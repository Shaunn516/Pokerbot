from __future__ import annotations

from copy import deepcopy
from typing import Any

from fastapi import HTTPException


MODULE_ORDER = [
    "what_is_texas_holdem",
    "hand_flow",
    "positions_and_turn_order",
    "hand_strength_and_draws",
    "actions_and_beginner_thinking",
]

_ALIASES = {
    "how_hand_works": "what_is_texas_holdem",
    "hand_strength_and_board_reading": "hand_strength_and_draws",
    "betting_logic_and_beginner_mistakes": "actions_and_beginner_thinking",
}


_TEXT: dict[str, dict[str, dict[str, Any]]] = {
    "how_hand_works": {
        "en": {
            "title": "How a Hold'em Hand Works",
            "shortDescription": "Learn the table, cards, betting rounds, and how a winner is decided.",
            "overview": "Texas Hold'em is a poker game where each player receives two private cards, then combines them with five shared community cards to make the best five-card hand. One hand moves through small steps: blinds are posted, cards are dealt, players bet, community cards arrive, and either everyone folds or the best hand wins at showdown.",
            "keyPoints": [
                "Each player starts with two private hole cards.",
                "Five community cards can be used by everyone.",
                "The streets are preflop, flop, turn, and river.",
                "You can win by making everyone fold or by showing the best hand.",
            ],
            "beginnerTerms": [
                {"term": "Hole cards", "explanation": "The two private cards only you can use."},
                {"term": "Community cards", "explanation": "Shared cards in the middle of the table."},
                {"term": "Pot", "explanation": "The chips players are fighting to win."},
                {"term": "Showdown", "explanation": "The final reveal if more than one player remains after the river."},
            ],
            "miniExamples": [
                "You hold As Kh. The board is Ks 7d 2c 5h 9c. Your best hand is a pair of kings.",
                "If everyone folds after you bet, you win the pot without showing your cards.",
            ],
            "visualHints": [
                {"type": "street_flow", "items": ["Blinds", "Hole cards", "Preflop", "Flop", "Turn", "River", "Showdown"]},
                {"type": "card_zone", "privateCards": 2, "communityCards": 5},
            ],
            "stepSections": [
                {
                    "stepNumber": 1,
                    "stepTitle": "Blinds create a pot",
                    "explanation": "Before cards are dealt, the small blind and big blind put in forced bets. This gives players something to compete for.",
                    "bullets": ["Small blind posts half a blind.", "Big blind posts one blind.", "Action starts with chips already in the middle."],
                    "example": "At 0.5/1 blinds, the pot starts at 1.5 big blinds.",
                },
                {
                    "stepNumber": 2,
                    "stepTitle": "Everyone gets two cards",
                    "explanation": "Your two private cards are the first clue about whether you should play the hand.",
                    "bullets": ["Strong hands like AA, KK, AK are often playable.", "Weak disconnected hands like 94 offsuit should usually be folded."],
                    "example": "As Kh is a strong starting hand. 9d 4c is usually weak.",
                },
                {
                    "stepNumber": 3,
                    "stepTitle": "Betting happens by street",
                    "explanation": "Players can fold, call, raise, bet, or check depending on the action. More community cards arrive after betting rounds.",
                    "bullets": ["Preflop: before community cards.", "Flop: three cards.", "Turn: one more card.", "River: final card."],
                    "example": "You raise preflop, one player calls, then the flop comes K-7-2.",
                },
                {
                    "stepNumber": 4,
                    "stepTitle": "A hand ends in two ways",
                    "explanation": "If all opponents fold, you win immediately. If players remain after river betting, the best five-card hand wins.",
                    "bullets": ["You do not always need showdown to win.", "At showdown, hand strength matters.", "Before showdown, pressure and position matter too."],
                    "example": "You bet the flop and everyone folds, so your exact cards no longer matter.",
                },
            ],
            "summary": "A Hold'em hand is a sequence of decisions. Beginners should first learn the order of play, the meaning of basic actions, and how their two cards connect with the board.",
            "recommendedNext": "positions_and_turn_order",
        },
        "zh": {
            "title": "一手德州扑克怎样进行",
            "shortDescription": "认识牌桌、手牌、公共牌、下注轮次，以及一手牌如何分出胜负。",
            "overview": "德州扑克中，每位玩家先拿到两张只有自己能看的手牌，然后和桌面最多五张公共牌组合成最好的五张牌。一手牌通常经历：盲注、发手牌、翻牌前行动、翻牌、转牌、河牌。如果别人都弃牌，你直接赢；如果打到最后摊牌，牌力最好的人赢。",
            "keyPoints": ["每人有两张私人手牌。", "桌面最多有五张公共牌。", "流程是翻牌前、翻牌、转牌、河牌。", "你可以靠别人弃牌赢，也可以摊牌用最好牌赢。"],
            "beginnerTerms": [
                {"term": "手牌", "explanation": "只有你能看到的两张牌。"},
                {"term": "公共牌", "explanation": "桌面上所有还在牌局里的玩家都能使用的牌。"},
                {"term": "底池", "explanation": "大家投入、正在争夺的筹码。"},
                {"term": "摊牌", "explanation": "河牌后仍有多人未弃牌，就亮牌比较大小。"},
            ],
            "miniExamples": ["你拿 As Kh，公共牌是 Ks 7d 2c 5h 9c，你的主要牌力是一对K。", "如果你下注后所有人弃牌，你不用亮牌也能赢下底池。"],
            "visualHints": [
                {"type": "street_flow", "items": ["盲注", "手牌", "翻牌前", "翻牌", "转牌", "河牌", "摊牌"]},
                {"type": "card_zone", "privateCards": 2, "communityCards": 5},
            ],
            "stepSections": [
                {"stepNumber": 1, "stepTitle": "盲注先形成底池", "explanation": "发牌前，小盲和大盲必须先投入筹码，让牌局有可争夺的奖励。", "bullets": ["小盲通常投入半个大盲。", "大盲投入一个大盲。", "所以一开始底池里就有筹码。"], "example": "0.5/1盲注下，初始底池是1.5BB。"},
                {"stepNumber": 2, "stepTitle": "每人拿两张手牌", "explanation": "这两张牌决定你是否值得进入牌局。新手要先学会少玩弱牌。", "bullets": ["AA、KK、AK通常很强。", "94不同花这类低牌、断张通常很弱。"], "example": "As Kh值得积极进入；9d 4c大多直接弃牌。"},
                {"stepNumber": 3, "stepTitle": "每条街都有行动", "explanation": "根据当前行动，你可以弃牌、跟注、加注、下注或过牌。公共牌会随着轮次逐步发出。", "bullets": ["翻牌前：还没有公共牌。", "翻牌：一次发三张。", "转牌：再发一张。", "河牌：最后一张。"], "example": "你翻牌前加注，一人跟注，翻牌发出 K-7-2。"},
                {"stepNumber": 4, "stepTitle": "一手牌有两种结束方式", "explanation": "如果所有对手都弃牌，你立即获胜；如果河牌后还有多人，就摊牌比较最好的五张牌。", "bullets": ["不一定非要摊牌才能赢。", "摊牌时看牌力。", "摊牌前位置和下注压力也很重要。"], "example": "你在翻牌下注，对手都弃牌，你直接拿下底池。"},
            ],
            "summary": "一手德州就是一连串小决策。新手先掌握流程、行动含义，以及手牌如何和公共牌组合。",
            "recommendedNext": "positions_and_turn_order",
        },
    },
    "positions_and_turn_order": {
        "en": {
            "title": "Positions and Turn Order",
            "shortDescription": "Understand 6-max seats, who acts first, and why late position is easier.",
            "overview": "Position means where you sit relative to the dealer button. In 6-max Hold'em the seats are UTG, HJ, CO, BTN, SB, and BB. Position matters because acting later gives you more information. Beginners should play tighter from early position and can play more hands from the button.",
            "keyPoints": ["6-max seats are UTG, HJ, CO, BTN, SB, BB.", "Preflop action starts left of the big blind.", "After the flop, small blind or first active player left of the button acts first.", "Button usually acts last postflop, which is powerful."],
            "beginnerTerms": [
                {"term": "Button", "explanation": "The dealer position. It acts last after the flop."},
                {"term": "UTG", "explanation": "Under the gun, the first player to act preflop in 6-max."},
                {"term": "Blinds", "explanation": "The two forced-bet seats: small blind and big blind."},
                {"term": "In position", "explanation": "You act after your opponent on later streets."},
            ],
            "miniExamples": ["BTN sees what the blinds do before deciding after the flop.", "UTG has five players behind, so weak hands get punished more often."],
            "visualHints": [{"type": "table_positions", "seats": ["UTG", "HJ", "CO", "BTN", "SB", "BB"]}, {"type": "order_arrow", "preflopStarts": "UTG", "postflopLast": "BTN"}],
            "stepSections": [
                {"stepNumber": 1, "stepTitle": "Learn the six seats", "explanation": "6-max means six seats. The button is the reference point; the blinds sit to its left.", "bullets": ["BTN is the best seat postflop.", "SB and BB pay forced bets.", "UTG acts earliest preflop."], "example": "A common clockwise order is BTN, SB, BB, UTG, HJ, CO."},
                {"stepNumber": 2, "stepTitle": "Preflop order is special", "explanation": "Because blinds already posted chips, the first voluntary action comes from UTG.", "bullets": ["UTG acts first preflop.", "BB acts last preflop if nobody raises again.", "More players behind means more danger."], "example": "UTG should fold many weak hands because five players can still wake up with strong cards."},
                {"stepNumber": 3, "stepTitle": "Postflop order follows the button", "explanation": "After the flop, the first active player left of the button acts first. The button often acts last.", "bullets": ["Acting last gives information.", "Information helps you value bet, bluff, or control the pot.", "Out of position is harder for beginners."], "example": "BTN raises, BB calls. On the flop, BB acts first and BTN acts last."},
                {"stepNumber": 4, "stepTitle": "Use position to choose hands", "explanation": "The earlier you act, the stronger your starting hand should be. The later you act, the more flexible you can be.", "bullets": ["Early position: tighter.", "CO and BTN: more playable hands.", "Blinds: already invested but out of position."], "example": "A9 suited may be fine on BTN but too loose for a new player UTG."},
            ],
            "summary": "Position is information. Acting later makes poker simpler because you see opponents' choices before making yours.",
            "recommendedNext": "hand_strength_and_board_reading",
        },
        "zh": {
            "title": "位置和行动顺序",
            "shortDescription": "理解6人桌位置、谁先行动，以及为什么后位更容易打。",
            "overview": "位置指你相对庄位按钮的位置。6人桌常见位置是 UTG、HJ、CO、BTN、SB、BB。位置重要，因为越晚行动，你看到的信息越多。新手应当前位玩紧一些，按钮位可以玩得更灵活。",
            "keyPoints": ["6人桌位置是 UTG、HJ、CO、BTN、SB、BB。", "翻牌前通常UTG先行动。", "翻牌后由按钮左侧仍在牌局的玩家先行动。", "BTN翻牌后通常最后行动，很有优势。"],
            "beginnerTerms": [
                {"term": "BTN/按钮位", "explanation": "庄位位置，翻牌后通常最后行动。"},
                {"term": "UTG", "explanation": "枪口位，6人桌翻牌前第一个行动。"},
                {"term": "盲注位", "explanation": "小盲和大盲，必须先投入筹码。"},
                {"term": "有位置", "explanation": "后续街你在对手之后行动。"},
            ],
            "miniExamples": ["BTN翻牌后可以先看盲注怎么做，再决定。", "UTG后面还有五个人，弱牌更容易遇到强牌。"],
            "visualHints": [{"type": "table_positions", "seats": ["UTG", "HJ", "CO", "BTN", "SB", "BB"]}, {"type": "order_arrow", "preflopStarts": "UTG", "postflopLast": "BTN"}],
            "stepSections": [
                {"stepNumber": 1, "stepTitle": "先记住六个位置", "explanation": "6-max就是最多六人。按钮是参照点，小盲和大盲在按钮左侧。", "bullets": ["BTN翻牌后位置最好。", "SB和BB要先付盲注。", "UTG翻牌前最早行动。"], "example": "常见顺序是 BTN、SB、BB、UTG、HJ、CO。"},
                {"stepNumber": 2, "stepTitle": "翻牌前顺序比较特殊", "explanation": "因为盲注已经投入，所以第一个自愿行动的是UTG。", "bullets": ["UTG翻牌前先行动。", "如果没人再加注，BB翻牌前最后行动。", "身后人越多，风险越大。"], "example": "UTG拿弱牌应多弃牌，因为后面五个人都可能拿到强牌。"},
                {"stepNumber": 3, "stepTitle": "翻牌后看按钮", "explanation": "翻牌后，按钮左侧仍在牌局的人先行动，按钮通常最后行动。", "bullets": ["后行动能获得信息。", "信息帮助你价值下注、诈唬或控制底池。", "没位置对新手更难。"], "example": "BTN加注，BB跟注。翻牌后BB先行动，BTN后行动。"},
                {"stepNumber": 4, "stepTitle": "用位置决定起手牌范围", "explanation": "越早行动，手牌要求越高；越晚行动，可以更灵活。", "bullets": ["前位：更紧。", "CO和BTN：可玩牌更多。", "盲注位：已投入但翻牌后常没位置。"], "example": "A9同花在BTN可玩，但新手UTG玩可能太松。"},
            ],
            "summary": "位置就是信息。越晚行动，越能根据对手选择做决定。",
            "recommendedNext": "hand_strength_and_board_reading",
        },
    },
}


