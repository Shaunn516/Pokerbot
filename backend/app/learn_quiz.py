from __future__ import annotations

import random
from typing import Any


QUIZ_BANK: dict[str, list[dict[str, Any]]] = {
    "how-a-hand-works": [
        {"q": {"en": "How many community cards are revealed on the flop?", "zh": "翻牌会发出几张公共牌？"}, "o": {"en": ["1", "3", "5"], "zh": ["1张", "3张", "5张"]}, "a": {"en": "3", "zh": "3张"}, "e": {"en": "The flop reveals three community cards at once.", "zh": "翻牌一次发出三张公共牌。"}},
        {"q": {"en": "Which street comes after the flop?", "zh": "翻牌之后是哪一街？"}, "o": {"en": ["Turn", "River", "Showdown"], "zh": ["转牌", "河牌", "摊牌"]}, "a": {"en": "Turn", "zh": "转牌"}, "e": {"en": "The order is preflop, flop, turn, river, then showdown if needed.", "zh": "顺序是翻前、翻牌、转牌、河牌，需要时再摊牌。"}},
        {"q": {"en": "How many private hole cards does each Hold'em player get?", "zh": "德州每位玩家有几张手牌？"}, "o": {"en": ["1", "2", "4"], "zh": ["1张", "2张", "4张"]}, "a": {"en": "2", "zh": "2张"}, "e": {"en": "Each player receives two private cards.", "zh": "每位玩家有两张私人手牌。"}},
        {"q": {"en": "What happens at showdown?", "zh": "摊牌时会发生什么？"}, "o": {"en": ["Players compare hands", "Blinds are posted", "The flop is dealt"], "zh": ["比较牌力", "下盲注", "发翻牌"]}, "a": {"en": "Players compare hands", "zh": "比较牌力"}, "e": {"en": "Remaining players reveal cards and the best hand wins.", "zh": "仍在牌局中的玩家亮牌，最大牌获胜。"}},
        {"q": {"en": "What is the pot?", "zh": "底池是什么？"}, "o": {"en": ["Money/chips to win", "Your stack", "Your position"], "zh": ["可争夺的筹码", "你的筹码量", "你的位置"]}, "a": {"en": "Money/chips to win", "zh": "可争夺的筹码"}, "e": {"en": "The pot is the chips players have put in and are competing for.", "zh": "底池是玩家投入、正在争夺的筹码。"}},
    ],
    "position-actions": [
        {"q": {"en": "Which position usually gets the most information before acting after the flop?", "zh": "翻牌后哪个位置通常行动前信息最多？"}, "o": {"en": ["UTG", "BTN", "SB"], "zh": ["UTG", "BTN", "SB"]}, "a": {"en": "BTN", "zh": "BTN"}, "e": {"en": "The button acts last postflop, so it sees others act first.", "zh": "按钮位翻后最后行动，能先看别人怎么做。"}},
        {"q": {"en": "What does call mean?", "zh": "call/跟注是什么意思？"}, "o": {"en": ["Match the current bet", "Quit the hand", "Bet more"], "zh": ["跟上当前下注", "退出这手牌", "下更多注"]}, "a": {"en": "Match the current bet", "zh": "跟上当前下注"}, "e": {"en": "Calling means paying the current price to continue.", "zh": "跟注意味着付出当前价格继续游戏。"}},
        {"q": {"en": "What does fold mean?", "zh": "fold/弃牌是什么意思？"}, "o": {"en": ["Give up the hand", "Match the bet", "Act last"], "zh": ["放弃这手牌", "跟上下注", "最后行动"]}, "a": {"en": "Give up the hand", "zh": "放弃这手牌"}, "e": {"en": "Folding gives up the pot but avoids losing more chips.", "zh": "弃牌会放弃底池，但避免损失更多筹码。"}},
        {"q": {"en": "What does raise mean?", "zh": "raise/加注是什么意思？"}, "o": {"en": ["Increase the bet", "Check for free", "Show your cards"], "zh": ["提高下注额", "免费过牌", "亮出手牌"]}, "a": {"en": "Increase the bet", "zh": "提高下注额"}, "e": {"en": "Raising puts in more chips than the current bet.", "zh": "加注意味着投入比当前下注更多的筹码。"}},
        {"q": {"en": "Why is position useful?", "zh": "为什么位置有用？"}, "o": {"en": ["More information", "More hole cards", "Guaranteed win"], "zh": ["信息更多", "手牌更多", "保证赢"]}, "a": {"en": "More information", "zh": "信息更多"}, "e": {"en": "Acting later lets you react to opponents.", "zh": "后行动可以根据对手动作调整。"}},
    ],
    "hand-strength": [
        {"q": {"en": "Which is usually strongest preflop?", "zh": "翻前通常哪手最强？"}, "o": {"en": ["AA", "72 offsuit", "T3 offsuit"], "zh": ["AA", "72不同花", "T3不同花"]}, "a": {"en": "AA", "zh": "AA"}, "e": {"en": "Pocket aces are the strongest starting hand.", "zh": "AA是最强起手牌。"}},
        {"q": {"en": "What is top pair?", "zh": "什么是顶对？"}, "o": {"en": ["Pairing the highest board card", "Having two pairs", "No pair"], "zh": ["配上公共牌最大的一张形成对子", "两对", "没有对子"]}, "a": {"en": "Pairing the highest board card", "zh": "配上公共牌最大的一张形成对子"}, "e": {"en": "If board is K-7-2 and you hold KQ, you have top pair.", "zh": "例如公共牌K-7-2，你拿KQ，就是顶对。"}},
        {"q": {"en": "What is a flush draw?", "zh": "什么是同花听牌？"}, "o": {"en": ["One card away from a flush", "Already a full house", "A weak pair"], "zh": ["差一张成同花", "已经葫芦", "弱对子"]}, "a": {"en": "One card away from a flush", "zh": "差一张成同花"}, "e": {"en": "A flush draw needs one more card of the same suit.", "zh": "同花听牌还需要一张同花色牌。"}},
        {"q": {"en": "What is a set?", "zh": "什么是暗三/set？"}, "o": {"en": ["Pocket pair hits a third card", "Two random high cards", "A missed draw"], "zh": ["口袋对子中第三张", "两张随机高牌", "没成的听牌"]}, "a": {"en": "Pocket pair hits a third card", "zh": "口袋对子中第三张"}, "e": {"en": "Holding 44 on K-8-4 gives you a set.", "zh": "拿44，公共牌K-8-4，就是暗三。"}},
        {"q": {"en": "Which hand is usually weak?", "zh": "哪手通常较弱？"}, "o": {"en": ["94 offsuit", "AK suited", "QQ"], "zh": ["94不同花", "AK同花", "QQ"]}, "a": {"en": "94 offsuit", "zh": "94不同花"}, "e": {"en": "Low disconnected offsuit cards rarely make strong hands.", "zh": "低张、不连、不成花的牌很难组成强牌。"}},
    ],
    "avoid-random-calling": [
        {"q": {"en": "Before calling, what should you ask?", "zh": "跟注前应该先问什么？"}, "o": {"en": ["What worse hands do I beat?", "Do I feel lucky?", "Can I ignore the pot?"], "zh": ["我能赢哪些更差牌？", "我今天运气好吗？", "可以无视底池吗？"]}, "a": {"en": "What worse hands do I beat?", "zh": "我能赢哪些更差牌？"}, "e": {"en": "Calling should have a reason, not just hope.", "zh": "跟注需要理由，不只是希望。"}},
        {"q": {"en": "What is a bad reason to call?", "zh": "哪个是糟糕的跟注理由？"}, "o": {"en": ["I am curious", "I have good pot odds", "I beat bluffs"], "zh": ["我想看看", "底池赔率合适", "我能赢诈唬"]}, "a": {"en": "I am curious", "zh": "我想看看"}, "e": {"en": "Curiosity calls become expensive.", "zh": "好奇跟注会很贵。"}},
        {"q": {"en": "When facing a big river bet, what do you need?", "zh": "面对河牌大下注，你需要什么？"}, "o": {"en": ["A strong reason to call", "Any pair always", "No thinking"], "zh": ["强理由跟注", "任何对子都跟", "不用思考"]}, "a": {"en": "A strong reason to call", "zh": "强理由跟注"}, "e": {"en": "Big bets demand better hands or a clear bluff read.", "zh": "大下注需要更强牌或明确诈唬判断。"}},
        {"q": {"en": "What can folding do?", "zh": "弃牌能带来什么？"}, "o": {"en": ["Save chips", "Guarantee losing forever", "Change your cards"], "zh": ["保存筹码", "永远输", "换手牌"]}, "a": {"en": "Save chips", "zh": "保存筹码"}, "e": {"en": "Good folds are part of winning poker.", "zh": "好的弃牌是打好扑克的一部分。"}},
        {"q": {"en": "A call is better when...", "zh": "什么时候跟注更好？"}, "o": {"en": ["Price and hand make sense", "You are bored", "Opponent bet big"], "zh": ["价格和牌力合理", "你无聊", "对手下大注"]}, "a": {"en": "Price and hand make sense", "zh": "价格和牌力合理"}, "e": {"en": "A call should connect pot odds, hand strength, and opponent action.", "zh": "跟注应结合底池赔率、牌力和对手动作。"}},
    ],
}

