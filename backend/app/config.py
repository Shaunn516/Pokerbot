from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    service_name: str = "stacksensei-backend"
    version: str = "0.1.0"
    deepseek_api_key: str = Field(default="", alias="DEEPSEEK_API_KEY")
    deepseek_endpoint: str = Field(
        default="https://api.deepseek.com/v1/chat/completions",
        alias="DEEPSEEK_API_ENDPOINT",
    )
    deepseek_model: str = Field(default="deepseek-chat", alias="DEEPSEEK_MODEL")
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173,http://localhost:8000",
        alias="CORS_ORIGINS",
    )
    enable_local_model: bool = Field(default=False, alias="ENABLE_LOCAL_MODEL")
    request_timeout_seconds: float = Field(default=30.0, alias="REQUEST_TIMEOUT_SECONDS")

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def deepseek_configured(self) -> bool:
        return bool(self.deepseek_api_key.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()

