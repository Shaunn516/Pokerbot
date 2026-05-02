from __future__ import annotations

import re
from typing import Any

from app.prompt_builder import detect_intent
from app.schemas import ChatRequest


ACTION_LABELS = {
    "en": {"check": "Check", "call": "Call", "fold": "Fold", "bet": "Bet", "raise": "Raise"},
    "zh": {"check": "过牌", "call": "跟注", "fold": "弃牌", "bet": "下注", "raise": "加注"},
}


def build_chat_payload(request: ChatRequest, reply: str, action: str) -> dict[str, Any]:
    intent = detect_intent(request)
    language = request.language or "en"
    normalized_intent = _normalized_intent(intent)
    payload: dict[str, Any] = {
        "action": action,
        "reply": reply,
        "intent": normalized_intent,
        "mode": "analysis" if normalized_intent == "hand_analysis" else normalized_intent,
        "language": language,
        "coachReply": reply,
    }
    if normalized_intent == "hand_analysis":
        payload.update(_analysis_fields(request, reply, action, language))
    return payload


def _analysis_fields(request: ChatRequest, reply: str, action: str, language: str) -> dict[str, Any]:
    recommended = _clean_action(action) or _infer_action(reply) or "review"
    street = request.gameState.street or _infer_street(request.gameState.communityCards) or "unknown"
    reasoning = _section_lines(reply, ["Reasoning:", "理由：", "理由:"]) or _sentences(reply, 3)
    risks = _section_lines(reply, ["Risk Note:", "风险提示：", "风险提示:"]) or _risk_fallback(language)
    tags = [tag for tag in [street, request.gameState.position.lower() if request.gameState.position != "unknown" else "", _hand_tag(request.gameState.handCards)] if tag]
    beginner_note = "Start with the simple question: what worse hands call, and what better hands fold?" if language == "en" else "先问一个简单问题：更差牌会跟吗？更好牌会弃吗？"
    label = ACTION_LABELS.get(language, ACTION_LABELS["en"]).get(recommended.lower(), recommended.title())
    headline = f"{label} looks best" if language == "en" else f"建议：{label}"
    subline = f"{street.title()} decision with beginner-friendly reasoning." if language == "en" else f"{street} 决策，用新手友好的逻辑解释。"
    return {
        "summary": {
            "recommendedAction": recommended,
            "recommendedActionLabel": label,
            "confidence": "medium",
            "street": street,
        },
        "reasoningBullets": reasoning[:5],
        "riskBullets": risks[:4],
        "beginnerNote": beginner_note,
        "tags": tags,
        "leakTypes": _leak_types(reply),
        "shareSummary": {
            "headline": headline,
            "subline": subline,
            "keyPoints": (reasoning + risks)[:3],
        },
    }


def _normalized_intent(intent: str) -> str:
    if intent in {"learn_concept", "lesson_explanation", "quiz_feedback"}:
        return "poker_learning_question"
    if intent == "hand_analysis":
        return "hand_analysis"
    return "casual_chat"


def _clean_action(action: str) -> str:
    text = action.strip().lower()
    for candidate in ("check", "call", "fold", "bet", "raise"):
        if candidate in text:
            return candidate
    for chinese, english in {"过牌": "check", "跟注": "call", "弃牌": "fold", "下注": "bet", "加注": "raise"}.items():
        if chinese in action:
            return english
    return text


def _infer_action(reply: str) -> str:
    return _clean_action(reply[:200])


def _infer_street(board: str) -> str:
    count = len([card for card in board.split() if card])
    return {0: "preflop", 3: "flop", 4: "turn", 5: "river"}.get(count, "unknown")


def _section_lines(reply: str, labels: list[str]) -> list[str]:
    for label in labels:
        if label in reply:
            after = reply.split(label, 1)[1]
            stop_positions = [pos for marker in ["Risk Note:", "Reasoning:", "Recommended Action:", "风险提示：", "理由："] if (pos := after.find(marker)) > 0]
            if stop_positions:
                after = after[: min(stop_positions)]
            return [line.strip(" -•\t") for line in after.splitlines() if line.strip(" -•\t")]
    return []


def _sentences(reply: str, limit: int) -> list[str]:
    parts = [part.strip() for part in re.split(r"(?<=[.!?。！？])\s+", reply) if part.strip()]
    return parts[:limit] or [reply[:180]]


def _risk_fallback(language: str) -> list[str]:
    if language == "zh":
        return ["信息不完整时，建议保持中等信心。", "不要把单次结果当成长期正确性。"]
    return ["Confidence is medium when opponent tendencies are unknown.", "One result does not prove a decision is good or bad."]


def _hand_tag(hand_cards: str) -> str:
    ranks = [card[0].upper() for card in hand_cards.split() if card]
    if len(ranks) == 2 and ranks[0] == ranks[1]:
        return "pocket-pair"
    if any(rank in {"A", "K", "Q"} for rank in ranks):
        return "broadway"
    return ""


def _leak_types(reply: str) -> list[str]:
    lowered = reply.lower()
    leaks = []
    if "call" in lowered or "跟注" in reply:
        leaks.append("calling-too-much")
    if "position" in lowered or "位置" in reply:
        leaks.append("ignoring-position")
    return leaks[:2]
