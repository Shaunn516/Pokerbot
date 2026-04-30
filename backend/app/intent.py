import re
from typing import Literal, Optional

from app.schemas import GameState, PracticeState


Intent = Literal[
    "casual_chat",
    "capability_question",
    "poker_concept_question",
    "hand_analysis",
    "incomplete_hand_request",
    "practice_feedback",
]

HAND_ANALYSIS_PATTERNS = [
    r"\banaly[sz]e this hand\b",
    r"\breview this hand\b",
    r"\bhow should i play this hand\b",
    r"\bhow should i play this spot\b",
    r"\bwhat should i do here\b",
    r"\bshould i (?:call|bet|fold|raise|jam|shove|all[ -]?in)\b",
    r"\bis this a (?:call|fold|raise|bet)\b",
    r"帮我分析这手牌",
    r"分析这手牌",
    r"这手牌怎么打",
    r"我应该(?:跟注|下注|弃牌|加注)吗",
    r"该(?:call|fold|raise|bet)吗",
    r"这里怎么打",
    r"这手怎么处理",
]

CONCEPT_MARKERS = [
    "what are pot odds",
    "what is pot odds",
    "what are outs",
    "what is equity",
    "what is range",
    "what is the flop",
    "what is the turn",
    "what is the river",
    "what is position",
    "what is a blind",
    "what does check mean",
    "what does call mean",
    "what does raise mean",
    "what does fold mean",
    "什么是底池赔率",
    "什么是翻牌",
    "什么是转牌",
    "什么是河牌",
    "什么是位置",
    "什么是盲注",
    "什么是check",
    "什么是call",
    "什么是raise",
    "什么是fold",
]

CAPABILITY_MARKERS = [
    "who are you",
    "what can you do",
    "what do you do",
    "can you chat",
    "你是谁",
    "你能做什么",
    "你可以做什么",
    "你能聊天吗",
    "你可以聊天吗",
]


def detect_user_intent(
    message: str,
    mode: Optional[str] = None,
    game_state: Optional[GameState | dict] = None,
    practice_state: Optional[PracticeState | dict] = None,
) -> Intent:
    """Classify the latest message; state objects are context, not commands."""

    text = message.strip()
    lowered = text.lower()
    practice_user_action = _practice_value(practice_state, "userAction")

    if mode == "practice" and practice_user_action:
        return "practice_feedback"

    if mode == "learn":
        if _asks_concept(lowered):
            return "poker_concept_question"
        if _asks_capability(lowered):
            return "capability_question"
        return "casual_chat"

    if _asks_for_hand_analysis(lowered):
        return "hand_analysis" if _has_enough_hand_context(game_state) else "incomplete_hand_request"

    if _asks_concept(lowered):
        return "poker_concept_question"

    if _asks_capability(lowered):
        return "capability_question"

    return "casual_chat"


def _asks_for_hand_analysis(lowered: str) -> bool:
    return any(re.search(pattern, lowered, re.IGNORECASE) for pattern in HAND_ANALYSIS_PATTERNS)


def _asks_concept(lowered: str) -> bool:
    return any(marker in lowered for marker in CONCEPT_MARKERS)


def _asks_capability(lowered: str) -> bool:
    return any(marker in lowered for marker in CAPABILITY_MARKERS)


def _has_enough_hand_context(game_state: Optional[GameState | dict]) -> bool:
    if not game_state:
        return False
    hand_cards = _state_value(game_state, "handCards")
    position = _state_value(game_state, "position")
    pot = _state_value(game_state, "pot")
    action_history = _state_value(game_state, "actionHistory")

    has_cards = bool(str(hand_cards).strip())
    has_position = bool(str(position).strip()) and str(position).strip().lower() != "unknown"
    has_pot_or_action = _positive_number(pot) or bool(str(action_history).strip())
    return has_cards and has_position and has_pot_or_action


def _state_value(state: GameState | dict, key: str) -> object:
    if isinstance(state, dict):
        return state.get(key)
    return getattr(state, key, None)


def _practice_value(state: Optional[PracticeState | dict], key: str) -> object:
    if not state:
        return None
    if isinstance(state, dict):
        return state.get(key)
    return getattr(state, key, None)


def _positive_number(value: object) -> bool:
    try:
        return float(value) > 0
    except (TypeError, ValueError):
        return False
