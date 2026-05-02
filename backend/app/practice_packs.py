from __future__ import annotations

from copy import deepcopy
from typing import Any


_OPTION_SETS = {
    "preflop": [{"id": "fold", "label": {"en": "Fold", "zh": "弃牌"}}, {"id": "call", "label": {"en": "Call", "zh": "跟注"}}, {"id": "raise", "label": {"en": "Raise", "zh": "加注"}}],
    "postflop": [{"id": "check", "label": {"en": "Check", "zh": "过牌"}}, {"id": "bet", "label": {"en": "Bet", "zh": "下注"}}],
    "river": [{"id": "fold", "label": {"en": "Fold", "zh": "弃牌"}}, {"id": "call", "label": {"en": "Call", "zh": "跟注"}}, {"id": "raise", "label": {"en": "Raise", "zh": "加注"}}],
}


_PACKS: list[dict[str, Any]] = [
    {"packId": "preflop_basics", "title": {"en": "Preflop Basics", "zh": "翻牌前基础"}, "description": {"en": "Practice when to open, fold, or avoid limping before the flop.", "zh": "练习翻牌前什么时候开池、弃牌，以及避免随意跛入。"}, "hands": [
        ["pfo_001", "preflop", "UTG", "As Ah", "", 1.5, 100, 6, {"en": "You are first to act.", "zh": "你第一个行动。"}, {"en": "Premium hand in early position. What now?", "zh": "前位拿到超强牌，怎么做？"}, "raise", {"en": "Raise for value. Strong hands should build the pot.", "zh": "为了价值加注。强牌应该建立底池。"}, {"en": "Do not slowplay premiums preflop as a default.", "zh": "翻牌前强牌不要默认慢打。"}],
        ["pfo_002", "preflop", "UTG", "9d 4c", "", 1.5, 100, 6, {"en": "You are first to act.", "zh": "你第一个行动。"}, {"en": "Weak offsuit hand. What now?", "zh": "弱的不同花牌，怎么做？"}, "fold", {"en": "Fold. Too many players remain behind you.", "zh": "弃牌。后面还有太多人。"}, {"en": "Early position needs tight hand selection.", "zh": "前位要严格选择起手牌。"}],
        ["pfo_003", "preflop", "CO", "Ad 5d", "", 1.5, 100, 6, {"en": "UTG and HJ fold.", "zh": "UTG和HJ弃牌。"}, {"en": "Suited ace in cutoff. What now?", "zh": "CO拿同花A，怎么做？"}, "raise", {"en": "Raise. You can steal blinds and have playable equity.", "zh": "加注。你可以偷盲，也有可玩性。"}, {"en": "Late position lets suited aces improve in value.", "zh": "后位会提高同花A的价值。"}],
        ["pfo_004", "preflop", "HJ", "7s 2d", "", 1.5, 100, 6, {"en": "UTG folds, action is on you.", "zh": "UTG弃牌，轮到你。"}, {"en": "Very weak hand. What now?", "zh": "非常弱的牌，怎么做？"}, "fold", {"en": "Fold. Low disconnected offsuit cards rarely make strong hands.", "zh": "弃牌。低张断开的不同花很少成强牌。"}, {"en": "You do not need to enter every pot.", "zh": "你不需要每个底池都参与。"}],
        ["pfo_005", "preflop", "BTN", "Kc Qc", "", 1.5, 100, 6, {"en": "Everyone folds to the button.", "zh": "前面弃牌到按钮位。"}, {"en": "Playable broadway hand on BTN. What now?", "zh": "按钮位拿到可玩的高张牌，怎么做？"}, "raise", {"en": "Raise. Good cards plus position make this a clear open.", "zh": "加注。好牌加位置，是清楚的开池。"}, {"en": "Button is the easiest seat to open from.", "zh": "按钮位是最容易开池的位置。"}],
    ]},
    {"packId": "position_basics", "title": {"en": "Position Basics", "zh": "位置基础"}, "description": {"en": "Use late position to steal, value bet, and control the hand.", "zh": "利用后位偷盲、价值下注和控制牌局。"}, "hands": []},
    {"packId": "flop_top_pair", "title": {"en": "Flop Top Pair", "zh": "翻牌顶对"}, "description": {"en": "Learn when top pair wants value and when it needs caution.", "zh": "学习顶对什么时候要价值，什么时候要谨慎。"}, "hands": []},
    {"packId": "draws_and_semibluffs", "title": {"en": "Draws and Semi-Bluffs", "zh": "听牌和半诈唬"}, "description": {"en": "Practice flush draws, straight draws, and simple semi-bluff spots.", "zh": "练习同花听牌、顺子听牌和简单半诈唬。"}, "hands": []},
    {"packId": "river_decisions", "title": {"en": "River Decisions", "zh": "河牌决策"}, "description": {"en": "Practice disciplined river decisions with beginner-friendly logic.", "zh": "用新手友好的逻辑练习河牌纪律。"}, "hands": []},
]


