import re
from typing import Literal

from app.schemas import ChatRequest, GameState


Intent = Literal[
    "casual_chat",
    "capability_question",
    "poker_concept_question",
    "hand_analysis",
    "incomplete_hand_request",
]

CARD_RE = re.compile(r"\b(?:[AKQJT2-9]|10)[shdc]\b", re.IGNORECASE)
CHINESE_CARD_RE = re.compile(r"(黑桃|红桃|方块|梅花|葵扇|桃|心|砖|草花|梅花)[AKQJ]|[AKQJ](黑桃|红桃|方块|梅花)|(?:黑桃|红桃|方块|梅花)(?:10|[2-9])")


def _contains_chinese(text: str) -> bool:
    return any("\u4e00" <= char <= "\u9fff" for char in text)


def _has_cards(text: str) -> bool:
    return bool(CARD_RE.search(text) or CHINESE_CARD_RE.search(text))


def _has_specific_game_context(request: ChatRequest) -> bool:
    state = request.gameState
    combined = f"{request.message} {state.handCards} {state.communityCards}"
    return bool(state.handCards.strip() or _has_cards(combined))


def detect_intent(request: ChatRequest) -> Intent:
    """Lightweight intent routing for prompt behavior without a second model call."""

    message = request.message.strip()
    lowered = message.lower()

    casual_markers = [
        "hello",
        "hi",
        "hey",
        "can you chat",
        "chat with me",
        "who are you",
        "你好",
        "您好",
        "你可以聊天吗",
        "能聊天吗",
        "你是谁",
    ]
    capability_markers = [
        "what can you do",
        "what do you do",
        "help me with",
        "你的功能",
        "你能做什么",
        "你会什么",
        "可以帮我",
    ]
    concept_markers = [
        "pot odds",
        "outs",
        "equity",
        "range",
        "position",
        "3-bet",
        "c-bet",
        "bluff",
        "底池赔率",
        "胜率",
        "范围",
        "位置",
        "诈唬",
        "持续下注",
        "什么是",
        "解释",
    ]
    decision_markers = [
        "should i",
        "what should i do",
        "call",
        "raise",
        "fold",
        "bet",
        "jam",
        "all in",
        "analyze this hand",
        "我应该",
        "该不该",
        "跟注",
        "加注",
        "弃牌",
        "下注",
        "全下",
        "分析这手牌",
        "怎么打",
    ]

    if any(marker in lowered for marker in capability_markers):
        return "capability_question"
    if any(marker in lowered for marker in casual_markers) and not any(marker in lowered for marker in decision_markers):
        return "casual_chat"

    asks_for_decision = any(marker in lowered for marker in decision_markers)
    if asks_for_decision:
        state = request.gameState
        has_hole_cards = bool(state.handCards.strip() or _has_cards(message))
        has_position = state.position != "unknown" or "position" in lowered or "位置" in message
        has_pot_or_action = state.pot > 0 or bool(state.actionHistory.strip()) or any(
            marker in lowered for marker in ["pot", "bet", "raise", "call", "底池", "下注", "加注", "跟注"]
        )
        if has_hole_cards and has_position and has_pot_or_action:
            return "hand_analysis"
        return "incomplete_hand_request"

    if any(marker in lowered for marker in concept_markers) and not _has_specific_game_context(request):
        return "poker_concept_question"

    if _has_specific_game_context(request):
        return "hand_analysis"
    return "casual_chat"


