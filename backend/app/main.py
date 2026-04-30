from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings, get_settings
from app.deepseek_service import call_deepseek
from app.learn_quiz import generate_quiz
from app.practice_scenarios import generate_practice_scenario, handle_practice_action
from app.prompt_builder import build_messages, extract_action
from app.schemas import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    LearnQuizRequest,
    LearnQuizResponse,
    PracticeActionRequest,
    PracticeActionResponse,
    PracticeScenarioResponse,
)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="StackSensei API", version=settings.version)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", response_model=HealthResponse)
    async def health(current_settings: Settings = Depends(get_settings)) -> HealthResponse:
        return HealthResponse(
            status="ok",
            service=current_settings.service_name,
            version=current_settings.version,
            deepseek_configured=current_settings.deepseek_configured,
            local_model_enabled=current_settings.enable_local_model,
        )

    @app.post("/api/poker-chat", response_model=ChatResponse)
    async def poker_chat(
        request: ChatRequest,
        current_settings: Settings = Depends(get_settings),
    ) -> ChatResponse:
        messages = build_messages(request)
        reply = await call_deepseek(messages, current_settings)
        action = extract_action(reply, request.language, request.practiceState)
        return ChatResponse(action=action, reply=reply)

    @app.get("/api/practice/scenario", response_model=PracticeScenarioResponse)
    async def practice_scenario(
        difficulty: str = Query(default="beginner", pattern="^(beginner|intermediate)$"),
        street: str = Query(default="random", pattern="^(preflop|flop|turn|river|random)$"),
        language: str = Query(default="en", pattern="^(en|zh)$"),
    ) -> PracticeScenarioResponse:
        return PracticeScenarioResponse(**generate_practice_scenario(difficulty, street, language))

    @app.post("/api/practice/action", response_model=PracticeActionResponse)
    async def practice_action(request: PracticeActionRequest) -> PracticeActionResponse:
        return PracticeActionResponse(**handle_practice_action(request))

    @app.post("/api/learn/quiz", response_model=LearnQuizResponse)
    async def learn_quiz(request: LearnQuizRequest) -> LearnQuizResponse:
        return LearnQuizResponse(**generate_quiz(request.lessonId, request.lessonTitle, request.language or "en"))

    return app


app = create_app()
