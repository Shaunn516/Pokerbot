import logging

import httpx
from fastapi import HTTPException

from app.config import Settings

logger = logging.getLogger(__name__)


async def call_deepseek(messages: list[dict[str, str]], settings: Settings) -> str:
    if not settings.deepseek_configured:
        raise HTTPException(
            status_code=503,
            detail="DeepSeek API key is not configured on the server.",
        )

    payload = {
        "model": settings.deepseek_model,
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 900,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
            response = await client.post(
                settings.deepseek_endpoint,
                headers={
                    "Authorization": f"Bearer {settings.deepseek_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except httpx.TimeoutException as exc:
        logger.warning("DeepSeek request timed out")
        raise HTTPException(status_code=504, detail="DeepSeek request timed out.") from exc
    except httpx.RequestError as exc:
        logger.warning("DeepSeek request failed: %s", exc.__class__.__name__)
        raise HTTPException(status_code=502, detail="Could not reach DeepSeek API.") from exc

    if response.status_code >= 400:
        logger.warning("DeepSeek returned status %s", response.status_code)
        detail = "DeepSeek API returned an error."
        try:
            error_payload = response.json()
            detail = error_payload.get("error", {}).get("message") or detail
        except ValueError:
            pass
        raise HTTPException(status_code=502, detail=detail)

    try:
        data = response.json()
        reply = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        logger.warning("Unexpected DeepSeek response shape")
        raise HTTPException(status_code=502, detail="DeepSeek returned an invalid response.") from exc

    if not reply:
        raise HTTPException(status_code=502, detail="DeepSeek returned an empty response.")

    return reply

