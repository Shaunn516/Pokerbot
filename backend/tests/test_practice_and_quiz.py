from fastapi.testclient import TestClient

from app.main import app
from app.practice_scenarios import SCENARIO_TEMPLATES


def _cards_from_step(step: dict) -> list[str]:
    cards = []
    for key in ("heroCards", "boardCards"):
        value = step.get(key, "")
        cards.extend(card for card in value.split() if card)
    return cards


def test_practice_templates_cover_required_count_and_streets():
    assert len(SCENARIO_TEMPLATES) >= 10
    streets = [step["street"] for scenario in SCENARIO_TEMPLATES for step in scenario["steps"]]
    assert streets.count("preflop") >= 3
    assert streets.count("flop") >= 3
    assert streets.count("turn") >= 2
    assert streets.count("river") >= 2


def test_get_practice_scenario_returns_valid_scenario():
    client = TestClient(app)

    response = client.get("/api/practice/scenario", params={"difficulty": "beginner", "street": "random", "language": "en"})

    assert response.status_code == 200
    data = response.json()
    assert data["scenarioId"]
    assert data["title"]
    assert data["difficulty"] == "beginner"
    assert data["steps"]
    assert data["currentStep"]["availableActions"]
    assert data["currentStep"]["recommendedAction"]


def test_practice_scenario_has_no_duplicate_cards():
    client = TestClient(app)

    response = client.get("/api/practice/scenario", params={"street": "flop", "language": "en"})

    assert response.status_code == 200
    for step in response.json()["steps"]:
        cards = _cards_from_step(step)
        assert len(cards) == len(set(cards))


def test_practice_action_recommended_action_returns_reasonable_true():
    client = TestClient(app)

    response = client.post(
        "/api/practice/action",
        json={"scenarioId": "btn-strong-open", "stepIndex": 0, "userAction": "raise", "language": "en"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["feedback"]["isReasonable"] is True
    assert data["feedback"]["coachSuggestion"] == "Raise"
    assert "Your Choice:" in data["feedback"]["formatted"]


def test_practice_action_non_recommended_action_returns_correction():
    client = TestClient(app)

    response = client.post(
        "/api/practice/action",
        json={"scenarioId": "btn-strong-open", "stepIndex": 0, "userAction": "fold", "language": "en"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["feedback"]["isReasonable"] is False
    assert data["feedback"]["coachSuggestion"] == "Raise"
    assert "too tight" in data["feedback"]["why"].lower()


def test_practice_action_returns_next_state_when_available():
    client = TestClient(app)

    response = client.post(
        "/api/practice/action",
        json={"scenarioId": "btn-strong-open", "stepIndex": 0, "userAction": "raise", "language": "en"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["isComplete"] is False
    assert data["nextState"] is not None
    assert data["nextState"]["stepIndex"] == 1


def test_practice_action_final_step_returns_complete():
    client = TestClient(app)

    response = client.post(
        "/api/practice/action",
        json={"scenarioId": "utg-weak-fold", "stepIndex": 0, "userAction": "fold", "language": "en"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["isComplete"] is True
    assert data["nextState"] is None
    assert data["summary"]


def test_learn_quiz_returns_question_options_and_answer():
    client = TestClient(app)

    response = client.post(
        "/api/learn/quiz",
        json={"lessonId": "position-actions", "lessonTitle": "Position and Actions", "language": "en"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["question"]
    assert len(data["options"]) >= 3
    assert data["correctAnswer"] in data["options"]
    assert data["explanation"]


def test_learn_quiz_same_lesson_can_return_different_questions():
    client = TestClient(app)

    first = client.post("/api/learn/quiz", json={"lessonId": "hand-strength", "language": "en"}).json()
    second = client.post("/api/learn/quiz", json={"lessonId": "hand-strength", "language": "en"}).json()

    assert first["question"] != second["question"]


def test_unknown_lesson_returns_safe_fallback_quiz():
    client = TestClient(app)

    response = client.post("/api/learn/quiz", json={"lessonId": "unknown-lesson", "language": "en"})

    assert response.status_code == 200
    data = response.json()
    assert data["question"]
    assert data["correctAnswer"] in data["options"]
    assert data["metadata"]["source"] == "local_quiz_bank"
