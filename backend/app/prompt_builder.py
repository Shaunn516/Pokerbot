from app.intent import Intent, detect_user_intent
from app.schemas import ChatRequest, GameState, PracticeState


def detect_intent(request: ChatRequest) -> Intent:
    return detect_user_intent(
        request.message,
        request.mode,
        request.gameState,
        request.practiceState,
    )


def build_messages(request: ChatRequest) -> list[dict[str, str]]:
    """Build DeepSeek chat messages with intent-aware response instructions."""

    intent = detect_intent(request)
    response_language = _response_language(request)
    shared_prompt = (
        "You are StackSensei, a witty card master and friendly poker coach for Texas Hold'em learners. "
        "Reply in the user's language. Keep the tone clear, concise, warm, and beginner-friendly. "
        "Light character flavor is welcome, but do not overdo roleplay. "
        "Never guarantee profit, gambling success, or certainty. "
        "The user's latest message determines intent. gameState and practiceState are optional context only."
    )

    intent_prompt = _intent_prompt(intent, response_language)
    system_prompt = "\n\n".join([shared_prompt, intent_prompt])
    user_prompt = _user_prompt(request, intent, response_language)

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


def extract_action(reply: str, language: str) -> str:
    labels = ["Recommended Action:", "建议行动：", "建议行动:"]
    for line in reply.splitlines():
        stripped = line.strip()
        for label in labels:
            if stripped.startswith(label):
                action = stripped[len(label) :].strip()
                return action or "See recommendation"
    return ""


def _response_language(request: ChatRequest) -> str:
    if request.language == "zh" or _contains_chinese(request.message):
        return "Chinese"
    return "English"


def _contains_chinese(text: str) -> bool:
    return any("\u4e00" <= char <= "\u9fff" for char in text)


def _intent_prompt(intent: Intent, response_language: str) -> str:
    if intent == "casual_chat":
        return (
            "Intent: casual_chat. Reply naturally as a friendly poker coach. "
            "Do not analyze the current hand unless the user explicitly asks. "
            "Do not use structured recommendation labels such as Recommended Action, Reasoning, Risk Note, 建议行动, 理由, or 风险提示."
        )
    if intent == "capability_question":
        return (
            "Intent: capability_question. Explain simply that StackSensei can teach poker from zero, explain rules and terms, "
            "guide practice hands, analyze real hands when asked, and chat casually as a coach. "
            "Do not use structured hand analysis labels."
        )
    if intent == "poker_concept_question":
        return (
            "Intent: poker_concept_question. Explain the concept for beginners using a one-sentence explanation, "
            "a simple example, and a beginner tip. Do not analyze current gameState or give a current-hand recommendation unless asked."
        )
    if intent == "hand_analysis" and response_language == "Chinese":
        return (
            "Intent: hand_analysis. Use gameState as poker context and strictly format the answer with these Chinese labels:\n"
            "建议行动：\n"
            "理由：\n"
            "风险提示：\n"
            "Use plain beginner language, mention uncertainty when information is incomplete, and never guarantee profit."
        )
    if intent == "hand_analysis":
        return (
            "Intent: hand_analysis. Use gameState as poker context and strictly format the answer with these English labels:\n"
            "Recommended Action:\n"
            "Reasoning:\n"
            "Risk Note:\n"
            "Use plain beginner language, mention uncertainty when information is incomplete, and never guarantee profit."
        )
    if intent == "incomplete_hand_request":
        return (
            "Intent: incomplete_hand_request. The user asks for a decision, but important details are missing. "
            "Ask for the missing details: hole cards, position, pot, current bet/action history, and board cards if postflop. "
            "Do not invent data, do not force a fold, and do not use the full structured hand analysis format."
        )
    if intent == "practice_feedback" and response_language == "Chinese":
        return (
            "Intent: practice_feedback. Use practiceState and userAction for concise educational feedback. "
            "If recommendedAction exists, compare userAction with recommendedAction. Use this format:\n"
            "你的选择：\n"
            "教练建议：\n"
            "为什么：\n"
            "新手提示：\n"
            "下一步："
        )
    return (
        "Intent: practice_feedback. Use practiceState and userAction for concise educational feedback. "
        "If recommendedAction exists, compare userAction with recommendedAction. Use this format:\n"
        "Your Choice:\n"
        "Coach Suggestion:\n"
        "Why:\n"
        "Beginner Tip:\n"
        "Next Step:"
    )


