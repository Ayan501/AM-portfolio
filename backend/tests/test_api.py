from fastapi.testclient import TestClient

from app.api import routes
from app.core.config import Settings
from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_chat_reports_missing_gemini_configuration(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    response = client.post("/api/chat", json={"message": "Who is Ayan?"})
    assert response.status_code == 503
    assert "GEMINI_API_KEY" in response.json()["detail"]


def test_chat_validates_message_length() -> None:
    response = client.post("/api/chat", json={"message": "x" * 1001})
    assert response.status_code == 422


def test_chat_returns_grounded_response_and_section_link(monkeypatch) -> None:
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")

    async def fake_answer(message, history, api_key, model):
        assert api_key == "test-key"
        return "TraderIQ is a trader intelligence and risk-analysis project."

    monkeypatch.setattr(routes, "generate_answer", fake_answer)
    response = client.post("/api/chat", json={"message": "Explain TraderIQ"})
    assert response.status_code == 200
    assert response.json()["answer"].startswith("TraderIQ")
    assert response.json()["links"] == [{"label": "View projects", "href": "/#projects"}]


def test_chat_provider_error_is_safe(monkeypatch) -> None:
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")

    async def fail_answer(message, history, api_key, model):
        raise RuntimeError("private provider detail")

    monkeypatch.setattr(routes, "generate_answer", fail_answer)
    response = client.post("/api/chat", json={"message": "Who is Ayan?"})
    assert response.status_code == 502
    assert "private provider detail" not in response.text


def test_contact_requires_email_configuration(monkeypatch) -> None:
    for key in ("SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD"):
        monkeypatch.delenv(key, raising=False)
    monkeypatch.setenv("CONTACT_EMAIL", "ayanmansuri535@gmail.com")
    response = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "recruiter@example.com",
            "subject": "Opportunity",
            "message": "Hello",
            "website": "",
        },
    )
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"]


def test_contact_validates_email() -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "not-an-email",
            "subject": "Opportunity",
            "message": "Hello",
        },
    )
    assert response.status_code == 422


def test_contact_rejects_header_control_characters() -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Recruiter\r\nBcc: attacker@example.com",
            "email": "recruiter@example.com",
            "subject": "Opportunity",
            "message": "Hello",
        },
    )
    assert response.status_code == 422


def test_contact_honeypot_is_rejected(monkeypatch) -> None:
    monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
    monkeypatch.setenv("SMTP_PORT", "587")
    monkeypatch.setenv("SMTP_USERNAME", "sender@example.com")
    monkeypatch.setenv("SMTP_PASSWORD", "not-a-real-secret")
    monkeypatch.setenv("CONTACT_EMAIL", "ayanmansuri535@gmail.com")
    response = client.post(
        "/api/contact",
        json={
            "name": "Spam",
            "email": "spam@example.com",
            "subject": "Offer",
            "message": "Click here",
            "website": "https://spam.example",
        },
    )
    assert response.status_code == 400


def test_contact_reports_delivery_success_only_after_provider_accepts(monkeypatch) -> None:
    monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
    monkeypatch.setenv("SMTP_PORT", "587")
    monkeypatch.setenv("SMTP_USERNAME", "sender@example.com")
    monkeypatch.setenv("SMTP_PASSWORD", "not-a-real-secret")
    monkeypatch.setenv("CONTACT_EMAIL", "ayanmansuri535@gmail.com")
    monkeypatch.setattr(routes, "send_contact_email", lambda settings, payload: None)
    response = client.post(
        "/api/contact",
        json={
            "name": "Recruiter",
            "email": "recruiter@example.com",
            "subject": "Opportunity",
            "message": "Hello",
            "website": "",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"status": "sent"}


def test_rate_limiter_enforces_window_and_expiry() -> None:
    limiter = routes.WindowRateLimiter(limit=2, window_seconds=60)
    assert limiter.allow("test", now=100)
    assert limiter.allow("test", now=110)
    assert not limiter.allow("test", now=120)
    assert limiter.allow("test", now=161)


def test_wildcard_cors_origin_is_rejected(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ALLOWED_ORIGINS", "*")
    try:
        Settings.from_env()
    except ValueError as exc:
        assert "exact origins" in str(exc)
    else:
        raise AssertionError("Wildcard origins must be rejected.")


def test_empty_cors_configuration_is_rejected(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ALLOWED_ORIGINS", "")
    try:
        Settings.from_env()
    except ValueError as exc:
        assert "at least one exact origin" in str(exc)
    else:
        raise AssertionError("An empty CORS allowlist must be rejected.")