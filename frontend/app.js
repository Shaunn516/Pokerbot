const API_BASE_URL = (window.STACKSENSEI_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

const RANKS = ["", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = [
    { value: "", label: "--", symbol: "" },
    { value: "s", label: "♠", symbol: "♠" },
    { value: "h", label: "♥", symbol: "♥" },
    { value: "d", label: "♦", symbol: "♦" },
    { value: "c", label: "♣", symbol: "♣" }
];
const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
const STREET_ORDER = ["preflop", "flop", "turn", "river", "showdown"];
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CARD_SLOTS = [
    { id: "hole-1", group: "hole", en: "Card 1", zh: "第1张" },
    { id: "hole-2", group: "hole", en: "Card 2", zh: "第2张" },
    { id: "flop-1", group: "board", en: "Flop 1", zh: "翻牌1" },
    { id: "flop-2", group: "board", en: "Flop 2", zh: "翻牌2" },
    { id: "flop-3", group: "board", en: "Flop 3", zh: "翻牌3" },
    { id: "turn", group: "board", en: "Turn", zh: "转牌" },
    { id: "river", group: "board", en: "River", zh: "河牌" }
];

const COPY = {
    en: {
        htmlLang: "en",
        langToggle: "中文",
        navLearn: "Learn",
        navPractice: "Practice",
        navAnalyze: "Analyze",
        learnKicker: "Beginner path",
        learnTitle: "Learn Texas Hold'em from Zero",
        learnSubtitle: "Understand the rules, actions, and flow of a hand in simple language.",
        todayPath: "Today's path",
        coachKicker: "StackSensei",
        learnChatTitle: "Chat with Coach",
        learnInput: "Ask about rules, actions, or poker basics...",
        coachNote: "StackSensei can be wrong. Think carefully and use judgment.",
        scenarioLabel: "Scenario",
        resetPractice: "Reset",
        startPractice: "Start Practice",
        continuePractice: "Continue",
        replay: "Replay",
        askCoach: "Ask Coach",
        markComplete: "Mark Complete",
        correct: "Correct",
        tryAgain: "Try Again",
        beginnerTip: "Beginner Tip",
        yourChoice: "Your Choice",
        coachSuggestion: "Coach Suggestion",
        practiceTitle: "Practice This Hand",
        coachSays: "Coach Says",
        tableState: "Table State",
        gameSetup: "Game Setup",
        heroCards: "Hero Cards",
        boardCards: "Board Cards",
        position: "Position",
        stack: "Stack",
        pot: "Pot",
        players: "Players",
        actionHistory: "Action History",
        actionPlaceholder: "UTG folds, HJ raises to 2.5BB...",
        useHand: "Use This Hand",
        analyzeTitle: "Review This Hand with Coach",
        analyzeInput: "Ask about this hand...",
        ready: "Ready",
        thinking: "Thinking...",
        handLoaded: "Hand loaded",
        empty: "Please enter a question first.",
        backendError: "The backend may be waking up. Please try again in a moment.",
        genericError: "Sorry, something went wrong.",
        duplicateWarning: "Duplicate card selected. Please choose unique cards.",
        rankEmpty: "--",
        turn: "Your turn",
        complete: "Complete",
        potPrefix: "Pot",
        step: "Step",
        stepIntro: "Click Start Practice to deal the hand.",
        scenarioComplete: "Hand complete",
        whatWentWell: "What went well",
        risk: "Risk",
        street: { preflop: "Preflop", flop: "Flop", turn: "Turn", river: "River" },
        actions: { fold: "Fold", check: "Check", call: "Call", bet: "Bet", raise: "Raise", ask: "Ask Coach" },
        learnWelcome: "Hi, I am StackSensei. Choose a lesson or ask me any Texas Hold'em beginner question.",
        analyzeWelcome: "Load a hand on the left, then ask what to do, why an action works, or how a beginner should think.",
        practiceWelcome: "Choose a scenario and start. I will guide you one decision at a time.",
        askCoachPrompt: "Please explain this practice step in beginner-friendly terms.",
        learnCoachPrompt: "Please explain this poker concept in beginner-friendly terms:",
        learnPrompts: ["What is the flop?", "How do I start?", "Why does position matter?"],
        analyzePrompts: ["Analyze this hand", "Why bet here?", "Are there other lines?"],
        positions: { unknown: "Unknown", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        quizChoose: "Choose one answer:",
        noLesson: "Pick a lesson card to begin."
    },
    zh: {
        htmlLang: "zh-CN",
        langToggle: "EN",
        navLearn: "学习",
        navPractice: "练习",
        navAnalyze: "分析",
        learnKicker: "新手路线",
        learnTitle: "从零开始学德州",
        learnSubtitle: "用最简单的话，学会规则、行动和一局牌怎么进行。",
        todayPath: "今日路线",
        coachKicker: "StackSensei",
        learnChatTitle: "和教练聊聊",
        learnInput: "问规则、行动，或任何新手问题...",
        coachNote: "StackSensei 可能会犯错，请结合思考，理性判断。",
        scenarioLabel: "练习场景",
        resetPractice: "重置",
        startPractice: "开始练习",
        continuePractice: "继续下一步",
        replay: "重新练习",
        askCoach: "问教练",
        markComplete: "标记完成",
        correct: "答对了",
        tryAgain: "再想想",
        beginnerTip: "新手提示",
        yourChoice: "你的选择",
        coachSuggestion: "教练建议",
        practiceTitle: "练习这一手",
        coachSays: "教练说",
        tableState: "牌桌状态",
        gameSetup: "牌局设置",
        heroCards: "手牌",
        boardCards: "公共牌",
        position: "位置",
        stack: "筹码",
        pot: "底池",
        players: "玩家数",
        actionHistory: "行动历史",
        actionPlaceholder: "UTG弃牌，HJ加注到2.5BB...",
        useHand: "使用这手牌",
        analyzeTitle: "和教练拆解这手牌",
        analyzeInput: "输入你的问题...",
        ready: "就绪",
        thinking: "思考中...",
        handLoaded: "牌局已载入",
        empty: "请先输入一个问题。",
        backendError: "后端服务可能正在唤醒，请稍后再试。",
        genericError: "抱歉，出错了。",
        duplicateWarning: "选择了重复牌，请换成不同的牌。",
        rankEmpty: "--",
        turn: "轮到你行动",
        complete: "已完成",
        potPrefix: "底池",
        step: "步骤",
        stepIntro: "点击开始练习，先发牌进入这一手。",
        scenarioComplete: "这一手完成",
        whatWentWell: "做得好的地方",
        risk: "风险",
        street: { preflop: "发牌前", flop: "翻牌", turn: "转牌", river: "河牌" },
        actions: { fold: "弃牌", check: "过牌", call: "跟注", bet: "下注", raise: "加注", ask: "问教练" },
        learnWelcome: "嗨，我是 StackSensei。选一节课开始，或者直接问我德州入门问题。",
        analyzeWelcome: "先在左侧设置牌局，再问我该怎么打、为什么这样打，或新手应该抓住什么重点。",
        practiceWelcome: "选择一个场景并开始，我会一步一步带你做决定。",
        askCoachPrompt: "请用新手能听懂的话解释我现在这一步应该怎么想。",
        learnCoachPrompt: "请用新手能听懂的话解释：",
        learnPrompts: ["什么是翻牌？", "我该怎么开始？", "位置为什么重要？"],
        analyzePrompts: ["帮我分析这手", "为什么这里要下注？", "还有别的打法吗？"],
        positions: { unknown: "未知", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        quizChoose: "选择一个答案：",
        noLesson: "点一张学习卡片开始。"
    }
};

const LESSONS = [
    {
        id: "hand-flow",
        icon: "♠",
        title: { en: "How a Hand Works", zh: "认识一局牌" },
        description: { en: "Learn blinds, cards, betting rounds, and showdown.", zh: "先看懂盲注、发牌、下注轮和摊牌顺序。" },
        steps: [
            {
                title: { en: "A hand has a clear order", zh: "一局牌有固定顺序" },
                explanation: { en: "Texas Hold'em is easier when you see it as a story: blinds go in, players get two cards, then the board arrives in stages.", zh: "把德州扑克看成一个流程就简单很多：先下盲注，每人两张手牌，然后公共牌分几步出现。" },
                bullets: {
                    en: ["Preflop: everyone has two private cards.", "Flop: three community cards appear.", "Turn and river: one more card each."],
                    zh: ["发牌前：每人两张自己的手牌。", "翻牌：出现三张公共牌。", "转牌和河牌：各再发一张公共牌。"]
                },
                visual: ["As", "Kh", "back"]
            },
            {
                title: { en: "Betting repeats by street", zh: "每一轮都可以行动" },
                explanation: { en: "On each street, players can fold, check, call, bet, or raise depending on what happened before them.", zh: "每一轮里，玩家根据前面的行动选择弃牌、过牌、跟注、下注或加注。" },
                bullets: {
                    en: ["No bet yet: check or bet.", "Facing a bet: fold, call, or raise.", "Showdown happens if players remain after river."],
                    zh: ["没人下注时：可以过牌或下注。", "面对下注时：可以弃牌、跟注或加注。", "河牌后还有人留下，就进入摊牌。"]
                },
                visual: ["Qd", "7s", "3h"]
            }
        ],
        quiz: {
            question: { en: "How many community cards are dealt on the flop?", zh: "翻牌会一次发出几张公共牌？" },
            options: { en: ["One", "Three", "Five"], zh: ["一张", "三张", "五张"] },
            correctIndex: 1,
            feedback: { en: "The flop is three community cards.", zh: "对，翻牌是三张公共牌。" },
            correction: { en: "Not quite. The flop means three community cards at once.", zh: "再想想。翻牌是一次发出三张公共牌。" }
        },
        takeaway: { en: "First learn the order, then decisions become easier.", zh: "先熟悉流程，后面的决定会简单很多。" }
    },
    {
        id: "position-actions",
        icon: "◎",
        title: { en: "Position and Actions", zh: "位置和行动" },
        description: { en: "Position tells you how much information you get before acting.", zh: "位置决定你行动前能看到多少信息。" },
        steps: [
            {
                title: { en: "Later position sees more", zh: "越晚行动，信息越多" },
                explanation: { en: "If you act after others, you know whether they checked, bet, or looked strong. That makes your decision cleaner.", zh: "如果你在别人之后行动，就能先看到他们是过牌、下注还是显得很强，决定会更清楚。" },
                bullets: {
                    en: ["BTN is usually the best position.", "UTG is hard because many players act after you.", "Good position lets you play more hands."],
                    zh: ["BTN 通常是最好的位置。", "UTG 比较难，因为后面还有很多人。", "位置好时，可以多玩一些牌。"]
                },
                visual: ["BTN", "CO", "BB"]
            }
        ],
        quiz: {
            question: { en: "Why is the button powerful?", zh: "为什么按钮位更有优势？" },
            options: { en: ["It acts late after the flop", "It always has better cards", "It never pays blinds"], zh: ["翻牌后通常最后行动", "它总能拿到好牌", "它永远不用下盲注"] },
            correctIndex: 0,
            feedback: { en: "Exactly. Acting late gives more information.", zh: "对。晚行动能看到更多信息。" },
            correction: { en: "The button is strong because it often acts last after the flop.", zh: "按钮位强，是因为翻牌后通常最后行动。" }
        },
        takeaway: { en: "When in doubt, respect position.", zh: "不确定时，先重视位置。" }
    },
    {
        id: "hand-strength",
        icon: "A",
        title: { en: "Hand Strength", zh: "看懂手牌强弱" },
        description: { en: "Start by knowing strong pairs, big cards, draws, and weak hands.", zh: "先认识大对子、大牌、听牌和明显弱牌。" },
        steps: [
            {
                title: { en: "Strength changes by board", zh: "牌力会随着公共牌改变" },
                explanation: { en: "A hand is not strong in isolation. A pair, draw, or top pair becomes good or risky depending on the board and action.", zh: "手牌不是孤立判断的。对子、听牌、顶对到底好不好，要看公共牌和对手行动。" },
                bullets: {
                    en: ["AA and KK are very strong preflop.", "Top pair can be strong on dry flops.", "Draws need future cards to improve."],
                    zh: ["AA、KK 翻前很强。", "干燥翻牌面的顶对通常不错。", "听牌需要后面牌帮助变强。"]
                },
                visual: ["Ah", "Ad", "Qs"]
            }
        ],
        quiz: {
            question: { en: "A flush draw means...", zh: "同花听牌的意思是..." },
            options: { en: ["You already have a flush", "You need one more suit card", "You must fold"], zh: ["已经成同花", "还差一张同花色牌", "必须弃牌"] },
            correctIndex: 1,
            feedback: { en: "Right. A draw is a hand that can improve.", zh: "对。听牌就是还可以变强的牌。" },
            correction: { en: "A flush draw usually needs one more card of that suit.", zh: "同花听牌通常还差一张同花色牌。" }
        },
        takeaway: { en: "Ask: what do I have now, and what can improve?", zh: "先问：我现在有什么？后面能变成什么？" }
    },
    {
        id: "avoid-random-calling",
        icon: "□",
        title: { en: "Avoid Random Calling", zh: "先学会不乱跟注" },
        description: { en: "Before calling, ask what you beat and what can improve.", zh: "跟注前先问自己能赢什么，后面能变好吗。" },
        steps: [
            {
                title: { en: "Calling needs a reason", zh: "跟注要有理由" },
                explanation: { en: "Calling feels safe, but it can quietly lose chips. Before calling, name the worse hands you beat or the cards that help you.", zh: "跟注看起来安全，但很容易慢慢输钱。跟注前，先说出你能赢哪些更差的牌，或哪些牌能帮你变强。" },
                bullets: {
                    en: ["Call with enough equity or showdown value.", "Fold hands with no pair, no draw, and no plan.", "Do not call only because you are curious."],
                    zh: ["有足够胜率或摊牌价值时再跟。", "没对子、没听牌、没计划时要会弃。", "不要因为好奇就跟注。"]
                },
                visual: ["9d", "4c", "Kd"]
            }
        ],
        quiz: {
            question: { en: "A bad reason to call is...", zh: "下面哪个是糟糕的跟注理由？" },
            options: { en: ["I have a strong draw", "I want to see what happens", "Worse hands can pay me"], zh: ["我有强听牌", "我想看看会发生什么", "更差的牌可能付钱"] },
            correctIndex: 1,
            feedback: { en: "Yes. Curiosity is not a poker plan.", zh: "对。好奇不是一个牌局计划。" },
            correction: { en: "Calling out of curiosity is a common beginner leak.", zh: "因为好奇而跟注，是新手常见漏洞。" }
        },
        takeaway: { en: "A good fold is also a strong poker decision.", zh: "好的弃牌，也是很强的扑克决定。" }
    }
];

LESSONS.forEach((lesson) => {
    const baseStep = lesson.steps[0];
    const extras = {
        "hand-flow": [
            {
                title: { en: "Preflop comes first", zh: "先从发牌前开始" },
                explanation: { en: "Before any board cards appear, you decide whether your two cards and position are worth entering the pot.", zh: "公共牌还没出现时，你先根据两张手牌和位置，决定要不要入池。" },
                bullets: { en: ["Blinds create the first pot.", "Each player has two private cards.", "Tight choices save beginner chips."], zh: ["盲注先形成底池。", "每人先拿两张手牌。", "新手先选紧一点，能少亏很多。"] },
                visual: ["As", "Kh", "BB"]
            },
            {
                title: { en: "The board arrives in stages", zh: "公共牌分阶段出现" },
                explanation: { en: "The flop, turn, and river change hand strength. A weak hand can improve, and a strong hand can become risky.", zh: "翻牌、转牌、河牌会改变牌力。弱牌可能变强，强牌也可能变危险。" },
                bullets: { en: ["Flop: three cards.", "Turn: one card.", "River: final card."], zh: ["翻牌：三张。", "转牌：一张。", "河牌：最后一张。"] },
                visual: ["Qd", "7s", "3h"]
            },
            {
                title: { en: "Showdown is not always needed", zh: "不一定每手都摊牌" },
                explanation: { en: "Many pots end when everyone folds to a bet. Winning without showdown is normal poker.", zh: "很多底池会在有人下注、其他人都弃牌时结束。不摊牌赢下底池很正常。" },
                bullets: { en: ["Bets can win immediately.", "Calling keeps the hand alive.", "Folding ends your investment."], zh: ["下注可能直接赢。", "跟注让牌局继续。", "弃牌停止继续投入。"] },
                visual: ["back", "back", "Pot"]
            }
        ],
        "position-actions": [
            {
                title: { en: "Early position is tighter", zh: "早位要更谨慎" },
                explanation: { en: "UTG acts with many players behind, so weak hands get punished more often.", zh: "UTG 后面还有很多玩家，弱牌更容易被后面的人压制。" },
                bullets: { en: ["Play fewer hands early.", "Avoid weak offsuit hands.", "Respect raises behind you."], zh: ["早位少玩牌。", "避开弱杂花牌。", "尊重后面的加注。"] },
                visual: ["UTG", "HJ", "CO"]
            },
            {
                title: { en: "Late position can pressure", zh: "后位可以施压" },
                explanation: { en: "CO and BTN can attack blinds because fewer players remain and they often act later postflop.", zh: "CO 和 BTN 可以更常攻击盲注，因为后面玩家更少，翻牌后也常有位置。" },
                bullets: { en: ["BTN is the best seat.", "Stealing blinds is normal.", "Position turns medium hands playable."], zh: ["BTN 是最好的位置。", "偷盲是正常打法。", "位置能让中等牌更好打。"] },
                visual: ["CO", "BTN", "BB"]
            },
            {
                title: { en: "Actions depend on the bet", zh: "行动取决于前面有没有下注" },
                explanation: { en: "If no one bets, you can check or bet. If someone bets, you must fold, call, or raise.", zh: "没人下注时，你可以过牌或下注。有人下注时，你要在弃牌、跟注、加注里选。" },
                bullets: { en: ["Check means pass without paying.", "Call means match the bet.", "Raise means make it bigger."], zh: ["过牌是不花钱让过。", "跟注是补齐下注。", "加注是把下注变大。"] },
                visual: ["Check", "Call", "Raise"]
            }
        ],
        "hand-strength": [
            {
                title: { en: "Pairs and kickers matter", zh: "对子和踢脚都重要" },
                explanation: { en: "Top pair is stronger when your side card, the kicker, is high.", zh: "顶对不错，但旁边那张踢脚越大，越不容易被同样对子压制。" },
                bullets: { en: ["AQ on Q-high board is strong.", "Q9 on Q-high board is weaker.", "Kickers break ties."], zh: ["AQ 在 Q 高牌面很强。", "Q9 在 Q 高牌面弱一些。", "踢脚决定同对子胜负。"] },
                visual: ["Ah", "Qh", "Qd"]
            },
            {
                title: { en: "Draws are potential", zh: "听牌是潜力" },
                explanation: { en: "A draw is not made yet, but it can become a strong hand on later streets.", zh: "听牌还没成牌，但后面发到关键牌时可能变成强牌。" },
                bullets: { en: ["Flush draws need one suit.", "Straight draws need a connecting card.", "Strong draws can bet."], zh: ["同花听牌差一张同花。", "顺子听牌差连接牌。", "强听牌可以主动下注。"] },
                visual: ["As", "Js", "8s"]
            },
            {
                title: { en: "Board texture changes risk", zh: "牌面结构决定风险" },
                explanation: { en: "Dry boards have fewer draws. Wet boards create more ways for opponents to improve.", zh: "干燥牌面听牌少；潮湿牌面让对手更容易变强。" },
                bullets: { en: ["K72 rainbow is dry.", "J109 two-tone is wet.", "Bet sizing changes with texture."], zh: ["K72 彩虹面很干燥。", "J109 两同花很潮湿。", "下注大小要跟牌面变化。"] },
                visual: ["Js", "10s", "9d"]
            }
        ],
        "avoid-random-calling": [
            {
                title: { en: "Name worse hands", zh: "先说出更差的牌" },
                explanation: { en: "Before calling, ask which worse hands you beat. If you cannot name them, folding may be better.", zh: "跟注前先问：有哪些更差的牌我能赢？如果说不出来，弃牌可能更好。" },
                bullets: { en: ["Pair beats ace-high.", "Top pair beats worse pairs.", "No pair often needs a draw."], zh: ["对子能赢 A 高。", "顶对能赢更差对子。", "没对子通常需要听牌理由。"] },
                visual: ["Qh", "7c", "2d"]
            },
            {
                title: { en: "Know what improves you", zh: "知道哪些牌能帮你" },
                explanation: { en: "Good calls usually have outs: cards that can improve your hand enough to continue.", zh: "好的跟注通常有 outs，也就是后面哪些牌能让你明显变强。" },
                bullets: { en: ["Flush outs are suit cards.", "Straight outs complete the line.", "Tiny backdoor chances are not enough alone."], zh: ["同花 outs 是同花色牌。", "顺子 outs 能补成顺子。", "很小的后门机会不能单独当理由。"] },
                visual: ["As", "Js", "4s"]
            },
            {
                title: { en: "Curiosity is expensive", zh: "好奇心很贵" },
                explanation: { en: "Calling just to see one more card is one of the fastest ways for beginners to lose chips.", zh: "只是想多看一张牌而跟注，是新手最容易慢慢亏筹码的原因之一。" },
                bullets: { en: ["Have a plan before calling.", "Fold when the story is bad.", "Saving chips is winning long term."], zh: ["跟注前要有计划。", "牌局故事不对就弃。", "省下筹码长期也是赢。"] },
                visual: ["9d", "4c", "Fold"]
            }
        ]
    };
    lesson.steps = [baseStep, ...(extras[lesson.id] || [])].slice(0, 4).map((step) => ({
        ...step,
        takeaway: step.takeaway || lesson.takeaway,
        quizQuestion: step.quizQuestion || lesson.quiz.question,
        quizOptions: step.quizOptions || lesson.quiz.options,
        correctAnswer: typeof step.correctAnswer === "number" ? step.correctAnswer : lesson.quiz.correctIndex,
        feedback: step.feedback || lesson.quiz.feedback,
        correction: step.correction || lesson.quiz.correction
    }));
});

const PRACTICE_SCENARIOS = [
    {
        id: "btn-ako-open",
        title: { en: "BTN AKo Open Raise", zh: "BTN AKo 主动开池" },
        difficulty: { en: "Beginner", zh: "新手" },
        summary: { en: "Use a premium hand in position, then continue on favorable boards.", zh: "用位置和强起手牌主动进攻，再学习翻牌后怎么继续。" },
        finalSummary: {
            en: { good: "You used position and strong cards to take initiative.", tip: "Strong hand plus button position is a green light to play actively." },
            zh: { good: "你利用了位置和强牌主动进攻。", tip: "强手牌加按钮位，是主动出击的好机会。" }
        },
        steps: [
            {
                street: "preflop",
                heroPosition: "BTN",
                heroCards: ["As", "Kh"],
                boardCards: [],
                pot: 1.5,
                stack: 100,
                actionHistory: "UTG folds, HJ folds, CO folds. Hero is on BTN.",
                summaryText: { en: "You are BTN with A♠ K♥. Everyone folded to you.", zh: "你在 BTN，拿着 A♠ K♥。前面玩家都弃牌。" },
                availableActions: ["fold", "call", "raise"],
                recommendedAction: "raise",
                feedbackByAction: {
                    fold: { en: "Too tight. AKo on BTN is too strong to throw away unopened.", zh: "太紧了。BTN 的 AKo 很强，前面没人入池时不该直接弃牌。" },
                    call: { en: "Calling misses value. Raising can win blinds or build a pot with a strong hand.", zh: "平跟会少拿价值。加注可以偷盲，也能用强牌做大底池。" },
                    raise: { en: "Good. Raise and use your position with a premium hand.", zh: "很好。用强起手牌和位置优势主动加注。" }
                },
                nextNarration: { en: "BB calls. We go to the flop.", zh: "BB 跟注，进入翻牌。" },
                coachTip: { en: "Open strong hands on the button.", zh: "按钮位拿到强牌，要敢于主动开池。" },
                seatAction: { position: "BB", label: { en: "BB calls", zh: "BB 跟注" } }
            },
            {
                street: "flop",
                heroPosition: "BTN",
                heroCards: ["As", "Kh"],
                boardCards: ["Kc", "7d", "2s"],
                pot: 5.5,
                stack: 97.5,
                actionHistory: "Hero raised BTN, BB called. BB checks flop.",
                summaryText: { en: "Flop is K♣ 7♦ 2♠. BB checks. You have top pair top kicker.", zh: "翻牌 K♣ 7♦ 2♠，BB 过牌。你是顶对顶踢脚。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking is safe, but you miss value from worse kings and pairs.", zh: "过牌安全，但会错过更差K和小对子给你的价值。" },
                    bet: { en: "Good. Bet for value because worse hands can call.", zh: "很好。这里可以价值下注，因为更差的牌会跟注。" }
                },
                nextNarration: { en: "BB calls your flop bet. Turn is dealt.", zh: "BB 跟注你的翻牌下注，进入转牌。" },
                coachTip: { en: "Top pair with a strong kicker often wants value.", zh: "顶对好踢脚通常要主动拿价值。" },
                seatAction: { position: "BB", label: { en: "BB calls", zh: "BB 跟注" } }
            },
            {
                street: "turn",
                heroPosition: "BTN",
                heroCards: ["As", "Kh"],
                boardCards: ["Kc", "7d", "2s", "3h"],
                pot: 13.5,
                stack: 93.5,
                actionHistory: "Hero bet flop, BB called. Turn 3h, BB checks.",
                summaryText: { en: "Turn is 3♥. BB checks again. The board is still safe.", zh: "转牌 3♥，BB 再次过牌。牌面仍然比较安全。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking is okay sometimes, but beginners should notice there is still value.", zh: "有时可以过牌，但新手要注意这里仍然有价值可拿。" },
                    bet: { en: "Good. Keep betting smaller for value and protection.", zh: "很好。继续用较小下注拿价值，也保护你的牌。" }
                },
                nextNarration: { en: "Nice. You completed the value line.", zh: "不错，这条价值线完成了。" },
                coachTip: { en: "Keep asking what worse hands can call.", zh: "持续问自己：有哪些更差的牌会跟注。" }
            }
        ]
    },
    {
        id: "utg-discipline",
        title: { en: "UTG Weak Hand Discipline", zh: "UTG 弱牌纪律" },
        difficulty: { en: "Easy", zh: "简单" },
        summary: { en: "Practice folding weak hands early and avoiding curiosity calls.", zh: "练习早位弱牌弃牌，不因为好奇入池。" },
        finalSummary: {
            en: { good: "You protected your stack by avoiding a bad starting hand.", tip: "Early position means tighter starting hands." },
            zh: { good: "你避免了用差起手牌浪费筹码。", tip: "位置越早，起手牌越要紧。" }
        },
        steps: [
            {
                street: "preflop",
                heroPosition: "UTG",
                heroCards: ["9d", "4c"],
                boardCards: [],
                pot: 1.5,
                stack: 100,
                actionHistory: "Hero is UTG and first to act.",
                summaryText: { en: "You are UTG with 9♦ 4♣. Five players act after you.", zh: "你在 UTG，拿着 9♦ 4♣。后面还有五个人行动。" },
                availableActions: ["fold", "call", "raise"],
                recommendedAction: "fold",
                feedbackByAction: {
                    fold: { en: "Good discipline. Weak offsuit hands lose money early.", zh: "纪律很好。早位弱杂花牌很容易输钱。" },
                    call: { en: "Risky. Calling invites many players while your hand rarely improves well.", zh: "风险大。平跟会让多人入池，而你的牌很少变得很好。" },
                    raise: { en: "Too loose. This hand has poor high-card strength and poor playability.", zh: "太松了。这手牌高牌弱，也不好继续打。" }
                },
                nextNarration: { en: "You fold and watch the action continue.", zh: "你弃牌，观察后面的行动。" },
                coachTip: { en: "Folding preflop is often the cheapest lesson.", zh: "翻前弃牌常常是最省钱的选择。" },
                seatAction: { position: "HJ", label: { en: "HJ raises", zh: "HJ 加注" } }
            },
            {
                street: "flop",
                heroPosition: "UTG",
                heroCards: ["9d", "4c"],
                boardCards: ["Ah", "Qs", "8d"],
                pot: 6.5,
                stack: 100,
                actionHistory: "Hero folded. HJ raised, BB called. Flop Ah Qs 8d.",
                summaryText: { en: "You folded. The flop comes A♥ Q♠ 8♦, a board where 9♦ 4♣ would be lost.", zh: "你弃牌后，翻牌 A♥ Q♠ 8♦。如果拿 9♦ 4♣ 入池会很迷茫。" },
                availableActions: ["check", "fold"],
                recommendedAction: "fold",
                feedbackByAction: {
                    check: { en: "You are out of the hand, but the point is clear: folding avoided trouble.", zh: "你已经不在牌局里了，重点是：翻前弃牌避免了麻烦。" },
                    fold: { en: "Exactly. The best decision happened before the flop.", zh: "对。这手牌最好的决定发生在翻牌前。" }
                },
                nextNarration: { en: "Scenario complete.", zh: "场景完成。" },
                coachTip: { en: "Do not pay to see flops with trash hands.", zh: "不要花钱拿垃圾牌看翻牌。" }
            }
        ]
    },
    {
        id: "flush-draw-line",
        title: { en: "Flush Draw Decision", zh: "同花听牌决策" },
        difficulty: { en: "Guided", zh: "引导" },
        summary: { en: "Learn when a strong draw can bet and when to take the free card.", zh: "学习强听牌什么时候可以下注，什么时候看免费牌。" },
        finalSummary: {
            en: { good: "You recognized equity and pressure with a strong draw.", tip: "Strong draws are not made hands, but they can still play actively." },
            zh: { good: "你看到了强听牌的胜率和施压能力。", tip: "强听牌还没成牌，但可以主动打。" }
        },
        steps: [
            {
                street: "flop",
                heroPosition: "HJ",
                heroCards: ["As", "Js"],
                boardCards: ["8s", "4s", "Kd"],
                pot: 8,
                stack: 94,
                actionHistory: "Hero raised HJ, BTN called. Hero acts first on flop.",
                summaryText: { en: "You have A♠ J♠ on K♦ 8♠ 4♠. You raised preflop.", zh: "你拿 A♠ J♠，公共牌 K♦ 8♠ 4♠。你是翻前加注者。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking is playable, but betting uses fold equity with a very strong draw.", zh: "过牌可以，但下注能利用强听牌的弃牌率。" },
                    bet: { en: "Good. Nut flush draws can bet because they can win now or improve later.", zh: "很好。最大同花听牌可以下注，因为现在可能赢，后面也能变强。" }
                },
                nextNarration: { en: "BTN calls. Turn is dealt.", zh: "BTN 跟注，进入转牌。" },
                coachTip: { en: "Strong draws can be semi-bluffs.", zh: "强听牌可以作为半诈唬。" },
                seatAction: { position: "BTN", label: { en: "BTN calls", zh: "BTN 跟注" } }
            },
            {
                street: "turn",
                heroPosition: "HJ",
                heroCards: ["As", "Js"],
                boardCards: ["8s", "4s", "Kd", "2c"],
                pot: 18,
                stack: 89,
                actionHistory: "Hero bet flop, BTN called. Turn 2c.",
                summaryText: { en: "Turn is 2♣. You still have the nut flush draw but did not improve yet.", zh: "转牌 2♣。你仍然是最大同花听牌，但还没成牌。" },
                availableActions: ["check", "bet"],
                recommendedAction: "check",
                feedbackByAction: {
                    check: { en: "Good control. You can take a free card when fold equity drops.", zh: "很好。弃牌率下降时，可以控制底池看下一张。" },
                    bet: { en: "Possible, but riskier for beginners. If called, the pot grows while you still need to improve.", zh: "可以打，但对新手风险更高。被跟注后底池变大，而你仍需要成牌。" }
                },
                nextNarration: { en: "BTN checks back. River is dealt.", zh: "BTN 随后过牌，进入河牌。" },
                coachTip: { en: "Draws like pressure, but not every street needs pressure.", zh: "听牌可以施压，但不是每一轮都要施压。" },
                seatAction: { position: "BTN", label: { en: "BTN checks", zh: "BTN 过牌" } }
            },
            {
                street: "river",
                heroPosition: "HJ",
                heroCards: ["As", "Js"],
                boardCards: ["8s", "4s", "Kd", "2c", "Qs"],
                pot: 18,
                stack: 89,
                actionHistory: "Turn checked through. River Qs completes hero flush.",
                summaryText: { en: "River is Q♠. Your flush arrives.", zh: "河牌 Q♠，你的同花成了。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking misses value. You improved to a very strong hand.", zh: "过牌会少拿价值。你已经成了很强的牌。" },
                    bet: { en: "Good. Value bet when your draw completes and worse hands can call.", zh: "很好。听牌成了以后，如果更差的牌会跟，就要价值下注。" }
                },
                nextNarration: { en: "Scenario complete.", zh: "场景完成。" },
                coachTip: { en: "When the draw hits, switch from drawing to value betting.", zh: "听牌成了之后，要从“追牌”切换到“拿价值”。" }
            }
        ]
    },
    {
        id: "bb-defend-small-raise",
        title: { en: "BB Defend vs Small Raise", zh: "BB 防守小加注" },
        difficulty: { en: "Beginner", zh: "新手" },
        summary: { en: "Practice defending playable suited hands from the big blind.", zh: "练习大盲位用可玩同花牌防守。" },
        finalSummary: {
            en: { good: "You weighed price, position, and playability.", tip: "Big blind defense depends on price and hand playability." },
            zh: { good: "你考虑了价格、位置和可玩性。", tip: "大盲防守要看价格和手牌可玩性。" }
        },
        steps: [
            {
                street: "preflop",
                heroPosition: "BB",
                heroCards: ["Qs", "9s"],
                boardCards: [],
                pot: 4.5,
                stack: 98,
                actionHistory: "BTN raises to 2.5BB, SB folds. Hero is BB.",
                summaryText: { en: "BTN raises small. You are BB with Q♠ 9♠.", zh: "BTN 小加注。你在 BB，拿着 Q♠ 9♠。" },
                availableActions: ["fold", "call", "raise"],
                recommendedAction: "call",
                feedbackByAction: {
                    fold: { en: "A bit tight. Suited playable hands can defend at this price.", zh: "有点太紧。这个价格下，同花可玩牌可以防守。" },
                    call: { en: "Good. You close the action and have a playable suited hand.", zh: "很好。你最后行动，手牌也有可玩性。" },
                    raise: { en: "Possible sometimes, but calling is simpler for beginners.", zh: "有时可以加注，但对新手来说跟注更简单。" }
                },
                nextNarration: { en: "You call and see a flop.", zh: "你跟注，看翻牌。" },
                coachTip: { en: "In BB, good price makes more hands playable.", zh: "在 BB，价格好会让更多牌可以玩。" },
                seatAction: { position: "BTN", label: { en: "BTN opens", zh: "BTN 开池" } }
            },
            {
                street: "flop",
                heroPosition: "BB",
                heroCards: ["Qs", "9s"],
                boardCards: ["Qd", "6c", "2s"],
                pot: 5.5,
                stack: 97.5,
                actionHistory: "Hero called preflop. Flop Qd 6c 2s.",
                summaryText: { en: "You flop top pair. BTN continuation bets small.", zh: "你中了顶对。BTN 小额持续下注。" },
                availableActions: ["fold", "call", "raise"],
                recommendedAction: "call",
                feedbackByAction: {
                    fold: { en: "Too tight. Top pair is too strong to fold to a small bet.", zh: "太紧了。顶对面对小注不该轻易弃。" },
                    call: { en: "Good. Keep worse hands in and control the pot.", zh: "很好。保留更差的牌，同时控制底池。" },
                    raise: { en: "Raising can overplay this hand. Calling is cleaner.", zh: "加注可能打过头，跟注更稳。" }
                },
                nextNarration: { en: "Good defend and flop decision.", zh: "防守和翻牌决策都不错。" },
                coachTip: { en: "Top pair in BB often calls before it raises.", zh: "BB 顶对很多时候先跟注，不急着加注。" }
            }
        ]
    },
    {
        id: "flop-top-pair-value",
        title: { en: "Flop Top Pair Value Bet", zh: "翻牌顶对价值下注" },
        difficulty: { en: "Beginner", zh: "新手" },
        summary: { en: "Learn when top pair should bet for value.", zh: "学习顶对什么时候应该价值下注。" },
        finalSummary: {
            en: { good: "You identified worse hands that can call.", tip: "Value betting means worse hands can pay you." },
            zh: { good: "你找到了会跟注的更差牌。", tip: "价值下注的核心是更差的牌会付钱。" }
        },
        steps: [
            {
                street: "flop",
                heroPosition: "CO",
                heroCards: ["Ah", "Qh"],
                boardCards: ["Qd", "7s", "3h"],
                pot: 7,
                stack: 96,
                actionHistory: "Hero raised CO, BB called. BB checks flop.",
                summaryText: { en: "You have A♥ Q♥ on Q♦ 7♠ 3♥. BB checks.", zh: "你拿 A♥ Q♥，公共牌 Q♦ 7♠ 3♥。BB 过牌。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking is safe but misses value from worse queens.", zh: "过牌安全，但会错过更差 Q 的价值。" },
                    bet: { en: "Good. Top pair top kicker can bet for value.", zh: "很好。顶对顶踢脚可以价值下注。" }
                },
                nextNarration: { en: "BB calls. Keep thinking about value on safe turns.", zh: "BB 跟注。安全转牌继续考虑价值。" },
                coachTip: { en: "When worse hands call, bet.", zh: "有更差的牌会跟，就下注。" },
                seatAction: { position: "BB", label: { en: "BB checks", zh: "BB 过牌" } }
            },
            {
                street: "turn",
                heroPosition: "CO",
                heroCards: ["Ah", "Qh"],
                boardCards: ["Qd", "7s", "3h", "2c"],
                pot: 15,
                stack: 92,
                actionHistory: "Hero bet flop, BB called. Turn 2c, BB checks.",
                summaryText: { en: "Turn 2♣ changes little. BB checks again.", zh: "转牌 2♣ 没太大变化。BB 再次过牌。" },
                availableActions: ["check", "bet"],
                recommendedAction: "bet",
                feedbackByAction: {
                    check: { en: "Checking is okay, but there is still value.", zh: "过牌可以，但这里仍然有价值。" },
                    bet: { en: "Good. Continue value betting on a safe turn.", zh: "很好。安全转牌继续价值下注。" }
                },
                nextNarration: { en: "Value line complete.", zh: "价值线完成。" },
                coachTip: { en: "Safe turns let value hands keep betting.", zh: "安全转牌让价值牌可以继续下注。" }
            }
        ]
    }
];