_TEXT["hand_strength_and_board_reading"] = {
    "en": {
        "title": "Hand Strength and Board Reading",
        "shortDescription": "Learn strong hands, weak hands, draws, and how the board changes value.",
        "overview": "Hand strength is not just your two cards. It is your best five-card hand using your cards and the board. A strong hand can often bet for value; a weak hand often wants to fold or check; a draw is not made yet but can improve on later cards.",
        "keyPoints": ["Starting hands like AA and KK are very strong preflop.", "One pair can be strong on dry boards but fragile on scary boards.", "A draw needs future cards to become strong.", "Always read how your hand connects with the board."],
        "beginnerTerms": [
            {"term": "Made hand", "explanation": "A hand that already has showdown value, like a pair or better."},
            {"term": "Draw", "explanation": "A hand that is not strong yet but can improve, such as four cards to a flush."},
            {"term": "Kicker", "explanation": "A side card that helps decide who wins when players share the same pair."},
            {"term": "Dry board", "explanation": "A board with fewer straight and flush possibilities."},
        ],
        "miniExamples": ["KQ on K-7-2 is top pair with a good kicker.", "As 5s on Ks 8s 2d is a flush draw: one more spade makes a flush."],
        "visualHints": [{"type": "hand_rank_ladder", "items": ["High card", "Pair", "Two pair", "Trips", "Straight", "Flush", "Full house"]}, {"type": "draw_hint", "example": "four spades means flush draw"}],
        "stepSections": [
            {"stepNumber": 1, "stepTitle": "Separate preflop and postflop strength", "explanation": "AA is huge before the flop, but after the board arrives you must check what changed.", "bullets": ["Preflop strength starts with your two cards.", "Postflop strength depends on board texture.", "Big pairs can still become vulnerable."], "example": "AA is happy preflop, but a board like 9s 8s 7s is dangerous."},
            {"stepNumber": 2, "stepTitle": "Know common strong hands", "explanation": "Top pair good kicker, overpairs, two pair, sets, straights, and flushes are hands beginners should recognize quickly.", "bullets": ["Top pair means you paired the highest board card.", "A set means pocket pair plus one matching board card.", "Straights and flushes beat one pair."], "example": "You hold 44 on K-8-4. That is a set."},
            {"stepNumber": 3, "stepTitle": "Understand weak hands", "explanation": "No pair, low pair, or a pair with bad kicker can be weak, especially facing big bets.", "bullets": ["Do not marry one pair.", "Weak kicker means another player can have the same pair but better side card.", "Big river bets often need stronger calls."], "example": "K2 on K-Q-J-9-A is only one pair on a scary board."},
            {"stepNumber": 4, "stepTitle": "Spot draws", "explanation": "A draw has potential but is not a made hand yet. Price matters when deciding to call with a draw.", "bullets": ["Flush draw: one suit card away from a flush.", "Straight draw: one rank away from a straight.", "Good draws can sometimes bet as semi-bluffs."], "example": "You hold 9-8 on 7-6-2. A 5 or T makes a straight."},
        ],
        "summary": "Board reading means asking: what do I have now, what can improve me, and what stronger hands are possible?",
        "recommendedNext": "betting_logic_and_beginner_mistakes",
    },
    "zh": {
        "title": "牌力和读公共牌",
        "shortDescription": "学习强牌、弱牌、听牌，以及公共牌如何改变牌力。",
        "overview": "牌力不只看你的两张手牌，而是用手牌和公共牌组成的最好五张牌。强牌常能价值下注；弱牌常需要过牌或弃牌；听牌还没成牌，但未来牌可能让它变强。",
        "keyPoints": ["AA、KK翻牌前非常强。", "一对在干燥牌面可能不错，在危险牌面会变脆弱。", "听牌需要后续牌帮助才能成强牌。", "每次都要看手牌如何连接公共牌。"],
        "beginnerTerms": [
            {"term": "成牌", "explanation": "已经有摊牌价值的牌，比如一对或更好。"},
            {"term": "听牌", "explanation": "现在还不强，但有机会变强，比如差一张同花。"},
            {"term": "踢脚", "explanation": "同样是一对时，用来比较大小的边牌。"},
            {"term": "干燥牌面", "explanation": "顺子和同花可能较少的公共牌结构。"},
        ],
        "miniExamples": ["KQ在 K-7-2 上是顶对好踢脚。", "As 5s在 Ks 8s 2d 上是同花听牌，再来一张黑桃就成同花。"],
        "visualHints": [{"type": "hand_rank_ladder", "items": ["高牌", "一对", "两对", "三条", "顺子", "同花", "葫芦"]}, {"type": "draw_hint", "example": "四张同花代表同花听牌"}],
        "stepSections": [
            {"stepNumber": 1, "stepTitle": "区分翻牌前和翻牌后牌力", "explanation": "AA翻牌前很强，但公共牌出现后，要重新判断局面。", "bullets": ["翻牌前主要看两张手牌。", "翻牌后要看公共牌结构。", "大对子也可能变危险。"], "example": "AA翻牌前很好，但 9s 8s 7s 这种牌面很危险。"},
            {"stepNumber": 2, "stepTitle": "认识常见强牌", "explanation": "顶对好踢脚、超对、两对、暗三、顺子、同花，是新手要快速识别的牌。", "bullets": ["顶对是你配中了公共牌最大的一张。", "暗三是手中对子加公共牌同点数。", "顺子和同花都赢一对。"], "example": "你拿44，公共牌 K-8-4，这就是暗三。"},
            {"stepNumber": 3, "stepTitle": "理解弱牌", "explanation": "没对子、小对子、差踢脚的一对都可能很弱，尤其面对大下注。", "bullets": ["不要舍不得一对。", "踢脚差时，对手可能同样一对但边牌更好。", "河牌大下注通常需要更强理由跟注。"], "example": "K2在 K-Q-J-9-A 上只是一对，牌面很危险。"},
            {"stepNumber": 4, "stepTitle": "识别听牌", "explanation": "听牌有潜力，但还不是成牌。用听牌跟注时，价格很重要。", "bullets": ["同花听牌：差一张同花。", "顺子听牌：差一张点数连成顺。", "好听牌有时可以半诈唬下注。"], "example": "你拿9-8，牌面7-6-2，来5或T就成顺子。"},
        ],
        "summary": "读牌面就是问：我现在有什么，哪些牌能帮我，对手可能有哪些更强牌？",
        "recommendedNext": "betting_logic_and_beginner_mistakes",
    },
}