def _fill_pack_hands() -> None:
    templates = {
        "position_basics": [
            ("btn_001", "preflop", "BTN", "As Kh", "", "Everyone folds to you.", "前面所有人弃牌到你。", "Open this strong hand?", "强牌要开池吗？", "raise", "Raise for value and position.", "为了价值和位置优势加注。"),
            ("btn_002", "preflop", "BTN", "8d 3c", "", "Everyone folds to you.", "前面所有人弃牌到你。", "Play this weak hand?", "这手弱牌要玩吗？", "fold", "Fold. Button helps, but it does not make trash profitable.", "弃牌。按钮位有帮助，但不能把垃圾牌变好。"),
            ("btn_003", "flop", "BTN", "Kc Qc", "Qs 8d 2h", "You raised BTN, BB checks.", "你按钮位加注，BB翻牌过牌。", "Top pair on dry board.", "干燥牌面顶对。", "bet", "Bet for value from worse queens and pairs.", "向更差Q和小对子价值下注。"),
            ("btn_004", "flop", "BTN", "Ad 5d", "Kd 9d 2s", "You raised BTN, BB checks.", "你按钮位加注，BB翻牌过牌。", "Nut flush draw.", "最大同花听牌。", "bet", "Semi-bluffing is reasonable with a strong draw.", "强听牌可以合理半诈唬。"),
            ("btn_005", "river", "BTN", "Jc Tc", "Jh 8d 5s 4c Kd", "Opponent checks to you on river.", "河牌对手过牌给你。", "Second pair on scary river.", "危险河牌第二对。", "check", "Check back. Thin value is advanced and worse hands may not call.", "后位过牌。薄价值较难，更差牌未必跟。"),
        ],
        "flop_top_pair": [
            ("tp_001", "flop", "CO", "Ad Qh", "Qs 7d 3c", "You raised, BB checks.", "你加注，BB过牌。", "Top pair ace kicker.", "顶对A踢脚。", "bet", "Clear value bet.", "清楚的价值下注。"),
            ("tp_002", "turn", "CO", "Ad Qh", "Qs 7d 3c 2s", "Flop bet was called, BB checks turn.", "翻牌下注被跟，转牌BB过牌。", "Blank turn.", "空白转牌。", "bet", "Keep value betting against worse pairs.", "继续向更差对子价值下注。"),
            ("tp_003", "river", "BB", "Kc Qd", "Kh 9d 4s 2c Ac", "Opponent bets pot on river.", "河牌对手下注满池。", "Top pair got worse.", "顶对变差。", "fold", "Ace river plus big bet is a warning.", "A河牌加大下注是警告。"),
            ("tp_004", "flop", "BTN", "Ah 7h", "7s 6s 5d", "BB checks to you.", "BB过牌给你。", "Top pair on wet board.", "湿润牌面顶对。", "bet", "Bet smaller for value and protection.", "小下注获取价值并保护。"),
            ("tp_005", "river", "CO", "Qd Jd", "Qs Tc 8h 2s 9c", "Opponent bets big.", "对手大下注。", "One pair on four-straight board.", "四连顺牌面一对。", "fold", "Many straights are possible.", "很多顺子已经可能成牌。"),
        ],
        "draws_and_semibluffs": [
            ("draw_001", "flop", "BTN", "As 5s", "Ks 8s 2d", "BB checks.", "BB过牌。", "Nut flush draw.", "最大同花听牌。", "bet", "Bet can win now or improve later.", "下注可能现在赢，也可能后面成牌。"),
            ("draw_002", "turn", "CO", "9d 8c", "7s 6h 2d Kc", "Opponent bets half pot.", "对手下注半池。", "Open-ended straight draw.", "双头顺听牌。", "call", "Half-pot gives a fair price for a strong draw.", "半池下注给强听牌不错价格。"),
            ("draw_003", "flop", "BB", "Ah Jd", "8s 6s 2c", "You missed and face a bet.", "你没中牌并面对下注。", "No pair, no strong draw.", "没对子也没强听牌。", "fold", "Do not chase with no clear improvement path.", "没有清楚改进路线就别硬追。"),
            ("draw_004", "flop", "BTN", "Qh Jh", "Th 9c 2h", "Opponent checks.", "对手过牌。", "Combo draw.", "组合听牌。", "bet", "Strong draws can apply pressure.", "强听牌可以施压。"),
            ("draw_005", "river", "BTN", "As 5s", "Ks 8s 2d 4c 9h", "Your flush draw missed and opponent checks.", "你的同花听牌没中，对手过牌。", "Missed draw.", "没中的听牌。", "check", "Beginners can give up when the draw misses.", "听牌没中时，新手可以放弃。"),
        ],
        "river_decisions": [
            ("riv_001", "river", "BB", "Kc Qd", "Kh 9d 4s 2c Ac", "Opponent bets pot.", "对手下注满池。", "One pair after scare card.", "惊吓牌后一对。", "fold", "A big river bet needs a strong calling reason.", "河牌大下注需要强跟注理由。"),
            ("riv_002", "river", "BTN", "Ah Qh", "Qs 7d 3c 2s 2d", "Opponent checks.", "对手过牌。", "Top pair on paired low river.", "低牌成对河牌顶对。", "bet", "Worse queens can still call.", "更差Q仍可能跟。"),
            ("riv_003", "river", "CO", "9s 9d", "Kc 8h 4d 2s As", "Opponent bets big.", "对手大下注。", "Underpair on ace river.", "A河牌的低于公共牌对子。", "fold", "Your hand beats very little value.", "你的牌赢不了多少价值牌。"),
            ("riv_004", "river", "BTN", "As Js", "Ks 8s 2d 4s 9h", "Opponent checks.", "对手过牌。", "Nut flush.", "最大同花。", "bet", "Very strong hand wants value.", "超强牌要价值。"),
            ("riv_005", "river", "BB", "Jc Tc", "Jh 8d 5s 4c Kd", "Opponent checks behind possible.", "对手可能随后过牌。", "Second pair.", "第二对。", "check", "Show down cheaply with medium strength.", "中等牌力便宜摊牌。"),
        ],
    }
    for pack in _PACKS:
        if pack["hands"] and isinstance(pack["hands"][0], list):
            pack["hands"] = [_expand_row(row) for row in pack["hands"]]
            continue
        if pack["hands"]:
            continue
        pack["hands"] = [_hand(*row) for row in templates[pack["packId"]]]


