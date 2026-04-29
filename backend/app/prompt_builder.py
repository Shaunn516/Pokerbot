from app.schemas import ChatRequest, GameState


def _format_game_state(game_state: GameState, language: str) -> str:
    if language == "zh":
        return "\n".join(
            [
                f"- 手牌：{game_state.handCards or '未提供'}",
                f"- 公共牌：{game_state.communityCards or '未提供'}",
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
            f"- Chips: {game_state.chips:g}",
            f"- Pot: {game_state.pot:g}",
            f"- Position: {game_state.position}",
            f"- Players: {game_state.players}",
            f"- Opponents: {game_state.opponents if game_state.opponents is not None else 'not provided'}",
        ]
    )


def build_messages(request: ChatRequest) -> list[dict[str, str]]:
    """Build DeepSeek chat messages with consistent action-first output instructions."""

    game_state = _format_game_state(request.gameState, request.language)

    if request.language == "zh":
        system_prompt = (
            "你是 StackSensei，一个面向初学者的德州扑克学习助手。"
            "请基于用户给出的牌局信息提供清晰、简洁、行动优先的建议。"
            "你的回答必须使用中文，并严格使用以下格式：\n\n"
            "建议行动：\n"
            "理由：\n"
            "风险提示：\n\n"
            "要求：先给可执行行动，再用简短理由解释；不要承诺盈利；"
            "如果信息不足，请说明关键不确定性并给出保守建议。"
        )
        user_prompt = (
            "牌局信息：\n"
            f"{game_state}\n\n"
            f"用户问题：{request.message}"
        )
    else:
        system_prompt = (
            "You are StackSensei, a beginner-friendly Texas Hold'em learning assistant. "
            "Give clear, concise, action-first poker coaching based on the user's game state. "
            "Your answer must use exactly these section labels:\n\n"
            "Recommended Action:\n"
            "Reasoning:\n"
            "Risk Note:\n\n"
            "Start with a practical action, explain briefly, and never guarantee profit. "
            "If the situation is underspecified, name the uncertainty and give a conservative learning-oriented recommendation."
        )
        user_prompt = (
            "Game state:\n"
            f"{game_state}\n\n"
            f"User question: {request.message}"
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

