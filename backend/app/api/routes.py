import asyncio
import logging
import smtplib
import time
from collections import defaultdict
from email.message import EmailMessage
from threading import Lock

from fastapi import APIRouter, HTTPException, Request

from app.core.config import Settings
from app.schemas import ChatLink, ChatRequest, ChatResponse, ContactRequest, ContactResponse
from app.services.gemini import generate_answer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


class WindowRateLimiter:
    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._hits: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def allow(self, key: str, now: float | None = None) -> bool:
        current = time.monotonic() if now is None else now
        cutoff = current - self.window_seconds
        with self._lock:
            if len(self._hits) > 10_000:
                self._hits = defaultdict(
                    list,
                    {client: [hit for hit in hits if hit > cutoff] for client, hits in self._hits.items()},
                )
            recent = [hit for hit in self._hits[key] if hit > cutoff]
            if len(recent) >= self.limit:
                self._hits[key] = recent
                return False
            recent.append(current)
            self._hits[key] = recent
            return True


chat_limiter = WindowRateLimiter(limit=10, window_seconds=60)
contact_limiter = WindowRateLimiter(limit=5, window_seconds=60)


def client_key(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def section_links(message: str) -> list[ChatLink]:
    text = message.casefold()
    if "trader" in text or "market" in text or "fraud" in text or "churn" in text or "diabetes" in text or "mnist" in text or "object" in text:
        return [ChatLink(label="View projects", href="/#projects")]
    if "skill" in text or "technology" in text or "fastapi" in text or "python" in text:
        return [ChatLink(label="Explore skills", href="/#skills")]
    if "education" in text or "degree" in text or "college" in text:
        return [ChatLink(label="View education", href="/#education")]
    if "contact" in text or "email" in text or "resume" in text:
        return [ChatLink(label="Get in touch", href="/#contact")]
    if "experience" in text or "intern" in text:
        return [ChatLink(label="View experience", href="/#experience")]
    return [ChatLink(label="Explore portfolio", href="/#about")]


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    if not chat_limiter.allow(client_key(request)):
        raise HTTPException(status_code=429, detail="Too many chat requests. Please wait a minute and try again.")
    settings = Settings.from_env()
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Ask Ayan AI is not configured. Set GEMINI_API_KEY in the backend environment.",
        )
    history = [{"role": turn.role, "content": turn.content} for turn in payload.history]
    try:
        answer = await generate_answer(payload.message, history, settings.gemini_api_key, settings.gemini_model)
    except Exception as exc:
        logger.error("Gemini request failed (%s).", type(exc).__name__)
        raise HTTPException(
            status_code=502,
            detail="The AI assistant is temporarily unavailable. Please try again.",
        ) from exc
    return ChatResponse(answer=answer, links=section_links(payload.message))


def send_contact_email(settings: Settings, payload: ContactRequest) -> None:
    email = EmailMessage()
    email["Subject"] = f"Portfolio contact: {payload.subject}"
    email["From"] = settings.smtp_username
    email["To"] = settings.contact_email
    email["Reply-To"] = str(payload.email)
    email.set_content(
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n\n"
        f"{payload.message}"
    )

    if settings.smtp_port == 465:
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(email)
        return
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(email)


@router.post("/contact", response_model=ContactResponse)
async def contact(payload: ContactRequest, request: Request) -> ContactResponse:
    if not contact_limiter.allow(client_key(request)):
        raise HTTPException(status_code=429, detail="Too many contact requests. Please try again later.")
    if payload.website:
        raise HTTPException(status_code=400, detail="The contact submission could not be accepted.")
    settings = Settings.from_env()
    if not settings.has_email_configuration():
        raise HTTPException(
            status_code=503,
            detail="Contact delivery is not configured. Please email Ayan directly.",
        )
    try:
        await asyncio.wait_for(asyncio.to_thread(send_contact_email, settings, payload), timeout=12)
    except Exception as exc:
        logger.error("Contact email delivery failed (%s).", type(exc).__name__)
        raise HTTPException(
            status_code=502,
            detail="The message could not be delivered. Please use the direct email link instead.",
        ) from exc
    return ContactResponse(status="sent")