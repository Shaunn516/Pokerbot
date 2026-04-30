from app.prompt_builder import build_messages, detect_intent
from app.schemas import ChatRequest


def joined_prompt(request: ChatRequest) -> str:
    return "\n".join(message["content"] for message in build_messages(request))


def test_chinese_casual_chat_with_game_state_does_not_force_analysis():
    request = ChatRequest(
        message="不咋地手气",
        language="zh",
        gameState={
            "handCards": "As Kh",
            "communityCards": "Qh Jd 7c",
            "chips": 100,
            "pot": 24,
            "position": "BTN",
            "players": 6,
        },
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "casual_chat"
    assert "识别意图: casual_chat" in prompt
    assert "As Kh" not in prompt
    assert "建议行动：" not in prompt
    assert "Recommended Action:" not in prompt


def test_chinese_identity_question_is_not_hand_analysis():
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


def test_chinese_explicit_hand_analysis_uses_structured_prompt():
    request = ChatRequest(
        message="帮我分析这手牌",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "hand_analysis"
    assert "As Kh" in prompt
    assert "建议行动：" in prompt
    assert "理由：" in prompt
    assert "风险提示：" in prompt


def test_chinese_poker_concept_ignores_current_hand_context():
    request = ChatRequest(
        message="什么是底池赔率？",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "poker_concept_question"
    assert "one-sentence explanation" in prompt
    assert "As Kh" not in prompt
    assert "建议行动：" not in prompt
    assert "Recommended Action:" not in prompt


def test_english_bad_luck_with_game_state_stays_casual():
    request = ChatRequest(
        message="Bad luck today",
        language="en",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "casual_chat"
    assert "Detected intent: casual_chat" in prompt
    assert "As Kh" not in prompt
    assert "Recommended Action:" not in prompt


def test_decision_request_without_core_context_is_incomplete():
    request = ChatRequest(message="Should I call here?", language="en")

    prompt = joined_prompt(request)

    assert detect_intent(request) == "incomplete_hand_request"
    assert "hole cards" in prompt
    assert "position" in prompt
    assert "current bet/action history" in prompt
    assert "Recommended Action:" not in prompt


def test_practice_mode_with_user_action_routes_to_feedback():
    request = ChatRequest(
        message="I chose raise",
        language="en",
        mode="practice",
        practiceState={
            "scenarioId": "preflop-001",
            "street": "preflop",
            "heroPosition": "BTN",
            "heroCards": "Ah Kh",
            "pot": 3,
            "stack": 100,
            "options": ["fold", "call", "raise"],
            "userAction": "raise",
            "recommendedAction": "raise",
            "beginnerTip": "Strong hands like to build the pot in position.",
        },
    )

    prompt = joined_prompt(request)

    assert detect_intent(request) == "practice_feedback"
    assert "Your Choice:" in prompt
    assert "Coach Suggestion:" in prompt
    assert "User action: raise" in prompt
    assert "Recommended action: raise" in prompt