def get_practice_packs(language: str) -> dict[str, Any]:
    _fill_pack_hands()
    lang = language if language in {"en", "zh"} else "en"
    packs = deepcopy(_PACKS)
    for pack in packs:
        pack["title"] = pack["title"][lang]
        pack["description"] = pack["description"][lang]
        pack["difficulty"] = "beginner"
        total_hands = len(pack["hands"])
        for index, hand in enumerate(pack["hands"], start=1):
            hand["handNumber"] = index
            hand["totalHands"] = total_hands
            hand.setdefault("tags", [pack["packId"], hand["street"], hand["recommendedAction"]])
            _localize_hand(hand, lang)
    return {"language": lang, "packs": packs}


def _hand(hand_id, street, pos, cards, board, action_en, action_zh, prompt_en, prompt_zh, action, exp_en, exp_zh):
    option_key = "preflop" if street == "preflop" else "river" if action in {"fold", "call", "raise"} else "postflop"
    return {
        "handId": hand_id,
        "street": street,
        "heroPosition": pos,
        "heroCards": cards,
        "boardCards": board,
        "pot": 1.5 if street == "preflop" else 8 if street != "river" else 28,
        "stack": 100,
        "players": 6 if street == "preflop" else 2,
        "actionHistory": {"en": action_en, "zh": action_zh},
        "prompt": {"en": prompt_en, "zh": prompt_zh},
        "options": deepcopy(_OPTION_SETS[option_key]),
        "recommendedAction": action,
        "coachExplanation": {"en": exp_en, "zh": exp_zh},
        "beginnerTip": {"en": "Name your reason before putting chips in.", "zh": "投入筹码前，先说出你的理由。"},
    }


def _expand_row(row: list[Any]) -> dict[str, Any]:
    if len(row) == 13 and isinstance(row[8], dict):
        hand_id, street, pos, cards, board, pot, stack, players, action_history, prompt, action, explanation, tip = row
        option_key = "preflop" if street == "preflop" else "river" if action in {"fold", "call", "raise"} else "postflop"
        return {
            "handId": hand_id,
            "street": street,
            "heroPosition": pos,
            "heroCards": cards,
            "boardCards": board,
            "pot": pot,
            "stack": stack,
            "players": players,
            "actionHistory": action_history,
            "prompt": prompt,
            "options": deepcopy(_OPTION_SETS[option_key]),
            "recommendedAction": action,
            "coachExplanation": explanation,
            "beginnerTip": tip,
        }
    return _hand(*row)


def _localize_hand(hand: dict[str, Any], lang: str) -> None:
    for key in ("actionHistory", "prompt", "coachExplanation", "beginnerTip"):
        hand[key] = hand[key][lang]
    for option in hand["options"]:
        option["label"] = option["label"][lang]
