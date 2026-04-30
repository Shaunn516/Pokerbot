from __future__ import annotations

import random
from copy import deepcopy
from typing import Any

from fastapi import HTTPException


POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"]
SUITS = ["s", "h", "d", "c"]
ACTION_LABELS = {
    "en": {"fold": "Fold", "check": "Check", "call": "Call", "bet": "Bet", "raise": "Raise"},
    "zh": {"fold": "弃牌", "check": "过牌", "call": "跟注", "bet": "下注", "raise": "加注"},
}


SCENARIO_TEMPLATES: list[dict[str, Any]] = [
    {
        "scenarioId": "btn-strong-open",
        "title": {"en": "BTN strong hand open raise", "zh": "BTN强牌开池加注"},
        "difficulty": "beginner",
        "theme": "preflop value",
        "steps": [
            {
                "street": "preflop",
                "heroPosition": "BTN",
                "heroCards": ["A{a}", "K{b}"],
                "boardCards": [],
                "pot": 1.5,
                "stack": 100,
                "actionHistory": {"en": "UTG, HJ, and CO fold. Hero is on the button.", "zh": "UTG、HJ、CO都弃牌。你在按钮位。"},
                "summaryText": {"en": "You have A-K on BTN and everyone folded to you.", "zh": "你在BTN拿到AK，前面都弃牌。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "raise",
                "feedbackByAction": {
                    "raise": {"reasonable": True, "why": {"en": "A-K is strong and BTN has position, so raising builds value and can win blinds.", "zh": "AK很强，而且BTN有位置优势，加注可以拿价值，也可能直接赢下盲注。"}},
                    "call": {"reasonable": False, "why": {"en": "Calling lets the blinds see flops cheaply with worse hands.", "zh": "平跟会让盲注位用较差牌便宜看翻牌。"}},
                    "fold": {"reasonable": False, "why": {"en": "Folding A-K on the button after everyone folds is far too tight.", "zh": "前面都弃牌时，BTN弃掉AK太紧了。"}},
                },
                "beginnerTip": {"en": "Strong cards plus late position usually means be active.", "zh": "强牌加好位置，通常要主动。"},
                "nextStepText": {"en": "SB folds, BB calls. Go to the flop.", "zh": "SB弃牌，BB跟注。进入翻牌。"},
                "nextStepIndex": 1,
            },
            {
                "street": "flop",
                "heroPosition": "BTN",
                "heroCards": ["A{a}", "K{b}"],
                "boardCards": ["K{c}", "7{d}", "2{a}"],
                "pot": 5.5,
                "stack": 97,
                "actionHistory": {"en": "Hero raised BTN. BB called. BB checks the K-7-2 flop.", "zh": "你BTN加注，BB跟注。翻牌K-7-2，BB过牌。"},
                "summaryText": {"en": "You flopped top pair top kicker and BB checks.", "zh": "你击中顶对顶踢脚，BB过牌。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "Top pair top kicker can bet for value from worse kings and pairs.", "zh": "顶对顶踢脚可以向较差K和对子价值下注。"}},
                    "check": {"reasonable": False, "why": {"en": "Checking is playable sometimes, but beginners should value bet strong top pair here.", "zh": "有时可以过牌，但新手在这里更应学会用强顶对价值下注。"}},
                },
                "beginnerTip": {"en": "When worse hands can call, value betting is your friend.", "zh": "当更差的牌会跟注时，价值下注很重要。"},
                "nextStepText": {"en": "BB calls. Practice complete.", "zh": "BB跟注。练习完成。"},
            },
        ],
    },
    {
        "scenarioId": "utg-weak-fold",
        "title": {"en": "UTG weak hand fold discipline", "zh": "UTG弱牌弃牌纪律"},
        "difficulty": "beginner",
        "theme": "preflop discipline",
        "steps": [
            {
                "street": "preflop",
                "heroPosition": "UTG",
                "heroCards": ["9{a}", "4{b}"],
                "boardCards": [],
                "pot": 1.5,
                "stack": 100,
                "actionHistory": {"en": "Hero is first to act preflop.", "zh": "翻牌前你第一个行动。"},
                "summaryText": {"en": "You are UTG with 9-4 offsuit.", "zh": "你在UTG拿到9-4不同花。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "fold",
                "feedbackByAction": {
                    "fold": {"reasonable": True, "why": {"en": "Weak hand and early position is a classic fold.", "zh": "弱牌加早位，是标准弃牌。"}},
                    "call": {"reasonable": False, "why": {"en": "Calling first in invites trouble with a weak hand.", "zh": "用弱牌率先平跟很容易陷入麻烦。"}},
                    "raise": {"reasonable": False, "why": {"en": "Raising weak offsuit cards from UTG is too loose for beginners.", "zh": "UTG用弱杂牌加注，对新手来说太松。"}},
                },
                "beginnerTip": {"en": "Early position needs tighter starting hands.", "zh": "位置越早，起手牌越要紧。"},
                "nextStepText": {"en": "Good discipline. Practice complete.", "zh": "纪律很好。练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "co-suited-ace-steal",
        "title": {"en": "CO steal with suited ace", "zh": "CO同花A偷盲"},
        "difficulty": "beginner",
        "theme": "preflop steal",
        "steps": [
            {
                "street": "preflop",
                "heroPosition": "CO",
                "heroCards": ["A{a}", "5{a}"],
                "boardCards": [],
                "pot": 1.5,
                "stack": 100,
                "actionHistory": {"en": "UTG and HJ fold. Hero is in the cutoff.", "zh": "UTG和HJ弃牌，你在CO。"},
                "summaryText": {"en": "You have A5 suited in CO after folds.", "zh": "前面弃牌后，你在CO拿到A5同花。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "raise",
                "feedbackByAction": {
                    "raise": {"reasonable": True, "why": {"en": "A suited ace can steal blinds and has backup equity when called.", "zh": "同花A可以偷盲，被跟注时也有后续胜率。"}},
                    "call": {"reasonable": False, "why": {"en": "Open-limping gives away initiative.", "zh": "率先平跟会放弃主动权。"}},
                    "fold": {"reasonable": False, "why": {"en": "Folding is too tight with a playable suited ace in late position.", "zh": "后位拿到可玩的同花A直接弃牌偏紧。"}},
                },
                "beginnerTip": {"en": "Late position lets you play more hands, especially suited aces.", "zh": "后位可以多玩一些牌，尤其是同花A。"},
                "nextStepText": {"en": "BTN folds, blinds call. Go to the flop.", "zh": "BTN弃牌，盲注跟注。进入翻牌。"},
                "nextStepIndex": 1,
            },
            {
                "street": "flop",
                "heroPosition": "CO",
                "heroCards": ["A{a}", "5{a}"],
                "boardCards": ["K{a}", "8{a}", "2{b}"],
                "pot": 8,
                "stack": 96,
                "actionHistory": {"en": "Hero raised preflop and got called. Flop gives a flush draw.", "zh": "你翻前加注被跟注，翻牌形成同花听牌。"},
                "summaryText": {"en": "You missed pair but have the nut flush draw.", "zh": "你没有对子，但有最大同花听牌。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "A semi-bluff can win now or improve to a strong flush later.", "zh": "半诈唬可能现在赢下底池，也可能后面成强同花。"}},
                    "check": {"reasonable": True, "why": {"en": "Checking is cautious, but betting teaches pressure with good draws.", "zh": "过牌较谨慎，但下注能练习用强听牌施压。"}},
                },
                "beginnerTip": {"en": "Good draws can be played actively because they have backup ways to win.", "zh": "强听牌可以主动，因为有多种赢法。"},
                "nextStepText": {"en": "Practice complete.", "zh": "练习完成。"},
            },
        ],
    },
    {
        "scenarioId": "bb-small-btn-defend",
        "title": {"en": "BB defend against small button raise", "zh": "BB防守小按钮加注"},
        "difficulty": "beginner",
        "theme": "blind defense",
        "steps": [
            {
                "street": "preflop",
                "heroPosition": "BB",
                "heroCards": ["Q{a}", "9{a}"],
                "boardCards": [],
                "pot": 4.0,
                "stack": 98,
                "actionHistory": {"en": "BTN raises small to 2.2BB, SB folds. Hero is BB.", "zh": "BTN小加注到2.2BB，SB弃牌，你在BB。"},
                "summaryText": {"en": "You have Q9 suited in BB facing a small BTN raise.", "zh": "你在BB拿Q9同花，面对BTN小加注。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "call",
                "feedbackByAction": {
                    "call": {"reasonable": True, "why": {"en": "You already posted BB and Q9 suited plays well enough versus a small BTN raise.", "zh": "你已投入大盲，Q9同花面对BTN小加注有足够可玩性。"}},
                    "fold": {"reasonable": False, "why": {"en": "Folding is a bit tight against a small late-position raise.", "zh": "面对后位小加注直接弃牌偏紧。"}},
                    "raise": {"reasonable": False, "why": {"en": "A 3-bet is advanced; calling is simpler for beginners.", "zh": "3bet更进阶，新手这里跟注更简单。"}},
                },
                "beginnerTip": {"en": "Big blind gets a discount, so some suited hands can defend.", "zh": "大盲位有折扣，所以一些同花牌可以防守。"},
                "nextStepText": {"en": "You call and see the flop. Practice complete.", "zh": "你跟注看翻牌。练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "flop-top-pair-value",
        "title": {"en": "Flop top pair value bet", "zh": "翻牌顶对价值下注"},
        "difficulty": "beginner",
        "theme": "value bet",
        "steps": [
            {
                "street": "flop",
                "heroPosition": "CO",
                "heroCards": ["A{a}", "Q{b}"],
                "boardCards": ["Q{c}", "7{d}", "3{a}"],
                "pot": 7,
                "stack": 96,
                "actionHistory": {"en": "Hero raised CO, BB called, BB checks flop.", "zh": "你CO加注，BB跟注，翻牌BB过牌。"},
                "summaryText": {"en": "You have top pair with ace kicker.", "zh": "你有顶对A踢脚。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "Worse queens and pairs can call, so bet for value.", "zh": "较差Q和对子会跟注，所以应该价值下注。"}},
                    "check": {"reasonable": False, "why": {"en": "Checking misses value from worse hands.", "zh": "过牌会错过从更差牌拿价值。"}},
                },
                "beginnerTip": {"en": "Value bet when worse hands can continue.", "zh": "当更差牌会继续时，就价值下注。"},
                "nextStepText": {"en": "Opponent calls. Go to the turn.", "zh": "对手跟注。进入转牌。"},
                "nextStepIndex": 1,
            },
            {
                "street": "turn",
                "heroPosition": "CO",
                "heroCards": ["A{a}", "Q{b}"],
                "boardCards": ["Q{c}", "7{d}", "3{a}", "2{b}"],
                "pot": 17,
                "stack": 88,
                "actionHistory": {"en": "Flop bet got called. Turn is a blank and BB checks.", "zh": "翻牌下注被跟注。转牌是空白牌，BB过牌。"},
                "summaryText": {"en": "Your top pair is still strong on a blank turn.", "zh": "空白转牌后，你的顶对仍然强。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "The turn did not change much, so you can keep betting for value.", "zh": "转牌变化不大，可以继续价值下注。"}},
                    "check": {"reasonable": True, "why": {"en": "Checking controls pot, but value betting is the clearer beginner lesson.", "zh": "过牌能控池，但价值下注是更清晰的新手思路。"}},
                },
                "beginnerTip": {"en": "Blank turns often let strong made hands continue value betting.", "zh": "空白转牌常让强成牌继续价值下注。"},
                "nextStepText": {"en": "Practice complete.", "zh": "练习完成。"},
            },
        ],
    },
    {
        "scenarioId": "flop-missed-check-fold",
        "title": {"en": "Flop missed hand check/fold", "zh": "翻牌没中牌过牌弃牌"},
        "difficulty": "beginner",
        "theme": "missed hand",
        "steps": [
            {
                "street": "flop",
                "heroPosition": "BB",
                "heroCards": ["A{a}", "J{b}"],
                "boardCards": ["8{c}", "6{d}", "2{a}"],
                "pot": 6,
                "stack": 97,
                "actionHistory": {"en": "BTN raised, Hero called BB. Hero acts first on flop.", "zh": "BTN加注，你BB跟注。翻牌你先行动。"},
                "summaryText": {"en": "You missed the flop and are out of position.", "zh": "你没中翻牌，而且没位置。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "check",
                "feedbackByAction": {
                    "check": {"reasonable": True, "why": {"en": "With no pair or strong draw, checking keeps the pot small.", "zh": "没有对子或强听牌，过牌可以控制底池。"}},
                    "bet": {"reasonable": False, "why": {"en": "Betting into the raiser with little equity is often burning chips.", "zh": "胜率很少时主动打原加注者，常常是在烧筹码。"}},
                },
                "beginnerTip": {"en": "You do not need to fight for every pot.", "zh": "不是每个底池都必须争。"},
                "nextStepText": {"en": "BTN bets large; fold is fine. Practice complete.", "zh": "BTN大下注，弃牌没问题。练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "turn-flush-draw-semi-bluff",
        "title": {"en": "Flush draw semi-bluff", "zh": "同花听牌半诈唬"},
        "difficulty": "beginner",
        "theme": "draw aggression",
        "steps": [
            {
                "street": "turn",
                "heroPosition": "BTN",
                "heroCards": ["A{a}", "5{a}"],
                "boardCards": ["K{a}", "8{b}", "2{a}", "J{c}"],
                "pot": 14,
                "stack": 92,
                "actionHistory": {"en": "Hero bet flop with nut flush draw and got called. Opponent checks turn.", "zh": "你翻牌用最大同花听牌下注被跟注。对手转牌过牌。"},
                "summaryText": {"en": "You still have the nut flush draw on the turn.", "zh": "转牌你仍有最大同花听牌。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "Betting can make folds now and you can improve on river.", "zh": "下注可能现在逼弃牌，河牌也可能成同花。"}},
                    "check": {"reasonable": True, "why": {"en": "Checking takes the free card, but betting applies pressure.", "zh": "过牌能免费看牌，但下注能施压。"}},
                },
                "beginnerTip": {"en": "Semi-bluffs work best when you can win now or later.", "zh": "半诈唬好在既能现在赢，也能之后成牌赢。"},
                "nextStepText": {"en": "Opponent calls. Go to the river.", "zh": "对手跟注。进入河牌。"},
                "nextStepIndex": 1,
            },
            {
                "street": "river",
                "heroPosition": "BTN",
                "heroCards": ["A{a}", "5{a}"],
                "boardCards": ["K{a}", "8{b}", "2{a}", "J{c}", "3{a}"],
                "pot": 34,
                "stack": 78,
                "actionHistory": {"en": "River completes your nut flush and opponent checks.", "zh": "河牌完成最大同花，对手过牌。"},
                "summaryText": {"en": "You made the nut flush on river.", "zh": "你河牌成了最大同花。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "bet",
                "feedbackByAction": {
                    "bet": {"reasonable": True, "why": {"en": "You made a very strong hand and should value bet.", "zh": "你成了很强的牌，应该价值下注。"}},
                    "check": {"reasonable": False, "why": {"en": "Checking back misses value from hands that can call.", "zh": "后手过牌会错过可跟注牌的价值。"}},
                },
                "beginnerTip": {"en": "When your draw completes strongly, think value.", "zh": "强听牌成牌后，要想到拿价值。"},
                "nextStepText": {"en": "Practice complete.", "zh": "练习完成。"},
            },
        ],
    },
    {
        "scenarioId": "turn-open-ended-draw",
        "title": {"en": "Open-ended straight draw decision", "zh": "开放顺听牌决策"},
        "difficulty": "beginner",
        "theme": "draw decision",
        "steps": [
            {
                "street": "turn",
                "heroPosition": "CO",
                "heroCards": ["9{a}", "8{b}"],
                "boardCards": ["7{c}", "6{d}", "2{a}", "K{b}"],
                "pot": 12,
                "stack": 90,
                "actionHistory": {"en": "You called flop with an open-ended straight draw. Opponent bets half pot on turn.", "zh": "你翻牌用开放顺听牌跟注。对手转牌下注半池。"},
                "summaryText": {"en": "Any 5 or T makes a straight, but you only have a draw.", "zh": "任何5或T成顺，但你现在只是听牌。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "call",
                "feedbackByAction": {
                    "call": {"reasonable": True, "why": {"en": "Half-pot gives a reasonable price to chase an open-ended draw.", "zh": "半池下注给开放顺听牌一个合理价格。"}},
                    "fold": {"reasonable": False, "why": {"en": "Folding may be too tight when the price is fair.", "zh": "价格合适时弃牌可能太紧。"}},
                    "raise": {"reasonable": False, "why": {"en": "Raising draws is possible, but calling is the simpler beginner choice.", "zh": "听牌加注可以，但新手这里跟注更简单。"}},
                },
                "beginnerTip": {"en": "Draw decisions depend on price and how many cards help you.", "zh": "听牌决策看价格和有多少张牌能帮你。"},
                "nextStepText": {"en": "You call and see the river. Practice complete.", "zh": "你跟注看河牌。练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "river-facing-large-bet",
        "title": {"en": "Facing large river bet", "zh": "面对河牌大下注"},
        "difficulty": "beginner",
        "theme": "river discipline",
        "steps": [
            {
                "street": "river",
                "heroPosition": "BB",
                "heroCards": ["K{a}", "Q{b}"],
                "boardCards": ["K{c}", "9{d}", "4{a}", "2{b}", "A{c}"],
                "pot": 30,
                "stack": 75,
                "actionHistory": {"en": "You called flop and turn with top pair. River A arrives and opponent bets pot.", "zh": "你用顶对跟注翻牌和转牌。河牌A，对手下注满池。"},
                "summaryText": {"en": "Your pair of kings got worse on an ace river facing a big bet.", "zh": "河牌A让你的K对变弱，还面对大下注。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "fold",
                "feedbackByAction": {
                    "fold": {"reasonable": True, "why": {"en": "A pot-sized river bet after the ace is often strong; folding one pair is disciplined.", "zh": "A河牌后面对满池下注通常很强，弃掉一对是纪律。"}},
                    "call": {"reasonable": False, "why": {"en": "Calling big river bets with one pair can be expensive when many better hands exist.", "zh": "很多更好牌存在时，用一对跟河牌大注很贵。"}},
                    "raise": {"reasonable": False, "why": {"en": "Bluff-raising river is too advanced and risky for this beginner spot.", "zh": "河牌诈唬加注太进阶也太冒险。"}},
                },
                "beginnerTip": {"en": "Big river bets need stronger calling hands.", "zh": "面对河牌大下注，跟注牌力要更强。"},
                "nextStepText": {"en": "Practice complete.", "zh": "练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "river-thin-value-check",
        "title": {"en": "River thin value check", "zh": "河牌薄价值过牌"},
        "difficulty": "beginner",
        "theme": "river showdown",
        "steps": [
            {
                "street": "river",
                "heroPosition": "BTN",
                "heroCards": ["J{a}", "T{b}"],
                "boardCards": ["J{c}", "8{d}", "5{a}", "4{b}", "K{c}"],
                "pot": 24,
                "stack": 82,
                "actionHistory": {"en": "Flop checked, turn checked. Opponent checks river.", "zh": "翻牌过牌，转牌过牌。对手河牌过牌。"},
                "summaryText": {"en": "You have second pair on a scary king river.", "zh": "你在K河牌有第二对。"},
                "availableActions": ["check", "bet"],
                "recommendedAction": "check",
                "feedbackByAction": {
                    "check": {"reasonable": True, "why": {"en": "Second pair may win at showdown, but worse hands may not call a bet.", "zh": "第二对可能摊牌赢，但更差牌未必会跟注。"}},
                    "bet": {"reasonable": False, "why": {"en": "Betting thin value is advanced; beginners can check and see showdown.", "zh": "薄价值下注更进阶，新手可以过牌摊牌。"}},
                },
                "beginnerTip": {"en": "Before value betting, ask what worse hand calls.", "zh": "价值下注前先问：什么更差牌会跟？"},
                "nextStepText": {"en": "Practice complete.", "zh": "练习完成。"},
            }
        ],
    },
    {
        "scenarioId": "small-pair-set-mine",
        "title": {"en": "Small pocket pair set-mining spot", "zh": "小口袋对子追暗三"},
        "difficulty": "beginner",
        "theme": "set mining",
        "steps": [
            {
                "street": "preflop",
                "heroPosition": "BTN",
                "heroCards": ["4{a}", "4{b}"],
                "boardCards": [],
                "pot": 6,
                "stack": 100,
                "actionHistory": {"en": "UTG raises to 3BB and two players call. Hero is BTN.", "zh": "UTG加注到3BB，两人跟注。你在BTN。"},
                "summaryText": {"en": "You have pocket fours with position and deep stacks.", "zh": "你有44，有位置，筹码较深。"},
                "availableActions": ["fold", "call", "raise"],
                "recommendedAction": "call",
                "feedbackByAction": {
                    "call": {"reasonable": True, "why": {"en": "Small pairs can call cheaply with deep stacks to try to flop a set.", "zh": "深筹码时，小对子可以便宜跟注尝试中暗三。"}},
                    "fold": {"reasonable": True, "why": {"en": "Folding is cautious and fine, but calling is educational with position and multiway value.", "zh": "弃牌谨慎没错，但有位置且多人底池时，跟注很有学习价值。"}},
                    "raise": {"reasonable": False, "why": {"en": "Small pairs do not like getting 4-bet; calling keeps the plan simple.", "zh": "小对子不喜欢被再加注，跟注计划更简单。"}},
                },
                "beginnerTip": {"en": "Set mining needs a cheap call and enough stack behind.", "zh": "追暗三需要便宜跟注，并且后手筹码足够深。"},
                "nextStepText": {"en": "You call and go multiway to the flop. Practice complete.", "zh": "你跟注，多人进入翻牌。练习完成。"},
            }
        ],
    },
]


def generate_practice_scenario(difficulty: str = "beginner", street: str = "random", language: str = "en") -> dict[str, Any]:
    difficulty = difficulty if difficulty in {"beginner", "intermediate"} else "beginner"
    language = language if language in {"en", "zh"} else "en"
    candidates = [item for item in SCENARIO_TEMPLATES if item["difficulty"] == difficulty]
    if street != "random":
        candidates = [item for item in candidates if any(step["street"] == street for step in item["steps"])]
    if not candidates:
        candidates = SCENARIO_TEMPLATES

    template = deepcopy(random.choice(candidates))
    suit_map = _random_suit_map()
    pot_offset = random.choice([-0.5, 0, 0.5])
    steps = [_render_step(template, step, index, suit_map, pot_offset, language) for index, step in enumerate(template["steps"])]
    return {
        "scenarioId": template["scenarioId"],
        "title": template["title"][language],
        "difficulty": template["difficulty"],
        "theme": template["theme"],
        "language": language,
        "steps": steps,
        "currentStep": steps[0],
    }


def handle_practice_action(request) -> dict[str, Any]:
    language = request.language if request.language in {"en", "zh"} else "en"
    template = _find_template(request.scenarioId)
    if template is None:
        raise HTTPException(status_code=404, detail="Practice scenario not found.")
    if request.stepIndex >= len(template["steps"]):
        raise HTTPException(status_code=422, detail="Invalid practice stepIndex.")

    step = template["steps"][request.stepIndex]
    action = _normalize_action(request.userAction)
    recommended = step["recommendedAction"]
    feedback = step["feedbackByAction"].get(action)
    is_reasonable = bool(feedback and feedback["reasonable"])
    if feedback is None:
        feedback = {
            "reasonable": False,
            "why": {
                "en": "That action is not one of the main beginner options for this spot.",
                "zh": "这个行动不是此处主要的新手选项之一。",
            },
        }

    next_index = step.get("nextStepIndex")
    is_complete = next_index is None
    next_state = None
    if next_index is not None and next_index < len(template["steps"]):
        next_state = _render_step(template, template["steps"][next_index], next_index, {"a": "s", "b": "h", "c": "d", "d": "c"}, 0, language)

    labels = ACTION_LABELS[language]
    why = _feedback_text(feedback, "why", language)
    beginner_tip = step["beginnerTip"][language]
    next_step = step["nextStepText"][language]
    feedback_body = {
        "isReasonable": is_reasonable,
        "yourChoice": labels.get(action, request.userAction),
        "coachSuggestion": labels.get(recommended, recommended),
        "why": why,
        "beginnerTip": beginner_tip,
        "nextStep": next_step,
    }
    feedback_body["formatted"] = _format_feedback(feedback_body, language)
    return {
        "feedback": feedback_body,
        "nextState": next_state,
        "isComplete": is_complete,
        "summary": _completion_summary(template, language) if is_complete else None,
    }


def _find_template(scenario_id: str) -> dict[str, Any] | None:
    return next((item for item in SCENARIO_TEMPLATES if item["scenarioId"] == scenario_id), None)


def _render_step(
    template: dict[str, Any],
    step: dict[str, Any],
    index: int,
    suit_map: dict[str, str],
    pot_offset: float,
    language: str,
) -> dict[str, Any]:
    hero_cards = [_card(card, suit_map) for card in step["heroCards"]]
    board_cards = [_card(card, suit_map) for card in step["boardCards"]]
    _assert_unique(hero_cards + board_cards)
    pot = max(1, float(step["pot"]) + pot_offset)
    return {
        "scenarioId": template["scenarioId"],
        "scenarioTitle": template["title"][language],
        "stepIndex": index,
        "street": step["street"],
        "heroPosition": step["heroPosition"],
        "heroCards": " ".join(hero_cards),
        "boardCards": " ".join(board_cards),
        "pot": pot,
        "stack": float(step["stack"]),
        "actionHistory": step["actionHistory"][language],
        "summaryText": step["summaryText"][language],
        "availableActions": step["availableActions"],
        "recommendedAction": step["recommendedAction"],
        "beginnerTip": step["beginnerTip"][language],
        "isComplete": index == len(template["steps"]) - 1,
    }


def _random_suit_map() -> dict[str, str]:
    suits = SUITS[:]
    random.shuffle(suits)
    return {"a": suits[0], "b": suits[1], "c": suits[2], "d": suits[3]}


def _card(pattern: str, suit_map: dict[str, str]) -> str:
    for key, suit in suit_map.items():
        pattern = pattern.replace("{" + key + "}", suit)
    return pattern


def _assert_unique(cards: list[str]) -> None:
    if len(cards) != len(set(cards)):
        raise RuntimeError("Generated duplicate cards in practice scenario.")


def _normalize_action(action: str) -> str:
    action = action.strip().lower()
    aliases = {
        "下注": "bet",
        "加注": "raise",
        "跟注": "call",
        "弃牌": "fold",
        "过牌": "check",
    }
    return aliases.get(action, action)


def _feedback_text(feedback: dict[str, Any], key: str, language: str) -> str:
    value = feedback.get(key, "")
    if isinstance(value, dict):
        return value.get(language) or value.get("en") or ""
    return str(value)


def _format_feedback(feedback: dict[str, Any], language: str) -> str:
    if language == "zh":
        reasonable = "合理" if feedback["isReasonable"] else "不太理想"
        return "\n".join(
            [
                f"你的选择：{feedback['yourChoice']}",
                f"是否合理：{reasonable}",
                f"教练建议：{feedback['coachSuggestion']}",
                f"为什么：{feedback['why']}",
                f"新手提示：{feedback['beginnerTip']}",
                f"下一步：{feedback['nextStep']}",
            ]
        )
    reasonable = "Yes" if feedback["isReasonable"] else "Not quite"
    return "\n".join(
        [
            f"Your Choice: {feedback['yourChoice']}",
            f"Is It Reasonable? {reasonable}",
            f"Coach Suggestion: {feedback['coachSuggestion']}",
            f"Why: {feedback['why']}",
            f"Beginner Tip: {feedback['beginnerTip']}",
            f"Next Step: {feedback['nextStep']}",
        ]
    )


def _completion_summary(template: dict[str, Any], language: str) -> str:
    if language == "zh":
        return f"{template['title']['zh']} 已完成。记住这手牌的核心主题：{template['theme']}。"
    return f"{template['title']['en']} complete. Remember the core theme: {template['theme']}."
