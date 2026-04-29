from app.prompt_builder import build_messages, detect_intent
from app.schemas import ChatRequest


def test_prompt_contains_key_game_state_fields_in_english():
    request = ChatRequest(
        message="Should I bet?",
        language="en",
        gameState={
            "handCards": "Ah Ks",
            "communityCards": "Qh Jd 7c",
            "chips": 100,
            "pot": 24,
            "position": "BTN",
            "players": 6,
            "opponents": 5,
        },
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "hand_analysis"
    assert "Recommended Action:" in joined
    assert "Ah Ks" in joined
    assert "BTN" in joined
    assert "Pot: 24" in joined


def test_prompt_uses_chinese_labels():
    request = ChatRequest(
        message="我应该跟注吗？",
        language="zh",
        gameState={
            "handCards": "Ah Ks",
            "communityCards": "",
            "chips": 100,
            "pot": 12,
            "position": "BB",
            "players": 6,
            "opponents": 5,
        },
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "hand_analysis"
    assert "建议行动：" in joined
    assert "理由：" in joined
    assert "风险提示：" in joined
    assert "Ah Ks" in joined
    assert "BB" in joined
    assert "底池：12" in joined


def test_chinese_casual_chat_does_not_force_recommendation_format():
    request = ChatRequest(message="你可以聊天吗？", language="zh")

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "casual_chat"
    assert "识别意图: casual_chat" in joined
    assert "structured recommendation labels" in joined
    assert "For this hand_analysis request" not in joined
    assert "建议行动：" not in joined
    assert "Recommended Action:" not in joined


def test_english_casual_chat_routes_as_casual_chat():
    request = ChatRequest(message="Can you chat?", language="en")

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "casual_chat"
    assert "Detected intent: casual_chat" in joined
    assert "structured recommendation labels" in joined
    assert "For this hand_analysis request" not in joined
    assert "Recommended Action:" not in joined


def test_incomplete_hand_request_asks_for_missing_details():
    request = ChatRequest(message="Should I call?", language="en")

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "incomplete_hand_request"
    assert "Ask for the missing details" in joined
    assert "hole cards" in joined
    assert "position" in joined
    assert "pot size" in joined
    assert "current bet" in joined
    assert "action history" in joined


def test_chinese_table_talk_with_game_state_stays_casual():
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

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "casual_chat"
    assert "识别意图: casual_chat" in joined
    assert "As Kh" not in joined
    assert "建议行动：" not in joined
    assert "Recommended Action:" not in joined


def test_chinese_identity_question_with_game_state_does_not_force_analysis():
    request = ChatRequest(
        message="你是谁",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) in {"capability_question", "casual_chat"}
    assert "For this hand_analysis request" not in joined
    assert "建议行动：" not in joined


def test_chinese_explicit_hand_analysis_uses_game_state_and_labels():
    request = ChatRequest(
        message="帮我分析这手牌",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "hand_analysis"
    assert "As Kh" in joined
    assert "建议行动：" in joined
    assert "理由：" in joined
    assert "风险提示：" in joined


def test_english_bad_luck_with_game_state_stays_casual():
    request = ChatRequest(
        message="Bad luck today",
        language="en",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "casual_chat"
    assert "As Kh" not in joined
    assert "Recommended Action:" not in joined


def test_english_explicit_decision_uses_available_game_state():
    request = ChatRequest(
        message="Should I call here?",
        language="en",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "hand_analysis"
    assert "Recommended Action:" in joined
    assert "As Kh" in joined


def test_chinese_poker_concept_ignores_current_hand_context():
    request = ChatRequest(
        message="什么是底池赔率？",
        language="zh",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    messages = build_messages(request)
    joined = "\n".join(message["content"] for message in messages)

    assert detect_intent(request) == "poker_concept_question"
    assert "As Kh" not in joined
    assert "建议行动：" not in joined
