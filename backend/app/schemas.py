from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints, field_validator
from typing_extensions import Annotated


class ChatTurn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    role: Literal["user", "assistant"]
    content: Annotated[str, StringConstraints(min_length=1, max_length=1000)]


class ChatRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    message: Annotated[str, StringConstraints(min_length=1, max_length=1000)]
    history: list[ChatTurn] = Field(default_factory=list, max_length=8)


class ChatLink(BaseModel):
    label: str
    href: str


class ChatResponse(BaseModel):
    answer: str
    links: list[ChatLink] = Field(default_factory=list)


class ContactRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: Annotated[str, StringConstraints(min_length=1, max_length=100)]
    email: EmailStr
    subject: Annotated[str, StringConstraints(min_length=1, max_length=150)]
    message: Annotated[str, StringConstraints(min_length=1, max_length=4000)]
    website: Annotated[str, StringConstraints(max_length=200)] = ""

    @field_validator("name", "subject")
    @classmethod
    def reject_header_control_characters(cls, value: str) -> str:
        if any(ord(character) < 32 or ord(character) == 127 for character in value):
            raise ValueError("Control characters are not allowed.")
        return value


class ContactResponse(BaseModel):
    status: Literal["sent"]