def _user_prompt(request: ChatRequest, intent: Intent, response_language: str) -> str:
    labels = _labels(response_language)
    parts = [
        f"{labels['intent']}: {intent}",
        f"{labels['mode']}: {request.mode or 'not provided'}",
        f"{labels['message']}: {request.message}",
    ]

    if intent in {"hand_analysis", "incomplete_hand_request"}:
        parts.append(f"{labels['game_state']}:\n{_format_game_state(request.gameState, response_language)}")

    if intent == "practice_feedback":
        parts.append(
            f"{labels['practice_state']}:\n{_format_practice_state(request.practiceState, response_language)}"
        )

    return "\n\n".join(parts)


def _labels(response_language: str) -> dict[str, str]:
    if response_language == "Chinese":
        return {
            "intent": "识别意图",
            "mode": "前端模式",
            "message": "用户消息",
            "game_state": "牌局上下文",
            "practice_state": "练习上下文",
        }
    return {
        "intent": "Detected intent",
        "mode": "Frontend mode",
        "message": "User message",
        "game_state": "Game state",
        "practice_state": "Practice state",
    }


def _format_game_state(game_state: GameState, response_language: str) -> str:
    if response_language == "Chinese":
        return "\n".join(
            [
                f"- 手牌：{game_state.handCards or '未提供'}",
                f"- 公共牌：{game_state.communityCards or '未提供'}",
                f"- 街道：{game_state.street or '未提供'}",
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
            f"- Street: {game_state.street or 'not provided'}",
            f"- Action history: {game_state.actionHistory or 'not provided'}",
            f"- Chips: {game_state.chips:g}",
            f"- Pot: {game_state.pot:g}",
            f"- Position: {game_state.position}",
            f"- Players: {game_state.players}",
            f"- Opponents: {game_state.opponents if game_state.opponents is not None else 'not provided'}",
        ]
    )


def _format_practice_state(practice_state: PracticeState | None, response_language: str) -> str:
    if practice_state is None:
        return "未提供" if response_language == "Chinese" else "not provided"

    if response_language == "Chinese":
        return "\n".join(
            [
                f"- 场景ID：{practice_state.scenarioId or '未提供'}",
                f"- 街道：{practice_state.street or '未提供'}",
                f"- 英雄位置：{practice_state.heroPosition or '未提供'}",
                f"- 英雄手牌：{practice_state.heroCards or '未提供'}",
                f"- 公共牌：{practice_state.boardCards or '未提供'}",
                f"- 底池：{practice_state.pot if practice_state.pot is not None else '未提供'}",
                f"- 筹码：{practice_state.stack if practice_state.stack is not None else '未提供'}",
                f"- 行动历史：{practice_state.actionHistory or '未提供'}",
                f"- 可选行动：{', '.join(practice_state.options) or '未提供'}",
                f"- 用户选择：{practice_state.userAction or '未提供'}",
                f"- 推荐行动：{practice_state.recommendedAction or '未提供'}",
                f"- 新手提示：{practice_state.beginnerTip or '未提供'}",
            ]
        )

    return "\n".join(
        [
            f"- Scenario ID: {practice_state.scenarioId or 'not provided'}",
            f"- Street: {practice_state.street or 'not provided'}",
            f"- Hero position: {practice_state.heroPosition or 'not provided'}",
            f"- Hero cards: {practice_state.heroCards or 'not provided'}",
            f"- Board cards: {practice_state.boardCards or 'not provided'}",
            f"- Pot: {practice_state.pot if practice_state.pot is not None else 'not provided'}",
            f"- Stack: {practice_state.stack if practice_state.stack is not None else 'not provided'}",
            f"- Action history: {practice_state.actionHistory or 'not provided'}",
            f"- Options: {', '.join(practice_state.options) or 'not provided'}",
            f"- User action: {practice_state.userAction or 'not provided'}",
            f"- Recommended action: {practice_state.recommendedAction or 'not provided'}",
            f"- Beginner tip: {practice_state.beginnerTip or 'not provided'}",
        ]
    )
