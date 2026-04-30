from fastapi.testclient import TestClient

from app.main import app


def test_api_poker_chat_accepts_casual_chat(monkeypatch):
    async def fake_call_deepseek(messages, settings):
        joined = "\n".join(message["content"] for message in messages)
        assert "Detected intent: casual_chat" in joined
        return "Running bad happens. Take a breath and keep the next decision simple."

    monkeypatch.setattr("app.main.call_deepseek", fake_call_deepseek)
    client = TestClient(app)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Bad luck today",
            "language": "en",
            "gameState": {"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
        },
    )

    assert response.status_code == 200
    assert response.json()["action"] == ""
    assert "Running bad" in response.json()["reply"]


def test_api_poker_chat_accepts_hand_analysis_request(monkeypatch):
    async def fake_call_deepseek(messages, settings):
        joined = "\n".join(message["content"] for message in messages)
        assert "Detected intent: hand_analysis" in joined
        assert "Recommended Action:" in joined
        return "Recommended Action: Call\nReasoning: You have enough context to continue.\nRisk Note: No play is guaranteed."

    monkeypatch.setattr("app.main.call_deepseek", fake_call_deepseek)
    client = TestClient(app)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Should I call here?",
            "language": "en",
            "gameState": {"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
        },
    )

    assert response.status_code == 200
    assert response.json()["action"] == "Call"
    assert "Recommended Action: Call" in response.json()["reply"]


def test_api_poker_chat_accepts_practice_feedback_request(monkeypatch):
    async def fake_call_deepseek(messages, settings):
        joined = "\n".join(message["content"] for message in messages)
        assert "Detected intent: practice_feedback" in joined
        assert "User action: raise" in joined
        return "Your Choice: raise\nCoach Suggestion: raise\nWhy: Good value spot.\nBeginner Tip: Raise strong hands.\nNext Step: Continue."

    monkeypatch.setattr("app.main.call_deepseek", fake_call_deepseek)
    client = TestClient(app)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "I chose raise",
            "language": "en",
            "mode": "practice",
            "practiceState": {"userAction": "raise", "recommendedAction": "raise"},
        },
    )

    assert response.status_code == 200
    assert response.json()["action"] == ""
    assert "Coach Suggestion" in response.json()["reply"]
