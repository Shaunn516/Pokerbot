from app.prompt_builder import build_messages
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

    assert "建议行动：" in joined
    assert "理由：" in joined
    assert "风险提示：" in joined
    assert "Ah Ks" in joined
    assert "BB" in joined
    assert "底池：12" in joined

