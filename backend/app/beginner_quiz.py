from __future__ import annotations

import random
from copy import deepcopy
from typing import Any

from app.learn_content import MODULE_ORDER


_BANK: dict[str, list[dict[str, Any]]] = {
    "how_hand_works": [
        {"id": "hand_001", "q": {"en": "How many private cards does each Hold'em player receive?", "zh": "德州扑克中每位玩家先拿到几张手牌？"}, "o": {"en": ["One", "Two", "Five"], "zh": ["一张", "两张", "五张"]}, "a": 1, "e": {"en": "Each player receives two private hole cards.", "zh": "每位玩家有两张只有自己能看的手牌。"}},
        {"id": "hand_002", "q": {"en": "What is the flop?", "zh": "翻牌是什么？"}, "o": {"en": ["The first three community cards", "Your two private cards", "The final card"], "zh": ["前三张公共牌", "你的两张手牌", "最后一张公共牌"]}, "a": 0, "e": {"en": "The flop reveals three community cards at once.", "zh": "翻牌会一次发出三张公共牌。"}},
        {"id": "hand_003", "q": {"en": "What is the pot?", "zh": "底池是什么？"}, "o": {"en": ["Chips players are competing for", "Your two cards", "The dealer button"], "zh": ["大家争夺的筹码", "你的两张手牌", "庄位按钮"]}, "a": 0, "e": {"en": "The pot is the chips already put into the middle.", "zh": "底池是已经投入到桌面中、大家正在争夺的筹码。"}},
        {"id": "hand_004", "q": {"en": "How can you win without showdown?", "zh": "不摊牌也能赢的方式是什么？"}, "o": {"en": ["Everyone else folds", "You ask for new cards", "You always call"], "zh": ["其他人都弃牌", "要求换牌", "每次都跟注"]}, "a": 0, "e": {"en": "If all opponents fold, you win the pot immediately.", "zh": "如果所有对手都弃牌，你会直接赢下底池。"}},
    ],
    "positions_and_turn_order": [
        {"id": "positions_001", "q": {"en": "In 6-max, which seat usually acts last after the flop?", "zh": "6人桌中，翻牌后通常哪个位置最后行动？"}, "o": {"en": ["UTG", "BTN", "SB"], "zh": ["UTG", "BTN", "SB"]}, "a": 1, "e": {"en": "The button usually acts last postflop, which gives it more information.", "zh": "BTN翻牌后通常最后行动，因此信息最多。"}},
        {"id": "positions_002", "q": {"en": "Why is early position harder?", "zh": "为什么前位更难打？"}, "o": {"en": ["More players can act after you", "You get extra cards", "You always see the river"], "zh": ["你后面还有更多人行动", "你会多拿牌", "你一定能看到河牌"]}, "a": 0, "e": {"en": "More players behind you means a higher chance someone has a strong hand.", "zh": "身后还有更多人，代表更容易有人拿到强牌。"}},
        {"id": "positions_003", "q": {"en": "What are the forced-bet positions called?", "zh": "必须先投入筹码的两个位置叫什么？"}, "o": {"en": ["CO and BTN", "SB and BB", "UTG and HJ"], "zh": ["CO和BTN", "SB和BB", "UTG和HJ"]}, "a": 1, "e": {"en": "Small blind and big blind post forced bets before cards are dealt.", "zh": "小盲和大盲在发牌前必须投入盲注。"}},
        {"id": "positions_004", "q": {"en": "What does being in position mean?", "zh": "有位置是什么意思？"}, "o": {"en": ["Acting after your opponent", "Having more chips", "Holding a pair"], "zh": ["在对手之后行动", "筹码更多", "手里有对子"]}, "a": 0, "e": {"en": "Acting later lets you see what the opponent does first.", "zh": "后行动可以先看到对手怎么做，再做决定。"}},
    ],
    "hand_strength_and_board_reading": [
        {"id": "strength_001", "q": {"en": "What is a draw?", "zh": "听牌是什么？"}, "o": {"en": ["A hand that can improve with future cards", "A guaranteed winning hand", "A forced bet"], "zh": ["未来牌可能让它变强的牌", "保证赢的牌", "强制下注"]}, "a": 0, "e": {"en": "A draw is not made yet, but certain future cards can complete it.", "zh": "听牌现在还没成强牌，但某些后续牌能帮助它成牌。"}},
        {"id": "strength_002", "q": {"en": "On K-7-2, what is KQ?", "zh": "在 K-7-2 牌面上，KQ是什么？"}, "o": {"en": ["Top pair", "No pair", "A straight"], "zh": ["顶对", "没对子", "顺子"]}, "a": 0, "e": {"en": "You paired the highest board card, so you have top pair.", "zh": "你配中了公共牌最大的K，所以是顶对。"}},
        {"id": "strength_003", "q": {"en": "What completes a flush draw?", "zh": "同花听牌需要什么成牌？"}, "o": {"en": ["One more card of the same suit", "Any ace", "A second pair"], "zh": ["再来一张同花色", "任意A", "再来一个对子"]}, "a": 0, "e": {"en": "A flush uses five cards of the same suit.", "zh": "同花需要五张相同花色的牌。"}},
        {"id": "strength_004", "q": {"en": "Which starting hand is usually strongest?", "zh": "哪手起手牌通常最强？"}, "o": {"en": ["AA", "94 offsuit", "T3 offsuit"], "zh": ["AA", "94不同花", "T3不同花"]}, "a": 0, "e": {"en": "Pocket aces are the strongest starting hand preflop.", "zh": "AA是翻牌前最强的起手牌。"}},
    ],
    "betting_logic_and_beginner_mistakes": [
        {"id": "betting_001", "q": {"en": "What is a value bet trying to do?", "zh": "价值下注希望发生什么？"}, "o": {"en": ["Get called by worse hands", "Always make better hands call", "Skip the river"], "zh": ["让更差牌跟注", "一定让更好牌跟注", "跳过河牌"]}, "a": 0, "e": {"en": "A value bet earns chips when worse hands continue.", "zh": "价值下注是希望更差的牌继续投入筹码。"}},
        {"id": "betting_002", "q": {"en": "Which is a bad reason to call?", "zh": "哪个是糟糕的跟注理由？"}, "o": {"en": ["I am curious", "The price is good", "Opponent bluffs too much"], "zh": ["我很好奇", "价格很好", "对手诈唬太多"]}, "a": 0, "e": {"en": "Curiosity calls are one of the most expensive beginner leaks.", "zh": "好奇跟注是新手最容易烧钱的漏洞之一。"}},
        {"id": "betting_003", "q": {"en": "Before bluffing, what should you ask?", "zh": "诈唬前应该先问什么？"}, "o": {"en": ["Can better hands fold?", "Do I feel bored?", "Can I ignore position?"], "zh": ["更好牌会弃吗？", "我无聊吗？", "可以忽略位置吗？"]}, "a": 0, "e": {"en": "A bluff needs fold equity: a real chance better hands fold.", "zh": "诈唬需要弃牌率，也就是更好牌真的可能弃牌。"}},
        {"id": "betting_004", "q": {"en": "What should beginners do from early position?", "zh": "新手在前位通常应该怎么做？"}, "o": {"en": ["Play tighter", "Play every hand", "Never fold pairs"], "zh": ["玩紧一些", "每手都玩", "对子永不弃牌"]}, "a": 0, "e": {"en": "Early position has more players behind, so tighter starting hands help.", "zh": "前位后面人多，起手牌玩紧一点更稳。"}},
    ],
}