_TEXT["betting_logic_and_beginner_mistakes"] = {
    "en": {
        "title": "Betting Logic and Beginner Mistakes",
        "shortDescription": "Learn why players bet and how to avoid common expensive habits.",
        "overview": "Betting is not random aggression. Players bet for value, as a bluff, for protection, or to use a strong draw with fold equity. Beginners lose chips when they call from curiosity, play too many hands, ignore position, or bet without knowing what they want to happen.",
        "keyPoints": ["Value bet when worse hands can call.", "Bluff when better hands may fold.", "Do not call just because you want to see.", "Before acting, name your reason."],
        "beginnerTerms": [
            {"term": "Value bet", "explanation": "A bet hoping worse hands call."},
            {"term": "Bluff", "explanation": "A bet hoping better hands fold."},
            {"term": "Protection", "explanation": "Betting to charge hands that can improve against you."},
            {"term": "Pot odds", "explanation": "The price of calling compared with the pot you can win."},
        ],
        "miniExamples": ["You have AQ on Q-7-3. Betting can get called by worse queens.", "Facing a huge river bet with one pair, calling only from curiosity is a leak."],
        "visualHints": [{"type": "decision_checklist", "items": ["What worse calls?", "What better folds?", "What price am I getting?", "What position am I in?"]}],
        "stepSections": [
            {"stepNumber": 1, "stepTitle": "Bet for value", "explanation": "A value bet wants worse hands to continue. This is the simplest way beginners make money with strong hands.", "bullets": ["Top pair can often value bet.", "Strong hands should not always slowplay.", "Ask what worse hand calls."], "example": "AQ on Q-7-3 can bet because QJ, QT, and smaller pairs may call."},
            {"stepNumber": 2, "stepTitle": "Bluff with a story", "explanation": "A bluff works when your action makes sense and your opponent can fold better hands. Beginners should bluff less and choose clear spots.", "bullets": ["Random bluffs burn chips.", "Good draws make better semi-bluffs.", "Position helps bluffs work."], "example": "A flush draw can bet because it may win now or improve later."},
            {"stepNumber": 3, "stepTitle": "Avoid curiosity calls", "explanation": "Calling should have a reason: good price, enough hand strength, or a read that opponent bluffs too much.", "bullets": ["Curiosity is not a poker reason.", "Big river calls need strong evidence.", "Folding saves chips."], "example": "One pair facing a pot-sized river bet is often a fold without a clear bluff read."},
            {"stepNumber": 4, "stepTitle": "Fix common beginner leaks", "explanation": "Most early losses come from playing too many hands, ignoring position, chasing bad draws, and refusing to fold.", "bullets": ["Play tighter early position.", "Respect big bets.", "Do not chase every draw.", "Think before calling."], "example": "Calling 94 offsuit UTG because you are bored is a leak."},
        ],
        "summary": "Good betting has a purpose. Before you put chips in, say whether you want value, folds, a fair draw price, or pot control.",
        "recommendedNext": "how_hand_works",
    },
    "zh": {
        "title": "下注逻辑和新手常见错误",
        "shortDescription": "理解为什么下注，以及如何避开昂贵的新手习惯。",
        "overview": "下注不是随便凶。玩家下注通常是为了价值、诈唬、保护，或用强听牌制造弃牌率。新手常因为好奇跟注、玩太多牌、忽视位置、下注没有目的而亏筹码。",
        "keyPoints": ["价值下注：希望更差牌跟注。", "诈唬：希望更好牌弃牌。", "不要因为想看结果就跟注。", "行动前先说出理由。"],
        "beginnerTerms": [
            {"term": "价值下注", "explanation": "希望更差的牌跟注你的下注。"},
            {"term": "诈唬", "explanation": "希望更好的牌弃牌。"},
            {"term": "保护", "explanation": "下注让可能反超你的牌付出代价。"},
            {"term": "底池赔率", "explanation": "跟注价格和你能赢的底池之间的关系。"},
        ],
        "miniExamples": ["你拿AQ，牌面 Q-7-3，下注可能被更差Q跟注。", "河牌拿一对面对超大下注，只因好奇跟注是漏洞。"],
        "visualHints": [{"type": "decision_checklist", "items": ["什么更差牌会跟？", "什么更好牌会弃？", "价格合适吗？", "我有没有位置？"]}],
        "stepSections": [
            {"stepNumber": 1, "stepTitle": "为了价值下注", "explanation": "价值下注希望更差的牌继续投入。新手用强牌稳定赢筹码，最先要学这个。", "bullets": ["顶对常可以价值下注。", "强牌不必总慢打。", "问自己：更差什么牌会跟？"], "example": "AQ在 Q-7-3 上下注，QJ、QT、小对子可能跟。"},
            {"stepNumber": 2, "stepTitle": "诈唬要讲得通", "explanation": "诈唬要让你的行动像强牌，并且对手真的可能弃掉更好牌。新手少诈唬，挑清楚的点。", "bullets": ["乱诈唬会烧筹码。", "强听牌更适合半诈唬。", "有位置更容易施压。"], "example": "同花听牌下注，可能现在赢，也可能后面成牌。"},
            {"stepNumber": 3, "stepTitle": "避免好奇跟注", "explanation": "跟注要有理由：价格好、牌力够、或你判断对手诈唬多。", "bullets": ["好奇不是理由。", "河牌大跟注需要强证据。", "会弃牌就是在省钱。"], "example": "一对面对河牌满池下注，没有明确诈唬信息时常该弃牌。"},
            {"stepNumber": 4, "stepTitle": "修正常见新手漏洞", "explanation": "早期亏损多来自玩太多牌、忽略位置、追差价格听牌、不肯弃牌。", "bullets": ["前位玩紧。", "尊重大下注。", "不是所有听牌都追。", "跟注前先想理由。"], "example": "UTG因为无聊跟注94不同花，就是明显漏洞。"},
        ],
        "summary": "好下注必须有目的。投入筹码前，先说清你是在要价值、逼弃牌、追合适价格，还是控制底池。",
        "recommendedNext": "how_hand_works",
    },
}


