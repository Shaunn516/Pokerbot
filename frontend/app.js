const API_BASE_URL = (window.STACKSENSEI_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

const I18N = {
    en: {
        htmlLang: "en",
        toggle: "中文",
        subtitle: "Action-first poker coaching for learners.",
        gameTitle: "Current Game Info",
        labels: ["Hand Cards", "Community Cards", "Chips", "Pot", "Position", "Players"],
        update: "Update Game Info",
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
        updated: "Game info updated.",
        empty: "Please enter a poker question first.",
        listening: "Listening...",
        noSpeech: "Speech recognition is not supported in this browser.",
        backendError: "The backend service may be waking up or temporarily unavailable. Please try again in a moment.",
        genericError: "Sorry, something went wrong.",
        readNone: "There is no assistant response to read yet."
    },
    zh: {
        htmlLang: "zh-CN",
        toggle: "EN",
        subtitle: "面向学习者的行动优先德州扑克助手。",
        gameTitle: "当前牌局信息",
        labels: ["手牌", "公共牌", "筹码", "底池", "位置", "玩家数"],
        update: "更新牌局信息",
        welcome: "你好，我是 StackSensei。输入你的牌局，我会给出清晰、实用的学习建议。",
        questions: [
            "下一步我该怎么做？",
            "我应该跟注吗？",
            "我应该加注吗？",
            "我应该弃牌吗？",
            "底池赔率是多少？",
            "分析这手牌"
        ],
        mic: "语音",
        read: "朗读",
        input: "输入你的扑克问题...",
        send: "发送",
        thinking: "思考中...",
        updated: "牌局信息已更新。",
        empty: "请先输入一个扑克问题。",
        listening: "正在聆听...",
        noSpeech: "当前浏览器不支持语音识别。",
        backendError: "后端服务可能正在唤醒或暂时不可用，请稍后再试。",
        genericError: "抱歉，发生了一些问题。",
        readNone: "还没有可朗读的助手回复。"
    }
};

class StackSenseiApp {
    constructor() {
        this.language = localStorage.getItem("stacksensei_language") || "en";
        this.lastAssistantText = "";
        this.recognition = null;
        this.synthesis = window.speechSynthesis || null;
        this.bindElements();
        this.bindEvents();
        this.setupSpeechRecognition();
        this.applyLanguage();
    }

    bindElements() {
        this.langButton = document.getElementById("lang-toggle-btn");
        this.subtitle = document.getElementById("subtitle");
        this.gameTitle = document.getElementById("game-title");
        this.labels = Array.from(document.querySelectorAll(".game-panel .input-group span"));
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
        this.labels.forEach((label, index) => {
            label.textContent = copy.labels[index];
        });
        this.updateButton.textContent = copy.update;
        this.welcome.innerHTML = `<p>${copy.welcome}</p>`;
        this.quickQuestions.forEach((button, index) => {
            button.textContent = copy.questions[index];
        });
        this.voiceButton.textContent = copy.mic;
        this.readButton.textContent = copy.read;
        this.input.placeholder = copy.input;
        this.sendButton.textContent = copy.send;
        if (this.recognition) {
            this.recognition.lang = this.language === "zh" ? "zh-CN" : "en-US";
        }
    }

    getGameState() {
        const players = Number.parseInt(document.getElementById("players").value, 10) || 6;
        return {
            handCards: document.getElementById("hand-cards").value.trim(),
            communityCards: document.getElementById("community-cards").value.trim(),
            chips: Number.parseFloat(document.getElementById("chips").value) || 100,
            pot: Number.parseFloat(document.getElementById("pot").value) || 0,
            position: document.getElementById("position").value || "unknown",
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

