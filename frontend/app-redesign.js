const API_BASE_URL = (window.STACKSENSEI_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const REVIEW_LOG_KEY = "stacksensei.reviewLog";
const DAILY_PROGRESS_KEY = "stacksensei.dailyHandProgress";
const LANGUAGE_KEY = "stacksensei_language";
const COMPLETED_KEY = "stacksensei_completed_lessons";
const DAILY_KEY = "stacksensei.dailyHand";
const DAILY_STREAK_KEY = "stacksensei.dailyStreak";

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
        navLearn: "Learn",
        navPractice: "Practice",
        navAnalyze: "Analyze",
        learnKicker: "Beginner path",
        learnTitle: "Learn Texas Hold'em from Zero",
        learnSubtitle: "Start with the shape of one hand, then learn position, hand strength, and simple betting logic.",
        homeSlogan: "Luck deals the cards. Skill plays the hand.",
        startLearning: "Start Learning",
        tryDailyHand: "Try Daily Hand",
        reviewAHand: "Review a Hand",
        whyPokerTitle: "Why poker is not just luck",
        whyProbability: "Probability",
        whyProbabilityText: "Every call and bet weighs risk against reward.",
        whyInformation: "Information",
        whyInformationText: "Position and action order tell you what others may have.",
        whyPsychology: "Psychology",
        whyPsychologyText: "You play the hand, but also read intention and pressure.",
        todayPath: "Today's path",
        coachKicker: "StackSensei",
        learnChatTitle: "Chat with Coach",
        learnInput: "Ask about rules, actions, or poker basics...",
        coachNote: "StackSensei can be wrong. Think carefully and use judgment.",
        dailyKicker: "Daily drill",
        dailyHand: "Daily Hand",
        dailyAnswer: "Show Answer",
        dailySubmit: "Lock Answer",
        streak: "day streak",
        scenarioLabel: "Scenario",
        resetPractice: "Reset",
        startPractice: "Start Practice",
        continuePractice: "Continue",
        replay: "Replay",
        askCoach: "Ask Coach",
        markComplete: "Mark Complete",
        previous: "Previous",
        next: "Next",
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
        incompleteHandTitle: "Please complete the hand setup:",
        missingHeroCards: "Choose both hero cards.",
        missingPosition: "Choose your position.",
        missingPot: "Enter the pot size.",
        missingActionHistory: "Describe the action history.",
        incompleteBoard: "Board cards must be empty, flop 3 cards, turn 4 cards, or river 5 cards.",
        backendError: "The backend may be waking up. Please try again in a moment.",
        genericError: "Sorry, something went wrong.",
        duplicateWarning: "Duplicate card selected. Please choose unique cards.",
        rankEmpty: "--",
        turn: "Your turn",
        complete: "Complete",
        potPrefix: "Pot",
        step: "Step",
        overview: "Overview",
        keyPoints: "Key points",
        examples: "Examples",
        quickCheck: "Quick check",
        stepIntro: "Click Start Practice to deal the hand.",
        scenarioComplete: "Hand complete",
        whatWentWell: "What went well",
        risk: "Risk",
        street: { preflop: "Preflop", flop: "Flop", turn: "Turn", river: "River", showdown: "Showdown" },
        actions: { fold: "Fold", check: "Check", call: "Call", bet: "Bet", raise: "Raise", ask: "Ask Coach" },
        learnWelcome: "Hi, I am StackSensei. Choose a lesson first, then ask me anything that still feels fuzzy.",
        analyzeWelcome: "Load a hand on the left, ask for analysis, then save important spots into your Review Log.",
        practiceWelcome: "Choose a scenario and start. I will guide you one decision at a time.",
        askCoachPrompt: "Please explain this practice step in beginner-friendly terms.",
        learnCoachPrompt: "Please explain this poker concept in beginner-friendly terms:",
        learnPrompts: ["What is the flop?", "Why does position matter?", "What is a draw?"],
        analyzePrompts: ["Analyze this hand", "What is my best action?", "What mistake should I avoid?"],
        positions: { unknown: "Unknown", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        quizChoose: "Choose one answer:",
        loadingQuiz: "Loading a fresh question...",
        quizFallback: "Using a local check while the backend wakes up.",
        noLesson: "Pick a lesson card to begin.",
        reviewKicker: "Study notebook",
        reviewLog: "Review Log",
        whatReviewLog: "What is Review Log?",
        reviewHelp: "Save important analyzed hands here. You can revisit them later, add notes, and generate a shareable hand card.",
        reviewNotice: "Your review log is stored in this browser. Export it anytime if you want a backup.",
        saveReview: "Save to Review Log",
        shareHand: "Share Hand",
        exportJson: "Export",
        importJson: "Import",
        clearAll: "Clear",
        allTags: "All tags",
        favorite: "Favorite",
        unfavorite: "Unfavorite",
        delete: "Delete",
        notes: "Notes",
        saveNotes: "Save Notes",
        emptyLog: "No saved hands yet. Analyze a hand, then save it here.",
        confirmClear: "Clear every saved review from this browser?",
        confirmDelete: "Delete this review?",
        importOk: "Review log imported.",
        importBad: "Could not import that JSON file.",
        saved: "Saved.",
        downloadPng: "Download PNG",
        copyImage: "Copy Image",
        copied: "Image copied.",
        copyFallback: "Copy is not supported in this browser. Please download the image instead.",
        shareReady: "Share card ready.",
        nextHand: "Next Hand",
        practiceComplete: "Practice Complete",
        restartPractice: "Restart Practice",
        backToLearn: "Back to Learn",
        analyzeAHand: "Analyze a Hand",
        reviewedBy: "Reviewed by StackSensei",
        handReview: "Hand Review",
        recommendedAction: "Recommended action",
        keyReasoning: "Key reasoning",
        coachNoteLine: "Coach note",
        beginnerReminder: "Think in reasons, not guesses.",
        tagValue: "Value",
        tagBluff: "Bluff",
        tagPosition: "Position",
        tagDraw: "Draw",
        tagMistake: "Mistake"
    },
    zh: {
        htmlLang: "zh-CN",
        navLearn: "学习",
        navPractice: "练习",
        navAnalyze: "分析",
        learnKicker: "新手路线",
        learnTitle: "从零开始学德州扑克",
        learnSubtitle: "先看懂一局牌怎么进行，再学习位置、牌力和基础下注逻辑。",
        homeSlogan: "运气发牌，技术打牌。",
        startLearning: "从零开始",
        tryDailyHand: "做今日一手",
        reviewAHand: "复盘一手牌",
        whyPokerTitle: "为什么扑克不只是运气",
        whyProbability: "概率",
        whyProbabilityText: "每一次跟注和下注，都是在比较风险与回报。",
        whyInformation: "信息",
        whyInformationText: "位置和行动顺序，会透露别人可能拿着什么。",
        whyPsychology: "心理",
        whyPsychologyText: "你不只是在打牌，也在读意图和压力。",
        todayPath: "今日路线",
        coachKicker: "StackSensei",
        learnChatTitle: "和教练聊聊",
        learnInput: "询问规则、行动或任何扑克基础问题...",
        coachNote: "StackSensei 可能会出错，请结合自己的判断。",
        dailyKicker: "每日训练",
        dailyHand: "每日一手",
        dailyAnswer: "查看答案",
        dailySubmit: "锁定答案",
        streak: "天连续打卡",
        scenarioLabel: "场景",
        resetPractice: "重置",
        startPractice: "开始练习",
        continuePractice: "继续",
        replay: "重练",
        askCoach: "问教练",
        markComplete: "标记完成",
        previous: "上一步",
        next: "下一步",
        correct: "答对了",
        tryAgain: "再想想",
        beginnerTip: "新手提示",
        yourChoice: "你的选择",
        coachSuggestion: "教练建议",
        practiceTitle: "练这手牌",
        coachSays: "教练说",
        tableState: "牌局状态",
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
        analyzeTitle: "和教练复盘这手牌",
        analyzeInput: "输入你的问题...",
        ready: "就绪",
        thinking: "思考中...",
        handLoaded: "牌局已载入",
        empty: "请先输入一个问题。",
        backendError: "后端可能正在唤醒，请稍后再试。",
        genericError: "抱歉，出错了。",
        duplicateWarning: "选择了重复牌，请换成不同的牌。",
        rankEmpty: "--",
        turn: "轮到你行动",
        complete: "完成",
        potPrefix: "底池",
        step: "步骤",
        overview: "概览",
        keyPoints: "重点",
        examples: "例子",
        quickCheck: "快速检查",
        stepIntro: "点击开始练习，先发牌进入这一手。",
        scenarioComplete: "这一手已完成",
        whatWentWell: "做得好的地方",
        risk: "风险",
        street: { preflop: "翻前", flop: "翻牌", turn: "转牌", river: "河牌", showdown: "摊牌" },
        actions: { fold: "弃牌", check: "过牌", call: "跟注", bet: "下注", raise: "加注", ask: "问教练" },
        learnWelcome: "嗨，我是 StackSensei。先选一节课，再把没懂的地方直接问我。",
        analyzeWelcome: "先在左侧设置牌局，再请求分析。重要牌局可以保存到复盘本。",
        practiceWelcome: "选择一个场景并开始，我会一步一步带你做决定。",
        askCoachPrompt: "请用新手能听懂的话解释这一步该怎么想。",
        learnCoachPrompt: "请用新手能听懂的话解释这个扑克概念：",
        learnPrompts: ["什么是翻牌？", "位置为什么重要？", "什么是听牌？"],
        analyzePrompts: ["帮我分析这手", "最佳行动是什么？", "我该避免什么错误？"],
        positions: { unknown: "未知", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        quizChoose: "选择一个答案：",
        loadingQuiz: "正在加载新题...",
        quizFallback: "后端唤醒时，先使用本地题目。",
        noLesson: "点击一张学习卡片开始。",
        reviewKicker: "学习笔记",
        reviewLog: "复盘本",
        whatReviewLog: "什么是复盘本？",
        reviewHelp: "把你分析过的重要牌局保存到这里，之后可以回看、写备注，并一键生成分享图片。",
        reviewNotice: "复盘本保存在当前浏览器。清除缓存或更换设备后可能丢失，可随时导出备份。",
        saveReview: "保存到复盘本",
        shareHand: "生成分享图",
        exportJson: "导出",
        importJson: "导入",
        clearAll: "清空",
        allTags: "全部标签",
        favorite: "收藏",
        unfavorite: "取消收藏",
        delete: "删除",
        notes: "备注",
        saveNotes: "保存备注",
        emptyLog: "还没有保存的牌局。先分析一手牌，再保存到这里。",
        confirmClear: "清空当前浏览器里的全部复盘？",
        confirmDelete: "删除这条复盘？",
        importOk: "复盘本已导入。",
        importBad: "无法导入这个 JSON 文件。",
        saved: "已保存。",
        downloadPng: "下载 PNG",
        copyImage: "复制图片",
        copied: "图片已复制。",
        copyFallback: "当前浏览器不支持复制图片，请使用下载。",
        shareReady: "分享图已生成。",
        reviewedBy: "由 StackSensei 复盘",
        handReview: "牌局复盘",
        recommendedAction: "建议行动",
        keyReasoning: "关键理由",
        coachNoteLine: "教练提示",
        beginnerReminder: "用理由做决定，不靠猜。",
        tagValue: "价值",
        tagBluff: "诈唬",
        tagPosition: "位置",
        tagDraw: "听牌",
        tagMistake: "错误"
    }
};

const LESSONS = [
    {
        id: "what-is-holdem",
        icon: "dealer",
        title: { en: "What Is Texas Hold'em?", zh: "德州是什么" },
        description: { en: "Goal, hole cards, community cards, the pot, and how a hand is won.", zh: "先理解目标、手牌、公共牌、底池，以及一手牌怎么赢。" },
        steps: [
            {
                title: { en: "The goal of the game", zh: "游戏目标" },
                overview: { en: "Texas Hold'em is a decision game played with hidden information. You try to win the pot by making the best five-card hand at showdown or by betting so every opponent folds.", zh: "德州扑克是在信息不完整下做决策的游戏。你要么在摊牌时组成最好的五张牌，要么通过下注让所有对手弃牌，从而赢下底池。" },
                points: {
                    en: ["The pot is the chips in the middle.", "You can win before showdown if everyone folds.", "Good decisions matter because the same cards can be played well or badly."],
                    zh: ["底池是桌面中央大家争夺的筹码。", "如果其他人都弃牌，你不用摊牌也能赢。", "同样的牌可以打得好也可以打得差，所以决策很重要。"]
                },
                visual: { type: "potOdds" },
                examples: { en: ["If you bet and both opponents fold, you win the pot immediately even without showing your cards."], zh: ["如果你下注后两个对手都弃牌，你不用亮牌也能立刻赢下底池。"] }
            },
            {
                title: { en: "Two private cards", zh: "两张手牌" },
                overview: { en: "Every player receives two private hole cards. Only you can see yours. Beginners should first learn which starting hands are naturally strong and which are trouble hands.", zh: "每位玩家先拿到两张只有自己能看的手牌。新手要先学哪些起手牌天然更强，哪些容易惹麻烦。" },
                points: {
                    en: ["Pairs like AA and KK are strong.", "Big cards like AK and AQ can make strong top pair.", "Weak disconnected cards usually lose money from early position."],
                    zh: ["AA、KK 这样的对子很强。", "AK、AQ 这样的大牌容易形成强顶对。", "弱且不连张的牌在前位通常容易亏钱。"]
                },
                visual: { type: "cards", cards: ["As", "Ah", "Kh", "Qd"] },
                examples: { en: ["A-K suited is much easier to play than 9-4 offsuit."], zh: ["AK 同花比 94 不同花容易打得多。"] }
            },
            {
                title: { en: "Five community cards", zh: "五张公共牌" },
                overview: { en: "Up to five community cards appear in the middle: three on the flop, one on the turn, and one on the river. Everyone can use them.", zh: "桌面中间最多会出现五张公共牌：翻牌三张，转牌一张，河牌一张。所有玩家都可以使用这些牌。" },
                points: {
                    en: ["The board can improve you or your opponents.", "A dry board has fewer draws.", "A wet board connects with many hands."],
                    zh: ["公共牌可能帮助你，也可能帮助对手。", "干燥牌面听牌较少。", "湿润牌面会和很多手牌产生连接。"]
                },
                visual: { type: "cards", cards: ["Qd", "Jc", "7h", "2s", "9d"] },
                examples: { en: ["KQ on K-7-2 is top pair. On K-Q-J, one pair is more fragile."], zh: ["KQ 在 K-7-2 是顶对；但在 K-Q-J 上，一对就脆弱得多。"] }
            },
            {
                title: { en: "Best five-card hand", zh: "最好的五张牌" },
                overview: { en: "At showdown, you combine your two hole cards with the board to make the best five-card poker hand. You may use two, one, or even zero hole cards.", zh: "摊牌时，你用自己的两张手牌和公共牌组合成最好的五张牌。你可以用两张手牌、一张手牌，甚至不用手牌。" },
                points: {
                    en: ["The best five cards win, not the most cards.", "Sometimes the board itself makes the best hand.", "Before acting, name what hand you currently have."],
                    zh: ["比的是最好的五张牌，不是谁用的牌更多。", "有时公共牌本身就是最佳五张。", "行动前先说清楚自己现在是什么牌型。"]
                },
                visual: { type: "madeDraw" },
                examples: { en: ["If the board is A-A-K-K-Q and you hold 7-2, your best hand may still be the board."], zh: ["如果公共牌是 A-A-K-K-Q，而你拿 7-2，你的最佳牌可能仍然就是公共牌。"] }
            }
        ]
    },
    {
        id: "how-a-hand-works",
        icon: "dealer",
        title: { en: "How a Hand Works", zh: "一局牌怎么进行" },
        description: { en: "Blinds, button, hole cards, streets, betting rounds, showdown, and who wins.", zh: "盲注、按钮、手牌、翻转河、下注轮、摊牌，以及谁赢。" },
        steps: [
            {
                title: { en: "What is Texas Hold'em?", zh: "德州扑克是什么？" },
                overview: { en: "Each player gets two private cards. Five community cards can appear in the middle. Your goal is to win the pot by making the best five-card hand or by getting everyone else to fold.", zh: "每位玩家有两张自己的手牌，中间最多出现五张公共牌。你的目标是组成最好的五张牌，或者通过下注让其他人弃牌，从而赢下底池。" },
                points: {
                    en: ["The pot is the chips everyone is fighting for.", "You do not need to reach showdown to win.", "A beginner's first job is to understand the order of the hand."],
                    zh: ["底池是大家争夺的筹码。", "不一定要摊牌才能赢。", "新手第一件事，是看懂一局牌的顺序。"]
                },
                visual: { type: "timeline", items: ["Blinds", "Hole Cards", "Flop", "Turn", "River", "Showdown"] },
                examples: { en: ["You hold A♠ K♥. The board runs K♦ 7♣ 2♠ 9♥ 4♣. Your best five cards include a pair of kings."], zh: ["你拿 A♠ K♥。公共牌是 K♦ 7♣ 2♠ 9♥ 4♣。你的五张最佳牌里有一对K。"] }
            },
            {
                title: { en: "Blinds and the dealer button", zh: "盲注和庄位按钮" },
                overview: { en: "The button marks the dealer position and moves one seat each hand. The small blind and big blind put chips in before cards are dealt, which creates action.", zh: "按钮代表庄位，每一手向左移动一格。小盲和大盲在发牌前先放入筹码，这样牌局一开始就有底池可以争夺。" },
                points: {
                    en: ["SB and BB are forced bets.", "The button is valuable because it often acts last after the flop.", "Blinds rotate so everyone pays them over time."],
                    zh: ["小盲和大盲是强制下注。", "按钮位很有价值，因为翻牌后通常最后行动。", "盲注会轮流移动，所以每个人都会轮到。"]
                },
                visual: { type: "seats" },
                examples: { en: ["In a 6-max game the order is UTG, HJ, CO, BTN, SB, BB."], zh: ["6人桌常见位置顺序是 UTG、HJ、CO、BTN、SB、BB。"] }
            },
            {
                title: { en: "The streets of a hand", zh: "一手牌的阶段" },
                overview: { en: "A hand moves through streets. Preflop happens before community cards. The flop shows three cards, the turn adds one, and the river adds the final one.", zh: "一手牌分为几个阶段。翻前还没有公共牌；翻牌一次发三张；转牌再发一张；河牌发最后一张。" },
                points: {
                    en: ["Preflop: decide whether your two cards are worth playing.", "Flop, turn, river: reassess as the board changes.", "After the river, remaining players may show cards."],
                    zh: ["翻前：判断两张手牌是否值得入池。", "翻牌、转牌、河牌：公共牌变化后重新评估。", "河牌后若还有多人没弃牌，就可能摊牌。"]
                },
                visual: { type: "cards", cards: ["As", "Kh", "Qd", "7c", "2s", "9h", "4c"] },
                examples: { en: ["A strong preflop hand can become risky on a scary board, so keep updating your plan."], zh: ["翻前很强的牌，遇到危险牌面也可能变得有风险，所以要不断更新计划。"] }
            },
            {
                title: { en: "Betting rounds and showdown", zh: "下注轮和摊牌" },
                overview: { en: "On each street, players can fold, check, call, bet, or raise depending on the action. If more than one player remains after the river, the best hand wins at showdown.", zh: "每个阶段玩家会根据前面的行动选择弃牌、过牌、跟注、下注或加注。如果河牌后还有多人留下，就摊牌比较牌力。" },
                points: {
                    en: ["Fold means you give up this pot but stop losing more.", "Call means you match the current bet.", "Bet or raise can win value, protect a hand, or pressure opponents."],
                    zh: ["弃牌是放弃当前底池，但避免继续损失。", "跟注是补齐当前下注。", "下注或加注可以拿价值、保护牌，或给对手压力。"]
                },
                visual: { type: "actions" },
                examples: { en: ["If everyone folds to your bet, you win immediately. If someone calls through the river, compare hands."], zh: ["如果所有人都面对你的下注弃牌，你立刻赢下底池。若有人一路跟到河牌，就比较牌力。"] }
            }
        ]
    },
    {
        id: "position-actions",
        icon: "position",
        title: { en: "Positions and Turn Order", zh: "位置与行动顺序" },
        description: { en: "Learn UTG, HJ, CO, BTN, SB, BB, and why acting later is easier.", zh: "认识 UTG、HJ、CO、BTN、SB、BB，以及为什么后行动更有利。" },
        steps: [
            {
                title: { en: "What position means", zh: "位置是什么意思" },
                overview: { en: "Position is your seat relative to the dealer button. It decides when you act. Acting later gives you more information because you see what opponents do first.", zh: "位置是你相对按钮的位置，它决定你什么时候行动。越晚行动，越能先看到别人怎么做，信息就越多。" },
                points: {
                    en: ["Early position acts with less information.", "Late position can react to checks, bets, and weakness.", "Position affects which starting hands are playable."],
                    zh: ["前位行动时信息更少。", "后位可以根据别人过牌、下注或示弱来调整。", "位置会影响哪些起手牌值得玩。"]
                },
                visual: { type: "seatStrip" },
                examples: { en: ["A hand like KJ suited is easier to play on the button than UTG."], zh: ["像 KJ 同花这样的牌，在按钮位通常比 UTG 更容易玩。"] }
            },
            {
                title: { en: "6-max seat map", zh: "6人桌座位图" },
                overview: { en: "In a common 6-max game, the seats are UTG, HJ, CO, BTN, SB, and BB. BTN is the button. SB and BB post blinds.", zh: "常见6人桌的位置是 UTG、HJ、CO、BTN、SB、BB。BTN 是按钮位，SB 和 BB 下盲注。" },
                points: {
                    en: ["UTG is first preflop and should be tight.", "CO and BTN are late positions.", "SB and BB have forced chips in but play out of position often."],
                    zh: ["UTG 翻前最早行动，应该更谨慎。", "CO 和 BTN 属于后位。", "SB 和 BB 已经投入盲注，但翻后经常位置不利。"]
                },
                visual: { type: "seats" },
                examples: { en: ["BTN gets to see UTG, HJ, and CO act before choosing preflop."], zh: ["BTN 翻前能先看到 UTG、HJ、CO 怎么行动。"] }
            },
            {
                title: { en: "Preflop vs postflop order", zh: "翻前和翻后顺序不同" },
                overview: { en: "Preflop, action starts left of the big blind. After the flop, the small blind or first remaining player left of the button acts first, and the button often acts last.", zh: "翻前从大盲左侧开始行动。翻后通常从小盲或按钮左侧第一个还在牌局的人开始，按钮位常常最后行动。" },
                points: {
                    en: ["Preflop: UTG usually acts first in 6-max.", "Postflop: blinds usually act early.", "Late position lets you control pot size more easily."],
                    zh: ["翻前：6人桌通常 UTG 最早行动。", "翻后：盲注位通常更早行动。", "后位更容易控制底池大小。"]
                },
                visual: { type: "turnOrder" },
                examples: { en: ["On the button, you can check back for a free card or bet after others check."], zh: ["在按钮位，别人过牌后你可以选择免费看牌，也可以下注。"] }
            },
            {
                title: { en: "Beginner position rule", zh: "新手位置原则" },
                overview: { en: "Play fewer hands from early position and more from late position. This one habit removes many beginner mistakes.", zh: "前位少玩一些手牌，后位可以适当多玩一些。这个习惯能减少很多新手错误。" },
                points: {
                    en: ["Early: strong pairs, big broadways, premium suited hands.", "Late: add more suited connectors and playable broadways.", "When unsure, fold weak hands in early position."],
                    zh: ["前位：大对子、大高张、优质同花牌。", "后位：可以加入更多同花连张和可玩的高张。", "不确定时，前位弱牌先弃。"]
                },
                visual: { type: "positionScale" },
                examples: { en: ["A9 offsuit UTG is often a fold. A9 suited on the button may be playable."], zh: ["UTG 的 A9 不同花通常可以弃。按钮位的 A9 同花可能可以玩。"] }
            }
        ]
    },
    {
        id: "hand-strength",
        icon: "cards",
        title: { en: "Hand Strength and Board Reading", zh: "手牌强弱与牌面理解" },
        description: { en: "Pairs, big cards, suited hands, connectors, top pair, overpair, draws, sets, and board changes.", zh: "对子、大牌、同花、连张、顶对、超对、听牌、暗三，以及牌面变化。" },
        steps: [
            {
                title: { en: "Strong starting hands", zh: "强起手牌" },
                overview: { en: "Before the flop, strong hands usually make strong pairs, strong top pairs, or strong draws. Big pairs and big suited cards are easiest for beginners.", zh: "翻前强牌通常能形成强对子、强顶对或强听牌。大对子和大同花高张对新手最友好。" },
                points: {
                    en: ["Pairs: AA, KK, QQ are premium.", "Big cards: AK, AQ, KQ can make strong top pair.", "Suited connectors: 98s can make straights and flushes but need care."],
                    zh: ["对子：AA、KK、QQ 是顶级起手牌。", "大牌：AK、AQ、KQ 容易形成强顶对。", "同花连张：98s 能成顺子或同花，但需要谨慎。"]
                },
                visual: { type: "cards", cards: ["As", "Ah", "Kc", "Qd", "9s", "8s"] },
                examples: { en: ["AA is strong before the flop because it already beats every other starting hand heads-up."], zh: ["AA 翻前很强，因为单挑时它领先所有其他起手牌。"] }
            },
            {
                title: { en: "Made hands vs draws", zh: "成牌和听牌" },
                overview: { en: "A made hand has value right now, like a pair or two pair. A draw is not complete yet, but can become strong if the right card arrives.", zh: "成牌是现在已经有牌力，例如一对或两对。听牌是还没成，但如果后面来对牌，就能变强。" },
                points: {
                    en: ["Top pair: you pair the highest card on board.", "Overpair: your pocket pair is higher than every board card.", "Flush draw: one more suit card can make a flush."],
                    zh: ["顶对：你配中了公共牌最大的一张。", "超对：你的口袋对子比所有公共牌都大。", "同花听牌：再来一张同花色牌就成同花。"]
                },
                visual: { type: "madeDraw" },
                examples: { en: ["A♥ Q♥ on K♥ 7♥ 2♣ is a flush draw, not a made flush yet."], zh: ["A♥ Q♥ 遇到 K♥ 7♥ 2♣ 是同花听牌，还不是同花成牌。"] }
            },
            {
                title: { en: "Board texture changes value", zh: "牌面结构会改变牌力" },
                overview: { en: "The same pair can be strong or fragile depending on the board. Dry boards have fewer draws. Wet boards connect with many hands.", zh: "同样的一对，在不同牌面上强弱不同。干燥牌面听牌少；湿润牌面更容易和很多手牌连接。" },
                points: {
                    en: ["K-7-2 rainbow is dry.", "J-T-9 two-tone is wet and dangerous.", "One pair is not always enough on wet boards."],
                    zh: ["K-7-2 彩虹面比较干燥。", "J-T-9 两同花很湿润也更危险。", "湿润牌面上一对不一定够强。"]
                },
                visual: { type: "boardTexture" },
                examples: { en: ["Top pair on K-7-2 is clearer than top pair on K-Q-J with two hearts."], zh: ["K-7-2 的顶对，比 K-Q-J 两红桃牌面上的顶对更清晰。"] }
            },
            {
                title: { en: "Beginner board-reading questions", zh: "新手读牌面问题" },
                overview: { en: "When the board appears, ask simple questions. What do I have now? What beats me? What cards help me? What story does the betting tell?", zh: "公共牌出现后，先问几个简单问题：我现在有什么？哪些牌赢我？哪些牌帮我？下注动作在讲什么故事？" },
                points: {
                    en: ["Name your hand clearly before acting.", "Separate made hands from draws.", "Do not overvalue one pair when action gets heavy."],
                    zh: ["行动前先清楚说出自己的牌型。", "区分成牌和听牌。", "行动很激烈时，不要高估一对。"]
                },
                visual: { type: "questions" },
                examples: { en: ["If you have top pair but face raise and re-raise, ask whether one pair is still good."], zh: ["如果你有顶对，却面对加注和再加注，要问一对是否还够好。"] }
            }
        ]
    },
    {
        id: "betting-logic",
        icon: "chips",
        title: { en: "Betting Logic and Beginner Mistakes", zh: "下注逻辑与新手常见错误" },
        description: { en: "Value, bluff, protection, pot odds, draws, and the leaks that cost beginners chips.", zh: "价值下注、诈唬、保护、底池赔率、听牌，以及新手最容易漏钱的地方。" },
        steps: [
            {
                title: { en: "Why people bet", zh: "为什么下注" },
                overview: { en: "A bet should have a job. You may bet because worse hands can call, better hands might fold, or you want to protect against future cards.", zh: "下注应该有任务。你可能为了让更差的牌跟注、让更好的牌弃掉，或为了防止后面的牌让对手反超。" },
                points: {
                    en: ["Value bet: worse hands can pay you.", "Bluff: better hands may fold.", "Protection: charge draws before they improve."],
                    zh: ["价值下注：更差的牌可能会付钱。", "诈唬：更好的牌可能会弃。", "保护：让听牌在变强前付出代价。"]
                },
                visual: { type: "betReasons" },
                examples: { en: ["With top pair on a draw-heavy board, betting can get value and charge draws."], zh: ["在听牌很多的牌面上，顶对下注既能拿价值，也能让听牌付费。"] }
            },
            {
                title: { en: "Do not call randomly", zh: "不要随便跟注" },
                overview: { en: "Calling feels safe, but random calls quietly drain your stack. Before calling, know what you beat, what can improve, and whether the price is fair.", zh: "跟注看起来安全，但随便跟会慢慢漏掉筹码。跟注前要知道你赢哪些牌、哪些牌能帮你、价格是否合理。" },
                points: {
                    en: ["Do not call just to see what happens.", "Fold hands with no pair, no draw, and no plan.", "A good fold is also a strong decision."],
                    zh: ["不要因为想看看结果就跟注。", "没对子、没听牌、没计划的牌要会弃。", "好的弃牌也是强决策。"]
                },
                visual: { type: "callChecklist" },
                examples: { en: ["Facing a big bet with bottom pair and no draw is usually a fold."], zh: ["拿底对且没听牌面对大下注，通常应该弃牌。"] }
            },
            {
                title: { en: "Pot odds in plain language", zh: "用简单话理解底池赔率" },
                overview: { en: "Pot odds ask: is the price of calling worth the prize I can win? You do not need perfect math at first. Start by noticing small calls into big pots are easier than big calls into small pots.", zh: "底池赔率在问：跟注的价格，值不值得争夺这个底池？一开始不需要精确数学，先记住：小跟注争大底池更容易接受，大跟注争小底池更危险。" },
                points: {
                    en: ["Calling 5 to win 50 is cheap.", "Calling 50 to win 20 is expensive.", "Draws need the price to make sense."],
                    zh: ["跟5去赢50，价格便宜。", "跟50去赢20，价格很贵。", "听牌需要价格合理才值得追。"]
                },
                visual: { type: "potOdds" },
                examples: { en: ["A flush draw likes cheap calls more than huge all-in calls."], zh: ["同花听牌更喜欢便宜跟注，而不是面对巨大全下盲目追。"] }
            },
            {
                title: { en: "Five beginner leaks", zh: "五个新手常见漏洞" },
                overview: { en: "Most beginner losses come from a few repeated habits. Fix these first before studying advanced strategy.", zh: "大多数新手亏损来自几个重复习惯。先修正这些，再学高级策略。" },
                points: {
                    en: ["Calling too much.", "Playing too many weak hands.", "Ignoring position.", "Chasing draws blindly.", "Overvaluing one pair."],
                    zh: ["跟注太多。", "玩太多弱牌。", "忽视位置。", "盲目追听牌。", "高估一对。"]
                },
                visual: { type: "leaks" },
                examples: { en: ["If your reason is only 'maybe they are bluffing,' slow down and ask for evidence."], zh: ["如果你的理由只是“也许对手在诈唬”，先停一下，问问证据在哪里。"] }
            }
        ]
    }
];

const DAILY_HANDS = [
    {
        heroCards: ["Ah", "Kh"],
        boardCards: ["Kd", "7c", "2s"],
        position: "BTN",
        street: "flop",
        situation: {
            en: "You raised preflop on the button. Big blind calls. On K♦ 7♣ 2♠, BB checks to you.",
            zh: "你在按钮位翻前加注，大盲跟注。翻牌 K♦ 7♣ 2♠，大盲过牌到你。"
        },
        options: [
            { id: "bet", en: "Bet for value", zh: "价值下注" },
            { id: "check", en: "Check back", zh: "随后过牌" },
            { id: "fold", en: "Fold", zh: "弃牌" }
        ],
        answer: "bet",
        explanation: {
            en: "Top pair with top kicker is strong on this dry board. A small value bet can be called by worse kings, sevens, and pocket pairs.",
            zh: "这个干燥牌面上，顶对顶踢脚很强。小额价值下注可以让更差的K、7或口袋对子跟注。"
        }
    },
    {
        heroCards: ["9h", "8h"],
        boardCards: ["Kh", "7h", "2c"],
        position: "CO",
        street: "flop",
        situation: {
            en: "You call preflop in the cutoff. The raiser bets small on K♥ 7♥ 2♣.",
            zh: "你在 CO 翻前跟注。原加注者在 K♥ 7♥ 2♣ 小额下注。"
        },
        options: [
            { id: "call", en: "Call with draw", zh: "带听牌跟注" },
            { id: "raise", en: "Always raise", zh: "总是加注" },
            { id: "fold", en: "Always fold", zh: "总是弃牌" }
        ],
        answer: "call",
        explanation: {
            en: "You do not have a made hand yet, but a flush draw can continue against a small bet when stacks are deep enough.",
            zh: "你还没有成牌，但面对小下注且有效筹码足够时，同花听牌可以继续。"
        }
    }
];

class StackSenseiApp {
    constructor() {
        this.language = localStorage.getItem(LANGUAGE_KEY) || "en";
        this.completedLessons = new Set(this.readJson(COMPLETED_KEY, []));
        this.selectedLessonId = LESSONS[0].id;
        this.lessonStepIndex = 0;
        this.quizByLesson = {};
        this.reviewLog = this.readJson(REVIEW_LOG_KEY, []);
        this.selectedReviewId = this.reviewLog[0]?.id || "";
        this.activeReviewFilter = "all";
        this.lastAnalysis = null;
        this.shareTarget = null;
        this.dailyState = this.getDailyState();
        this.dailyHand = this.fallbackDailyHand();
        this.practiceScenarios = this.localPracticeScenarios();
        this.practiceState = { scenarioId: this.practiceScenarios[0].id, stepIndex: 0, selectedAction: "", started: false, feedbackVisible: false, isComplete: false, apiFeedback: null };
        this.bindElements();
        this.renderCardSelectors();
        this.renderPositionOptions();
        this.bindEvents();
        this.applyLanguage();
        this.addMessage(this.learnMessages, "bot", this.t("learnWelcome"));
        this.addMessage(this.analyzeMessages, "bot", this.t("analyzeWelcome"));
        this.loadScenarioFromBackend();
        this.loadDailyHandFromBackend();
    }

    bindElements() {
        this.langButton = document.getElementById("lang-toggle-btn");
        this.langText = document.getElementById("lang-toggle-text");
        this.learnGrid = document.getElementById("learn-grid");
        this.navButtons = Array.from(document.querySelectorAll("[data-nav]"));
        this.sections = Array.from(document.querySelectorAll(".app-section"));
        this.learningCards = document.getElementById("learning-cards");
        this.lessonDetail = document.getElementById("lesson-detail");
        this.learnProgressCount = document.getElementById("learn-progress-count");
        this.learnProgressBar = document.getElementById("learn-progress-bar");
        this.dailyContent = document.getElementById("daily-hand-content");
        this.dailyStreak = document.getElementById("daily-streak");
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
        this.analysisActions = document.getElementById("analysis-actions");
        this.saveReviewButton = document.getElementById("save-review-btn");
        this.shareCurrentButton = document.getElementById("share-current-btn");
        this.scenarioSelect = document.getElementById("scenario-select");
        this.resetPracticeButton = document.getElementById("reset-practice-btn");
        this.startPracticeButton = document.getElementById("start-practice-btn");
        this.continuePracticeButton = document.getElementById("continue-practice-btn");
        this.askPracticeCoachButton = document.getElementById("ask-practice-coach-btn");
        this.practiceTable = document.getElementById("practice-table");
        this.practiceDifficulty = document.getElementById("practice-difficulty");
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
        this.reviewFilter = document.getElementById("review-filter");
        this.reviewList = document.getElementById("review-log-list");
        this.reviewDetail = document.getElementById("review-log-detail");
        this.exportLogButton = document.getElementById("export-log-btn");
        this.importLogButton = document.getElementById("import-log-btn");
        this.importLogFile = document.getElementById("import-log-file");
        this.clearLogButton = document.getElementById("clear-log-btn");
        this.shareModal = document.getElementById("share-modal");
        this.shareCard = document.getElementById("share-card");
        this.closeShareButton = document.getElementById("close-share-btn");
        this.downloadShareButton = document.getElementById("download-share-btn");
        this.copyShareButton = document.getElementById("copy-share-btn");
        this.shareStatus = document.getElementById("share-status");
    }

    bindEvents() {
        this.langButton.addEventListener("click", () => this.toggleLanguage());
        this.navButtons.forEach((button) => button.addEventListener("click", () => {
            if (button.classList.contains("brand-button")) {
                this.showHome();
                return;
            }
            if (button.dataset.nav === "learn") {
                this.enterLearn();
                return;
            }
            this.setSection(button.dataset.nav);
        }));
        document.querySelectorAll("[data-hero-action]").forEach((button) => button.addEventListener("click", () => this.handleHeroAction(button.dataset.heroAction)));
        this.learningCards.addEventListener("click", (event) => {
            const card = event.target.closest("[data-lesson-id]");
            if (card) this.selectLesson(card.dataset.lessonId);
        });
        this.lessonDetail.addEventListener("click", (event) => this.handleLessonClick(event));
        this.dailyContent.addEventListener("click", (event) => this.handleDailyClick(event));
        this.learnForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendChat("learn");
        });
        this.analyzeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!this.validateAnalyzeInputs(true)) return;
            this.sendChat("analyze");
        });
        this.updateButton.addEventListener("click", () => {
            this.syncCardsFromSelectors();
            if (!this.validateAnalyzeInputs(true)) return;
            this.statePill.textContent = this.t("handLoaded");
            this.setSection("analyze");
        });
        this.holeSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        this.boardSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        [this.position, this.players, this.chips, this.pot, this.actionHistory].forEach((input) => input.addEventListener("input", () => this.updateAnalyzeTable(true)));
        this.scenarioSelect.addEventListener("change", () => this.setPracticeScenario(this.scenarioSelect.value));
        this.resetPracticeButton.addEventListener("click", () => this.resetPractice());
        this.startPracticeButton.addEventListener("click", () => this.startPractice());
        this.continuePracticeButton.addEventListener("click", () => this.continuePractice());
        this.askPracticeCoachButton.addEventListener("click", () => this.askPracticeCoach());
        this.practiceActions.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (button) this.handlePracticeAction(button.dataset.action, button);
        });
        this.saveReviewButton.addEventListener("click", () => this.saveCurrentAnalysis());
        this.shareCurrentButton.addEventListener("click", () => this.openShare(this.lastAnalysis));
        this.reviewFilter.addEventListener("change", () => {
            this.activeReviewFilter = this.reviewFilter.value;
            this.renderReviewLog();
        });
        this.reviewList.addEventListener("click", (event) => {
            const item = event.target.closest("[data-review-id]");
            if (item) {
                this.selectedReviewId = item.dataset.reviewId;
                this.renderReviewLog();
            }
        });
        this.reviewDetail.addEventListener("click", (event) => this.handleReviewDetailClick(event));
        this.reviewDetail.addEventListener("input", (event) => {
            if (event.target.id === "review-notes") this.updateReviewNotes(event.target.value);
        });
        this.exportLogButton.addEventListener("click", () => this.exportReviewLog());
        this.importLogButton.addEventListener("click", () => this.importLogFile.click());
        this.importLogFile.addEventListener("change", (event) => this.importReviewLog(event));
        this.clearLogButton.addEventListener("click", () => this.clearReviewLog());
        this.closeShareButton.addEventListener("click", () => this.closeShare());
        this.downloadShareButton.addEventListener("click", () => this.downloadShareImage());
        this.copyShareButton.addEventListener("click", () => this.copyShareImage());
    }

    handleHeroAction(action) {
        if (action === "start") {
            this.enterLearn();
        }
        if (action === "daily") {
            this.dailyContent.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "center" });
        }
        if (action === "practice") {
            this.setSection("practice");
        }
        if (action === "review") {
            this.setSection("analyze");
            this.analyzeInput.focus();
        }
    }

    applyLanguage() {
        const copy = COPY[this.language];
        document.documentElement.lang = copy.htmlLang;
        this.langText.textContent = "中 / ENG";
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
        this.renderDailyHand();
        this.renderPrompts(this.learnPrompts, copy.learnPrompts, "learn");
        this.renderPrompts(this.analyzePrompts, copy.analyzePrompts, "analyze");
        this.updateCardSelectorCopy();
        this.renderPositionOptions();
        this.renderPracticeScenarioOptions();
        this.renderPractice();
        this.updateAnalyzeTable();
        this.renderReviewLog();
        if (this.statePill) this.statePill.textContent = this.t("ready");
        this.updateHomeLanding();
    }

    toggleLanguage() {
        this.language = this.language === "en" ? "zh" : "en";
        localStorage.setItem(LANGUAGE_KEY, this.language);
        this.applyLanguage();
        this.loadDailyHandFromBackend();
    }

    setSection(section) {
        this.sections.forEach((el) => el.classList.toggle("active", el.dataset.section === section));
        this.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.nav === section));
        this.updateHomeLanding();
    }

    enterLearn() {
        this.learnGrid?.classList.remove("home-only");
        this.setSection("learn");
        this.selectLesson(this.selectedLessonId || LESSONS[0].id);
        this.lessonDetail.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "start" });
    }

    showHome() {
        this.learnGrid?.classList.add("home-only");
        this.setSection("learn");
        window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? "auto" : "smooth" });
    }

    updateHomeLanding() {
        const isHome = this.learnGrid?.classList.contains("home-only") && document.getElementById("learn-section")?.classList.contains("active");
        document.body.classList.toggle("home-landing", Boolean(isHome));
    }

    t(key) {
        return COPY[this.language][key] ?? key;
    }

    renderLearningCards() {
        this.learningCards.innerHTML = LESSONS.map((lesson) => {
            const selected = lesson.id === this.selectedLessonId ? "selected" : "";
            const completed = this.completedLessons.has(lesson.id) ? "completed" : "";
            return `
                <button class="learn-card ${selected} ${completed}" type="button" data-lesson-id="${lesson.id}">
                    <span class="learn-card-icon icon-${lesson.icon}" aria-hidden="true"></span>
                    <span>
                        <h3>${this.text(lesson.title)}</h3>
                        <p>${this.text(lesson.description)}</p>
                    </span>
                    <span class="complete-check">✓</span>
                </button>
            `;
        }).join("");
    }

    selectLesson(lessonId) {
        this.selectedLessonId = lessonId;
        this.lessonStepIndex = 0;
        this.renderLearningCards();
        this.renderLessonDetail(true);
        this.loadQuiz(lessonId);
    }

    currentLesson() {
        return LESSONS.find((lesson) => lesson.id === this.selectedLessonId) || LESSONS[0];
    }

    renderLessonDetail(animate = false) {
        const lesson = this.currentLesson();
        const step = lesson.steps[this.lessonStepIndex];
        const quiz = this.quizByLesson[lesson.id];
        this.lessonDetail.innerHTML = `
            <div class="lesson-heading">
                <div>
                    <p class="section-kicker">${this.text(lesson.title)}</p>
                    <h2>${this.text(step.title)}</h2>
                </div>
                <span class="lesson-step-pill">${this.t("step")} ${this.lessonStepIndex + 1} / ${lesson.steps.length}</span>
            </div>
            <div class="lesson-body-grid">
                <div class="lesson-main-copy">
                    <h3>${this.t("overview")}</h3>
                    <p>${this.text(step.overview)}</p>
                    <h3>${this.t("keyPoints")}</h3>
                    <ul class="lesson-bullets">${step.points[this.language].map((point) => `<li>${point}</li>`).join("")}</ul>
                    <h3>${this.t("examples")}</h3>
                    <div class="concept-card">${step.examples[this.language].map((item) => `<p>${item}</p>`).join("")}</div>
                </div>
                <div class="lesson-visual-rich">${this.renderLessonVisual(step.visual)}</div>
            </div>
            <section class="quiz-box">
                <div class="quiz-head">
                    <div>
                        <p class="section-kicker">${this.t("quickCheck")}</p>
                        <h3>${quiz?.question ? this.escapeHtml(quiz.question) : this.t("loadingQuiz")}</h3>
                    </div>
                    <button class="ghost-icon-button" type="button" data-lesson-action="newQuiz">↻</button>
                </div>
                ${this.renderQuiz(lesson, quiz)}
            </section>
            <div class="lesson-actions">
                <button class="lesson-nav-button" type="button" data-lesson-action="prev" ${this.lessonStepIndex === 0 ? "disabled" : ""}>${this.t("previous")}</button>
                <button class="lesson-nav-button" type="button" data-lesson-action="next" ${this.lessonStepIndex === lesson.steps.length - 1 ? "disabled" : ""}>${this.t("next")}</button>
                <button class="ghost-button" type="button" data-lesson-action="ask">${this.t("askCoach")}</button>
                <button class="primary-button" type="button" data-lesson-action="complete">${this.t("markComplete")}</button>
            </div>
        `;
        if (animate) {
            this.lessonDetail.classList.remove("entering");
            void this.lessonDetail.offsetWidth;
            this.lessonDetail.classList.add("entering");
        }
        if (!quiz) this.loadQuiz(lesson.id);
    }

    renderQuiz(lesson, quiz) {
        if (!quiz) return `<p class="quiz-feedback">${this.t("loadingQuiz")}</p>`;
        const answered = quiz.selected;
        return `
            <p class="quiz-choose">${this.t("quizChoose")}</p>
            <div class="quiz-options">
                ${quiz.options.map((option) => {
                    const state = answered === option ? (option === quiz.correctAnswer ? "correct" : "wrong") : "";
                    return `<button class="quiz-option ${state}" type="button" data-quiz-answer="${this.escapeAttr(option)}">${this.escapeHtml(option)}</button>`;
                }).join("")}
            </div>
            <p class="quiz-feedback">${answered ? this.escapeHtml(quiz.explanation) : ""}</p>
        `;
    }

    renderLessonVisual(visual) {
        if (visual.type === "timeline") {
            return `<div class="lesson-timeline">${visual.items.map((item, index) => `<span>${index + 1}<strong>${item}</strong></span>`).join("")}</div>`;
        }
        if (visual.type === "seats") return this.renderSeatDiagram();
        if (visual.type === "seatStrip") return `<div class="seat-strip">${POSITIONS.map((pos) => `<span>${pos}</span>`).join("")}</div><p class="visual-caption">${this.language === "zh" ? "从前位到后位，信息逐渐增加。" : "Information increases from early to late position."}</p>`;
        if (visual.type === "turnOrder") return `<div class="turn-order"><span>Preflop: UTG → HJ → CO → BTN → SB → BB</span><span>Postflop: SB/BB side → ... → BTN</span></div>`;
        if (visual.type === "positionScale") return `<div class="position-scale"><span>UTG</span><span>HJ</span><span>CO</span><span>BTN</span></div>`;
        if (visual.type === "cards") return `<div class="lesson-card-row">${visual.cards.map((card) => this.cardMarkup(card)).join("")}</div>`;
        if (visual.type === "madeDraw") return `<div class="mini-comparison"><div><strong>Made</strong>${this.cardMarkup("Kh")}${this.cardMarkup("Kc")}</div><div><strong>Draw</strong>${this.cardMarkup("Ah")}${this.cardMarkup("Qh")}</div></div>`;
        if (visual.type === "boardTexture") return `<div class="mini-comparison wide"><div><strong>Dry</strong>${["Ks", "7d", "2c"].map((c) => this.cardMarkup(c)).join("")}</div><div><strong>Wet</strong>${["Jh", "Th", "9s"].map((c) => this.cardMarkup(c)).join("")}</div></div>`;
        if (visual.type === "questions") return `<div class="question-stack"><span>What do I have?</span><span>What beats me?</span><span>What helps me?</span><span>What does betting say?</span></div>`;
        if (visual.type === "betReasons") return `<div class="reason-triad"><span>Value</span><span>Bluff</span><span>Protection</span></div>`;
        if (visual.type === "callChecklist") return `<div class="question-stack"><span>What do I beat?</span><span>What improves me?</span><span>Is the price fair?</span></div>`;
        if (visual.type === "potOdds") return `<div class="pot-odds-visual"><span>Call 5</span><strong>Win 50</strong></div>`;
        if (visual.type === "leaks") return `<div class="leak-tags"><span>Too many calls</span><span>Weak hands</span><span>No position plan</span><span>Chasing</span><span>One-pair ego</span></div>`;
        if (visual.type === "actions") return `<div class="action-flow">${["Fold", "Check", "Call", "Bet", "Raise"].map((a) => `<span>${a}</span>`).join("")}</div>`;
        return "";
    }

    renderSeatDiagram() {
        return `
            <div class="position-table-diagram">
                ${POSITIONS.map((pos) => `<span class="diagram-seat diagram-${pos.toLowerCase()}">${pos}<small>${this.positionHint(pos)}</small></span>`).join("")}
                <strong>6-max</strong>
            </div>
        `;
    }

    positionHint(pos) {
        const hints = {
            en: { UTG: "early", HJ: "middle", CO: "late", BTN: "button", SB: "blind", BB: "blind" },
            zh: { UTG: "前位", HJ: "中位", CO: "后位", BTN: "按钮", SB: "小盲", BB: "大盲" }
        };
        return hints[this.language][pos];
    }

    handleLessonClick(event) {
        const actionButton = event.target.closest("[data-lesson-action]");
        const quizButton = event.target.closest("[data-quiz-answer]");
        if (actionButton) {
            const action = actionButton.dataset.lessonAction;
            const lesson = this.currentLesson();
            if (action === "prev") this.lessonStepIndex = Math.max(0, this.lessonStepIndex - 1);
            if (action === "next") this.lessonStepIndex = Math.min(lesson.steps.length - 1, this.lessonStepIndex + 1);
            if (action === "complete") this.markLessonComplete(lesson.id);
            if (action === "ask") this.askLessonCoach(lesson);
            if (action === "newQuiz") this.loadQuiz(lesson.id, true);
            if (!["ask", "newQuiz"].includes(action)) this.renderLessonDetail(true);
        }
        if (quizButton) this.answerQuiz(quizButton.dataset.quizAnswer);
    }

    async loadQuiz(lessonId, forceRender = false) {
        const lesson = LESSONS.find((item) => item.id === lessonId);
        this.quizByLesson[lessonId] = null;
        if (forceRender) this.renderLessonDetail();
        try {
            const moduleId = this.backendModuleId(lessonId);
            const response = await fetch(`${API_BASE_URL}/api/learn/quiz?module=${encodeURIComponent(moduleId)}&lang=${encodeURIComponent(this.language)}`);
            if (!response.ok) throw new Error("quiz");
            const data = await response.json();
            this.quizByLesson[lessonId] = this.normalizeQuiz(data, lessonId);
        } catch (error) {
            this.quizByLesson[lessonId] = this.localQuiz(lessonId);
        }
        if (lessonId === this.selectedLessonId) this.renderLessonDetail();
    }

    backendModuleId(lessonId) {
        const map = {
            "how-a-hand-works": "how_hand_works",
            "position-actions": "positions_and_turn_order",
            "hand-strength": "hand_strength_and_board_reading",
            "betting-logic": "betting_logic_and_beginner_mistakes"
        };
        return map[lessonId] || lessonId;
    }

    normalizeQuiz(data, lessonId) {
        if (Array.isArray(data.options) && data.options[0]?.text) {
            const correct = data.options.find((option) => option.id === data.correctOptionId);
            return {
                lessonId,
                question: data.question,
                options: data.options.map((option) => option.text),
                correctAnswer: correct?.text || data.options[0].text,
                explanation: data.explanation,
                selected: ""
            };
        }
        return { ...data, selected: "", lessonId };
    }

    localQuiz(lessonId) {
        const bank = {
            "how-a-hand-works": { question: this.language === "zh" ? "翻牌一次发几张公共牌？" : "How many cards come on the flop?", options: this.language === "zh" ? ["1张", "3张", "5张"] : ["1", "3", "5"], correctAnswer: this.language === "zh" ? "3张" : "3", explanation: this.language === "zh" ? "翻牌会一次发三张公共牌。" : "The flop reveals three community cards." },
            "position-actions": { question: this.language === "zh" ? "翻后通常哪个位置最有信息优势？" : "Which position usually has the most information postflop?", options: ["UTG", "BTN", "SB"], correctAnswer: "BTN", explanation: this.language === "zh" ? "按钮位翻后通常最后行动。" : "The button usually acts last postflop." },
            "hand-strength": { question: this.language === "zh" ? "同花听牌是什么意思？" : "What is a flush draw?", options: this.language === "zh" ? ["已经成同花", "差一张同花", "必须弃牌"] : ["Already a flush", "One suit card away", "Must fold"], correctAnswer: this.language === "zh" ? "差一张同花" : "One suit card away", explanation: this.language === "zh" ? "听牌还没成，但有机会变强。" : "A draw is not made yet, but can improve." },
            "betting-logic": { question: this.language === "zh" ? "糟糕的跟注理由是什么？" : "Which is a bad reason to call?", options: this.language === "zh" ? ["我有好价格", "我只是好奇", "我能赢诈唬"] : ["Good price", "I am curious", "I beat bluffs"], correctAnswer: this.language === "zh" ? "我只是好奇" : "I am curious", explanation: this.language === "zh" ? "好奇不是牌局计划。" : "Curiosity is not a poker plan." }
        };
        return { ...bank[lessonId], selected: "", lessonId };
    }

    answerQuiz(answer) {
        const quiz = this.quizByLesson[this.selectedLessonId];
        if (!quiz) return;
        quiz.selected = answer;
        this.renderLessonDetail();
    }

    markLessonComplete(lessonId) {
        this.completedLessons.add(lessonId);
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(Array.from(this.completedLessons)));
        this.renderLearningCards();
        this.renderLearnProgress();
    }

    renderLearnProgress() {
        const done = this.completedLessons.size;
        this.learnProgressCount.textContent = `${done} / ${LESSONS.length}`;
        this.learnProgressBar.style.width = `${Math.round((done / LESSONS.length) * 100)}%`;
    }

    askLessonCoach(lesson) {
        this.learnInput.value = `${this.t("learnCoachPrompt")} ${this.text(lesson.title)}`;
        this.learnInput.focus();
    }

    getDailyState() {
        const today = new Date().toISOString().slice(0, 10);
        const saved = this.readJson(DAILY_PROGRESS_KEY, null);
        const migrated = saved || this.migrateOldDailyState(today);
        const state = {
            lastCompletedDate: migrated?.lastCompletedDate || "",
            streak: Number(migrated?.streak || 0),
            history: migrated?.history && typeof migrated.history === "object" ? migrated.history : {}
        };
        localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(state));
        return state;
    }

    migrateOldDailyState(today) {
        const oldState = this.readJson(DAILY_KEY, null);
        if (!oldState?.date || !oldState.revealed) return null;
        const oldHand = DAILY_HANDS[oldState.index] || DAILY_HANDS[0];
        return {
            lastCompletedDate: oldState.date,
            streak: Number(localStorage.getItem(DAILY_STREAK_KEY) || (oldState.date === today ? 1 : 0)),
            history: {
                [oldState.date]: {
                    handId: oldHand.handId || `local-${oldState.index || 0}`,
                    selectedAction: oldState.selected,
                    recommendedAction: oldHand.answer,
                    isCorrect: oldState.selected === oldHand.answer,
                    completedAt: new Date().toISOString()
                }
            }
        };
    }

    persistDailyProgress() {
        localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(this.dailyState));
    }

    fallbackDailyHand() {
        const index = Math.floor(Date.now() / 86400000) % DAILY_HANDS.length;
        const hand = DAILY_HANDS[index];
        return {
            handId: `local-${index}`,
            date: new Date().toISOString().slice(0, 10),
            title: this.language === "zh" ? "每日一手" : "Daily Hand",
            street: hand.street,
            heroPosition: hand.position,
            heroCards: hand.heroCards.join(" "),
            boardCards: hand.boardCards.join(" "),
            pot: 0,
            stack: 100,
            actionHistory: this.text(hand.situation),
            question: this.language === "zh" ? "你会怎么做？" : "What should you do?",
            options: hand.options.map((option) => ({ id: option.id, label: option[this.language] })),
            recommendedAction: hand.answer,
            explanation: this.text(hand.explanation),
            beginnerTip: this.language === "zh" ? "把位置、牌力和下注理由连起来思考。" : "Connect position, hand strength, and betting purpose.",
            tags: ["daily"]
        };
    }

    async loadDailyHandFromBackend() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/daily-hand?lang=${encodeURIComponent(this.language)}`);
            if (!response.ok) throw new Error("daily");
            this.dailyHand = this.normalizeDailyHand(await response.json());
        } catch (error) {
            this.dailyHand = this.fallbackDailyHand();
        }
        this.renderDailyHand();
    }

    normalizeDailyHand(data) {
        return {
            handId: data.handId || data.id || `daily-${data.date || Date.now()}`,
            date: data.date || new Date().toISOString().slice(0, 10),
            title: data.title || (this.language === "zh" ? "每日一手" : "Daily Hand"),
            street: data.street || "preflop",
            heroPosition: data.heroPosition || data.position || "BTN",
            heroCards: Array.isArray(data.heroCards) ? data.heroCards.join(" ") : (data.heroCards || ""),
            boardCards: Array.isArray(data.boardCards) ? data.boardCards.join(" ") : (data.boardCards || ""),
            pot: data.pot ?? 0,
            stack: data.stack ?? 100,
            actionHistory: data.actionHistory || data.situation || "",
            question: data.question || (this.language === "zh" ? "你会怎么做？" : "What should you do?"),
            options: (data.options || []).map((option) => ({ id: option.id, label: option.label || option.text || option[this.language] || option.id })),
            recommendedAction: data.recommendedAction || data.answer || "",
            explanation: data.explanation || "",
            beginnerTip: data.beginnerTip || "",
            tags: data.tags || ["daily"]
        };
    }

    renderDailyHand() {
        const hand = this.dailyHand || this.fallbackDailyHand();
        const date = hand.date || new Date().toISOString().slice(0, 10);
        const completed = this.dailyState.history?.[date];
        const selected = completed?.selectedAction || this.dailyState.pendingSelection || "";
        this.dailyStreak.textContent = `${this.dailyState.streak || 0} ${this.t("streak")}`;
        this.dailyContent.innerHTML = `
            <p class="daily-date">${this.escapeHtml(date)}</p>
            <p class="daily-situation">${this.escapeHtml(hand.actionHistory || hand.question)}</p>
            <div class="daily-card-row">${this.splitCards(hand.heroCards).map((card) => this.cardMarkup(card)).join("")}<span class="daily-board">${this.splitCards(hand.boardCards).map((card) => this.cardMarkup(card)).join("")}</span></div>
            <div class="practice-meta">
                <span class="meta-pill">${hand.heroPosition}</span>
                <span class="meta-pill">${this.streetLabel(hand.street)}</span>
                <span class="meta-pill">${this.t("pot")}: ${hand.pot || 0}</span>
            </div>
            <p class="quiz-choose">${this.escapeHtml(hand.question)}</p>
            <div class="daily-options">${hand.options.map((option) => `<button class="quiz-option ${selected === option.id ? "selected-option" : ""}" type="button" data-daily-option="${option.id}" ${completed ? "disabled" : ""}>${this.escapeHtml(option.label)}</button>`).join("")}</div>
            <button class="primary-button full-width" type="button" data-daily-submit ${completed ? "disabled" : ""}>${completed ? this.t("complete") : this.t("dailySubmit")}</button>
            ${completed ? `<div class="feedback-card ${completed.isCorrect ? "good" : "warn"}">${this.escapeHtml(hand.explanation)}${hand.beginnerTip ? `<p>${this.escapeHtml(hand.beginnerTip)}</p>` : ""}</div>` : ""}
        `;
    }

    handleDailyClick(event) {
        const hand = this.dailyHand || this.fallbackDailyHand();
        const date = hand.date || new Date().toISOString().slice(0, 10);
        if (this.dailyState.history?.[date]) return;
        const option = event.target.closest("[data-daily-option]");
        if (option) {
            this.dailyState.pendingSelection = option.dataset.dailyOption;
            this.persistDailyProgress();
            this.renderDailyHand();
        }
        if (event.target.closest("[data-daily-submit]")) {
            const selected = this.dailyState.pendingSelection;
            if (!selected) return;
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            const isCorrect = selected === hand.recommendedAction;
            this.dailyState.streak = this.dailyState.lastCompletedDate === yesterday ? (this.dailyState.streak || 0) + 1 : 1;
            this.dailyState.lastCompletedDate = date;
            this.dailyState.history = {
                ...(this.dailyState.history || {}),
                [date]: {
                    handId: hand.handId,
                    selectedAction: selected,
                    recommendedAction: hand.recommendedAction,
                    isCorrect,
                    completedAt: new Date().toISOString()
                }
            };
            delete this.dailyState.pendingSelection;
            this.persistDailyProgress();
            this.renderDailyHand();
        }
    }

    renderCardSelectors() {
        CARD_SLOTS.forEach((slot) => {
            const wrapper = document.createElement("div");
            wrapper.className = "card-selector";
            wrapper.dataset.slot = slot.id;
            wrapper.innerHTML = `
                <span class="card-selector-label" data-card-label="${slot.id}"></span>
                <div class="card-picker-row">
                    <select class="card-rank" data-slot="${slot.id}"></select>
                    <select class="card-suit" data-slot="${slot.id}"></select>
                </div>
                <span class="card-selected-preview" data-card-preview="${slot.id}">--</span>
            `;
            (slot.group === "hole" ? this.holeSelectorRoot : this.boardSelectorRoot).appendChild(wrapper);
        });
        this.updateCardSelectorCopy();
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
        document.querySelectorAll(".card-selector").forEach((el) => {
            const card = this.cardFromSlot(el.dataset.slot);
            el.classList.toggle("has-card", Boolean(card));
            const preview = el.querySelector("[data-card-preview]");
            if (preview) {
                preview.textContent = card ? this.cardText(card) : "--";
                preview.classList.toggle("red", Boolean(card && this.isRedCard(card)));
            }
        });
        this.validateDuplicateCards();
        this.updateAnalyzeTable(true);
    }

    validateDuplicateCards() {
        const cards = [...this.handCards.value.split(/\s+/), ...this.communityCards.value.split(/\s+/)].filter(Boolean);
        const duplicate = cards.some((card, index) => cards.indexOf(card) !== index);
        this.cardWarning.textContent = duplicate ? this.t("duplicateWarning") : "";
        this.updateButton.disabled = duplicate;
        return !duplicate;
    }

    validateAnalyzeInputs(showAlert = false) {
        this.syncCardsFromSelectors();
        const missing = [];
        const heroCards = this.handCards.value.split(/\s+/).filter(Boolean);
        const boardCards = this.communityCards.value.split(/\s+/).filter(Boolean);
        if (heroCards.length < 2) missing.push(this.t("missingHeroCards"));
        if (!this.position.value || this.position.value === "unknown") missing.push(this.t("missingPosition"));
        if (!(Number.parseFloat(this.pot.value) > 0)) missing.push(this.t("missingPot"));
        if (!this.actionHistory.value.trim()) missing.push(this.t("missingActionHistory"));
        if (![0, 3, 4, 5].includes(boardCards.length)) missing.push(this.t("incompleteBoard"));
        if (!this.validateDuplicateCards()) missing.push(this.t("duplicateWarning"));
        if (missing.length && showAlert) window.alert(`${this.t("incompleteHandTitle")}\n\n${missing.map((line) => `- ${line}`).join("\n")}`);
        return missing.length === 0;
    }

    renderPositionOptions() {
        this.position.innerHTML = ["unknown", ...POSITIONS].map((position) => `<option value="${position}">${COPY[this.language].positions[position]}</option>`).join("");
    }

    renderPrompts(root, prompts, mode) {
        root.innerHTML = prompts.map((prompt) => `<button class="quick-prompt" type="button">${prompt}</button>`).join("");
        root.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                const input = mode === "learn" ? this.learnInput : this.analyzeInput;
                input.value = button.textContent;
                input.focus();
            });
        });
    }

    localPracticeScenarios() {
        const makeStep = (packId, handId, title, street, heroPosition, heroCards, boardCards, pot, actionHistory, prompt, availableActions, recommendedAction, coachExplanation, beginnerTip, tags = []) => ({
            handId,
            packId,
            title: { en: title, zh: title },
            street,
            heroPosition,
            heroCards: this.splitCards(heroCards),
            boardCards: this.splitCards(boardCards),
            pot,
            stack: 100,
            players: street === "preflop" ? 6 : 2,
            actionHistory,
            summaryText: { en: prompt, zh: prompt },
            availableActions: availableActions.map((action) => typeof action === "string" ? { id: action, label: COPY.en.actions[action] || action } : action),
            recommendedAction,
            coachTip: { en: beginnerTip, zh: beginnerTip },
            coachExplanation: { en: coachExplanation, zh: coachExplanation },
            feedbackByAction: {},
            nextNarration: { en: coachExplanation, zh: coachExplanation },
            tags
        });
        const pack = (id, title, summary, steps) => ({
            id,
            title: { en: title, zh: title },
            difficulty: { en: "Beginner", zh: "新手" },
            finalSummary: {
                en: { good: title + " complete. You played " + steps.length + " hands with clear beginner logic.", tip: "Restart this pack or move to Analyze when you want a deeper review." },
                zh: { good: title + " complete. You played " + steps.length + " hands with clear beginner logic.", tip: "Restart this pack or move to Analyze when you want a deeper review." }
            },
            steps
        });
        return [
            pack("preflop_basics", "Preflop Basics", "Open, fold, defend, and handle pressure before the flop.", [
                makeStep("preflop_basics", "preflop_001", "BTN AKo Open Raise", "preflop", "BTN", "As Kh", "", 1.5, "UTG folds, HJ folds, CO folds. Action is on Hero.", "You are on the button with AKo. Everyone folds to you. What should you do?", [{ id: "fold", label: "Fold" }, { id: "call", label: "Call" }, { id: "raise", label: "Raise to 2.5BB" }], "raise", "AKo is a premium hand and BTN is the best position. Raising builds value and pressures the blinds.", "Strong hands in late position usually want to raise first in.", ["preflop", "position", "open-raise"]),
                makeStep("preflop_basics", "preflop_002", "Weak UTG Fold", "preflop", "UTG", "9d 4c", "", 1.5, "You are first to act at a 6-max table.", "You have 9d 4c UTG. What is the disciplined beginner play?", ["fold", "call", "raise"], "fold", "Weak disconnected offsuit hands lose money from early position because five players still act behind you.", "Early position needs tighter starting hands.", ["preflop", "discipline", "early-position"]),
                makeStep("preflop_basics", "preflop_003", "CO Suited Connector", "preflop", "CO", "9s 8s", "", 1.5, "UTG folds, HJ folds. Action is on Hero in the cutoff.", "You hold 9s 8s in CO. What should you do first in?", ["fold", "call", "raise"], "raise", "A suited connector in late position can open because it has playability and can win the blinds.", "Playable hands become better when fewer players remain behind.", ["preflop", "position", "suited-connector"]),
                makeStep("preflop_basics", "preflop_004", "Big Blind Defend", "preflop", "BB", "Kc Tc", "", 5.5, "BTN raises to 2.5BB. SB folds. Action is on Hero in BB.", "You have Kc Tc in the big blind against a button open. What now?", ["fold", "call", "raise"], "call", "KTs is playable against a wide button range and you already have one blind invested.", "Defend playable suited broadways, but avoid forcing huge pots out of position.", ["preflop", "big-blind", "defend"]),
                makeStep("preflop_basics", "preflop_005", "Marginal Hand Facing 3-Bet", "preflop", "CO", "Ad 9c", "", 10.5, "Hero opens CO to 2.5BB. BTN 3-bets to 8BB. Blinds fold.", "You opened A9o and face a button 3-bet. What is best for a beginner?", ["fold", "call", "raise"], "fold", "A9 offsuit is dominated by many 3-bet hands and plays poorly under pressure.", "Do not feel married to a loose open when pressure arrives.", ["preflop", "3-bet", "fold-discipline"])
            ]),
            pack("flop_decisions", "Flop Decisions", "Practice value, missed boards, draws, and pot control.", [
                makeStep("flop_decisions", "flop_001", "Top Pair Value Bet", "flop", "BTN", "Ah Kh", "Kd 7c 2s", 6.5, "Hero raised BTN, BB called, and BB checks the flop.", "You have top pair top kicker on a dry board. What should you do?", ["check", "bet"], "bet", "Top pair top kicker can get called by worse kings, sevens, and pocket pairs.", "When worse hands can call, value bet.", ["flop", "top-pair", "value-bet"]),
                makeStep("flop_decisions", "flop_002", "Missed Flop Check/Fold", "flop", "BB", "Ah Jd", "8s 6s 2c", 5.5, "BTN raised preflop, Hero called BB. Hero checks, BTN bets half pot.", "You missed the flop with no pair and no strong draw. What now?", ["fold", "call", "raise"], "fold", "With no pair, no strong draw, and poor position, continuing is usually a curiosity call.", "Fold when you have no clear way to improve or win.", ["flop", "missed-board", "fold"]),
                makeStep("flop_decisions", "flop_003", "Flush Draw Semi-Bluff", "flop", "BTN", "As 5s", "Ks 8s 2d", 6.5, "Hero opened BTN, BB called, BB checks.", "You have the nut flush draw. What is a good beginner action?", ["check", "bet"], "bet", "Betting can win now when BB folds and can still improve to the nut flush later.", "Strong draws can bet as semi-bluffs.", ["flop", "draw", "semi-bluff"]),
                makeStep("flop_decisions", "flop_004", "Open-Ended Straight Draw", "flop", "CO", "9d 8c", "7s 6h 2d", 7, "Hero called preflop in CO. The raiser bets small on the flop.", "You have an open-ended straight draw facing a small bet. What now?", ["fold", "call", "raise"], "call", "A 5 or T can make a straight, and the small bet gives a reasonable price.", "Draws care about price. Small bets are easier to call than large bets.", ["flop", "straight-draw", "pot-odds"]),
                makeStep("flop_decisions", "flop_005", "Middle Pair Pot Control", "flop", "BTN", "Qh 8h", "Ks 8d 3c", 6.5, "Hero opened BTN, BB called, BB checks.", "You have middle pair on a dry K-high board. What is the calmer play?", ["check", "bet"], "check", "Middle pair has some showdown value but does not love building a big pot.", "Medium hands often prefer pot control.", ["flop", "middle-pair", "pot-control"])
            ]),
            pack("turn_river_decisions", "Turn / River Decisions", "Practice later street discipline and value.", [
                makeStep("turn_river_decisions", "turnriver_001", "Value Bet Turn", "turn", "BTN", "Ad Qh", "Qs 7d 3c 2s", 14, "Hero bet flop with top pair and BB called. BB checks turn.", "The turn is a blank and you still have top pair ace kicker. What now?", ["check", "bet"], "bet", "Worse queens and draws can still call, so a second value bet is reasonable.", "Keep betting when worse hands can continue.", ["turn", "value-bet", "top-pair"]),
                makeStep("turn_river_decisions", "turnriver_002", "Scary Turn Control", "turn", "CO", "Kc Qc", "Kh Jh 4s Ah", 18, "Hero bet flop and got called. The turn is an ace and opponent checks.", "The ace is scary for one pair. What is a prudent beginner option?", ["check", "bet"], "check", "The ace improves many calling hands and your one pair no longer wants a large pot.", "Scary cards are a reason to slow down with medium strength.", ["turn", "pot-control", "scare-card"]),
                makeStep("turn_river_decisions", "turnriver_003", "River Bluff Catcher", "river", "BB", "Qd Jd", "Qs 8c 4h 2s 2d", 24, "BTN bet flop, checked turn, and bets small on river.", "You have top pair against a small river bet after turn checked through. What now?", ["fold", "call", "raise"], "call", "Top pair can bluff-catch versus a small bet after the opponent showed weakness on the turn.", "Call more comfortably when the price is small and your hand beats bluffs.", ["river", "bluff-catcher", "call"]),
                makeStep("turn_river_decisions", "turnriver_004", "Facing Large River Bet", "river", "BB", "Kc Qd", "Kh 9d 4s 2c Ac", 30, "Hero called flop and turn. River is an ace. Opponent bets pot.", "You have one pair facing a pot-sized river bet on a scary ace. What now?", ["fold", "call", "raise"], "fold", "A large river bet on a scary card is often strong. One pair needs a clear read to call.", "Big river calls need strong reasons, not curiosity.", ["river", "fold-discipline", "one-pair"]),
                makeStep("turn_river_decisions", "turnriver_005", "Missed Draw Give Up", "river", "BTN", "As 5s", "Ks 8s 2d 4c 9h", 20, "Hero bet flop with nut flush draw, checked turn, and BB checks river.", "Your flush draw missed on the river. What is best for a beginner?", ["check", "bet"], "check", "When a draw misses and the opponent can still have pairs, giving up is often best for beginners.", "You do not need to bluff every missed draw.", ["river", "missed-draw", "give-up"])
            ])
        ];
    }

    async loadScenarioFromBackend() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/practice/scenario?difficulty=beginner&street=random&language=${this.language}`);
            if (!response.ok) return;
            const data = await response.json();
            const scenario = this.scenarioFromApi(data);
            this.practiceScenarios = [scenario, ...this.practiceScenarios.filter((item) => item.id !== scenario.id)];
            this.practiceState.scenarioId = scenario.id;
            this.renderPracticeScenarioOptions();
            this.renderPractice();
        } catch (error) {
            this.renderPractice();
        }
    }

    scenarioFromApi(data) {
        return {
            id: data.scenarioId,
            title: { en: data.title, zh: data.title },
            difficulty: { en: data.difficulty, zh: data.difficulty },
            finalSummary: { en: { good: data.theme || "Scenario complete.", tip: "Review your reason for each action." }, zh: { good: data.theme || "场景完成。", tip: "复盘每一步行动理由。" } },
            steps: data.steps.map((step) => this.stepFromApi(step))
        };
    }

    stepFromApi(step) {
        return {
            street: step.street,
            heroPosition: step.heroPosition,
            heroCards: step.heroCards.split(/\s+/).filter(Boolean),
            boardCards: step.boardCards.split(/\s+/).filter(Boolean),
            pot: step.pot,
            stack: step.stack,
            actionHistory: step.actionHistory,
            summaryText: { en: step.summaryText, zh: step.summaryText },
            availableActions: step.availableActions,
            recommendedAction: step.recommendedAction,
            coachTip: { en: step.beginnerTip, zh: step.beginnerTip },
            feedbackByAction: {},
            nextNarration: { en: "", zh: "" }
        };
    }

    renderPracticeScenarioOptions() {
        this.scenarioSelect.innerHTML = this.practiceScenarios.map((scenario) => `<option value="${scenario.id}">${this.text(scenario.title)}</option>`).join("");
        this.scenarioSelect.value = this.practiceState.scenarioId;
    }

    setPracticeScenario(id) {
        this.practiceState = { scenarioId: id, stepIndex: 0, selectedAction: "", started: false, feedbackVisible: false, isComplete: false, apiFeedback: null };
        this.renderPractice();
    }

    currentScenario() {
        return this.practiceScenarios.find((scenario) => scenario.id === this.practiceState.scenarioId) || this.practiceScenarios[0];
    }

    currentStep() {
        return this.currentScenario().steps[this.practiceState.stepIndex] || this.currentScenario().steps[0];
    }

    resetPractice() {
        this.setPracticeScenario(this.practiceState.scenarioId);
    }

    startPractice() {
        if (this.practiceState.isComplete) {
            this.resetPractice();
            return;
        }
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
    }

    renderPractice(options = {}) {
        const scenario = this.currentScenario();
        const step = this.currentStep();
        this.scenarioSelect.value = scenario.id;
        this.practiceDifficulty.textContent = this.text(scenario.difficulty);
        this.scenarioSummary.textContent = this.practiceState.isComplete ? this.t("scenarioComplete") : this.text(step.summaryText);
        this.practiceMeta.innerHTML = `<span class="meta-pill">${this.streetLabel(step.street)}</span><span class="meta-pill">${this.t("potPrefix")}: ${step.pot} BB</span><span class="meta-pill">${this.t("step")} ${this.practiceState.stepIndex + 1} / ${scenario.steps.length}</span>`;
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
        this.practiceTurnLabel.textContent = this.t("turn");
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
            return `<button class="action-button ${tone} ${selected}" type="button" data-action="${action}" ${this.practiceState.feedbackVisible ? "disabled" : ""}>${COPY[this.language].actions[action] || action}</button>`;
        }).join("");
    }

    async handlePracticeAction(action, button) {
        if (!this.practiceState.started || this.practiceState.feedbackVisible) return;
        button.classList.add("clicked");
        window.setTimeout(() => button.classList.remove("clicked"), 280);
        this.practiceState.selectedAction = action;
        this.practiceState.feedbackVisible = true;
        await this.submitPracticeAction(action);
        this.renderPractice();
        this.animateSeatAction(this.currentStep().heroPosition, `${this.t("yourChoice")}: ${COPY[this.language].actions[action] || action}`);
    }

    async submitPracticeAction(action) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/practice/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenarioId: this.practiceState.scenarioId, stepIndex: this.practiceState.stepIndex, userAction: action, language: this.language })
            });
            if (!response.ok) return;
            const data = await response.json();
            this.practiceState.apiFeedback = data.feedback || null;
            this.practiceState.isComplete = Boolean(data.isComplete);
            if (data.nextState) {
                const scenario = this.currentScenario();
                scenario.steps[this.practiceState.stepIndex + 1] = this.stepFromApi(data.nextState);
            }
        } catch (error) {
            this.practiceState.apiFeedback = null;
        }
    }

    renderPracticeFeedback() {
        const scenario = this.currentScenario();
        const step = this.currentStep();
        if (this.practiceState.isComplete) {
            const summary = this.text(scenario.finalSummary);
            this.practiceFeedback.innerHTML = `<div class="feedback-card good"><strong>${this.t("whatWentWell")}:</strong><br>${summary.good}</div><div class="feedback-card"><strong>${this.t("beginnerTip")}:</strong><br>${summary.tip}</div>`;
            return;
        }
        if (!this.practiceState.started) {
            this.practiceFeedback.innerHTML = `<p>${this.t("stepIntro")}</p>`;
            return;
        }
        if (this.practiceState.feedbackVisible && this.practiceState.apiFeedback) {
            const feedback = this.practiceState.apiFeedback;
            this.practiceFeedback.innerHTML = `<div class="feedback-card ${feedback.isReasonable ? "good" : "caution"}"><strong>${this.t("yourChoice")}:</strong> ${this.escapeHtml(feedback.yourChoice || this.practiceState.selectedAction)}<br><strong>${this.t("coachSuggestion")}:</strong> ${this.escapeHtml(feedback.coachSuggestion || "")}</div><div class="feedback-card"><strong>Why:</strong><br>${this.escapeHtml(feedback.why || "")}<br><strong>${this.t("beginnerTip")}:</strong> ${this.escapeHtml(feedback.beginnerTip || "")}</div>`;
            return;
        }
        if (!this.practiceState.feedbackVisible) {
            this.practiceFeedback.innerHTML = `<p>${this.t("practiceWelcome")}</p><p><strong>${this.t("beginnerTip")}:</strong> ${this.text(step.coachTip)}</p>`;
            return;
        }
        const action = this.practiceState.selectedAction;
        const isRecommended = action === step.recommendedAction;
        const feedbackText = step.feedbackByAction[action] ? this.text(step.feedbackByAction[action]) : (isRecommended ? this.text(step.coachTip) : this.text(step.coachTip));
        this.practiceFeedback.innerHTML = `<div class="feedback-card ${isRecommended ? "good" : "caution"}"><strong>${this.t("yourChoice")}:</strong> ${COPY[this.language].actions[action] || action}<br>${feedbackText}</div><div class="feedback-card"><strong>${this.t("coachSuggestion")}:</strong> ${COPY[this.language].actions[step.recommendedAction] || step.recommendedAction}<br><strong>${this.t("beginnerTip")}:</strong> ${this.text(step.coachTip)}</div><p>${this.text(step.nextNarration)}</p>`;
    }

    renderStreetProgress(activeStreet) {
        const activeIndex = STREET_ORDER.indexOf(activeStreet);
        this.streetProgress.innerHTML = STREET_ORDER.map((street, index) => {
            const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "";
            return `<div class="street-step ${state}">${this.streetLabel(street)}</div>`;
        }).join("");
    }

    askPracticeCoach() {
        this.setSection("analyze");
        this.analyzeInput.value = this.t("askCoachPrompt");
        this.sendChat("analyze", this.getPracticeGameState(), { mode: "practice", practiceState: { ...this.practiceState, stepIndex: this.practiceState.stepIndex } });
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
            return `<div class="seat-node pos-${position.toLowerCase()} ${isHero ? "hero seat-active" : ""}" data-seat="${position}"><div class="seat-cards">${cards.map((card, index) => this.cardMarkup(card, animated, index * 90)).join("")}</div><div class="seat-label">${position}${heroLabel}<span class="seat-stack">${isHero ? stack : compact ? "" : "100 BB"}</span></div></div>`;
        }).join("");
        return `<div class="poker-table"></div>${compact ? "" : '<div class="deck-stack" aria-hidden="true"></div>'}<div class="pot-badge">${this.t("potPrefix")}: ${pot}</div><div class="board-zone">${board.map((card, index) => this.cardMarkup(card, boardFlip, index * 110, card ? "card-flip" : "")).join("")}</div><div class="street-badge">${this.streetLabel(street)}</div>${seats}`;
    }

    cardMarkup(card, animated = false, delay = 0, animationClass = "card-deal") {
        const delayStyle = animated && !REDUCED_MOTION ? ` style="--deal-delay:${delay}ms;--flip-delay:${delay}ms"` : "";
        const cls = animated && !REDUCED_MOTION ? animationClass : "";
        if (card === "back") return `<span class="playing-card back ${cls}"${delayStyle}>##</span>`;
        if (!card) return `<span class="playing-card empty">--</span>`;
        const rank = card.slice(0, -1).replace("T", "10");
        const suit = SUITS.find((item) => item.value === card.slice(-1).toLowerCase())?.symbol || card.slice(-1);
        return `<span class="playing-card face ${this.isRedCard(card) ? "red" : ""} ${cls}"${delayStyle}><span class="card-corner top">${rank}<small>${suit}</small></span><span class="card-pip">${suit}</span><span class="card-corner bottom">${rank}<small>${suit}</small></span></span>`;
    }

    streetLabel(street) {
        return COPY[this.language].street[street] || street;
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
                gameState: mode === "learn" ? { context: "learn" } : this.getGameState(gameStateOverride),
                language: this.language,
                mode,
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
            if (mode === "analyze") this.captureLastAnalysis(message, data);
        } catch (error) {
            loading.remove();
            const text = error instanceof TypeError ? this.t("backendError") : `${this.t("genericError")} ${error.message}`;
            this.addMessage(messagesRoot, "bot", text);
        } finally {
            this.setBusy(false, mode);
        }
    }

    captureLastAnalysis(userQuestion, data) {
        const state = this.getGameState();
        this.lastAnalysis = this.buildReviewItem({
            userQuestion,
            coachRecommendation: data.summary?.recommendedActionLabel || data.summary?.recommendedAction || data.action || "",
            coachReply: data.reply || "",
            reasoningBullets: data.reasoningBullets || data.shareSummary?.reasoningBullets || [],
            riskBullets: data.riskBullets || [],
            beginnerNote: data.beginnerNote || data.shareSummary?.beginnerNote || "",
            tags: data.tags || [],
            sourceState: state
        });
        this.analysisActions.hidden = false;
    }

    buildReviewItem({ userQuestion = "", coachRecommendation = "", coachReply = "", reasoningBullets = [], riskBullets = [], beginnerNote = "", tags = [], sourceState = this.getGameState() }) {
        const derivedTags = tags.length ? tags : this.deriveTags(coachRecommendation, coachReply);
        return {
            id: `review-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            createdAt: new Date().toISOString(),
            language: this.language,
            heroCards: sourceState.handCards,
            boardCards: sourceState.communityCards,
            position: sourceState.position,
            street: this.inferStreet(sourceState.communityCards),
            pot: sourceState.pot,
            stack: sourceState.chips,
            players: sourceState.players,
            actionHistory: sourceState.actionHistory,
            userQuestion,
            coachRecommendation,
            coachReply,
            reasoningBullets,
            riskBullets,
            beginnerNote,
            tags: derivedTags,
            leakTypes: this.deriveLeaks(coachReply),
            favorite: false,
            notes: ""
        };
    }

    saveCurrentAnalysis() {
        if (!this.lastAnalysis) return;
        const item = { ...this.lastAnalysis, id: `review-${Date.now()}-${Math.random().toString(16).slice(2)}` };
        this.reviewLog.unshift(item);
        this.persistReviewLog();
        this.selectedReviewId = item.id;
        this.renderReviewLog();
    }

    renderReviewLog() {
        const tags = ["all", ...Array.from(new Set(this.reviewLog.flatMap((item) => item.tags || [])))];
        this.reviewFilter.innerHTML = tags.map((tag) => `<option value="${tag}">${tag === "all" ? this.t("allTags") : this.escapeHtml(tag)}</option>`).join("");
        this.reviewFilter.value = this.activeReviewFilter;
        const filtered = this.filteredReviews();
        this.reviewList.innerHTML = filtered.length ? filtered.map((item) => `
            <button class="review-list-item ${item.id === this.selectedReviewId ? "active" : ""}" type="button" data-review-id="${item.id}">
                <span>${this.cardText(item.heroCards) || "--"} · ${item.position || "?"}</span>
                <small>${new Date(item.createdAt).toLocaleDateString()} ${item.favorite ? "★" : ""}</small>
            </button>
        `).join("") : `<p class="empty-log">${this.t("emptyLog")}</p>`;
        const selected = this.reviewLog.find((item) => item.id === this.selectedReviewId) || filtered[0];
        this.selectedReviewId = selected?.id || "";
        this.reviewDetail.innerHTML = selected ? this.renderReviewDetail(selected) : "";
    }

    filteredReviews() {
        const items = [...this.reviewLog].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (this.activeReviewFilter === "all") return items;
        return items.filter((item) => item.tags?.includes(this.activeReviewFilter));
    }

    renderReviewDetail(item) {
        return `
            <div class="review-detail-card">
                <div class="review-detail-head">
                    <strong>${this.cardText(item.heroCards)} ${item.boardCards ? `· ${this.cardText(item.boardCards)}` : ""}</strong>
                    <span>${this.streetLabel(item.street)} · ${item.position}</span>
                </div>
                <p>${this.escapeHtml(item.userQuestion || "")}</p>
                <div class="recommendation-badge">${this.escapeHtml(item.coachRecommendation || this.t("recommendedAction"))}</div>
                <p class="review-reply">${this.escapeHtml(this.shortText(item.coachReply, 360))}</p>
                <div class="tag-row">${(item.tags || []).map((tag) => `<span>${this.escapeHtml(tag)}</span>`).join("")}</div>
                <label class="input-group full" for="review-notes"><span>${this.t("notes")}</span><textarea id="review-notes" rows="3">${this.escapeHtml(item.notes || "")}</textarea></label>
                <div class="lesson-actions">
                    <button class="ghost-button" type="button" data-review-action="favorite">${item.favorite ? this.t("unfavorite") : this.t("favorite")}</button>
                    <button class="ghost-button" type="button" data-review-action="share">${this.t("shareHand")}</button>
                    <button class="ghost-button danger-lite" type="button" data-review-action="delete">${this.t("delete")}</button>
                </div>
            </div>
        `;
    }

    handleReviewDetailClick(event) {
        const button = event.target.closest("[data-review-action]");
        if (!button || !this.selectedReviewId) return;
        const item = this.reviewLog.find((review) => review.id === this.selectedReviewId);
        if (!item) return;
        if (button.dataset.reviewAction === "favorite") item.favorite = !item.favorite;
        if (button.dataset.reviewAction === "delete") {
            if (!window.confirm(this.t("confirmDelete"))) return;
            this.reviewLog = this.reviewLog.filter((review) => review.id !== item.id);
            this.selectedReviewId = this.reviewLog[0]?.id || "";
        }
        if (button.dataset.reviewAction === "share") this.openShare(item);
        this.persistReviewLog();
        this.renderReviewLog();
    }

    updateReviewNotes(notes) {
        const item = this.reviewLog.find((review) => review.id === this.selectedReviewId);
        if (!item) return;
        item.notes = notes;
        this.persistReviewLog();
    }

    persistReviewLog() {
        localStorage.setItem(REVIEW_LOG_KEY, JSON.stringify(this.reviewLog));
    }

    exportReviewLog() {
        const blob = new Blob([JSON.stringify(this.reviewLog, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `stacksensei-review-log-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importReviewLog(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result));
                if (!Array.isArray(data)) throw new Error("bad");
                this.reviewLog = data.map((item) => ({ ...this.buildReviewItem({}), ...item })).filter((item) => item.id);
                this.persistReviewLog();
                this.selectedReviewId = this.reviewLog[0]?.id || "";
                this.renderReviewLog();
                window.alert(this.t("importOk"));
            } catch (error) {
                window.alert(this.t("importBad"));
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    }

    clearReviewLog() {
        if (!window.confirm(this.t("confirmClear"))) return;
        this.reviewLog = [];
        this.selectedReviewId = "";
        this.persistReviewLog();
        this.renderReviewLog();
    }

    openShare(item) {
        if (!item) return;
        this.shareTarget = item;
        this.renderShareCard(item);
        this.shareModal.hidden = false;
        this.shareStatus.textContent = this.t("shareReady");
    }

    closeShare() {
        this.shareModal.hidden = true;
    }

    renderShareCard(item) {
        const reasons = this.extractReasonBullets(item);
        const boardCards = this.splitCards(item.boardCards);
        while (boardCards.length < 5) boardCards.push("");
        this.shareCard.innerHTML = `
            <div class="share-card-inner">
                <div class="share-brand"><img src="assets/brand/jester-dealer.png" alt="" onerror="this.src='assets/joker-avatar.png'"><span>StackSensei</span></div>
                <h2>${item.language === "zh" ? "牌局复盘" : "Hand Review"}</h2>
                <div class="share-felt">
                    <div class="share-cards">${this.splitCards(item.heroCards).map((card) => this.cardMarkup(card)).join("")}</div>
                    <div class="share-board">${boardCards.map((card) => this.cardMarkup(card)).join("")}</div>
                </div>
                <div class="share-summary">
                    <span>${this.t("position")}: ${item.position || "--"}</span>
                    <span>${this.t("street")}: ${this.streetLabel(item.street)}</span>
                    <span>${this.t("pot")}: ${item.pot || 0} BB</span>
                </div>
                <div class="share-action-badge">${this.escapeHtml(item.coachRecommendation || this.t("recommendedAction"))}</div>
                <h3>${this.t("keyReasoning")}</h3>
                <ul>${reasons.map((reason) => `<li>${this.escapeHtml(reason)}</li>`).join("")}</ul>
                <p class="share-note"><strong>${this.t("coachNoteLine")}:</strong> ${this.escapeHtml(this.coachNoteFromItem(item))}</p>
                <footer>${new Date(item.createdAt).toLocaleDateString()} · ${this.t("reviewedBy")}</footer>
            </div>
        `;
    }

    async downloadShareImage() {
        const canvas = await this.renderShareCanvas(this.shareTarget);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `stacksensei-hand-review-${Date.now()}.png`;
        link.click();
    }

    async copyShareImage() {
        try {
            if (!navigator.clipboard || !window.ClipboardItem) throw new Error("unsupported");
            const canvas = await this.renderShareCanvas(this.shareTarget);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            this.shareStatus.textContent = this.t("copied");
        } catch (error) {
            this.shareStatus.textContent = this.t("copyFallback");
        }
    }

    async renderShareCanvas(item) {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1440;
        const ctx = canvas.getContext("2d");
        const lang = item.language || this.language;
        ctx.fillStyle = "#070a0d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createRadialGradient(540, 260, 60, 540, 260, 900);
        gradient.addColorStop(0, "#513719");
        gradient.addColorStop(0.48, "#103a2c");
        gradient.addColorStop(1, "#070a0d");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.roundRect(ctx, 70, 70, 940, 1300, 34, "#10171a", "#d9aa4f");
        ctx.fillStyle = "#f3c861";
        ctx.font = "700 42px Georgia";
        ctx.fillText("StackSensei", 145, 150);
        ctx.font = "700 76px Georgia";
        ctx.fillStyle = "#fff1c6";
        ctx.fillText(lang === "zh" ? "牌局复盘" : "Hand Review", 110, 255);
        this.roundRect(ctx, 110, 315, 860, 310, 34, "#0f4a34", "#dfb35c");
        const boardCards = this.splitCards(item.boardCards);
        while (boardCards.length < 5) boardCards.push("");
        this.drawCardRow(ctx, this.splitCards(item.heroCards), 155, 365, 104, 146);
        this.drawCardRow(ctx, boardCards, 420, 365, 90, 126);
        ctx.fillStyle = "#fff3d0";
        ctx.font = "700 30px Arial";
        ctx.fillText(`${this.t("position")}: ${item.position || "--"}`, 155, 570);
        ctx.fillText(`${this.language === "zh" ? "阶段" : "Street"}: ${this.streetLabel(item.street)}`, 410, 570);
        ctx.fillText(`${this.t("pot")}: ${item.pot || 0} BB`, 665, 570);
        this.roundRect(ctx, 110, 685, 860, 105, 22, "#2b2114", "#f3c861");
        ctx.fillStyle = "#ffd874";
        ctx.font = "700 30px Arial";
        ctx.fillText(this.t("recommendedAction"), 145, 727);
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 38px Arial";
        ctx.fillText(this.shortText(item.coachRecommendation || "--", 26), 145, 770);
        ctx.fillStyle = "#f3c861";
        ctx.font = "700 34px Georgia";
        ctx.fillText(this.t("keyReasoning"), 110, 875);
        ctx.fillStyle = "#efe4cf";
        ctx.font = "28px Arial";
        this.extractReasonBullets(item).forEach((reason, index) => {
            this.wrapCanvasText(ctx, `• ${reason}`, 130, 930 + index * 74, 800, 34);
        });
        this.roundRect(ctx, 110, 1180, 860, 92, 20, "#191f21", "#5d4b29");
        ctx.fillStyle = "#f7e2ad";
        ctx.font = "700 26px Arial";
        this.wrapCanvasText(ctx, `${this.t("coachNoteLine")}: ${this.coachNoteFromItem(item)}`, 145, 1235, 790, 32);
        ctx.fillStyle = "#aeb7b6";
        ctx.font = "24px Arial";
        ctx.fillText(`${new Date(item.createdAt).toLocaleDateString()} · ${this.t("reviewedBy")}`, 110, 1330);
        return canvas;
    }

    drawCardRow(ctx, cards, x, y, width, height) {
        cards.forEach((card, index) => this.drawCanvasCard(ctx, card, x + index * (width + 14), y, width, height));
    }

    drawCanvasCard(ctx, card, x, y, width, height) {
        if (!card) {
            this.roundRect(ctx, x, y, width, height, 12, "rgba(10, 34, 27, 0.72)", "#d9aa4f");
            ctx.setLineDash([8, 8]);
            ctx.strokeStyle = "#d9aa4f";
            ctx.strokeRect(x + 9, y + 9, width - 18, height - 18);
            ctx.setLineDash([]);
            return;
        }
        const rank = card.slice(0, -1).replace("T", "10");
        const suit = SUITS.find((item) => item.value === card.slice(-1).toLowerCase())?.symbol || card.slice(-1);
        this.roundRect(ctx, x, y, width, height, 12, "#fff7e9", "#6b5232");
        ctx.fillStyle = this.isRedCard(card) ? "#c93631" : "#1b2328";
        ctx.font = "800 28px Arial";
        ctx.fillText(rank, x + 12, y + 34);
        ctx.font = "42px Arial";
        ctx.fillText(suit, x + width / 2 - 14, y + height / 2 + 14);
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = String(text).split(/\s+/);
        let line = "";
        words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && line) {
                ctx.fillText(line, x, y);
                line = word;
                y += lineHeight;
            } else {
                line = testLine;
            }
        });
        if (line) ctx.fillText(line, x, y);
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

    extractReasonBullets(source) {
        if (source && typeof source === "object" && Array.isArray(source.reasoningBullets) && source.reasoningBullets.length) {
            return source.reasoningBullets.slice(0, 4).map((line) => this.shortText(line, 96));
        }
        const text = source && typeof source === "object" ? source.coachReply : source;
        const clean = String(text || "").replace(/\*\*/g, "");
        const lines = clean.split(/\n+/).map((line) => line.replace(/^[-•\d.]+\s*/, "").trim()).filter((line) => line.length > 18);
        const fallback = this.language === "zh" ? ["牌力、位置和底池大小共同决定行动。", "先确认下注理由，再选择跟注或加注。", "避免只因为好奇而继续。"] : ["Hand strength, position, and pot size shape the decision.", "Name the betting reason before calling or raising.", "Avoid continuing only because you are curious."];
        return (lines.length ? lines : fallback).slice(0, 4).map((line) => this.shortText(line, 96));
    }

    coachNoteFromItem(item) {
        if (item.notes) return this.shortText(item.notes, 88);
        if (item.beginnerNote) return this.shortText(item.beginnerNote, 88);
        return this.t("beginnerReminder");
    }

    deriveTags(action, reply) {
        const text = `${action} ${reply}`.toLowerCase();
        const tags = [];
        if (/bet|raise|value|下注|加注|价值/.test(text)) tags.push(this.t("tagValue"));
        if (/bluff|诈唬/.test(text)) tags.push(this.t("tagBluff"));
        if (/position|button|btn|位置|按钮/.test(text)) tags.push(this.t("tagPosition"));
        if (/draw|flush|straight|听牌|同花|顺子/.test(text)) tags.push(this.t("tagDraw"));
        if (/mistake|leak|avoid|错误|漏洞|避免/.test(text)) tags.push(this.t("tagMistake"));
        return tags.length ? tags : [this.t("tagMistake")];
    }

    deriveLeaks(reply) {
        const text = String(reply || "").toLowerCase();
        return ["calling too much", "ignoring position", "overvaluing one pair", "chasing draws"].filter((leak) => text.includes(leak.split(" ")[0]));
    }

    cardText(cards) {
        return String(cards || "").split(/\s+/).filter(Boolean).map((card) => {
            const rank = card.slice(0, -1).replace("T", "10");
            const suit = SUITS.find((item) => item.value === card.slice(-1).toLowerCase())?.symbol || card.slice(-1);
            return `${rank}${suit}`;
        }).join(" ");
    }

    splitCards(cards) {
        return Array.isArray(cards) ? cards : String(cards || "").split(/\s+/).filter(Boolean);
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

    isRedCard(card) {
        const suit = card.slice(-1).toLowerCase();
        return suit === "h" || suit === "d";
    }

    text(value) {
        if (value && typeof value === "object") return value[this.language] ?? value.en ?? value.zh ?? "";
        return value ?? "";
    }

    shortText(value, max) {
        const text = String(value || "").replace(/\s+/g, " ").trim();
        return text.length > max ? `${text.slice(0, max - 1)}…` : text;
    }

    escapeHtml(value) {
        return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    escapeAttr(value) {
        return this.escapeHtml(value).replace(/'/g, "&#39;");
    }

    readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        } catch (error) {
            return fallback;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.stackSenseiApp = new StackSenseiApp();
});
