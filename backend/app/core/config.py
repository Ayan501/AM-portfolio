import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str
    gemini_model: str
    cors_allowed_origins: tuple[str, ...]
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    contact_email: str

    @classmethod
    def from_env(cls) -> "Settings":
        load_dotenv(Path(__file__).resolve().parents[2] / ".env")
        origins = os.getenv(
            "CORS_ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        )
        try:
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
        except ValueError as exc:
            raise ValueError("SMTP_PORT must be a valid integer.") from exc
        if not 1 <= smtp_port <= 65535:
            raise ValueError("SMTP_PORT must be between 1 and 65535.")
        allowed_origins = tuple(origin.strip() for origin in origins.split(",") if origin.strip())
        if not allowed_origins:
            raise ValueError("CORS_ALLOWED_ORIGINS must include at least one exact origin.")
        if "*" in allowed_origins:
            raise ValueError("CORS_ALLOWED_ORIGINS must contain exact origins, not a wildcard.")
        gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
        if not gemini_model:
            raise ValueError("GEMINI_MODEL cannot be empty.")
        return cls(
            gemini_api_key=os.getenv("GEMINI_API_KEY", "").strip(),
            gemini_model=gemini_model,
            cors_allowed_origins=allowed_origins,
            smtp_host=os.getenv("SMTP_HOST", "").strip(),
            smtp_port=smtp_port,
            smtp_username=os.getenv("SMTP_USERNAME", "").strip(),
            smtp_password=os.getenv("SMTP_PASSWORD", ""),
            contact_email=os.getenv("CONTACT_EMAIL", "").strip(),
        )

    def has_email_configuration(self) -> bool:
        return all((self.smtp_host, self.smtp_port, self.smtp_username, self.smtp_password, self.contact_email))