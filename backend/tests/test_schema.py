from fastapi.testclient import TestClient

from app.main import app
from app.schemas import ChatRequest


def test_old_request_format_without_mode_still_works():
    request = ChatRequest(message="Can you chat?", language="en")

    assert request.message == "Can you chat?"
    assert request.mode is None
    assert request.practiceState is None
    assert request.gameState.players == 6


def test_new_request_format_with_mode_and_practice_state_works():
    request = ChatRequest(
        message="I chose raise",
        language="en",
        mode="practice",
        practiceState={"userAction": "raise", "recommendedAction": "call", "options": ["fold", "call", "raise"]},
    )

    assert request.mode == "practice"
    assert request.practiceState is not None
    assert request.practiceState.userAction == "raise"
    assert request.practiceState.recommendedAction == "call"
    assert request.practiceState.options == ["fold", "call", "raise"]


def test_invalid_player_count_fails_validation():
    client = TestClient(app)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Should I call?",
            "language": "en",
            "gameState": {"players": 1, "chips": 100, "pot": 0, "position": "BTN"},
        },
    )

    assert response.status_code == 422


def test_negative_pot_fails_validation():
    client = TestClient(app)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Should I call?",
            "language": "en",
            "gameState": {"players": 6, "chips": 100, "pot": -1, "position": "BTN"},
        },
    )

    assert response.status_code == 422
