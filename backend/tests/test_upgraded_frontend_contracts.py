from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_learn_modules_returns_four_beginner_pillars():
    response = client.get("/api/learn/modules", params={"lang": "en"})

    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "en"
    assert [module["id"] for module in data["modules"]] == [
        "what_is_texas_holdem",
        "hand_flow",
        "positions_and_turn_order",
        "hand_strength_and_draws",
        "actions_and_beginner_thinking",
    ]
    assert all(module["title"] and module["shortDescription"] and module["iconKey"] for module in data["modules"])


def test_learn_module_detail_has_beginner_structure():
    response = client.get("/api/learn/modules/what_is_texas_holdem", params={"lang": "zh"})

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "what_is_texas_holdem"
    assert data["overview"]
    assert len(data["keyPoints"]) >= 4
    assert len(data["beginnerTerms"]) >= 4
    assert len(data["stepSections"]) >= 4
    assert {"stepNumber", "stepTitle", "explanation", "bullets", "example"} <= set(data["stepSections"][0])


def test_get_learn_quiz_returns_new_random_quiz_shape():
    response = client.get("/api/learn/quiz", params={"module": "positions_and_turn_order", "lang": "en"})

    assert response.status_code == 200
    data = response.json()
    assert data["quizId"].startswith("positions_")
    assert data["module"] == "positions_and_turn_order"
    assert len(data["options"]) >= 3
    assert data["correctOptionId"] in {option["id"] for option in data["options"]}
    assert data["difficulty"] == "beginner"


def test_get_learn_quiz_can_vary_and_fallback_unknown_module():
    seen = {
        client.get("/api/learn/quiz", params={"module": "hand_flow", "lang": "en"}).json()["quizId"]
        for _ in range(6)
    }
    fallback = client.get("/api/learn/quiz", params={"module": "missing", "lang": "en"})

    assert len(seen) > 1
    assert fallback.status_code == 200
    assert fallback.json()["module"] == "what_is_texas_holdem"


def test_daily_hand_is_deterministic_by_date_and_localized():
    first = client.get("/api/daily-hand", params={"date": "2026-04-30", "lang": "en"})
    second = client.get("/api/daily-hand", params={"date": "2026-04-30", "lang": "en"})
    zh = client.get("/api/daily-hand", params={"date": "2026-04-30", "lang": "zh"})

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json() == second.json()
    data = first.json()
    assert data["date"] == "2026-04-30"
    assert data["handId"].startswith("daily_")
    assert data["recommendedAction"] in {option["id"] for option in data["options"]}
    assert zh.json()["title"] != data["title"]


def test_practice_scenarios_returns_packs_with_five_hands_each():
    response = client.get("/api/practice/scenarios", params={"lang": "en"})

    assert response.status_code == 200
    data = response.json()
    assert len(data["packs"]) >= 5
    for pack in data["packs"]:
        assert pack["packId"]
        assert pack["title"]
        assert len(pack["hands"]) == 5
        hand = pack["hands"][0]
        assert {"handId", "street", "heroPosition", "heroCards", "prompt", "options", "recommendedAction"} <= set(hand)


def test_structured_analysis_response_shape(monkeypatch):
    async def fake_call_deepseek(messages, settings):
        return (
            "Recommended Action: Check\n"
            "Reasoning:\n"
            "- River card is awkward for one pair.\n"
            "- Worse hands may not call a bet.\n"
            "Risk Note:\n"
            "- Opponent tendencies are unknown."
        )

    monkeypatch.setattr("app.main.call_deepseek", fake_call_deepseek)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Please analyze this hand. Should I bet?",
            "language": "en",
            "gameState": {
                "handCards": "Js Ts",
                "communityCards": "Jd 8c 5h 4s Kc",
                "street": "river",
                "pot": 24,
                "position": "BTN",
                "actionHistory": "Opponent checks river.",
            },
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "hand_analysis"
    assert data["mode"] == "analysis"
    assert data["summary"]["street"] == "river"
    assert data["summary"]["recommendedAction"] == "check"
    assert data["summary"]["recommendedActionLabel"] == "Check"
    assert data["reasoningBullets"]
    assert data["riskBullets"]
    assert data["shareSummary"]["keyPoints"]
    assert data["coachReply"].startswith("Recommended Action")


def test_casual_chat_with_hand_context_stays_casual(monkeypatch):
    async def fake_call_deepseek(messages, settings):
        joined = "\n".join(message["content"] for message in messages)
        assert "Detected intent: hand_analysis" not in joined
        return "Hey, I am here. We can talk poker or just cool off after a rough hand."

    monkeypatch.setattr("app.main.call_deepseek", fake_call_deepseek)

    response = client.post(
        "/api/poker-chat",
        json={
            "message": "Hey StackSensei, who are you?",
            "language": "en",
            "mode": "analyze",
            "gameState": {"handCards": "As Kh", "pot": 20, "position": "BTN"},
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "casual_chat"
    assert data["summary"] is None
