from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


Language = Literal["en", "zh"]
Mode = Literal["learn", "practice", "analyze", "chat"]
Position = Literal["UTG", "HJ", "CO", "BTN", "SB", "BB", "unknown"]


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
    street: str = Field(default="", max_length=32)
    heroPosition: str = Field(default="", max_length=32)
    heroCards: str = Field(default="", max_length=32)
    boardCards: str = Field(default="", max_length=80)
    pot: Optional[float] = Field(default=None, ge=0)
    stack: Optional[float] = Field(default=None, gt=0)
    actionHistory: str = Field(default="", max_length=1000)
    options: list[str] = Field(default_factory=list, max_length=12)
    userAction: str = Field(default="", max_length=120)
    recommendedAction: str = Field(default="", max_length=120)
    beginnerTip: str = Field(default="", max_length=500)

    @field_validator(
        "scenarioId",
        "street",
        "heroPosition",
        "heroCards",
        "boardCards",
        "actionHistory",
        "userAction",
        "recommendedAction",
        "beginnerTip",
        mode="before",
    )
    @classmethod
    def sanitize_text(cls, value: object) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        return " ".join(text.split())

    @field_validator("options", mode="before")
    @classmethod
    def sanitize_options(cls, value: object) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, list):
            return [str(value).strip()]
        return [" ".join(str(item).strip().split()) for item in value if str(item).strip()]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    gameState: GameState = Field(default_factory=GameState)
    practiceState: Optional[PracticeState] = None
    language: Language = "en"
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


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    deepseek_configured: bool
    local_model_enabled: bool
