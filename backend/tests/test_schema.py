from fastapi.testclient import TestClient

from app.main import app


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