_LAST_INDEX: dict[tuple[str, str], int] = {}


def generate_quiz(lesson_id: str, lesson_title: str = "", language: str = "en") -> dict[str, Any]:
    language = language if language in {"en", "zh"} else "en"
    lesson_id = lesson_id or "how-a-hand-works"
    questions = QUIZ_BANK.get(lesson_id) or _fallback_questions()
    key = (lesson_id, language)
    if len(questions) == 1:
        index = 0
    else:
        previous = _LAST_INDEX.get(key)
        choices = [i for i in range(len(questions)) if i != previous]
        index = random.choice(choices)
    _LAST_INDEX[key] = index
    item = questions[index]
    fallback_title = "Poker Basics" if language == "en" else "扑克基础"
    return {
        "question": item["q"][language],
        "options": item["o"][language],
        "correctAnswer": item["a"][language],
        "explanation": item["e"][language],
        "lessonId": lesson_id,
        "lessonTitle": lesson_title or fallback_title,
        "metadata": {"source": "local_quiz_bank", "questionIndex": index},
    }


def _fallback_questions() -> list[dict[str, Any]]:
    return [
        {
            "q": {"en": "What is the safest beginner habit?", "zh": "最安全的新手习惯是什么？"},
            "o": {"en": ["Ask why before calling", "Call every hand", "Ignore position"], "zh": ["跟注前先问为什么", "每手都跟", "忽略位置"]},
            "a": {"en": "Ask why before calling", "zh": "跟注前先问为什么"},
            "e": {"en": "Good poker decisions start with a clear reason.", "zh": "好的扑克决策从清楚的理由开始。"},
        }
    ]
