const API_BASE_URL = (window.STACKSENSEI_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

const RANKS = ["", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = [
    { value: "", en: "--", zh: "--", symbol: "" },
    { value: "s", en: "♠", zh: "♠", symbol: "♠" },
    { value: "h", en: "♥", zh: "♥", symbol: "♥" },
    { value: "d", en: "♦", zh: "♦", symbol: "♦" },
    { value: "c", en: "♣", zh: "♣", symbol: "♣" }
];

const CARD_SLOTS = [
    { id: "hole-1", group: "hole", en: "Card 1", zh: "手牌1" },
    { id: "hole-2", group: "hole", en: "Card 2", zh: "手牌2" },
    { id: "flop-1", group: "board", en: "Flop 1", zh: "翻牌1" },
    { id: "flop-2", group: "board", en: "Flop 2", zh: "翻牌2" },
    { id: "flop-3", group: "board", en: "Flop 3", zh: "翻牌3" },
    { id: "turn", group: "board", en: "Turn", zh: "转牌" },
    { id: "river", group: "board", en: "River", zh: "河牌" }
];

const POSITIONS = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];

const I18N = {
    en: {
        htmlLang: "en",
        toggle: "中文",
        kicker: "Texas Hold'em Mentor",
        subtitleEn: "A card-table coach that chats, teaches, and reviews your hands.",
        subtitleZh: "会聊天、会讲牌，也会拆解牌局的牌桌教练。",
        tableTitle: "Table View",
        gameTitle: "Game Setup",
        heroCards: "Hero Cards",
        boardCards: "Board Cards",
        tableContext: "Table Context",
        stack: "Stack",
        pot: "Pot",
        position: "Position",
        players: "Players",
        actionHistory: "Action History",
        actionPlaceholder: "e.g. UTG folds, HJ raises to 2.5BB, BTN calls...",
        rankPlaceholder: "--",
        duplicateWarning: "Duplicate card selected. Please choose unique cards.",
        update: "Use This Hand",
        chatTitle: "Coach Chat",
        chatSubtitle: "Ask for a decision, a concept, or a full hand review.",
        ready: "Ready",
        updated: "Hand loaded",
        welcome: "Hello, I am StackSensei. Share your spot and I will give a practical poker learning recommendation.",
        questions: [
            "What should I do next?",
            "Should I call?",
            "Should I raise?",
            "Should I fold?",
            "What are the pot odds?",
            "Analyze this hand"
        ],
        mic: "Mic",
        read: "Read",
        input: "Ask a poker question...",
        send: "Send",
        thinking: "Thinking...",
        empty: "Please enter a question first.",
        listening: "Listening...",
        noSpeech: "Speech recognition is not supported in this browser.",
        backendError: "The backend service may be waking up or temporarily unavailable. Please try again in a moment.",
        genericError: "Sorry, something went wrong.",
        readNone: "There is no assistant response to read yet.",
        positions: {
            unknown: "Unknown",
            UTG: "UTG",
            HJ: "HJ",
            CO: "CO",
            BTN: "BTN",
            SB: "SB",
            BB: "BB"
        }
    },
    zh: {
        htmlLang: "zh-CN",
        toggle: "EN",
        kicker: "德州扑克导师",
        subtitleEn: "A card-table coach that chats, teaches, and reviews your hands.",
        subtitleZh: "会聊天、会讲牌，也会拆解牌局的牌桌教练。",
        tableTitle: "牌桌视图",
        gameTitle: "牌局设置",
        heroCards: "手牌",
        boardCards: "公共牌",
        tableContext: "牌桌信息",
        stack: "筹码",
        pot: "底池",
        position: "位置",
        players: "玩家数",
        actionHistory: "行动历史",
        actionPlaceholder: "例如：UTG弃牌，HJ加注到2.5BB，BTN跟注……",
        rankPlaceholder: "--",
        duplicateWarning: "选择了重复牌，请换成不同的牌。",
        update: "使用这手牌",
        chatTitle: "教练聊天",
        chatSubtitle: "询问决策、概念，或完整复盘这手牌。",
        ready: "就绪",
        updated: "牌局已载入",
        welcome: "你好，我是 StackSensei。告诉我当前牌局，我会给你实用的德州扑克学习建议。",
        questions: [
            "下一步怎么打？",
            "我应该跟注吗？",
            "我应该加注吗？",
            "我应该弃牌吗？",
            "底池赔率是多少？",
            "分析这手牌"
        ],
        mic: "语音",
        read: "朗读",
        input: "问一个德州扑克问题……",
        send: "发送",
        thinking: "思考中...",
        empty: "请先输入问题。",
        listening: "正在聆听...",
        noSpeech: "这个浏览器不支持语音识别。",
        backendError: "后端服务可能正在唤醒或暂时不可用，请稍后再试。",
        genericError: "抱歉，出错了。",
        readNone: "还没有可朗读的助手回复。",
        positions: {
            unknown: "未知",
            UTG: "UTG",
            HJ: "HJ",
            CO: "CO",
            BTN: "BTN",
            SB: "SB",
            BB: "BB"
        }
    }
};

class StackSenseiApp {
    constructor() {
        this.language = localStorage.getItem("stacksensei_language") || "en";
        this.lastAssistantText = "";
        this.recognition = null;
        this.synthesis = window.speechSynthesis || null;
        this.bindElements();
        this.renderCardSelectors();
        this.bindEvents();
        this.setupSpeechRecognition();
        this.applyLanguage();
        this.syncCardsFromSelectors();
    }

    bindElements() {
        this.langButton = document.getElementById("lang-toggle-btn");
        this.kicker = document.getElementById("kicker");
        this.subtitleEn = document.getElementById("subtitle-en");
        this.subtitleZh = document.getElementById("subtitle-zh");
        this.tableTitle = document.getElementById("table-title");
        this.gameTitle = document.getElementById("game-title");
        this.handCardsLabel = document.getElementById("hand-cards-label");
        this.communityCardsLabel = document.getElementById("community-cards-label");
        this.tableContextLabel = document.getElementById("table-context-label");
        this.chipsLabel = document.getElementById("chips-label");
        this.potLabel = document.getElementById("pot-label");
        this.positionLabel = document.getElementById("position-label");
        this.playersLabel = document.getElementById("players-label");
        this.actionHistoryLabel = document.getElementById("action-history-label");
        this.actionHistory = document.getElementById("action-history");
        this.position = document.getElementById("position");
        this.players = document.getElementById("players");
        this.chips = document.getElementById("chips");
        this.pot = document.getElementById("pot");
        this.holeSelectorRoot = document.getElementById("hole-card-selectors");
        this.boardSelectorRoot = document.getElementById("community-card-selectors");
        this.cardWarning = document.getElementById("card-warning");
        this.handCards = document.getElementById("hand-cards");
        this.communityCards = document.getElementById("community-cards");
        this.updateButton = document.getElementById("update-game-btn");
        this.tableCommunityCards = document.getElementById("table-community-cards");
        this.handSummary = document.getElementById("hand-summary");
        this.seats = Array.from(document.querySelectorAll(".seat"));
        this.chatTitle = document.getElementById("chat-title");
        this.chatSubtitle = document.getElementById("chat-subtitle");
        this.statePill = document.getElementById("state-pill");
        this.messages = document.getElementById("chat-messages");
        this.welcome = document.getElementById("welcome-message");
        this.quickQuestions = Array.from(document.querySelectorAll(".quick-question-btn"));
        this.voiceButton = document.getElementById("voice-btn");
        this.readButton = document.getElementById("read-aloud-btn");
        this.voiceStatus = document.getElementById("voice-status");
        this.form = document.getElementById("chat-form");
        this.input = document.getElementById("user-input");
        this.sendButton = document.getElementById("send-btn");
    }

    bindEvents() {
        this.langButton.addEventListener("click", () => this.toggleLanguage());
        this.updateButton.addEventListener("click", () => {
            this.syncCardsFromSelectors();
            this.statePill.textContent = this.t("updated");
        });
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.sendMessage();
        });
        this.quickQuestions.forEach((button) => {
            button.addEventListener("click", () => {
                this.input.value = button.textContent;
                this.input.focus();
            });
        });
        this.voiceButton.addEventListener("click", () => this.startVoiceInput());
        this.readButton.addEventListener("click", () => this.readLastResponse());
        this.holeSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        this.boardSelectorRoot.addEventListener("change", () => this.syncCardsFromSelectors());
        this.position.addEventListener("change", () => this.updateTableVisualizer());
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
            rank.setAttribute("aria-label", `${slot.en} rank`);
            row.appendChild(rank);

            const suit = document.createElement("select");
            suit.className = "card-suit";
            suit.dataset.slot = slot.id;
            suit.setAttribute("aria-label", `${slot.en} suit`);
            row.appendChild(suit);

            wrapper.appendChild(row);
            const root = slot.group === "hole" ? this.holeSelectorRoot : this.boardSelectorRoot;
            root.appendChild(wrapper);
        });
    }

    t(key) {
        return I18N[this.language][key];
    }

    toggleLanguage() {
        this.language = this.language === "en" ? "zh" : "en";
        localStorage.setItem("stacksensei_language", this.language);
        this.applyLanguage();
    }

    applyLanguage() {
        const copy = I18N[this.language];
        document.documentElement.lang = copy.htmlLang;
        this.langButton.textContent = copy.toggle;
        this.kicker.textContent = copy.kicker;
        this.subtitleEn.textContent = copy.subtitleEn;
        this.subtitleZh.textContent = copy.subtitleZh;
        this.tableTitle.textContent = copy.tableTitle;
        this.gameTitle.textContent = copy.gameTitle;
        this.handCardsLabel.textContent = copy.heroCards;
        this.communityCardsLabel.textContent = copy.boardCards;
        this.tableContextLabel.textContent = copy.tableContext;
        this.chipsLabel.textContent = copy.stack;
        this.potLabel.textContent = copy.pot;
        this.positionLabel.textContent = copy.position;
        this.playersLabel.textContent = copy.players;
        this.actionHistoryLabel.textContent = copy.actionHistory;
        this.actionHistory.placeholder = copy.actionPlaceholder;
        this.updateButton.textContent = copy.update;
        this.chatTitle.textContent = copy.chatTitle;
        this.chatSubtitle.textContent = copy.chatSubtitle;
        this.statePill.textContent = copy.ready;
        this.welcome.innerHTML = `<p>${copy.welcome}</p>`;
        this.quickQuestions.forEach((button, index) => {
            button.textContent = copy.questions[index];
        });
        this.voiceButton.textContent = copy.mic;
        this.readButton.textContent = copy.read;
        this.input.placeholder = copy.input;
        this.sendButton.textContent = copy.send;
        this.updatePositionOptions();
        this.updateCardSelectorCopy();
        this.validateDuplicateCards();
        this.updateTableVisualizer();
        if (this.recognition) {
            this.recognition.lang = this.language === "zh" ? "zh-CN" : "en-US";
        }
    }

    updatePositionOptions() {
        const selected = this.position.value;
        Array.from(this.position.options).forEach((option) => {
            option.textContent = I18N[this.language].positions[option.value];
        });
        this.position.value = selected;
    }

    updateCardSelectorCopy() {
        const copy = I18N[this.language];
        CARD_SLOTS.forEach((slot) => {
            const label = document.querySelector(`[data-card-label="${slot.id}"]`);
            if (label) {
                label.textContent = this.language === "zh" ? slot.zh : slot.en;
            }
        });

        document.querySelectorAll(".card-rank").forEach((select) => {
            const selected = select.value;
            select.innerHTML = "";
            RANKS.forEach((rank) => {
                const option = document.createElement("option");
                option.value = rank;
                option.textContent = rank || copy.rankPlaceholder;
                select.appendChild(option);
            });
            select.value = selected;
        });

        document.querySelectorAll(".card-suit").forEach((select) => {
            const selected = select.value;
            select.innerHTML = "";
            SUITS.forEach((suit) => {
                const option = document.createElement("option");
                option.value = suit.value;
                option.textContent = this.language === "zh" ? suit.zh : suit.en;
                select.appendChild(option);
            });
            select.value = selected;
        });
    }

    cardFromSlot(slotId) {
        const rank = document.querySelector(`.card-rank[data-slot="${slotId}"]`)?.value || "";
        const suit = document.querySelector(`.card-suit[data-slot="${slotId}"]`)?.value || "";
        if (!rank || !suit) {
            return "";
        }
        return `${rank === "10" ? "T" : rank}${suit}`;
    }

    syncCardsFromSelectors() {
        const holeCards = CARD_SLOTS
            .filter((slot) => slot.group === "hole")
            .map((slot) => this.cardFromSlot(slot.id))
            .filter(Boolean);
        const boardCards = CARD_SLOTS
            .filter((slot) => slot.group === "board")
            .map((slot) => this.cardFromSlot(slot.id))
            .filter(Boolean);
        this.handCards.value = holeCards.join(" ");
        this.communityCards.value = boardCards.join(" ");
        this.validateDuplicateCards();
        this.updateTableVisualizer();
    }

    validateDuplicateCards() {
        const cards = `${this.handCards.value} ${this.communityCards.value}`
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((card) => card.toLowerCase());
        const hasDuplicate = new Set(cards).size !== cards.length;
        this.cardWarning.textContent = hasDuplicate ? this.t("duplicateWarning") : "";
        return !hasDuplicate;
    }

    updateTableVisualizer() {
        const heroPosition = this.position.value;
        const heroCards = this.handCards.value.split(/\s+/).filter(Boolean);
        const boardCards = this.communityCards.value.split(/\s+/).filter(Boolean);

        this.handSummary.textContent = heroCards.length ? heroCards.map((card) => this.displayCard(card)).join(" ") : "-- / --";
        this.tableCommunityCards.innerHTML = "";
        for (let index = 0; index < 5; index += 1) {
            this.tableCommunityCards.appendChild(this.createMiniCard(boardCards[index] || ""));
        }

        this.seats.forEach((seat) => {
            const position = seat.dataset.position;
            const cardsRoot = seat.querySelector(".seat-cards");
            const isHero = position === heroPosition;
            seat.classList.toggle("hero-seat", isHero);
            cardsRoot.innerHTML = "";
            if (isHero) {
                cardsRoot.appendChild(this.createMiniCard(heroCards[0] || ""));
                cardsRoot.appendChild(this.createMiniCard(heroCards[1] || ""));
            } else {
                cardsRoot.appendChild(this.createCardBack());
                cardsRoot.appendChild(this.createCardBack());
            }
        });
    }

    createMiniCard(card) {
        const el = document.createElement("span");
        el.className = `mini-card${card ? "" : " empty"}${this.isRedCard(card) ? " red" : ""}`;
        el.textContent = card ? this.displayCard(card) : "--";
        return el;
    }

    createCardBack() {
        const el = document.createElement("span");
        el.className = "mini-card back";
        el.textContent = "##";
        return el;
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

    getGameState() {
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

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) {
            this.addMessage("bot", this.t("empty"));
            return;
        }

        this.syncCardsFromSelectors();
        this.input.value = "";
        this.addMessage("user", message);
        const loading = this.addMessage("bot", this.t("thinking"), true);
        this.setBusy(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/poker-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    gameState: this.getGameState(),
                    language: this.language
                })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.detail || this.t("genericError"));
            }

            loading.remove();
            this.lastAssistantText = data.reply || "";
            this.addMessage("bot", this.lastAssistantText, false, data.action);
        } catch (error) {
            loading.remove();
            const offline = error instanceof TypeError;
            this.addMessage("bot", offline ? this.t("backendError") : `${this.t("genericError")} ${error.message}`);
        } finally {
            this.setBusy(false);
        }
    }

    setBusy(isBusy) {
        this.sendButton.disabled = isBusy;
        this.input.disabled = isBusy;
        this.statePill.textContent = isBusy ? this.t("thinking") : this.t("ready");
    }

    addMessage(sender, text, isLoading = false, action = "") {
        const article = document.createElement("article");
        article.className = `message ${sender}-message${isLoading ? " loading" : ""}`;

        if (sender === "bot") {
            const avatar = document.createElement("img");
            avatar.src = "assets/joker-avatar.png";
            avatar.alt = "StackSensei avatar";
            avatar.className = "bot-avatar";
            article.appendChild(avatar);
        }

        const content = document.createElement("div");
        content.className = "message-content";
        if (action && action !== "N/A") {
            const tag = document.createElement("div");
            tag.className = "action-tag";
            tag.textContent = action;
            content.appendChild(tag);
        }
        content.innerHTML += this.formatText(text);
        article.appendChild(content);
        this.messages.appendChild(article);
        this.messages.scrollTop = this.messages.scrollHeight;
        return article;
    }

    formatText(text) {
        const escaped = String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return escaped
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .split(/\n{2,}/)
            .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
            .join("");
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.language === "zh" ? "zh-CN" : "en-US";
        this.recognition.onresult = (event) => {
            this.input.value = event.results[0][0].transcript;
            this.voiceStatus.textContent = "";
        };
        this.recognition.onerror = () => {
            this.voiceStatus.textContent = "";
        };
        this.recognition.onend = () => {
            this.voiceStatus.textContent = "";
        };
    }

    startVoiceInput() {
        if (!this.recognition) {
            this.voiceStatus.textContent = this.t("noSpeech");
            return;
        }
        this.voiceStatus.textContent = this.t("listening");
        this.recognition.start();
    }

    readLastResponse() {
        if (!this.synthesis) {
            return;
        }
        if (!this.lastAssistantText) {
            this.addMessage("bot", this.t("readNone"));
            return;
        }
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(this.cleanForSpeech(this.lastAssistantText));
        utterance.lang = this.language === "zh" ? "zh-CN" : "en-US";
        this.synthesis.speak(utterance);
    }

    cleanForSpeech(text) {
        return text
            .replace(/\*\*/g, "")
            .replace(/[`*_#>-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new StackSenseiApp();
});