class StackSenseiApp {
    constructor() {
        this.language = localStorage.getItem("stacksensei_language") || "en";
        this.completedLessons = new Set(JSON.parse(localStorage.getItem("stacksensei_completed_lessons") || "[]"));
        this.selectedLessonId = LESSONS[0].id;
        this.lessonStepIndex = 0;
        this.quizState = {};
        this.quizQuestionIndex = {};
        this.practiceState = {
            scenarioId: PRACTICE_SCENARIOS[0].id,
            stepIndex: 0,
            selectedAction: "",
            feedbackVisible: false,
            isComplete: false,
            started: false
        };
        this.bindElements();
        this.renderCardSelectors();
        this.renderPositionOptions();
        this.bindEvents();
        this.applyLanguage();
        this.syncCardsFromSelectors();
        this.renderPractice();
        this.loadBackendPracticeScenario();
    }

    bindElements() {
        this.langButton = document.getElementById("lang-toggle-btn");
        this.langText = document.getElementById("lang-toggle-text");
        this.navButtons = Array.from(document.querySelectorAll("[data-nav]"));
        this.sections = Array.from(document.querySelectorAll(".app-section"));
        this.learningCards = document.getElementById("learning-cards");
        this.lessonDetail = document.getElementById("lesson-detail");
        this.learnProgressCount = document.getElementById("learn-progress-count");
        this.learnProgressBar = document.getElementById("learn-progress-bar");
        this.learnMessages = document.getElementById("learn-messages");
        this.analyzeMessages = document.getElementById("analyze-messages");
        this.learnPrompts = document.getElementById("learn-prompts");
        this.analyzePrompts = document.getElementById("analyze-prompts");
        this.learnForm = document.getElementById("learn-form");
        this.learnInput = document.getElementById("learn-input");
        this.analyzeForm = document.getElementById("analyze-form");
        this.analyzeInput = document.getElementById("analyze-input");
        this.sendButton = document.getElementById("send-btn");
        this.statePill = document.getElementById("state-pill");
        this.scenarioSelect = document.getElementById("scenario-select");
        this.resetPracticeButton = document.getElementById("reset-practice-btn");
        this.startPracticeButton = document.getElementById("start-practice-btn");
        this.continuePracticeButton = document.getElementById("continue-practice-btn");
        this.askPracticeCoachButton = document.getElementById("ask-practice-coach-btn");
        this.practiceTable = document.getElementById("practice-table");
        this.practiceDifficulty = document.getElementById("practice-difficulty");
        this.practiceTurnPill = document.getElementById("practice-turn-pill");
        this.practiceTurnLabel = document.getElementById("practice-turn-label");
        this.scenarioSummary = document.getElementById("scenario-summary");
        this.practiceMeta = document.getElementById("practice-meta");
        this.practiceActions = document.getElementById("practice-actions");
        this.practiceFeedback = document.getElementById("practice-feedback");
        this.streetProgress = document.getElementById("street-progress");
        this.analyzeTable = document.getElementById("analyze-table");
        this.compactVisualizer = document.querySelector(".compact-visualizer");
        this.holeSelectorRoot = document.getElementById("hole-card-selectors");
        this.boardSelectorRoot = document.getElementById("community-card-selectors");
        this.cardWarning = document.getElementById("card-warning");
        this.handCards = document.getElementById("hand-cards");
        this.communityCards = document.getElementById("community-cards");
        this.position = document.getElementById("position");
        this.players = document.getElementById("players");
        this.chips = document.getElementById("chips");
        this.pot = document.getElementById("pot");
        this.actionHistory = document.getElementById("action-history");
        this.updateButton = document.getElementById("update-game-btn");
    }

