from __future__ import annotations

from copy import deepcopy
from datetime import date, datetime
from typing import Any

from fastapi import HTTPException


_HANDS: list[dict[str, Any]] = [
    {"handId": "daily_001", "title": {"en": "Button With Big Slick", "zh": "按钮位AK"}, "street": "preflop", "heroPosition": "BTN", "heroCards": "As Kh", "boardCards": "", "pot": 1.5, "stack": 100, "players": 6, "actionHistory": {"en": "Everyone folds to you on the button.", "zh": "前面所有人弃牌，轮到按钮位的你。"}, "question": {"en": "What should you do?", "zh": "你应该怎么做？"}, "options": [{"id": "fold", "label": {"en": "Fold", "zh": "弃牌"}}, {"id": "call", "label": {"en": "Call", "zh": "跟注"}}, {"id": "raise", "label": {"en": "Raise to 2.5BB", "zh": "加注到2.5BB"}}], "recommendedAction": "raise", "explanation": {"en": "AK is a premium hand and the button has position. Raising can win the blinds or build value when called.", "zh": "AK是强起手牌，按钮位还有位置优势。加注可以直接赢盲注，也能在被跟注时建立价值。"}, "beginnerTip": {"en": "Strong hand plus late position usually means be active.", "zh": "强牌加后位，通常要主动进攻。"}, "tags": ["position", "preflop", "open-raise"]},
    {"handId": "daily_002", "title": {"en": "UTG Trash Hand", "zh": "枪口位弱牌"}, "street": "preflop", "heroPosition": "UTG", "heroCards": "9d 4c", "boardCards": "", "pot": 1.5, "stack": 100, "players": 6, "actionHistory": {"en": "You are first to act preflop.", "zh": "翻牌前你第一个行动。"}, "question": {"en": "What should you do?", "zh": "你应该怎么做？"}, "options": [{"id": "fold", "label": {"en": "Fold", "zh": "弃牌"}}, {"id": "call", "label": {"en": "Call", "zh": "跟注"}}, {"id": "raise", "label": {"en": "Raise", "zh": "加注"}}], "recommendedAction": "fold", "explanation": {"en": "94 offsuit is weak and UTG has many players behind. Folding saves chips.", "zh": "94不同花很弱，UTG后面还有很多玩家。弃牌是在省筹码。"}, "beginnerTip": {"en": "Early position needs stronger starting hands.", "zh": "前位需要更强的起手牌。"}, "tags": ["preflop", "discipline", "early-position"]},
    {"handId": "daily_003", "title": {"en": "Top Pair Value", "zh": "顶对价值"}, "street": "flop", "heroPosition": "CO", "heroCards": "Ad Qh", "boardCards": "Qs 7d 3c", "pot": 7, "stack": 96, "players": 2, "actionHistory": {"en": "You raised preflop, BB called, and BB checks the flop.", "zh": "你翻牌前加注，BB跟注，翻牌BB过牌。"}, "question": {"en": "What should you do?", "zh": "你应该怎么做？"}, "options": [{"id": "check", "label": {"en": "Check", "zh": "过牌"}}, {"id": "bet", "label": {"en": "Bet 4BB", "zh": "下注4BB"}}], "recommendedAction": "bet", "explanation": {"en": "Top pair with ace kicker can get called by worse queens and smaller pairs.", "zh": "顶对A踢脚能被更差Q和小对子跟注。"}, "beginnerTip": {"en": "Value bet when worse hands can call.", "zh": "当更差牌会跟注时，可以价值下注。"}, "tags": ["flop", "top-pair", "value-bet"]},
    {"handId": "daily_004", "title": {"en": "Flush Draw Spot", "zh": "同花听牌"}, "street": "flop", "heroPosition": "BTN", "heroCards": "As 5s", "boardCards": "Ks 8s 2d", "pot": 6, "stack": 97, "players": 2, "actionHistory": {"en": "You raised button, BB called, BB checks.", "zh": "你按钮位加注，BB跟注，翻牌BB过牌。"}, "question": {"en": "What should you do?", "zh": "你应该怎么做？"}, "options": [{"id": "check", "label": {"en": "Check", "zh": "过牌"}}, {"id": "bet", "label": {"en": "Bet", "zh": "下注"}}], "recommendedAction": "bet", "explanation": {"en": "The nut flush draw can bet as a semi-bluff: you may win now or improve later.", "zh": "最大同花听牌可以半诈唬下注：现在可能赢，后面也可能成牌。"}, "beginnerTip": {"en": "Good draws have backup ways to win.", "zh": "好听牌有额外赢法。"}, "tags": ["flop", "draw", "semi-bluff"]},
    {"handId": "daily_005", "title": {"en": "River One Pair Discipline", "zh": "河牌一对纪律"}, "street": "river", "heroPosition": "BB", "heroCards": "Kc Qd", "boardCards": "Kh 9d 4s 2c Ac", "pot": 30, "stack": 75, "players": 2, "actionHistory": {"en": "You called flop and turn. River is an ace and opponent bets pot.", "zh": "你翻牌和转牌跟注。河牌来了A，对手下注满池。"}, "question": {"en": "What should you do?", "zh": "你应该怎么做？"}, "options": [{"id": "fold", "label": {"en": "Fold", "zh": "弃牌"}}, {"id": "call", "label": {"en": "Call", "zh": "跟注"}}, {"id": "raise", "label": {"en": "Raise", "zh": "加注"}}], "recommendedAction": "fold", "explanation": {"en": "A pot-sized river bet after a scary ace is often strong. One pair is not enough without a clear bluff read.", "zh": "危险A河牌后对手满池下注通常很强。没有明确诈唬信息，一对不够跟。"}, "beginnerTip": {"en": "Big river calls need strong reasons.", "zh": "河牌大跟注需要强理由。"}, "tags": ["river", "fold", "one-pair"]},
]

for index in range(6, 21):
    base = deepcopy(_HANDS[(index - 1) % 5])
    base["handId"] = f"daily_{index:03d}"
    base["title"] = {"en": f"Beginner Spot {index}", "zh": f"新手决策 {index}"}
    _HANDS.append(base)


def get_daily_hand(language: str, date_text: str | None = None) -> dict[str, Any]:
    lang = language if language in {"en", "zh"} else "en"
    target_date = _parse_date(date_text)
    index = target_date.toordinal() % len(_HANDS)
    hand = deepcopy(_HANDS[index])
    return _localize(hand, lang, target_date.isoformat())


def _parse_date(date_text: str | None) -> date:
    if not date_text:
        return date.today()
    try:
        return datetime.strptime(date_text, "%Y-%m-%d").date()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="date must use YYYY-MM-DD format.") from exc


def _localize(hand: dict[str, Any], lang: str, date_value: str) -> dict[str, Any]:
    hand["date"] = date_value
    for key in ("title", "actionHistory", "question", "explanation", "beginnerTip"):
        hand[key] = hand[key][lang]
    for option in hand["options"]:
        option["label"] = option["label"][lang]
    return hand
