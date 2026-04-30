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
        practiceState={
            "scenarioTitle": "Button open",
            "stepIndex": 2,
            "userAction": "raise",
            "recommendedAction": "call",
            "availableActions": ["fold", "call", "raise"],
        },
    )

    assert request.mode == "practice"
    assert request.practiceState is not None
    assert request.practiceState.userAction == "raise"
    assert request.practiceState.recommendedAction == "call"
    assert request.practiceState.availableActions == ["fold", "call", "raise"]


def test_learn_request_with_lesson_state_works():
    request = ChatRequest(
        message="Continue",
        mode="learn",
        lessonState={"lessonId": "basics", "currentTopic": "position", "stepIndex": 1},
    )

    assert request.mode == "learn"
    assert request.lessonState is not None
    assert request.lessonState.currentTopic == "position"
    assert request.lessonState.stepIndex == 1


def test_analyze_request_with_game_state_works():
    request = ChatRequest(
        message="Analyze this hand",
        language="en",
        mode="analyze",
        gameState={"handCards": "As Kh", "communityCards": "Qh Jd 7c", "pot": 24, "position": "BTN"},
    )

    assert request.mode == "analyze"
    assert request.gameState.handCards == "As Kh"
    assert request.gameState.position == "BTN"


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
