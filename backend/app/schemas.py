from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


Language = Literal["en", "zh"]
Position = Literal["UTG", "HJ", "CO", "BTN", "SB", "BB", "unknown"]


class GameState(BaseModel):
    handCards: str = Field(default="", max_length=32)
    communityCards: str = Field(default="", max_length=80)
    chips: float = Field(default=100, gt=0)
    pot: float = Field(default=0, ge=0)
    position: Position = "unknown"
    players: int = Field(default=6, ge=2, le=9)
    opponents: Optional[int] = Field(default=None, ge=1, le=8)

    @field_validator("handCards", "communityCards", mode="before")
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


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    gameState: GameState = Field(default_factory=GameState)
    language: Language = "en"

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("message must not be empty")
        return text


class ChatResponse(BaseModel):
    action: str
    reply: str


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    deepseek_configured: bool
    local_model_enabled: bool

