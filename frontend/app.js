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
const STREET_ORDER = ["preflop", "flop", "turn", "river"];

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
        potPrefix: "Pot",
        street: {
            preflop: "Preflop",
            flop: "Flop",
            turn: "Turn",
            river: "River"
        },
        actions: {
            fold: "Fold",
            check: "Check",
            call: "Call",
            bet: "Bet",
            raise: "Raise",
            ask: "Ask Coach"
        },
        learnWelcome: "Hi, I am StackSensei. Ask me anything about Texas Hold'em basics, and I will explain it in plain language.",
        analyzeWelcome: "Load a hand on the left, then ask me what to do, why an action works, or how a beginner should think about the spot.",
        practiceWelcome: "Choose an action and I will explain the decision in beginner-friendly terms.",
        reasonable: "Reasonable?",
        recommended: "Recommended action",
        takeaway: "Beginner takeaway",
        askCoachPrompt: "Please explain this practice scenario and recommend the best beginner action.",
        learnPrompts: ["What is the flop?", "How do I start?", "Why does position matter?"],
        analyzePrompts: ["Analyze this hand", "Why bet here?", "Are there other lines?"],
        positions: { unknown: "Unknown", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        learningCards: [
            { icon: "♠", title: "How a Hand Works", text: "Learn the order of blinds, cards, betting rounds, and showdown." },
            { icon: "◎", title: "Position and Actions", text: "Position tells you how much information you get before acting." },
            { icon: "A", title: "Hand Strength", text: "Start by knowing strong pairs, big cards, draws, and weak hands." },
            { icon: "□", title: "Avoid Random Calling", text: "Before calling, ask what you beat and what can improve." }
        ]
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
        potPrefix: "底池",
        street: {
            preflop: "发牌前",
            flop: "翻牌",
            turn: "转牌",
            river: "河牌"
        },
        actions: {
            fold: "弃牌",
            check: "过牌",
            call: "跟注",
            bet: "下注",
            raise: "加注",
            ask: "问教练"
        },
        learnWelcome: "嗨，我是 StackSensei。你可以问我任何德州入门问题，我会用简单的话讲清楚。",
        analyzeWelcome: "先在左侧设置牌局，再问我该怎么打、为什么这样打，或新手应该抓住什么重点。",
        practiceWelcome: "选择一个行动，我会用新手能听懂的话解释这一手。",
        reasonable: "是否合理",
        recommended: "建议行动",
        takeaway: "新手要记住",
        askCoachPrompt: "请解释这个练习场景，并给出最适合新手的建议行动。",
        learnPrompts: ["什么是翻牌？", "我该怎么开始？", "位置为什么重要？"],
        analyzePrompts: ["帮我分析这手", "为什么这里要下注？", "还有别的打法吗？"],
        positions: { unknown: "未知", UTG: "UTG", HJ: "HJ", CO: "CO", BTN: "BTN", SB: "SB", BB: "BB" },
        learningCards: [
            { icon: "♠", title: "认识一局牌", text: "先看懂盲注、发牌、下注轮和摊牌顺序。" },
            { icon: "◎", title: "位置和行动", text: "位置决定你行动前能看到多少信息。" },
            { icon: "A", title: "看懂手牌强弱", text: "先认识大对子、大牌、听牌和明显弱牌。" },
            { icon: "□", title: "先学会不乱跟注", text: "跟注前先问自己能赢什么，后面能变好吗。" }
        ]
    }
};

