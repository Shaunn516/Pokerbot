from app.intent import Intent, detect_user_intent
from app.schemas import ChatRequest, GameState, LessonState, PracticeState


def detect_intent(request: ChatRequest) -> Intent:
    return detect_user_intent(
        request.message,
        request.mode,
        request.gameState,
        request.practiceState,
        request.lessonState,
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
        "The user's latest message and explicit mode determine intent. "
        "gameState is optional context only and never forces hand analysis. "
        "practiceState is used only for practice mode or practice questions."
    )

    return [
        {"role": "system", "content": "\n\n".join([shared_prompt, _intent_prompt(intent, response_language)])},
        {"role": "user", "content": _user_prompt(request, intent, response_language)},
    ]


def extract_action(reply: str, language: str, practice_state: PracticeState | None = None) -> str:
    if practice_state and practice_state.recommendedAction:
        return practice_state.recommendedAction

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
    if intent in {"learn_concept", "lesson_explanation"} and response_language == "Chinese":
        return (
            f"Intent: {intent}. Teach the lesson or concept with simple beginner language. "
            "Use lessonState when available. Avoid solver jargon and keep it concise. Use this exact format:\n"
            "简单解释：\n"
            "举个例子：\n"
            "新手记住："
        )
    if intent in {"learn_concept", "lesson_explanation"}:
        return (
            f"Intent: {intent}. Teach the lesson or concept with simple beginner language. "
            "Use lessonState when available. Avoid solver jargon and keep it concise. Use this exact format:\n"
            "Simple Explanation:\n"
            "Example:\n"
            "Beginner Tip:"
        )
    if intent == "quiz_feedback" and response_language == "Chinese":
        return (
            "Intent: quiz_feedback. Use lessonState.selectedAnswer and lessonState.correctAnswer. "
            "Say whether the answer is correct, explain simply, encourage the learner, and suggest the next step. "
            "Use this exact format:\n"
            "答题反馈：\n"
            "为什么：\n"
            "下一步："
        )
    if intent == "quiz_feedback":
        return (
            "Intent: quiz_feedback. Use lessonState.selectedAnswer and lessonState.correctAnswer. "
            "Say whether the answer is correct, explain simply, encourage the learner, and suggest the next step. "
            "Use this exact format:\n"
            "Quiz Feedback:\n"
            "Why:\n"
            "Next Step:"
        )
    if intent == "practice_feedback" and response_language == "Chinese":
        return (
            "Intent: practice_feedback. Use practiceState and userAction for scenario-based educational feedback. "
            "If userAction matches recommendedAction, encourage and explain why it works. "
            "If it differs, explain the risk gently, give the recommended action, and mention continuing practice is okay. "
            "Do not treat this as a full poker solver. Use this exact format:\n"
            "你的选择：\n"
            "是否合理：\n"
            "教练建议：\n"
            "为什么：\n"
            "下一步："
        )
    if intent == "practice_feedback":
        return (
            "Intent: practice_feedback. Use practiceState and userAction for scenario-based educational feedback. "
            "If userAction matches recommendedAction, encourage and explain why it works. "
            "If it differs, explain the risk gently, give the recommended action, and mention continuing practice is okay. "
            "Do not treat this as a full poker solver. Use this exact format:\n"
            "Your Choice:\n"
            "Is It Reasonable?\n"
            "Coach Suggestion:\n"
            "Why:\n"
            "Next Step:"
        )
    if intent == "practice_question":
        return (
            "Intent: practice_question. Answer the user's question about the current practice spot. "
            "Use practiceState as the main context and tie the teaching to position, hand strength, pot, street, action history, "
            "and beginnerTip if provided. Keep it concise and educational, not a full solver output. "
            "Do not use hand-analysis labels."
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
            "Intent: incomplete_hand_request. Ask for missing details: hole cards, position, pot, current bet/action history, "
            "and board cards if postflop. Do not invent cards or actions. Do not use full hand-analysis labels."
        )
    if intent == "capability_question":
        return (
            "Intent: capability_question. Explain that StackSensei can teach poker from zero, explain rules and terms, "
            "guide practice hands, analyze real hands when explicitly asked, and chat casually as a coach. "
            "Do not use structured hand-analysis labels."
        )
    return (
        "Intent: casual_chat. Reply naturally as StackSensei with light coach personality. "
        "Do not analyze the current hand unless the user explicitly asks. "
        "Do not use structured labels such as Recommended Action, Reasoning, Risk Note, 建议行动, 理由, or 风险提示."
    )


def _user_prompt(request: ChatRequest, intent: Intent, response_language: str) -> str:
    labels = _labels(response_language)
    parts = [
        f"{labels['intent']}: {intent}",
        f"{labels['mode']}: {request.mode or 'not provided'}",
        f"{labels['message']}: {request.message}",
    ]

    if intent in {"lesson_explanation", "learn_concept", "quiz_feedback"} and request.lessonState:
        parts.append(f"{labels['lesson_state']}:\n{_format_lesson_state(request.lessonState, response_language)}")

    if intent in {"practice_feedback", "practice_question"}:
        parts.append(f"{labels['practice_state']}:\n{_format_practice_state(request.practiceState, response_language)}")

    if intent in {"hand_analysis", "incomplete_hand_request"}:
        parts.append(f"{labels['game_state']}:\n{_format_game_state(request.gameState, response_language)}")

    return "\n\n".join(parts)


