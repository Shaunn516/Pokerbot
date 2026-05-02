from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, field_validator


Language = Literal["en", "zh"]
Mode = Literal["learn", "practice", "analyze", "chat"]
Position = Literal["UTG", "HJ", "CO", "BTN", "SB", "BB", "unknown"]
Difficulty = Literal["beginner", "intermediate"]
Street = Literal["preflop", "flop", "turn", "river", "random"]


class GameState(BaseModel):
    handCards: str = Field(default="", max_length=32)
    communityCards: str = Field(default="", max_length=80)
    actionHistory: str = Field(default="", max_length=1000)
    street: str = Field(default="", max_length=32)
    chips: float = Field(default=100, gt=0)
    pot: float = Field(default=0, ge=0)
    position: Position = "unknown"
    players: int = Field(default=6, ge=2, le=9)
    opponents: Optional[int] = Field(default=None, ge=1, le=8)

    @field_validator("handCards", "communityCards", "actionHistory", "street", mode="before")
    @classmethod
    def sanitize_card_text(cls, value: object) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        return " ".join(text.split())

    @field_validator("position", mode="before")
    @classmethod
    def normalize_position(cls, value: object) -> str:
        if value is None or str(value).strip() == "":
            return "unknown"
        normalized = str(value).strip().upper().replace("-", "_")
        aliases = {
            "EARLY": "UTG",
            "MIDDLE": "HJ",
            "LATE": "CO",
            "BUTTON": "BTN",
            "SMALL_BLIND": "SB",
            "BIG_BLIND": "BB",
            "UNKNOWN": "unknown",
        }
        return aliases.get(normalized, normalized)


class PracticeState(BaseModel):
    scenarioId: str = Field(default="", max_length=120)
    scenarioTitle: str = Field(default="", max_length=200)
    stepIndex: Optional[int] = Field(default=None, ge=0)
    street: str = Field(default="", max_length=32)
    heroPosition: str = Field(default="", max_length=32)
    heroCards: str = Field(default="", max_length=32)
    boardCards: str = Field(default="", max_length=80)
    pot: Optional[float] = Field(default=None, ge=0)
    stack: Optional[float] = Field(default=None, gt=0)
    actionHistory: str = Field(default="", max_length=1000)
    availableActions: list[str] = Field(default_factory=list, max_length=12)
    options: list[str] = Field(default_factory=list, max_length=12)
    userAction: str = Field(default="", max_length=120)
    recommendedAction: str = Field(default="", max_length=120)
    beginnerTip: str = Field(default="", max_length=500)
    coachContext: str = Field(default="", max_length=1000)
    isComplete: Optional[bool] = None

    @field_validator(
        "scenarioId",
        "scenarioTitle",
        "street",
        "heroPosition",
        "heroCards",
        "boardCards",
        "actionHistory",
        "userAction",
        "recommendedAction",
        "beginnerTip",
        "coachContext",
        mode="before",
    )
    @classmethod
    def sanitize_text(cls, value: object) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        return " ".join(text.split())

    @field_validator("availableActions", "options", mode="before")
    @classmethod
    def sanitize_options(cls, value: object) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, list):
            return [str(value).strip()]
        return [" ".join(str(item).strip().split()) for item in value if str(item).strip()]


class LessonState(BaseModel):
    lessonId: str = Field(default="", max_length=120)
    lessonTitle: str = Field(default="", max_length=200)
    stepIndex: Optional[int] = Field(default=None, ge=0)
    currentTopic: str = Field(default="", max_length=200)
    quizQuestion: str = Field(default="", max_length=500)
    selectedAnswer: str = Field(default="", max_length=500)
    correctAnswer: str = Field(default="", max_length=500)
    completed: Optional[bool] = None

    @field_validator(
        "lessonId",
        "lessonTitle",
        "currentTopic",
        "quizQuestion",
        "selectedAnswer",
        "correctAnswer",
        mode="before",
    )
    @classmethod
    def sanitize_text(cls, value: object) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        return " ".join(text.split())


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    gameState: GameState = Field(default_factory=GameState)
    practiceState: Optional[PracticeState] = None
    lessonState: Optional[LessonState] = None
    language: Optional[Language] = "en"
    mode: Optional[Mode] = None

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("message must not be empty")
        return text

    @field_validator("gameState", mode="before")
    @classmethod
    def default_game_state_when_null(cls, value: object) -> object:
        return {} if value is None else value


class ChatResponse(BaseModel):
    action: str
    reply: str
    intent: Optional[str] = None
    mode: Optional[str] = None
    language: Optional[Language] = None
    summary: Optional[dict[str, Any]] = None
    reasoningBullets: list[str] = Field(default_factory=list)
    riskBullets: list[str] = Field(default_factory=list)
    beginnerNote: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    leakTypes: list[str] = Field(default_factory=list)
    shareSummary: Optional[dict[str, Any]] = None
    coachReply: Optional[str] = None


class PracticeStepState(BaseModel):
    scenarioId: str
    scenarioTitle: str
    stepIndex: int = Field(..., ge=0)
    street: str
    heroPosition: str
    heroCards: str
    boardCards: str = ""
    pot: float = Field(..., ge=0)
    stack: float = Field(..., gt=0)
    actionHistory: str
    summaryText: str
    availableActions: list[str]
    recommendedAction: str
    beginnerTip: str
    isComplete: bool = False


class PracticeScenarioResponse(BaseModel):
    scenarioId: str
    title: str
    difficulty: str
    theme: str
    language: Language
    steps: list[PracticeStepState]
    currentStep: PracticeStepState


class PracticeActionRequest(BaseModel):
    scenarioId: str = Field(..., min_length=1, max_length=120)
    stepIndex: int = Field(..., ge=0)
    userAction: str = Field(..., min_length=1, max_length=120)
    language: Optional[Language] = "en"

    @field_validator("scenarioId", "userAction")
    @classmethod
    def sanitize_required_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("value must not be empty")
        return " ".join(text.split())


class PracticeActionFeedback(BaseModel):
    isReasonable: bool
    yourChoice: str
    coachSuggestion: str
    why: str
    beginnerTip: str
    nextStep: str
    formatted: str


class PracticeActionResponse(BaseModel):
    feedback: PracticeActionFeedback
    nextState: Optional[PracticeStepState] = None
    isComplete: bool
    summary: Optional[str] = None


class LearnQuizRequest(BaseModel):
    lessonId: str = Field(default="", max_length=120)
    lessonTitle: str = Field(default="", max_length=200)
    language: Optional[Language] = "en"

    @field_validator("lessonId", "lessonTitle", mode="before")
    @classmethod
    def sanitize_quiz_text(cls, value: object) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        return " ".join(text.split())


class LearnQuizResponse(BaseModel):
    question: str
    options: list[str]
    correctAnswer: str
    explanation: str
    lessonId: str
    lessonTitle: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    deepseek_configured: bool
    local_model_enabled: bool