_LAST_INDEX: dict[tuple[str, str], int] = {}

_MODULE_ALIASES = {
    "how_hand_works": "what_is_texas_holdem",
    "hand_strength_and_board_reading": "hand_strength_and_draws",
    "betting_logic_and_beginner_mistakes": "actions_and_beginner_thinking",
}


def _clone_question(item: dict[str, Any], suffix: int) -> dict[str, Any]:
    cloned = deepcopy(item)
    cloned["id"] = f"{item['id']}_v{suffix}"
    return cloned


_BANK["what_is_texas_holdem"] = [_clone_question(item, 1) for item in _BANK["how_hand_works"]]
_BANK["hand_flow"] = [_clone_question(item, 2) for item in _BANK["how_hand_works"]]
_BANK["hand_flow"].extend(
    [
        {
            "id": "flow_001",
            "q": {"en": "Which street comes after the flop?", "zh": "翻牌之后是哪条街？"},
            "o": {"en": ["Turn", "Showdown", "Preflop", "Blinds"], "zh": ["转牌", "摊牌", "翻牌前", "盲注"]},
            "a": 0,
            "e": {"en": "After the flop, the turn adds one more community card.", "zh": "翻牌之后是转牌，会再发一张公共牌。"},
        },
        {
            "id": "flow_002",
            "q": {"en": "When does showdown happen?", "zh": "什么时候会摊牌？"},
            "o": {"en": ["When multiple players remain after river betting", "Before hole cards", "After every preflop raise", "Only when blinds fold"], "zh": ["河牌下注后仍有多人未弃牌", "发手牌前", "每次翻前加注后", "只有盲注弃牌时"]},
            "a": 0,
            "e": {"en": "Showdown is only needed when more than one player is still in after all betting.", "zh": "只有最后仍有多人在牌局里，才需要摊牌。"},
        },
    ]
)
_BANK["hand_strength_and_draws"] = [_clone_question(item, 1) for item in _BANK["hand_strength_and_board_reading"]]
_BANK["actions_and_beginner_thinking"] = [_clone_question(item, 1) for item in _BANK["betting_logic_and_beginner_mistakes"]]

for module_id, questions in list(_BANK.items()):
    base_questions = deepcopy(questions)
    suffix = 2
    while len(questions) < 8:
        for item in base_questions:
            if len(questions) >= 8:
                break
            questions.append(_clone_question(item, suffix))
            suffix += 1


def random_quiz(module: str, language: str) -> dict[str, Any]:
    lang = language if language in {"en", "zh"} else "en"
    module = _MODULE_ALIASES.get(module, module)
    module_id = module if module in _BANK else MODULE_ORDER[0]
    questions = _BANK[module_id]
    key = (module_id, lang)
    previous = _LAST_INDEX.get(key)
    choices = [index for index in range(len(questions)) if index != previous] or [0]
    index = random.choice(choices)
    _LAST_INDEX[key] = index
    item = deepcopy(questions[index])
    options = [{"id": chr(97 + i), "text": text} for i, text in enumerate(item["o"][lang])]
    return {
        "quizId": item["id"],
        "module": module_id,
        "question": item["q"][lang],
        "options": options,
        "correctOptionId": options[item["a"]]["id"],
        "explanation": item["e"][lang],
        "difficulty": "beginner",
    }