    bindEvents() {
        if (this.langButton) this.langButton.addEventListener("click", () => this.toggleLanguage());
        this.navButtons.forEach((button) => button.addEventListener("click", () => this.setSection(button.dataset.nav)));
        this.learningCards.addEventListener("click", (event) => {
            const card = event.target.closest("[data-lesson-id]");
            if (card) this.selectLesson(card.dataset.lessonId);
        });
        this.lessonDetail.addEventListener("click", (event) => this.handleLessonDetailClick(event));
        this.learnForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendChat("learn", null, { mode: "learn" });
        });
        this.analyzeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendChat("analyze", null, { mode: "analyze" });
        });
        this.learnPrompts.addEventListener("click", (event) => this.handlePromptClick(event, "learn"));
        this.analyzePrompts.addEventListener("click", (event) => this.handlePromptClick(event, "analyze"));
        this.scenarioSelect.addEventListener("change", () => this.resetPractice(this.scenarioSelect.value));
        this.resetPracticeButton.addEventListener("click", () => this.resetPractice());
        this.startPracticeButton.addEventListener("click", () => this.startPractice());
        this.continuePracticeButton.addEventListener("click", () => this.continuePractice());
        this.askPracticeCoachButton.addEventListener("click", () => this.askPracticeCoach());
        this.practiceActions.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (button) this.handlePracticeAction(button.dataset.action, button);
        });
        this.updateButton.addEventListener("click", () => {
            this.syncCardsFromSelectors();
            this.statePill.textContent = this.t("handLoaded");
            this.setSection("analyze");
        });
        this.holeSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        this.boardSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        [this.position, this.players, this.chips, this.pot, this.actionHistory].forEach((el) => {
            el.addEventListener("input", () => this.updateAnalyzeTable(true));
            el.addEventListener("change", () => this.updateAnalyzeTable(true));
        });
    }

    t(key) {
        return COPY[this.language][key];
    }

    toggleLanguage() {
        this.language = this.language === "en" ? "zh" : "en";
        localStorage.setItem("stacksensei_language", this.language);
        this.applyLanguage();
        this.renderPractice();
        this.updateAnalyzeTable();
    }

    setSection(section) {
        this.sections.forEach((el) => el.classList.toggle("active", el.dataset.section === section));
        this.navButtons.forEach((button) => {
            if (button.classList.contains("nav-tab")) button.classList.toggle("active", button.dataset.nav === section);
        });
    }

    applyLanguage() {
        const copy = COPY[this.language];
        document.documentElement.lang = copy.htmlLang;
        if (this.langText) this.langText.textContent = "中 / ENG";
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            if (copy[key]) el.textContent = copy[key];
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.dataset.i18nPlaceholder;
            if (copy[key]) el.placeholder = copy[key];
        });
        this.renderLearningCards();
        this.renderLessonDetail();
        this.renderLearnProgress();
        this.renderPrompts(this.learnPrompts, copy.learnPrompts);
        this.renderPrompts(this.analyzePrompts, copy.analyzePrompts);
        this.renderScenarioOptions();
        this.updateCardSelectorCopy();
        this.renderPositionOptions();
        this.resetWelcomeMessages();
        this.validateDuplicateCards();
        this.practiceTurnLabel.textContent = copy.turn;
        this.statePill.textContent = copy.ready;
    }

    resetWelcomeMessages() {
        this.learnMessages.innerHTML = "";
        this.analyzeMessages.innerHTML = "";
        this.addMessage(this.learnMessages, "bot", this.t("learnWelcome"));
        this.addMessage(this.analyzeMessages, "bot", this.t("analyzeWelcome"));
    }

    renderLearningCards() {
        this.learningCards.innerHTML = LESSONS.map((lesson) => {
            const selected = lesson.id === this.selectedLessonId ? "selected" : "";
            const completed = this.completedLessons.has(lesson.id) ? "completed" : "";
            return `
                <button class="learn-card ${selected} ${completed}" type="button" data-lesson-id="${lesson.id}">
                    <span class="learn-card-icon" aria-hidden="true">${lesson.icon}</span>
                    <span>
                        <h3>${lesson.title[this.language]}</h3>
                        <p>${lesson.description[this.language]}</p>
                    </span>
                    <span class="complete-check" aria-hidden="true">✓</span>
                </button>
            `;
        }).join("");
    }

    selectLesson(lessonId) {
        this.selectedLessonId = lessonId;
        this.lessonStepIndex = 0;
        this.quizState[lessonId] = null;
        this.renderLearningCards();
        this.renderLessonDetail(true);
    }

    currentLesson() {
        return LESSONS.find((lesson) => lesson.id === this.selectedLessonId) || LESSONS[0];
    }

    renderLessonDetail(animate = false) {
        const lesson = this.currentLesson();
        const step = lesson.steps[this.lessonStepIndex];
        const quizKey = `${lesson.id}:${this.lessonStepIndex}`;
        const currentQuiz = this.currentQuiz(lesson, step, quizKey);
        const quizResult = this.quizState[quizKey];
        const isComplete = this.completedLessons.has(lesson.id);
        this.lessonDetail.classList.toggle("entering", animate);
        this.lessonDetail.innerHTML = `
            <div class="lesson-heading">
                <div>
                    <p class="section-kicker">STEP ${this.lessonStepIndex + 1}/${lesson.steps.length}</p>
                    <h2>${step.title[this.language]}</h2>
                </div>
                <span class="lesson-step-pill">${isComplete ? this.t("complete") : lesson.title[this.language]}</span>
            </div>
            <p>${step.explanation[this.language]}</p>
            <div class="lesson-visual">${step.visual.map((item) => this.lessonVisualMarkup(item)).join("")}</div>
            <ul class="lesson-bullets">${step.bullets[this.language].map((item) => `<li>${item}</li>`).join("")}</ul>
            <div class="lesson-actions">
                <button class="lesson-nav-button" type="button" data-lesson-action="prev" ${this.lessonStepIndex === 0 ? "disabled" : ""}>${this.language === "zh" ? "上一步" : "Previous"}</button>
                <button class="lesson-nav-button" type="button" data-lesson-action="next" ${this.lessonStepIndex === lesson.steps.length - 1 ? "disabled" : ""}>${this.language === "zh" ? "下一步" : "Next"}</button>
                <button class="lesson-nav-button" type="button" data-lesson-action="ask">${this.t("askCoach")}</button>
                <button class="lesson-nav-button primaryish" type="button" data-lesson-action="complete">${this.t("markComplete")}</button>
            </div>
            <div class="quiz-block">
                <p class="section-kicker">${this.t("quizChoose")}</p>
                <h3>${currentQuiz.question[this.language]}</h3>
                <div class="quiz-options">
                    ${currentQuiz.options[this.language].map((option, index) => {
                        const stateClass = quizResult && quizResult.index === index ? (quizResult.correct ? "correct" : "wrong") : "";
                        return `<button class="quiz-option ${stateClass}" type="button" data-quiz-index="${index}">${option}</button>`;
                    }).join("")}
                </div>
                <div class="quiz-feedback">${quizResult ? (quizResult.correct ? `${this.t("correct")}: ${currentQuiz.feedback[this.language]}` : `${this.t("tryAgain")}: ${currentQuiz.correction[this.language]}`) : ""}</div>
                <button class="lesson-nav-button" type="button" data-lesson-action="newQuiz">${this.language === "zh" ? "换一题" : "New Question"}</button>
            </div>
            <p><strong>${this.t("beginnerTip")}:</strong> ${(step.takeaway || lesson.takeaway)[this.language]}</p>
        `;
        if (animate) window.setTimeout(() => this.lessonDetail.classList.remove("entering"), 300);
    }

    lessonVisualMarkup(item) {
        if (POSITIONS.includes(item)) return `<span class="playing-card empty">${item}</span>`;
        if (item === "back") return this.cardMarkup("back");
        if (!/^(10|[2-9TJQKA])[shdc]$/i.test(item)) return `<span class="playing-card empty">${this.escapeHtml(item)}</span>`;
        return this.cardMarkup(item);
    }

    handleLessonDetailClick(event) {
        const actionButton = event.target.closest("[data-lesson-action]");
        const quizButton = event.target.closest("[data-quiz-index]");
        if (actionButton) {
            const lesson = this.currentLesson();
            const action = actionButton.dataset.lessonAction;
            if (action === "prev") this.lessonStepIndex = Math.max(0, this.lessonStepIndex - 1);
            if (action === "next") this.lessonStepIndex = Math.min(lesson.steps.length - 1, this.lessonStepIndex + 1);
            if (action === "complete") this.markLessonComplete(lesson.id);
            if (action === "ask") this.askLessonCoach(lesson);
            if (action === "newQuiz") this.newQuizQuestion(lesson.id);
            if (action !== "ask") this.renderLessonDetail(true);
        }
        if (quizButton) this.answerQuiz(Number.parseInt(quizButton.dataset.quizIndex, 10));
    }

    answerQuiz(index) {
        const lesson = this.currentLesson();
        const step = lesson.steps[this.lessonStepIndex];
        const quizKey = `${lesson.id}:${this.lessonStepIndex}`;
        const currentQuiz = this.currentQuiz(lesson, step, quizKey);
        this.quizState[quizKey] = { index, correct: index === currentQuiz.correctAnswer };
        this.renderLessonDetail();
    }

    currentQuiz(lesson, step, quizKey) {
        if (!step.quizPool) {
            step.quizPool = [
                {
                    question: step.quizQuestion,
                    options: step.quizOptions,
                    correctAnswer: step.correctAnswer,
                    feedback: step.feedback,
                    correction: step.correction
                },
                {
                    question: {
                        en: `Quick check: ${lesson.title.en}`,
                        zh: `快速检查：${lesson.title.zh}`
                    },
                    options: {
                        en: ["Have a clear reason", "Click any button", "Ignore position"],
                        zh: ["要有清楚理由", "随便点一个", "忽略位置"]
                    },
                    correctAnswer: 0,
                    feedback: {
                        en: "Right. Beginner poker improves when every action has a reason.",
                        zh: "对。新手进步的关键，是每个行动都有理由。"
                    },
                    correction: {
                        en: "Try to choose the answer that creates a clear poker reason.",
                        zh: "再想想，选择那个能形成清楚扑克理由的答案。"
                    }
                }
            ];
        }
        if (typeof this.quizQuestionIndex[quizKey] !== "number") {
            this.quizQuestionIndex[quizKey] = Math.floor(Math.random() * step.quizPool.length);
        }
        return step.quizPool[this.quizQuestionIndex[quizKey]];
    }

    newQuizQuestion(lessonId) {
        const lesson = this.currentLesson();
        const step = lesson.steps[this.lessonStepIndex];
        const quizKey = `${lessonId}:${this.lessonStepIndex}`;
        const current = this.quizQuestionIndex[quizKey] || 0;
        const total = step.quizPool?.length || 2;
        this.quizQuestionIndex[quizKey] = (current + 1) % total;
        this.quizState[quizKey] = null;
    }

    markLessonComplete(lessonId) {
        this.completedLessons.add(lessonId);
        localStorage.setItem("stacksensei_completed_lessons", JSON.stringify(Array.from(this.completedLessons)));
        this.renderLearningCards();
        this.renderLearnProgress();
    }

    renderLearnProgress() {
        const done = this.completedLessons.size;
        this.learnProgressCount.textContent = `${done} / ${LESSONS.length}`;
        this.learnProgressBar.style.width = `${(done / LESSONS.length) * 100}%`;
    }

    askLessonCoach(lesson) {
        const text = `${this.t("learnCoachPrompt")}${lesson.title[this.language]}`;
        this.learnInput.value = text;
        this.sendChat("learn", null, { mode: "learn", lessonId: lesson.id, lessonTitle: lesson.title[this.language] });
    }

    renderPrompts(root, prompts) {
        root.innerHTML = prompts.map((prompt) => `<button class="quick-prompt" type="button">${prompt}</button>`).join("");
    }

    handlePromptClick(event, mode) {
        const button = event.target.closest(".quick-prompt");
        if (!button) return;
        const input = mode === "learn" ? this.learnInput : this.analyzeInput;
        input.value = button.textContent;
        input.focus();
    }

    renderScenarioOptions() {
        this.scenarioSelect.innerHTML = PRACTICE_SCENARIOS.map((scenario) => (
            `<option value="${scenario.id}">${scenario.title[this.language]}</option>`
        )).join("");
        this.scenarioSelect.value = this.practiceState.scenarioId;
    }

    renderCardSelectors() {
        CARD_SLOTS.forEach((slot) => {
            const wrapper = document.createElement("div");
            wrapper.className = "card-selector";
            wrapper.dataset.slot = slot.id;
            wrapper.innerHTML = `
                <div class="card-selector-label" data-card-label="${slot.id}"></div>
                <div class="card-picker-row">
                    <select class="card-rank" data-slot="${slot.id}"></select>
                    <select class="card-suit" data-slot="${slot.id}"></select>
                </div>
            `;
            (slot.group === "hole" ? this.holeSelectorRoot : this.boardSelectorRoot).appendChild(wrapper);
        });
    }

    updateCardSelectorCopy() {
        CARD_SLOTS.forEach((slot) => {
            const label = document.querySelector(`[data-card-label="${slot.id}"]`);
            if (label) label.textContent = this.language === "zh" ? slot.zh : slot.en;
        });
        document.querySelectorAll(".card-rank").forEach((select) => {
            const selected = select.value;
            select.innerHTML = RANKS.map((rank) => `<option value="${rank}">${rank || this.t("rankEmpty")}</option>`).join("");
            select.value = selected;
        });
        document.querySelectorAll(".card-suit").forEach((select) => {
            const selected = select.value;
            select.innerHTML = SUITS.map((suit) => `<option value="${suit.value}">${suit.label}</option>`).join("");
            select.value = selected;
        });
    }

    renderPositionOptions() {
        const selected = this.position.value || "unknown";
        const labels = COPY[this.language].positions;
        this.position.innerHTML = ["unknown", ...POSITIONS].map((position) => `<option value="${position}">${labels[position]}</option>`).join("");
        this.position.value = selected;
    }

    cardFromSlot(slotId) {
        const rank = document.querySelector(`.card-rank[data-slot="${slotId}"]`)?.value || "";
        const suit = document.querySelector(`.card-suit[data-slot="${slotId}"]`)?.value || "";
        if (!rank || !suit) return "";
        return `${rank === "10" ? "T" : rank}${suit}`;
    }

    syncCardsFromSelectors() {
        const holeCards = CARD_SLOTS.filter((slot) => slot.group === "hole").map((slot) => this.cardFromSlot(slot.id)).filter(Boolean);
        const boardCards = CARD_SLOTS.filter((slot) => slot.group === "board").map((slot) => this.cardFromSlot(slot.id)).filter(Boolean);
        this.handCards.value = holeCards.join(" ");
        this.communityCards.value = boardCards.join(" ");
        document.querySelectorAll(".card-selector").forEach((el) => el.classList.toggle("has-card", Boolean(this.cardFromSlot(el.dataset.slot))));
        this.validateDuplicateCards();
        this.updateAnalyzeTable(true);
    }

    validateDuplicateCards() {
        const cards = `${this.handCards.value} ${this.communityCards.value}`.trim().split(/\s+/).filter(Boolean).map((card) => card.toLowerCase());
        const hasDuplicate = new Set(cards).size !== cards.length;
        this.cardWarning.textContent = hasDuplicate ? this.t("duplicateWarning") : "";
        return !hasDuplicate;
    }

    currentScenario() {
        return PRACTICE_SCENARIOS.find((scenario) => scenario.id === this.practiceState.scenarioId) || PRACTICE_SCENARIOS[0];
    }

    currentStep() {
        const scenario = this.currentScenario();
        return scenario.steps[this.practiceState.stepIndex] || scenario.steps[0];
    }

    async loadBackendPracticeScenario() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/practice/scenario?language=${encodeURIComponent(this.language)}`);
            if (!response.ok) return;
            const data = await response.json();
            const scenario = this.scenarioFromApi(data);
            if (!scenario) return;
            const existingIndex = PRACTICE_SCENARIOS.findIndex((item) => item.id === scenario.id);
            if (existingIndex >= 0) {
                PRACTICE_SCENARIOS[existingIndex] = scenario;
            } else {
                PRACTICE_SCENARIOS.unshift(scenario);
            }
            this.practiceState.scenarioId = scenario.id;
            this.practiceState.stepIndex = 0;
            this.renderScenarioOptions();
            this.renderPractice();
        } catch (error) {
            // Local scripted scenarios remain the fallback when practice APIs are unavailable.
        }
    }

    scenarioFromApi(data) {
        if (!data || !data.scenarioId) return null;
        const step = this.stepFromApi(data);
        return {
            id: data.scenarioId,
            title: { en: data.scenarioTitle || "Practice Scenario", zh: data.scenarioTitle || "练习场景" },
            difficulty: { en: data.difficulty || "beginner", zh: data.difficulty || "新手" },
            summary: { en: data.summaryText || "", zh: data.summaryText || "" },
            finalSummary: {
                en: { good: "You completed the guided hand.", tip: data.beginnerTip || "" },
                zh: { good: "你完成了这一手练习。", tip: data.beginnerTip || "" }
            },
            steps: [step]
        };
    }

    stepFromApi(data) {
        const cardsFromText = (value) => String(value || "").trim().split(/\s+/).filter(Boolean);
        return {
            street: data.street || "preflop",
            heroPosition: data.heroPosition || "BTN",
            heroCards: cardsFromText(data.heroCards),
            boardCards: cardsFromText(data.boardCards),
            pot: Number(data.pot) || 0,
            stack: Number(data.stack) || 100,
            actionHistory: data.actionHistory || "",
            summaryText: { en: data.summaryText || "", zh: data.summaryText || "" },
            availableActions: (data.availableActions || []).map((action) => typeof action === "string" ? action : action.id).filter(Boolean),
            actionLabels: data.availableActions || [],
            recommendedAction: data.recommendedAction || "",
            feedbackByAction: {},
            nextNarration: { en: "", zh: "" },
            coachTip: { en: data.beginnerTip || "", zh: data.beginnerTip || "" }
        };
    }

    resetPractice(scenarioId = this.practiceState.scenarioId) {
        this.practiceState = { scenarioId, stepIndex: 0, selectedAction: "", feedbackVisible: false, isComplete: false, started: false };
        this.renderPractice();
    }

    startPractice() {
        this.practiceState.started = true;
        this.practiceState.feedbackVisible = false;
        this.renderPractice({ deal: true });
    }

    continuePractice() {
        const scenario = this.currentScenario();
        if (this.practiceState.stepIndex >= scenario.steps.length - 1) {
            this.practiceState.isComplete = true;
            this.renderPractice();
            return;
        }
        this.practiceState.stepIndex += 1;
        this.practiceState.selectedAction = "";
        this.practiceState.feedbackVisible = false;
        this.practiceState.apiFeedback = null;
        this.renderPractice({ deal: true, boardFlip: true });
        const step = this.currentStep();
        if (step.seatAction) window.setTimeout(() => this.animateSeatAction(step.seatAction.position, step.seatAction.label[this.language]), 500);
    }

    renderPractice(options = {}) {
        const scenario = this.currentScenario();
        const step = this.currentStep();
        this.scenarioSelect.value = scenario.id;
        this.practiceDifficulty.textContent = scenario.difficulty[this.language];
        this.scenarioSummary.textContent = this.practiceState.isComplete ? this.t("scenarioComplete") : step.summaryText[this.language];
        this.practiceMeta.innerHTML = `
            <span class="meta-pill">${this.streetLabel(step.street)}</span>
            <span class="meta-pill">${this.t("potPrefix")}: ${step.pot} BB</span>
            <span class="meta-pill">${this.t("step")} ${this.practiceState.stepIndex + 1} / ${scenario.steps.length}</span>
        `;
        this.practiceTable.innerHTML = this.renderTable({
            heroPosition: step.heroPosition,
            heroCards: this.practiceState.started ? step.heroCards : ["back", "back"],
            boardCards: this.practiceState.started ? step.boardCards : [],
            pot: `${step.pot} BB`,
            stack: `${step.stack} BB`,
            street: step.street,
            compact: false,
            animated: options.deal,
            boardFlip: options.boardFlip
        });
        this.renderPracticeActions(step);
        this.renderStreetProgress(step.street);
        this.renderPracticeFeedback();
        this.startPracticeButton.hidden = this.practiceState.started && !this.practiceState.isComplete;
        this.continuePracticeButton.hidden = !this.practiceState.feedbackVisible || this.practiceState.isComplete;
        this.startPracticeButton.textContent = this.practiceState.isComplete ? this.t("replay") : this.t("startPractice");
        if (this.practiceState.isComplete) {
            this.startPracticeButton.hidden = false;
            this.startPracticeButton.onclick = () => this.resetPractice();
        } else {
            this.startPracticeButton.onclick = () => this.startPractice();
        }
        if (options.deal) this.animatePotUpdate();
    }

    renderPracticeActions(step) {
        if (!this.practiceState.started || this.practiceState.isComplete) {
            this.practiceActions.innerHTML = "";
            return;
        }
        this.practiceActions.innerHTML = step.availableActions.map((action) => {
            const selected = this.practiceState.selectedAction === action ? "action-selected" : "";
            const tone = action === step.recommendedAction ? "primary" : action === "fold" ? "danger" : "";
            return `<button class="action-button ${tone} ${selected}" type="button" data-action="${action}" ${this.practiceState.feedbackVisible ? "disabled" : ""}>${this.actionLabel(step, action)}</button>`;
        }).join("");
    }

    actionLabel(step, action) {
        const apiAction = (step.actionLabels || []).find((item) => item.id === action);
        const base = apiAction?.label || COPY[this.language].actions[action] || action;
        return apiAction?.amount ? `${base} ${apiAction.amount} BB` : base;
    }

    async handlePracticeAction(action, button) {
        if (!this.practiceState.started || this.practiceState.feedbackVisible) return;
        button.classList.add("clicked");
        window.setTimeout(() => button.classList.remove("clicked"), 280);
        this.practiceState.selectedAction = action;
        this.practiceState.feedbackVisible = true;
        const apiHandled = await this.submitPracticeAction(action);
        if (apiHandled) return;
        this.renderPractice();
        this.animateSeatAction(this.currentStep().heroPosition, `${this.t("yourChoice")}: ${COPY[this.language].actions[action]}`);
    }

    async submitPracticeAction(action) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/practice/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scenarioId: this.practiceState.scenarioId,
                    stepIndex: this.practiceState.stepIndex,
                    userAction: action,
                    language: this.language
                })
            });
            if (!response.ok) return false;
            const data = await response.json();
            this.practiceState.apiFeedback = data.feedback || null;
            if (data.nextState) {
                const scenario = this.currentScenario();
                scenario.steps[this.practiceState.stepIndex + 1] = this.stepFromApi(data.nextState);
            }
            this.practiceState.isComplete = Boolean(data.isComplete);
            this.renderPractice();
            this.animateSeatAction(this.currentStep().heroPosition, `${this.t("yourChoice")}: ${COPY[this.language].actions[action] || action}`);
            return true;
        } catch (error) {
            return false;
        }
    }

    renderPracticeFeedback() {
        const scenario = this.currentScenario();
        const step = this.currentStep();
        if (this.practiceState.isComplete) {
            const summary = scenario.finalSummary[this.language];
            this.practiceFeedback.innerHTML = `
                <div class="feedback-card good"><strong>${this.t("whatWentWell")}:</strong><br>${summary.good}</div>
                <div class="feedback-card"><strong>${this.t("beginnerTip")}:</strong><br>${summary.tip}</div>
            `;
            return;
        }
        if (!this.practiceState.started) {
            this.practiceFeedback.innerHTML = `<p>${this.t("stepIntro")}</p>`;
            return;
        }
        if (this.practiceState.feedbackVisible && this.practiceState.apiFeedback) {
            const feedback = this.practiceState.apiFeedback;
            this.practiceFeedback.innerHTML = `
                <div class="feedback-card ${feedback.isReasonable ? "good" : "caution"}">
                    <strong>${this.t("yourChoice")}:</strong> ${this.escapeHtml(feedback.yourChoice || this.practiceState.selectedAction)}<br>
                    <strong>${this.t("coachSuggestion")}:</strong> ${this.escapeHtml(feedback.coachSuggestion || "")}
                </div>
                <div class="feedback-card">
                    <strong>Why:</strong><br>${this.escapeHtml(feedback.why || "")}<br>
                    <strong>${this.t("beginnerTip")}:</strong> ${this.escapeHtml(feedback.beginnerTip || "")}
                </div>
                <p>${this.escapeHtml(feedback.nextStep || "")}</p>
            `;
            return;
        }
        if (!this.practiceState.feedbackVisible) {
            this.practiceFeedback.innerHTML = `<p>${this.t("practiceWelcome")}</p><p><strong>${this.t("beginnerTip")}:</strong> ${step.coachTip[this.language]}</p>`;
            return;
        }
        const action = this.practiceState.selectedAction;
        const isRecommended = action === step.recommendedAction;
        this.practiceFeedback.innerHTML = `
            <div class="feedback-card ${isRecommended ? "good" : "caution"}">
                <strong>${this.t("yourChoice")}:</strong> ${COPY[this.language].actions[action]}<br>
                ${step.feedbackByAction[action][this.language]}
            </div>
            <div class="feedback-card">
                <strong>${this.t("coachSuggestion")}:</strong> ${COPY[this.language].actions[step.recommendedAction]}<br>
                <strong>${this.t("beginnerTip")}:</strong> ${step.coachTip[this.language]}
            </div>
            <p>${step.nextNarration[this.language]}</p>
        `;
        this.practiceFeedback.classList.remove("coach-slide-in");
        void this.practiceFeedback.offsetWidth;
        this.practiceFeedback.classList.add("coach-slide-in");
    }

    renderStreetProgress(activeStreet) {
        const activeIndex = STREET_ORDER.indexOf(activeStreet);
        this.streetProgress.innerHTML = STREET_ORDER.map((street, index) => {
            const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "";
            return `<div class="street-step ${state}">${this.streetLabel(street)}</div>`;
        }).join("");
    }

    async askPracticeCoach() {
        const scenario = this.currentScenario();
        const step = this.currentStep();
        const message = this.t("askCoachPrompt");
        this.setSection("analyze");
        this.analyzeInput.value = message;
        await this.sendChat("analyze", this.getPracticeGameState(), {
            mode: "practice",
            practiceState: {
                ...this.practiceState,
                scenarioTitle: scenario.title[this.language],
                step,
                selectedAction: this.practiceState.selectedAction
            }
        });
    }

    getPracticeGameState() {
        const step = this.currentStep();
        return {
            handCards: step.heroCards.join(" "),
            communityCards: step.boardCards.join(" "),
            actionHistory: step.actionHistory,
            chips: step.stack,
            pot: step.pot,
            position: step.heroPosition,
            players: 6,
            opponents: 5
        };
    }

    updateAnalyzeTable(animate = false) {
        const state = this.getGameState();
        this.analyzeTable.innerHTML = this.renderTable({
            heroPosition: state.position === "unknown" ? "CO" : state.position,
            heroCards: state.handCards ? state.handCards.split(/\s+/) : [],
            boardCards: state.communityCards ? state.communityCards.split(/\s+/) : [],
            pot: `${state.pot || 0} BB`,
            stack: `${state.chips || 100} BB`,
            street: this.inferStreet(state.communityCards),
            compact: true,
            animated: animate,
            boardFlip: animate
        });
        if (animate && this.compactVisualizer) {
            this.compactVisualizer.classList.remove("table-updated");
            void this.compactVisualizer.offsetWidth;
            this.compactVisualizer.classList.add("table-updated");
        }
    }

    inferStreet(boardCards) {
        const count = boardCards ? boardCards.split(/\s+/).filter(Boolean).length : 0;
        if (count >= 5) return "river";
        if (count === 4) return "turn";
        if (count >= 3) return "flop";
        return "preflop";
    }

    renderTable({ heroPosition, heroCards, boardCards, pot, stack, street, compact, animated = false, boardFlip = false }) {
        const board = [...boardCards];
        while (board.length < 5) board.push("");
        const seats = POSITIONS.map((position) => {
            const isHero = position === heroPosition;
            const cards = isHero ? [heroCards[0] || "", heroCards[1] || ""] : ["back", "back"];
            const heroLabel = isHero && !compact ? ` (${this.language === "zh" ? "你" : "You"})` : "";
            return `
                <div class="seat-node pos-${position.toLowerCase()} ${isHero ? "hero seat-active" : ""}" data-seat="${position}">
                    <div class="seat-cards">${cards.map((card, index) => this.cardMarkup(card, animated, index * 90)).join("")}</div>
                    <div class="seat-label">${position}${heroLabel}<span class="seat-stack">${isHero ? stack : compact ? "" : "100 BB"}</span></div>
                </div>
            `;
        }).join("");
        return `
            <div class="poker-table"></div>
            ${compact ? "" : '<div class="deck-stack" aria-hidden="true"></div>'}
            <div class="pot-badge">${this.t("potPrefix")}: ${pot}</div>
            <div class="board-zone">${board.map((card, index) => this.cardMarkup(card, boardFlip, index * 110, card ? "card-flip" : "")).join("")}</div>
            <div class="street-badge">${this.streetLabel(street)}</div>
            ${seats}
        `;
    }

    streetLabel(street) {
        if (COPY[this.language].street[street]) return COPY[this.language].street[street];
        if (street === "showdown") return this.language === "zh" ? "摊牌" : "Showdown";
        return street;
    }

    cardMarkup(card, animated = false, delay = 0, animationClass = "card-deal") {
        const delayStyle = animated && !REDUCED_MOTION ? ` style="--deal-delay:${delay}ms;--flip-delay:${delay}ms"` : "";
        const cls = animated && !REDUCED_MOTION ? animationClass : "";
        if (card === "back") return `<span class="playing-card back ${cls}"${delayStyle}>##</span>`;
        if (!card) return `<span class="playing-card empty">--</span>`;
        const rank = card.slice(0, -1).replace("T", "10");
        const suit = SUITS.find((item) => item.value === card.slice(-1).toLowerCase())?.symbol || card.slice(-1);
        return `
            <span class="playing-card face ${this.isRedCard(card) ? "red" : ""} ${cls}"${delayStyle}>
                <span class="card-corner top">${rank}<small>${suit}</small></span>
                <span class="card-pip">${suit}</span>
                <span class="card-corner bottom">${rank}<small>${suit}</small></span>
            </span>
        `;
    }

    animatePotUpdate() {
        if (REDUCED_MOTION) return;
        const pot = this.practiceTable.querySelector(".pot-badge");
        if (!pot) return;
        pot.classList.remove("chip-pulse");
        void pot.offsetWidth;
        pot.classList.add("chip-pulse");
    }

    animateSeatAction(position, label) {
        if (REDUCED_MOTION) return;
        const seat = this.practiceTable.querySelector(`[data-seat="${position}"]`);
        if (!seat) return;
        const old = seat.querySelector(".seat-action");
        if (old) old.remove();
        const el = document.createElement("span");
        el.className = "seat-action";
        el.textContent = label;
        seat.appendChild(el);
        window.setTimeout(() => el.remove(), 1300);
    }

    displayCard(card) {
        const rank = card.slice(0, -1).replace("T", "10");
        const suit = SUITS.find((item) => item.value === card.slice(-1).toLowerCase())?.symbol || card.slice(-1);
        return `${rank}${suit}`;
    }

    isRedCard(card) {
        const suit = card.slice(-1).toLowerCase();
        return suit === "h" || suit === "d";
    }

    getGameState(override = null) {
        if (override) return override;
        const players = Number.parseInt(this.players.value, 10) || 6;
        return {
            handCards: this.handCards.value.trim(),
            communityCards: this.communityCards.value.trim(),
            actionHistory: this.actionHistory.value.trim(),
            chips: Number.parseFloat(this.chips.value) || 100,
            pot: Number.parseFloat(this.pot.value) || 0,
            position: this.position.value || "unknown",
            players,
            opponents: Math.max(1, players - 1)
        };
    }

    async sendChat(mode, gameStateOverride = null, extraPayload = {}) {
        const input = mode === "learn" ? this.learnInput : this.analyzeInput;
        const messagesRoot = mode === "learn" ? this.learnMessages : this.analyzeMessages;
        const message = input.value.trim();
        if (!message) {
            this.addMessage(messagesRoot, "bot", this.t("empty"));
            return;
        }
        if (mode === "analyze" && !gameStateOverride) this.syncCardsFromSelectors();
        input.value = "";
        this.addMessage(messagesRoot, "user", message);
        const loading = this.addMessage(messagesRoot, "bot", "", true);
        this.setBusy(true, mode);
        try {
            const payload = {
                message,
                gameState: mode === "learn" ? { context: "learn", ...extraPayload } : this.getGameState(gameStateOverride),
                language: this.language,
                ...extraPayload
            };
            const response = await fetch(`${API_BASE_URL}/api/poker-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.detail || this.t("genericError"));
            loading.remove();
            this.addMessage(messagesRoot, "bot", data.reply || this.t("genericError"), false, data.action);
        } catch (error) {
            loading.remove();
            const text = error instanceof TypeError ? this.t("backendError") : `${this.t("genericError")} ${error.message}`;
            this.addMessage(messagesRoot, "bot", text);
        } finally {
            this.setBusy(false, mode);
        }
    }

    setBusy(isBusy, mode) {
        const input = mode === "learn" ? this.learnInput : this.analyzeInput;
        const button = mode === "learn" ? this.learnForm.querySelector("button") : this.sendButton;
        input.disabled = isBusy;
        button.disabled = isBusy;
        if (this.statePill) this.statePill.textContent = isBusy ? this.t("thinking") : this.t("ready");
    }

    addMessage(root, sender, text, isLoading = false, action = "") {
        const article = document.createElement("article");
        article.className = `message ${sender} entering${isLoading ? " loading" : ""}`;
        if (sender === "bot") {
            const avatar = document.createElement("img");
            avatar.src = "assets/joker-avatar.png";
            avatar.alt = "";
            avatar.className = "mini-avatar";
            article.appendChild(avatar);
        }
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        if (isLoading) {
            bubble.innerHTML = `<span class="typing-loader" aria-label="${this.t("thinking")}"><span></span><span></span><span></span></span>`;
        } else {
            if (action && action !== "N/A") bubble.innerHTML = `<p><strong>${this.escapeHtml(action)}</strong></p>`;
            bubble.innerHTML += this.formatText(text);
        }
        article.appendChild(bubble);
        root.appendChild(article);
        root.scrollTop = root.scrollHeight;
        window.setTimeout(() => article.classList.remove("entering"), 320);
        return article;
    }

    formatText(text) {
        return this.escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .split(/\n{2,}/)
            .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
            .join("");
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new StackSenseiApp();
});
