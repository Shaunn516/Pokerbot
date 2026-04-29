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


def _has_required_hand_context(message: str, game_state: GameState) -> bool:
    has_hole_cards = bool(game_state.handCards.strip() or _has_cards(message))
    has_position = game_state.position != "unknown" or "position" in message.lower() or "位置" in message
    has_pot_or_action = game_state.pot > 0 or bool(game_state.actionHistory.strip())
    return has_hole_cards and has_position and has_pot_or_action


def detect_user_intent(message: str, game_state: GameState) -> Intent:
    """Classify the current user message; game state is context, not intent."""

    message = message.strip()
    lowered = message.lower()

    capability_markers = [
        "what can you do",
        "what do you do",
        "who are you",
        "help me with",
        "你的功能",
        "你能做什么",
        "你会什么",
        "你是谁",
        "可以帮我",
    ]
    concept_markers = [
        "what are pot odds",
        "what is pot odds",
        "what is position",
        "what are outs",
        "what is equity",
        "what is range",
        "what is 3-bet",
        "what is c-bet",
        "what is bluff",
        "pot odds是什么",
        "底池赔率",
        "什么是位置",
        "什么是翻牌",
        "什么是胜率",
        "什么是范围",
        "什么是诈唬",
        "什么是持续下注",
        "什么是",
        "解释",
    ]
    explicit_decision_patterns = [
        r"\bshould i (?:call|bet|fold|raise|jam|shove|all[ -]?in)\b",
        r"\bwhat should i do(?: here)?\b",
        r"\banaly[sz]e this hand\b",
        r"\breview this hand\b",
        r"\bhow should i play this (?:spot|hand)\b",
        r"\bcan you analy[sz]e this hand\b",
        r"这手牌怎么打",
        r"帮我分析这手牌",
        r"分析这手牌",
        r"这手牌应该怎么做",
        r"我应该(?:跟注|下注|弃牌|加注|全下)吗",
        r"该不该(?:跟注|下注|弃牌|加注|全下)",
        r"该(?:call|fold|raise|bet|jam|all.?in)吗",
        r"怎么打",
    ]

    if any(marker in lowered for marker in capability_markers):
        return "capability_question"
    if any(marker in lowered for marker in concept_markers):
        return "poker_concept_question"

    asks_for_decision = any(re.search(pattern, lowered, re.IGNORECASE) for pattern in explicit_decision_patterns)
    if asks_for_decision and _has_required_hand_context(message, game_state):
        return "hand_analysis"
    if asks_for_decision:
        return "incomplete_hand_request"

    return "casual_chat"


def detect_intent(request: ChatRequest) -> Intent:
    """Backward-compatible wrapper for request-based intent detection."""

    return detect_user_intent(request.message, request.gameState)


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
    elif intent == "incomplete_hand_request":
        format_prompt = (
            "The user is asking for a poker decision, but the available details are incomplete. "
            "Ask for the missing details before recommending a specific action: hole cards, position, pot size, current bet, and action history as needed. "
            "Do not invent details, do not force a fold, and do not use structured recommendation labels."
        )
    elif intent == "capability_question":
        format_prompt = (
            "Explain what StackSensei can do: analyze explicit hand-review requests, explain poker concepts, help beginners understand actions, and chat lightly. "
            "Do not analyze the current hand unless the user explicitly asks, and do not use structured recommendation labels."
        )
    elif intent == "poker_concept_question":
        format_prompt = (
            "Explain the poker concept clearly like a coach with a short example. "
            "Do not apply the current game state to a specific recommendation unless the user explicitly asks, and do not use structured recommendation labels."
        )
    else:
        format_prompt = (
            "Reply naturally to the user's current message. You may lightly reference poker, variance, or coaching if it fits. "
            "Do not analyze the current hand unless the user explicitly asks, and do not use structured recommendation labels. "
            "Keep the reply concise and conversational."
        )

    system_prompt = "\n\n".join([shared_prompt, format_prompt])
    if intent in {"hand_analysis", "incomplete_hand_request"}:
        user_prompt = (
            f"{intent_label}: {intent}\n\n"
            f"{game_state_label}:\n"
            f"{game_state}\n\n"
            f"{user_prompt_label}: {request.message}"
        )
    else:
        user_prompt = f"{intent_label}: {intent}\n\n{user_prompt_label}: {request.message}"

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