const PRACTICE_SCENARIOS = [
    {
        id: "btn-ako-open",
        name: { en: "Strong BTN open with AKo", zh: "BTN AKo 主动开池" },
        street: "preflop",
        heroPosition: "BTN",
        heroCards: ["As", "Kh"],
        boardCards: [],
        pot: "1.5 BB",
        stack: "100 BB",
        actionHistory: "UTG folds, HJ folds, CO folds. Hero is on BTN.",
        options: ["fold", "call", "raise", "ask"],
        recommendedAction: "raise",
        explanation: {
            en: "AKo is a very strong starting hand on the button. With everyone folded to you, raising uses your position and can win the blinds right away.",
            zh: "AKo 在按钮位非常强。前面都弃牌时，加注可以利用位置优势，也可能直接拿下盲注。"
        },
        beginnerTip: {
            en: "Good position plus strong cards is a spot to be active.",
            zh: "位置好、手牌强，就要更主动。"
        },
        summary: {
            en: "You are on BTN with A♠ K♥. Everyone folded to you.",
            zh: "你在 BTN，拿着 A♠ K♥。前面玩家都弃牌，现在轮到你。"
        }
    },
    {
        id: "utg-weak-fold",
        name: { en: "Weak hand UTG fold", zh: "UTG 弱牌弃牌" },
        street: "preflop",
        heroPosition: "UTG",
        heroCards: ["9d", "4c"],
        boardCards: [],
        pot: "1.5 BB",
        stack: "100 BB",
        actionHistory: "Hero is first to act preflop.",
        options: ["fold", "call", "raise", "ask"],
        recommendedAction: "fold",
        explanation: {
            en: "94 offsuit is weak, and UTG acts first with five players behind. Folding avoids starting a hand with poor cards and poor information.",
            zh: "94不同花很弱，而且 UTG 后面还有很多人没行动。弃牌能避免用差牌、差位置进入底池。"
        },
        beginnerTip: {
            en: "Early position needs tighter starting hands.",
            zh: "越早行动，起手牌要越谨慎。"
        },
        summary: {
            en: "You are UTG with 9♦ 4♣. You must act first.",
            zh: "你在 UTG，拿着 9♦ 4♣。你是第一个行动。"
        }
    },
    {
        id: "bb-defend",
        name: { en: "BB defend spot", zh: "BB 防守盲注" },
        street: "preflop",
        heroPosition: "BB",
        heroCards: ["Qs", "9s"],
        boardCards: [],
        pot: "4.5 BB",
        stack: "98 BB",
        actionHistory: "BTN raises to 2.5BB, SB folds, Hero is in BB.",
        options: ["fold", "call", "raise", "ask"],
        recommendedAction: "call",
        explanation: {
            en: "Q9 suited can defend against a button raise because you already posted the big blind and the hand can make pairs, flushes, and straights.",
            zh: "面对按钮位加注，Q9同花可以防守。你已经投入大盲，而且这手牌能中对子、同花和顺子。"
        },
        beginnerTip: {
            en: "In the big blind, calling can be fine with playable suited hands.",
            zh: "在大盲位，能成牌的同花牌有时可以跟注防守。"
        },
        summary: {
            en: "BTN raises to 2.5BB. You are BB with Q♠ 9♠.",
            zh: "BTN 加注到 2.5BB。你在 BB，拿着 Q♠ 9♠。"
        }
    },
    {
        id: "flop-top-pair",
        name: { en: "Flop top pair decision", zh: "翻牌顶对决策" },
        street: "flop",
        heroPosition: "CO",
        heroCards: ["Ah", "Qh"],
        boardCards: ["Qd", "7s", "3h"],
        pot: "7 BB",
        stack: "96 BB",
        actionHistory: "Hero raised preflop from CO, BB called. BB checks flop.",
        options: ["check", "bet", "ask"],
        recommendedAction: "bet",
        explanation: {
            en: "Top pair with a strong kicker is usually worth betting for value. Worse queens, draws, and smaller pairs can call.",
            zh: "顶对好踢脚通常可以价值下注。更差的Q、听牌和小对子都可能跟注。"
        },
        beginnerTip: {
            en: "When worse hands can call, betting is often value.",
            zh: "如果更差的牌会跟注，下注常常是在拿价值。"
        },
        summary: {
            en: "You raised CO with A♥ Q♥. Flop is Q♦ 7♠ 3♥ and BB checks.",
            zh: "你在 CO 用 A♥ Q♥ 加注。翻牌 Q♦ 7♠ 3♥，BB 过牌。"
        }
    },
    {
        id: "flush-draw",
        name: { en: "Flush draw decision", zh: "同花听牌决策" },
        street: "flop",
        heroPosition: "HJ",
        heroCards: ["As", "Js"],
        boardCards: ["8s", "4s", "Kd"],
        pot: "8 BB",
        stack: "94 BB",
        actionHistory: "Hero raised preflop, BTN called. Hero is first on flop.",
        options: ["check", "bet", "ask"],
        recommendedAction: "bet",
        explanation: {
            en: "The nut flush draw has strong equity. Betting can win immediately or build a pot for when the flush arrives.",
            zh: "最大同花听牌胜率不错。下注可能直接赢下底池，也能在成同花时把底池做大。"
        },
        beginnerTip: {
            en: "Strong draws can be played actively, especially as the preflop raiser.",
            zh: "强听牌可以主动打，尤其你是翻前加注者。"
        },
        summary: {
            en: "You have A♠ J♠ on K♦ 8♠ 4♠. You were the preflop raiser.",
            zh: "你拿 A♠ J♠，公共牌 K♦ 8♠ 4♠。你是翻前加注者。"
        }
    }
];