def _labels(response_language: str) -> dict[str, str]:
    if response_language == "Chinese":
        return {
            "intent": "识别意图",
            "mode": "前端模式",
            "message": "用户消息",
            "game_state": "牌局上下文",
            "practice_state": "练习上下文",
            "lesson_state": "课程上下文",
        }
    return {
        "intent": "Detected intent",
        "mode": "Frontend mode",
        "message": "User message",
        "game_state": "Game state",
        "practice_state": "Practice state",
        "lesson_state": "Lesson state",
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
    actions = practice_state.availableActions or practice_state.options

    if response_language == "Chinese":
        return "\n".join(
            [
                f"- 场景ID：{practice_state.scenarioId or '未提供'}",
                f"- 场景标题：{practice_state.scenarioTitle or '未提供'}",
                f"- 步骤：{practice_state.stepIndex if practice_state.stepIndex is not None else '未提供'}",
                f"- 街道：{practice_state.street or '未提供'}",
                f"- 英雄位置：{practice_state.heroPosition or '未提供'}",
                f"- 英雄手牌：{practice_state.heroCards or '未提供'}",
                f"- 公共牌：{practice_state.boardCards or '未提供'}",
                f"- 底池：{practice_state.pot if practice_state.pot is not None else '未提供'}",
                f"- 筹码：{practice_state.stack if practice_state.stack is not None else '未提供'}",
                f"- 行动历史：{practice_state.actionHistory or '未提供'}",
                f"- 可选行动：{', '.join(actions) or '未提供'}",
                f"- 用户选择：{practice_state.userAction or '未提供'}",
                f"- 推荐行动：{practice_state.recommendedAction or '未提供'}",
                f"- 新手提示：{practice_state.beginnerTip or '未提供'}",
                f"- 教练上下文：{practice_state.coachContext or '未提供'}",
                f"- 是否完成：{practice_state.isComplete if practice_state.isComplete is not None else '未提供'}",
            ]
        )

    return "\n".join(
        [
            f"- Scenario ID: {practice_state.scenarioId or 'not provided'}",
            f"- Scenario title: {practice_state.scenarioTitle or 'not provided'}",
            f"- Step index: {practice_state.stepIndex if practice_state.stepIndex is not None else 'not provided'}",
            f"- Street: {practice_state.street or 'not provided'}",
            f"- Hero position: {practice_state.heroPosition or 'not provided'}",
            f"- Hero cards: {practice_state.heroCards or 'not provided'}",
            f"- Board cards: {practice_state.boardCards or 'not provided'}",
            f"- Pot: {practice_state.pot if practice_state.pot is not None else 'not provided'}",
            f"- Stack: {practice_state.stack if practice_state.stack is not None else 'not provided'}",
            f"- Action history: {practice_state.actionHistory or 'not provided'}",
            f"- Available actions: {', '.join(actions) or 'not provided'}",
            f"- User action: {practice_state.userAction or 'not provided'}",
            f"- Recommended action: {practice_state.recommendedAction or 'not provided'}",
            f"- Beginner tip: {practice_state.beginnerTip or 'not provided'}",
            f"- Coach context: {practice_state.coachContext or 'not provided'}",
            f"- Is complete: {practice_state.isComplete if practice_state.isComplete is not None else 'not provided'}",
        ]
    )


def _format_lesson_state(lesson_state: LessonState, response_language: str) -> str:
    if response_language == "Chinese":
        return "\n".join(
            [
                f"- 课程ID：{lesson_state.lessonId or '未提供'}",
                f"- 课程标题：{lesson_state.lessonTitle or '未提供'}",
                f"- 步骤：{lesson_state.stepIndex if lesson_state.stepIndex is not None else '未提供'}",
                f"- 当前主题：{lesson_state.currentTopic or '未提供'}",
                f"- 测验问题：{lesson_state.quizQuestion or '未提供'}",
                f"- 已选答案：{lesson_state.selectedAnswer or '未提供'}",
                f"- 正确答案：{lesson_state.correctAnswer or '未提供'}",
                f"- 是否完成：{lesson_state.completed if lesson_state.completed is not None else '未提供'}",
            ]
        )

    return "\n".join(
        [
            f"- Lesson ID: {lesson_state.lessonId or 'not provided'}",
            f"- Lesson title: {lesson_state.lessonTitle or 'not provided'}",
            f"- Step index: {lesson_state.stepIndex if lesson_state.stepIndex is not None else 'not provided'}",
            f"- Current topic: {lesson_state.currentTopic or 'not provided'}",
            f"- Quiz question: {lesson_state.quizQuestion or 'not provided'}",
            f"- Selected answer: {lesson_state.selectedAnswer or 'not provided'}",
            f"- Correct answer: {lesson_state.correctAnswer or 'not provided'}",
            f"- Completed: {lesson_state.completed if lesson_state.completed is not None else 'not provided'}",
        ]
    )