_TEXT["what_is_texas_holdem"] = deepcopy(_TEXT["how_hand_works"])
_TEXT["what_is_texas_holdem"]["en"]["title"] = "What Is Texas Hold'em?"
_TEXT["what_is_texas_holdem"]["en"]["shortDescription"] = "Start from zero: hole cards, community cards, the pot, and how a hand is won."
_TEXT["what_is_texas_holdem"]["zh"]["title"] = "什么是德州扑克？"
_TEXT["what_is_texas_holdem"]["zh"]["shortDescription"] = "从零开始认识手牌、公共牌、底池，以及一手牌如何获胜。"

_TEXT["hand_flow"] = deepcopy(_TEXT["how_hand_works"])
_TEXT["hand_flow"]["en"].update(
    {
        "title": "Hand Flow: Preflop to Showdown",
        "shortDescription": "Walk through preflop, flop, turn, river, and showdown in beginner language.",
        "overview": "A Hold'em hand follows a fixed rhythm. Preflop happens before community cards. The flop reveals three cards. The turn adds one more card. The river adds the final card. If more than one player remains after river betting, showdown decides the winner. Learning this order makes every later poker idea easier.",
        "keyPoints": [
            "Preflop is the first betting round, before community cards.",
            "The flop reveals three community cards at once.",
            "The turn and river each add one card.",
            "Showdown only happens if two or more players remain after all betting.",
        ],
        "summary": "The hand flow is your map: preflop, flop, turn, river, then showdown if needed.",
        "recommendedNext": "positions_and_turn_order",
    }
)
_TEXT["hand_flow"]["zh"].update(
    {
        "title": "一手牌流程：翻前到摊牌",
        "shortDescription": "用新手语言走一遍翻牌前、翻牌、转牌、河牌和摊牌。",
        "overview": "德州扑克每一手都有固定节奏。翻牌前还没有公共牌；翻牌一次发三张公共牌；转牌再发一张；河牌发最后一张。如果河牌下注后还有两名或更多玩家没有弃牌，就进入摊牌，比最好的五张牌。",
        "keyPoints": ["翻牌前是没有公共牌的第一轮行动。", "翻牌一次发三张公共牌。", "转牌和河牌各发一张。", "只有多人坚持到最后，才需要摊牌。"],
        "summary": "流程就是地图：翻牌前、翻牌、转牌、河牌，必要时摊牌。",
        "recommendedNext": "positions_and_turn_order",
    }
)