def _format_game_state(game_state: GameState, language: str) -> str:
    if language == "zh":
        return "\n".join(
            [
                f"- 手牌：{game_state.handCards or '未提供'}",
                f"- 公共牌：{game_state.communityCards or '未提供'}",
                f"- 行动历史：{game_state.actionHistory or '未提供'}",
                f"- 筹码：{game_state.chips:g}",
                f"- 底池：{game_state.pot:g}",
                f"- 位置：{game_state.position}",
                f"- 玩家数：{game_state.players}",
                f"- 对手数：{game_state.opponents if game_state.opponents is not None else '未提供'}",
            ]
        )

    return "\n".join(
        [
            f"- Hand cards: {game_state.handCards or 'not provided'}",
            f"- Community cards: {game_state.communityCards or 'not provided'}",
            f"- Action history: {game_state.actionHistory or 'not provided'}",
            f"- Chips: {game_state.chips:g}",
            f"- Pot: {game_state.pot:g}",
            f"- Position: {game_state.position}",
            f"- Players: {game_state.players}",
            f"- Opponents: {game_state.opponents if game_state.opponents is not None else 'not provided'}",
        ]
    )


def build_messages(request: ChatRequest) -> list[dict[str, str]]:
    """Build DeepSeek chat messages with intent-aware response instructions."""

    game_state = _format_game_state(request.gameState, request.language)
    intent = detect_intent(request)
    user_is_chinese = _contains_chinese(request.message)

    if request.language == "zh" or user_is_chinese:
        response_language = "Chinese"
        user_prompt_label = "用户问题"
        game_state_label = "牌局信息"
        intent_label = "识别意图"
    else:
        response_language = "English"
        user_prompt_label = "User question"
        game_state_label = "Game state"
        intent_label = "Detected intent"

    shared_prompt = (
        "You are StackSensei, a witty card master and friendly poker coach for learners. "
        "You can chat normally, but your specialty is helping people learn Texas Hold'em. "
        "Use light table-side coach flavor and a little humor when it fits, but do not become overly theatrical. "
        "Respect the user's language: if the user writes Chinese, reply in Chinese; if the user writes English, reply in English. "
        f"Use {response_language} for this reply unless the user's message clearly switches language. "
        "Never guarantee profit or gambling success; frame poker guidance as educational."
    )

    intent_prompt = (
        "Response routing:\n"
        "- casual_chat: reply naturally as StackSensei. Do not use Recommended Action/Reasoning/Risk Note labels.\n"
        "- capability_question: explain that you can analyze poker hands, explain basic concepts, help beginners understand actions, and chat lightly. Do not use hand-analysis labels.\n"
        "- poker_concept_question: explain the concept clearly like a coach with a short example. Do not use hand-analysis labels unless there is a specific hand decision.\n"
        "- incomplete_hand_request: ask for the missing details before recommending a specific action. Ask for hole cards, position, pot size, current bet or action history as needed. Do not pretend to know the correct action and do not force a fold.\n"
        "- hand_analysis: use the strict structured analysis format.\n"
    )

    if intent == "hand_analysis" and (request.language == "zh" or user_is_chinese):
        format_prompt = (
            "For this hand_analysis request, strictly use these Chinese labels:\n\n"
            "建议行动：\n"
            "理由：\n"
            "风险提示：\n\n"
            "Give practical, beginner-friendly reasoning and make clear this is educational guidance, not guaranteed profit."
        )
    elif intent == "hand_analysis":
        format_prompt = (
            "For this hand_analysis request, strictly use these English labels:\n\n"
            "Recommended Action:\n"
            "Reasoning:\n"
            "Risk Note:\n\n"
            "Give practical, beginner-friendly reasoning and make clear this is educational guidance, not guaranteed profit."
        )
    else:
        format_prompt = (
            "This is not a full hand-analysis response. Do not use the strict hand-analysis labels. "
            "Answer naturally, clearly, and briefly."
        )

    system_prompt = "\n\n".join([shared_prompt, intent_prompt, format_prompt])
    user_prompt = (
        f"{intent_label}: {intent}\n\n"
        f"{game_state_label}:\n"
        f"{game_state}\n\n"
        f"{user_prompt_label}: {request.message}"
    )

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


def extract_action(reply: str, language: str) -> str:
    label = "建议行动：" if language == "zh" else "Recommended Action:"
    for line in reply.splitlines():
        stripped = line.strip()
        if stripped.startswith(label):
            action = stripped[len(label):].strip()
            return action or "See recommendation"
    return "N/A"
