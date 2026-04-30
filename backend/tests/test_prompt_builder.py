from app.prompt_builder import build_messages, detect_intent
from app.schemas import ChatRequest


def joined_prompt(request: ChatRequest) -> str:
    return "\n".join(message["content"] for message in build_messages(request))


def test_learn_mode_with_lesson_state_routes_to_lesson_explanation():
    request = ChatRequest(
        message="Continue the lesson",
        language="en",
        mode="learn",
        lessonState={"lessonId": "basics-1", "lessonTitle": "Poker Basics", "currentTopic": "position"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "lesson_explanation"
    assert "Simple Explanation:" in prompt
    assert "Example:" in prompt
    assert "Beginner Tip:" in prompt
    assert "Current topic: position" in prompt


def test_learn_mode_with_quiz_answer_routes_to_quiz_feedback():
    request = ChatRequest(
        message="I choose call",
        language="en",
        mode="learn",
        lessonState={
            "quizQuestion": "What does call mean?",
            "selectedAnswer": "Match the current bet",
            "correctAnswer": "Match the current bet",
        },
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "quiz_feedback"
    assert "Quiz Feedback:" in prompt
    assert "Selected answer: Match the current bet" in prompt
    assert "Correct answer: Match the current bet" in prompt


def test_practice_mode_with_user_action_routes_to_feedback():
    request = ChatRequest(
        message="I chose raise",
        language="en",
        mode="practice",
        practiceState={
            "scenarioId": "preflop-001",
            "scenarioTitle": "Button open",
            "stepIndex": 1,
            "street": "preflop",
            "heroPosition": "BTN",
            "heroCards": "Ah Kh",
            "pot": 3,
            "stack": 100,
            "availableActions": ["fold", "call", "raise"],
            "userAction": "raise",
            "recommendedAction": "raise",
            "beginnerTip": "Strong hands like to build the pot in position.",
        },
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "practice_feedback"
    assert "Your Choice:" in prompt
    assert "Is It Reasonable?" in prompt
    assert "Coach Suggestion:" in prompt
    assert "User action: raise" in prompt
    assert "Recommended action: raise" in prompt


def test_practice_mode_question_routes_to_practice_question():
    request = ChatRequest(
        message="为什么要加注？",
        language="zh",
        mode="practice",
        practiceState={
            "scenarioId": "preflop-001",
            "street": "preflop",
            "heroPosition": "BTN",
            "heroCards": "Ah Kh",
            "pot": 3,
            "recommendedAction": "raise",
            "beginnerTip": "位置好且手牌强时可以主动加注。",
        },
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "practice_question"
    assert "practice_question" in prompt
    assert "Ah Kh" in prompt
    assert "位置好且手牌强时可以主动加注。" in prompt
    assert "建议行动：" not in prompt
    assert "Recommended Action:" not in prompt


def test_analyze_mode_casual_chat_with_game_state_stays_casual():
    request = ChatRequest(
        message="不咋地手气",
        language="zh",
        mode="analyze",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "casual_chat"
    assert "识别意图: casual_chat" in prompt
    assert "As Kh" not in prompt
    assert "建议行动：" not in prompt
    assert "Recommended Action:" not in prompt


def test_analyze_mode_explicit_hand_analysis_uses_structured_prompt():
    request = ChatRequest(
        message="帮我分析这手牌",
        language="zh",
        mode="analyze",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "hand_analysis"
    assert "As Kh" in prompt
    assert "建议行动：" in prompt
    assert "理由：" in prompt
    assert "风险提示：" in prompt


def test_no_mode_concept_question_routes_to_learn_concept():
    request = ChatRequest(message="什么是底池赔率？", language="zh")

    prompt = joined_prompt(request)

    assert detect_intent(request) == "learn_concept"
    assert "简单解释：" in prompt
    assert "举个例子：" in prompt
    assert "新手记住：" in prompt


def test_decision_request_without_core_context_is_incomplete():
    request = ChatRequest(message="Should I call here?", language="en")

    prompt = joined_prompt(request)

    assert detect_intent(request) == "incomplete_hand_request"
    assert "hole cards" in prompt
    assert "position" in prompt
    assert "current bet/action history" in prompt
    assert "Recommended Action:" not in prompt


def test_capability_question_is_not_hand_analysis():
    request = ChatRequest(
        message="你是谁",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "capability_question"
    assert "Intent: hand_analysis" not in prompt
    assert "建议行动：" not in prompt
    assert "Recommended Action:" not in prompt
