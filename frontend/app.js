const API_BASE_URL = (window.STACKSENSEI_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

const RANKS = ["", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = [
    { value: "", en: "Suit", zh: "花色" },
    { value: "s", en: "Spades ♠", zh: "黑桃 ♠" },
    { value: "h", en: "Hearts ♥", zh: "红桃 ♥" },
    { value: "d", en: "Diamonds ♦", zh: "方块 ♦" },
    { value: "c", en: "Clubs ♣", zh: "梅花 ♣" }
];

const CARD_SLOTS = [
    { id: "hole-1", group: "hole", en: "Card 1", zh: "第1张" },
    { id: "hole-2", group: "hole", en: "Card 2", zh: "第2张" },
    { id: "flop-1", group: "board", en: "Flop 1", zh: "翻牌1" },
    { id: "flop-2", group: "board", en: "Flop 2", zh: "翻牌2" },
    { id: "flop-3", group: "board", en: "Flop 3", zh: "翻牌3" },
    { id: "turn", group: "board", en: "Turn", zh: "转牌" },
    { id: "river", group: "board", en: "River", zh: "河牌" }
];

const I18N = {
    en: {
        htmlLang: "en",
        toggle: "中文",
        subtitle: "A witty card master for poker coaching, concepts, and table talk.",
        gameTitle: "Current Game Info",
        notationHelper: "New to poker notation? Use the dropdowns. StackSensei will convert your cards automatically.",
        handCards: "Hand Cards",
        communityCards: "Community Cards",
        manualHand: "Manual hand cards",
        manualCommunity: "Manual community cards",
        advanced: "Advanced manual input",
        chips: "Chips",
        pot: "Pot",
        position: "Position",
        players: "Players",
        actionHistory: "Action History",
        actionPlaceholder: "Example: UTG folds, HJ raises to 2.5BB, BTN calls...",
        rankPlaceholder: "Rank",
        duplicateWarning: "Duplicate card selected. Please choose unique cards.",
        update: "Update Game Info",
        welcome: "Hello, I am StackSensei. I can chat, explain poker ideas, or break down a hand when you bring me a spot.",
        questions: [
            "Can you chat?",
            "What can you do?",
            "What are pot odds?",
            "Should I call with As Kh on BTN?",
            "Analyze this hand",
            "Explain position"
        ],
        mic: "Mic",
        read: "Read",
        input: "Ask StackSensei anything...",
        send: "Send",
        thinking: "Thinking...",
        updated: "Game info updated.",
        empty: "Please enter a question first.",
        listening: "Listening...",
        noSpeech: "Speech recognition is not supported in this browser.",
        backendError: "The backend service may be waking up or temporarily unavailable. Please try again in a moment.",
        genericError: "Sorry, something went wrong.",
        readNone: "There is no assistant response to read yet.",
        positions: {
            unknown: "Unknown",
            UTG: "UTG = early position",
            HJ: "HJ = middle/late position",
            CO: "CO = middle/late position",
            BTN: "BTN = dealer button",
            SB: "SB = blinds",
            BB: "BB = blinds"
        }
    },
    zh: {
        htmlLang: "zh-CN",
        toggle: "EN",
        subtitle: "会聊天、会讲牌，也会拆解牌局的牌桌教练。",
        gameTitle: "当前牌局信息",
        notationHelper: "不熟悉扑克缩写？直接用下拉框选择点数和花色，StackSensei 会自动转换。",
        handCards: "手牌",
        communityCards: "公共牌",
        manualHand: "手动输入手牌",
        manualCommunity: "手动输入公共牌",
        advanced: "高级手动输入",
        chips: "筹码",
        pot: "底池",
        position: "位置",
        players: "玩家数",
        actionHistory: "行动历史",
        actionPlaceholder: "例如：UTG弃牌，HJ加注到2.5BB，BTN跟注……",
        rankPlaceholder: "点数",
        duplicateWarning: "选择了重复的牌，请改成不同的牌。",
        update: "更新牌局信息",
        welcome: "你好，我是 StackSensei。牌桌之外我也能聊两句，不过强项还是帮你拆解牌局和讲清扑克概念。",
        questions: [
            "你可以聊天吗？",
            "你能做什么？",
            "什么是底池赔率？",
            "我在BTN拿As Kh应该跟注吗？",
            "分析这手牌",
            "解释一下位置"
        ],
        mic: "语音",
        read: "朗读",
        input: "随便问 StackSensei...",
        send: "发送",
        thinking: "思考中...",
        updated: "牌局信息已更新。",
        empty: "请先输入一个问题。",
        listening: "正在聆听...",
        noSpeech: "当前浏览器不支持语音识别。",
        backendError: "后端服务可能正在唤醒或暂时不可用，请稍后再试。",
        genericError: "抱歉，发生了一些问题。",
        readNone: "还没有可朗读的助手回复。",
        positions: {
            unknown: "未知",
            UTG: "UTG = 前位",
            HJ: "HJ = 中后位",
            CO: "CO = 中后位",
            BTN: "BTN = 庄位",
            SB: "SB = 盲注位",
            BB: "BB = 盲注位"
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
        this.subtitle = document.getElementById("subtitle");
        this.gameTitle = document.getElementById("game-title");
        this.notationHelper = document.getElementById("notation-helper");
        this.handCardsLabel = document.getElementById("hand-cards-label");
        this.communityCardsLabel = document.getElementById("community-cards-label");
        this.manualHandLabel = document.getElementById("manual-hand-label");
        this.manualCommunityLabel = document.getElementById("manual-community-label");
        this.advancedSummary = document.getElementById("advanced-summary");
        this.chipsLabel = document.getElementById("chips-label");
        this.potLabel = document.getElementById("pot-label");
        this.positionLabel = document.getElementById("position-label");
        this.playersLabel = document.getElementById("players-label");
        this.actionHistoryLabel = document.getElementById("action-history-label");
        this.actionHistory = document.getElementById("action-history");
        this.position = document.getElementById("position");
        this.holeSelectorRoot = document.getElementById("hole-card-selectors");
        this.boardSelectorRoot = document.getElementById("community-card-selectors");
        this.cardWarning = document.getElementById("card-warning");
        this.handCards = document.getElementById("hand-cards");
        this.communityCards = document.getElementById("community-cards");
        this.updateButton = document.getElementById("update-game-btn");
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
        this.updateButton.addEventListener("click", () => this.addMessage("bot", this.t("updated")));
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
        this.handCards.addEventListener("input", () => this.validateDuplicateCards());
        this.communityCards.addEventListener("input", () => this.validateDuplicateCards());
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

            const rank = document.createElement("select");
            rank.className = "card-rank";
            rank.dataset.slot = slot.id;
            rank.setAttribute("aria-label", `${slot.en} rank`);
            wrapper.appendChild(rank);

            const suit = document.createElement("select");
            suit.className = "card-suit";
            suit.dataset.slot = slot.id;
            suit.setAttribute("aria-label", `${slot.en} suit`);
            wrapper.appendChild(suit);

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
        this.subtitle.textContent = copy.subtitle;
        this.gameTitle.textContent = copy.gameTitle;
        this.notationHelper.textContent = copy.notationHelper;
        this.handCardsLabel.textContent = copy.handCards;
        this.communityCardsLabel.textContent = copy.communityCards;
        this.manualHandLabel.textContent = copy.manualHand;
        this.manualCommunityLabel.textContent = copy.manualCommunity;
        this.advancedSummary.textContent = copy.advanced;
        this.chipsLabel.textContent = copy.chips;
        this.potLabel.textContent = copy.pot;
        this.positionLabel.textContent = copy.position;
        this.playersLabel.textContent = copy.players;
        this.actionHistoryLabel.textContent = copy.actionHistory;
        this.actionHistory.placeholder = copy.actionPlaceholder;
        this.updateButton.textContent = copy.update;
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

    getGameState() {
        const players = Number.parseInt(document.getElementById("players").value, 10) || 6;
        return {
            handCards: this.handCards.value.trim(),
            communityCards: this.communityCards.value.trim(),
            actionHistory: this.actionHistory.value.trim(),
            chips: Number.parseFloat(document.getElementById("chips").value) || 100,
            pot: Number.parseFloat(document.getElementById("pot").value) || 0,
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