class StackSenseiApp {
    constructor() {
        this.language = localStorage.getItem("stacksensei_language") || "en";
        this.activeSection = "learn";
        this.currentScenarioIndex = 0;
        this.lastPracticeAction = "";
        this.bindElements();
        this.renderCardSelectors();
        this.renderPositionOptions();
        this.bindEvents();
        this.applyLanguage();
        this.renderPracticeScenario();
        this.syncCardsFromSelectors();
    }

    bindElements() {
        this.langButton = document.getElementById("lang-toggle-btn");
        this.langText = document.getElementById("lang-toggle-text");
        this.navButtons = Array.from(document.querySelectorAll("[data-nav]"));
        this.sections = Array.from(document.querySelectorAll(".app-section"));
        this.learningCards = document.getElementById("learning-cards");
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
        this.nextScenarioButton = document.getElementById("next-scenario-btn");
        this.practiceTable = document.getElementById("practice-table");
        this.practiceStreet = document.getElementById("practice-street");
        this.practiceTurnLabel = document.getElementById("practice-turn-label");
        this.scenarioSummary = document.getElementById("scenario-summary");
        this.practiceActions = document.getElementById("practice-actions");
        this.practiceFeedback = document.getElementById("practice-feedback");
        this.streetProgress = document.getElementById("street-progress");
        this.analyzeTable = document.getElementById("analyze-table");
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
        this.langButton.addEventListener("click", () => this.toggleLanguage());
        this.navButtons.forEach((button) => {
            button.addEventListener("click", () => this.setSection(button.dataset.nav));
        });
        this.learnForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendChat("learn");
        });
        this.analyzeForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendChat("analyze");
        });
        this.learnPrompts.addEventListener("click", (event) => this.handlePromptClick(event, "learn"));
        this.analyzePrompts.addEventListener("click", (event) => this.handlePromptClick(event, "analyze"));
        this.scenarioSelect.addEventListener("change", () => {
            this.currentScenarioIndex = PRACTICE_SCENARIOS.findIndex((scenario) => scenario.id === this.scenarioSelect.value);
            if (this.currentScenarioIndex < 0) this.currentScenarioIndex = 0;
            this.renderPracticeScenario();
        });
        this.nextScenarioButton.addEventListener("click", () => {
            this.currentScenarioIndex = (this.currentScenarioIndex + 1) % PRACTICE_SCENARIOS.length;
            this.renderPracticeScenario();
        });
        this.practiceActions.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action]");
            if (button) this.handlePracticeAction(button.dataset.action);
        });
        this.updateButton.addEventListener("click", () => {
            this.syncCardsFromSelectors();
            this.statePill.textContent = this.t("handLoaded");
            this.setSection("analyze");
        });
        this.holeSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        this.boardSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        [this.position, this.players, this.chips, this.pot, this.actionHistory].forEach((el) => {
            el.addEventListener("input", () => this.updateAnalyzeTable());
            el.addEventListener("change", () => this.updateAnalyzeTable());
        });
    }

    t(key) {
        return COPY[this.language][key];
    }

    toggleLanguage() {
        this.language = this.language === "en" ? "zh" : "en";
        localStorage.setItem("stacksensei_language", this.language);
        this.applyLanguage();
        this.renderPracticeScenario();
        this.updateAnalyzeTable();
    }

    setSection(section) {
        this.activeSection = section;
        this.sections.forEach((el) => el.classList.toggle("active", el.dataset.section === section));
        this.navButtons.forEach((button) => {
            if (button.classList.contains("nav-tab")) {
                button.classList.toggle("active", button.dataset.nav === section);
            }
        });
    }

    applyLanguage() {
        const copy = COPY[this.language];
        document.documentElement.lang = copy.htmlLang;
        this.langText.textContent = copy.langToggle;

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            if (copy[key]) el.textContent = copy[key];
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.dataset.i18nPlaceholder;
            if (copy[key]) el.placeholder = copy[key];
        });

        this.renderLearningCards();
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
        this.learningCards.innerHTML = COPY[this.language].learningCards.map((card) => `
            <article class="learn-card">
                <div class="learn-card-icon" aria-hidden="true">${card.icon}</div>
                <div>
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                </div>
            </article>
        `).join("");
    }

    renderPrompts(root, prompts) {
        root.innerHTML = prompts.map((prompt) => (
            `<button class="quick-prompt" type="button">${prompt}</button>`
        )).join("");
    }

    handlePromptClick(event, mode) {
        const button = event.target.closest(".quick-prompt");
        if (!button) return;
        const input = mode === "learn" ? this.learnInput : this.analyzeInput;
        input.value = button.textContent;
        input.focus();
    }

    renderScenarioOptions() {
        const selected = this.currentScenario().id;
        this.scenarioSelect.innerHTML = PRACTICE_SCENARIOS.map((scenario) => (
            `<option value="${scenario.id}">${scenario.name[this.language]}</option>`
        )).join("");
        this.scenarioSelect.value = selected;
    }

    renderCardSelectors() {
        CARD_SLOTS.forEach((slot) => {
            const wrapper = document.createElement("div");
            wrapper.className = "card-selector";
            wrapper.dataset.slot = slot.id;

            const label = document.createElement("div");
            label.className = "card-selector-label";
            label.dataset.cardLabel = slot.id;
            wrapper.appendChild(label);

            const row = document.createElement("div");
            row.className = "card-picker-row";

            const rank = document.createElement("select");
            rank.className = "card-rank";
            rank.dataset.slot = slot.id;
            row.appendChild(rank);

            const suit = document.createElement("select");
            suit.className = "card-suit";
            suit.dataset.slot = slot.id;
            row.appendChild(suit);

            wrapper.appendChild(row);
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
            select.innerHTML = RANKS.map((rank) => (
                `<option value="${rank}">${rank || this.t("rankEmpty")}</option>`
            )).join("");
            select.value = selected;
        });

        document.querySelectorAll(".card-suit").forEach((select) => {
            const selected = select.value;
            select.innerHTML = SUITS.map((suit) => (
                `<option value="${suit.value}">${suit.label}</option>`
            )).join("");
            select.value = selected;
        });
    }

    renderPositionOptions() {
        const selected = this.position.value || "unknown";
        const labels = COPY[this.language].positions;
        this.position.innerHTML = ["unknown", ...POSITIONS].map((position) => (
            `<option value="${position}">${labels[position]}</option>`
        )).join("");
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
        this.validateDuplicateCards();
        this.updateAnalyzeTable();
    }

    validateDuplicateCards() {
        const cards = `${this.handCards.value} ${this.communityCards.value}`.trim().split(/\s+/).filter(Boolean).map((card) => card.toLowerCase());
        const hasDuplicate = new Set(cards).size !== cards.length;
        this.cardWarning.textContent = hasDuplicate ? this.t("duplicateWarning") : "";
        return !hasDuplicate;
    }

    currentScenario() {
        return PRACTICE_SCENARIOS[this.currentScenarioIndex] || PRACTICE_SCENARIOS[0];
    }

    renderPracticeScenario() {
        const scenario = this.currentScenario();
        this.scenarioSelect.value = scenario.id;
        this.practiceStreet.textContent = COPY[this.language].street[scenario.street];
        this.scenarioSummary.textContent = scenario.summary[this.language];
        this.practiceTable.innerHTML = this.renderTable({
            heroPosition: scenario.heroPosition,
            heroCards: scenario.heroCards,
            boardCards: scenario.boardCards,
            pot: scenario.pot,
            stack: scenario.stack,
            street: scenario.street,
            compact: false
        });
        this.practiceActions.innerHTML = scenario.options.map((action) => {
            const tone = action === "ask" || action === scenario.recommendedAction ? "primary" : action === "fold" ? "danger" : "";
            return `<button class="action-button ${tone}" type="button" data-action="${action}">${COPY[this.language].actions[action]}</button>`;
        }).join("");
        this.practiceFeedback.innerHTML = `<p>${this.t("practiceWelcome")}</p>`;
        this.renderStreetProgress(scenario.street);
    }

    renderStreetProgress(activeStreet) {
        this.streetProgress.innerHTML = STREET_ORDER.map((street) => (
            `<div class="street-step ${street === activeStreet ? "active" : ""}">${COPY[this.language].street[street]}</div>`
        )).join("");
    }

    handlePracticeAction(action) {
        if (action === "ask") {
            this.askPracticeCoach();
            return;
        }
        const scenario = this.currentScenario();
        const isRecommended = action === scenario.recommendedAction;
        this.lastPracticeAction = action;
        this.practiceFeedback.innerHTML = `
            <p><strong>${this.t("reasonable")}:</strong> ${isRecommended ? "✓" : "△"}</p>
            <p><strong>${this.t("recommended")}:</strong> ${COPY[this.language].actions[scenario.recommendedAction]}</p>
            <p>${scenario.explanation[this.language]}</p>
            <p><strong>${this.t("takeaway")}:</strong> ${scenario.beginnerTip[this.language]}</p>
        `;
    }

    async askPracticeCoach() {
        const scenario = this.currentScenario();
        const message = `${this.t("askCoachPrompt")}\n\n${scenario.summary[this.language]}\nAction history: ${scenario.actionHistory}`;
        this.setSection("analyze");
        this.analyzeInput.value = message;
        await this.sendChat("analyze", {
            handCards: scenario.heroCards.join(" "),
            communityCards: scenario.boardCards.join(" "),
            actionHistory: scenario.actionHistory,
            chips: Number.parseFloat(scenario.stack) || 100,
            pot: Number.parseFloat(scenario.pot) || 0,
            position: scenario.heroPosition,
            players: 6,
            opponents: 5,
            practiceScenarioId: scenario.id,
            recommendedAction: scenario.recommendedAction
        });
    }

    updateAnalyzeTable() {
        const state = this.getGameState();
        this.analyzeTable.innerHTML = this.renderTable({
            heroPosition: state.position === "unknown" ? "CO" : state.position,
            heroCards: state.handCards ? state.handCards.split(/\s+/) : [],
            boardCards: state.communityCards ? state.communityCards.split(/\s+/) : [],
            pot: `${state.pot || 0} BB`,
            stack: `${state.chips || 100} BB`,
            street: this.inferStreet(state.communityCards),
            compact: true
        });
    }

    inferStreet(boardCards) {
        const count = boardCards ? boardCards.split(/\s+/).filter(Boolean).length : 0;
        if (count >= 5) return "river";
        if (count === 4) return "turn";
        if (count >= 3) return "flop";
        return "preflop";
    }

    renderTable({ heroPosition, heroCards, boardCards, pot, stack, street, compact }) {
        const board = [...boardCards];
        while (board.length < 5) board.push("");
        const seats = POSITIONS.map((position) => {
            const isHero = position === heroPosition;
            const cards = isHero ? [heroCards[0] || "", heroCards[1] || ""] : ["back", "back"];
            const heroLabel = isHero && !compact ? ` (${this.language === "zh" ? "你" : "You"})` : "";
            return `
                <div class="seat-node pos-${position.toLowerCase()} ${isHero ? "hero" : ""}">
                    <div class="seat-cards">${cards.map((card) => this.cardMarkup(card)).join("")}</div>
                    <div class="seat-label">${position}${heroLabel}<span class="seat-stack">${isHero ? stack : compact ? "" : "100 BB"}</span></div>
                </div>
            `;
        }).join("");

        return `
            <div class="poker-table"></div>
            <div class="pot-badge">${this.t("potPrefix")}: ${pot}</div>
            <div class="board-zone">${board.map((card) => this.cardMarkup(card)).join("")}</div>
            <div class="street-badge">${COPY[this.language].street[street]}</div>
            ${seats}
        `;
    }

    cardMarkup(card) {
        if (card === "back") return `<span class="playing-card back">##</span>`;
        if (!card) return `<span class="playing-card empty">--</span>`;
        return `<span class="playing-card ${this.isRedCard(card) ? "red" : ""}">${this.displayCard(card)}</span>`;
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

    async sendChat(mode, gameStateOverride = null) {
        const input = mode === "learn" ? this.learnInput : this.analyzeInput;
        const messagesRoot = mode === "learn" ? this.learnMessages : this.analyzeMessages;
        const message = input.value.trim();
        if (!message) {
            this.addMessage(messagesRoot, "bot", this.t("empty"));
            return;
        }

        if (mode === "analyze") this.syncCardsFromSelectors();
        input.value = "";
        this.addMessage(messagesRoot, "user", message);
        const loading = this.addMessage(messagesRoot, "bot", this.t("thinking"), true);
        this.setBusy(true, mode);

        try {
            const response = await fetch(`${API_BASE_URL}/api/poker-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    gameState: mode === "learn" ? { context: "learn" } : this.getGameState(gameStateOverride),
                    language: this.language
                })
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
        article.className = `message ${sender}${isLoading ? " loading" : ""}`;
        if (sender === "bot") {
            const avatar = document.createElement("img");
            avatar.src = "assets/joker-avatar.png";
            avatar.alt = "";
            avatar.className = "mini-avatar";
            article.appendChild(avatar);
        }
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        if (action && action !== "N/A") {
            bubble.innerHTML = `<p><strong>${this.escapeHtml(action)}</strong></p>`;
        }
        bubble.innerHTML += this.formatText(text);
        article.appendChild(bubble);
        root.appendChild(article);
        root.scrollTop = root.scrollHeight;
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