_TEXT["hand_strength_and_draws"] = deepcopy(_TEXT["hand_strength_and_board_reading"])
_TEXT["hand_strength_and_draws"]["en"]["title"] = "Hand Strength and Draws"
_TEXT["hand_strength_and_draws"]["en"]["shortDescription"] = "Tell made hands from draws, including flush draws and straight draws."
_TEXT["hand_strength_and_draws"]["zh"]["title"] = "牌力和听牌"
_TEXT["hand_strength_and_draws"]["zh"]["shortDescription"] = "区分成牌和听牌，包括同花听牌、顺子听牌。"

_TEXT["actions_and_beginner_thinking"] = deepcopy(_TEXT["betting_logic_and_beginner_mistakes"])
_TEXT["actions_and_beginner_thinking"]["en"]["title"] = "Actions and Beginner Thinking"
_TEXT["actions_and_beginner_thinking"]["en"]["shortDescription"] = "Learn fold, check, call, bet, raise, and the beginner mistakes to avoid."
_TEXT["actions_and_beginner_thinking"]["zh"]["title"] = "行动和新手思考方式"
_TEXT["actions_and_beginner_thinking"]["zh"]["shortDescription"] = "学习弃牌、过牌、跟注、下注、加注，以及常见新手错误。"

GLOSSARY: dict[str, list[dict[str, str]]] = {
    "en": [
        {"term": "flop", "explanation": "The first three community cards."},
        {"term": "turn", "explanation": "The fourth community card."},
        {"term": "river", "explanation": "The fifth and final community card."},
        {"term": "showdown", "explanation": "The reveal if more than one player remains after river betting."},
        {"term": "draw", "explanation": "A hand that needs a future card to become strong."},
        {"term": "kicker", "explanation": "A side card that breaks ties when players share the same pair."},
        {"term": "button", "explanation": "The dealer position, usually last to act after the flop."},
        {"term": "blinds", "explanation": "Forced bets posted before cards are dealt."},
        {"term": "open raise", "explanation": "The first raise before the flop when nobody has entered yet."},
        {"term": "pot odds", "explanation": "The price of calling compared with the pot you can win."},
        {"term": "value bet", "explanation": "A bet hoping worse hands call."},
        {"term": "bluff", "explanation": "A bet hoping better hands fold."},
    ],
    "zh": [
        {"term": "翻牌", "explanation": "前三张公共牌。"},
        {"term": "转牌", "explanation": "第四张公共牌。"},
        {"term": "河牌", "explanation": "第五张也是最后一张公共牌。"},
        {"term": "摊牌", "explanation": "河牌下注后仍有多人未弃牌时，亮牌比大小。"},
        {"term": "听牌", "explanation": "现在还没成强牌，但未来牌可能帮助成牌。"},
        {"term": "踢脚", "explanation": "同样一对时，用来比较大小的边牌。"},
        {"term": "按钮位", "explanation": "庄位，翻牌后通常最后行动。"},
        {"term": "盲注", "explanation": "发牌前必须投入的强制下注。"},
        {"term": "开池加注", "explanation": "翻牌前无人入池时的第一个加注。"},
        {"term": "底池赔率", "explanation": "跟注价格和可赢底池之间的关系。"},
        {"term": "价值下注", "explanation": "希望更差牌跟注的下注。"},
        {"term": "诈唬", "explanation": "希望更好牌弃牌的下注。"},
    ],
}


def list_modules(language: str) -> dict[str, Any]:
    lang = _lang(language)
    return {
        "language": lang,
        "modules": [
            {
                "id": module_id,
                "title": _TEXT[module_id][lang]["title"],
                "shortDescription": _TEXT[module_id][lang]["shortDescription"],
                "iconKey": _icon_key(module_id),
                "order": index + 1,
            }
            for index, module_id in enumerate(MODULE_ORDER)
        ],
    }


def get_module(module_id: str, language: str) -> dict[str, Any]:
    module_id = _ALIASES.get(module_id, module_id)
    if module_id not in _TEXT:
        raise HTTPException(status_code=404, detail="Learning module not found.")
    lang = _lang(language)
    content = deepcopy(_TEXT[module_id][lang])
    return {"id": module_id, "iconKey": _icon_key(module_id), "order": MODULE_ORDER.index(module_id) + 1, **content}


def _lang(language: str) -> str:
    return language if language in {"en", "zh"} else "en"


def _icon_key(module_id: str) -> str:
    module_id = _ALIASES.get(module_id, module_id)
    return {
        "what_is_texas_holdem": "cards",
        "hand_flow": "street-flow",
        "positions_and_turn_order": "table-position",
        "hand_strength_and_draws": "hand-strength",
        "actions_and_beginner_thinking": "chips",
    }[module_id]


def get_glossary(language: str) -> dict[str, Any]:
    lang = _lang(language)
    return {"language": lang, "terms": deepcopy(GLOSSARY[lang])}


def get_quickstart(language: str) -> dict[str, Any]:
    lang = _lang(language)
    if lang == "zh":
        return {
            "language": "zh",
            "title": "30秒德州扑克入门",
            "steps": [
                "每人两张手牌，桌上最多五张公共牌。",
                "目标是用任意五张组成最好牌，或让所有对手弃牌。",
                "流程是翻牌前、翻牌、转牌、河牌、必要时摊牌。",
                "新手先少玩弱牌，多注意位置和下注理由。",
            ],
        }
    return {
        "language": "en",
        "title": "30-Second Hold'em Quickstart",
        "steps": [
            "Each player gets two private cards and shares up to five community cards.",
            "Win by making the best five-card hand or by getting everyone else to fold.",
            "The flow is preflop, flop, turn, river, then showdown if needed.",
            "As a beginner, play fewer weak hands and always name your reason before betting or calling.",
        ],
    }
