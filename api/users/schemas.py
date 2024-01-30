import strawberry
from pydantic import BaseModel, EmailStr
from users.model import User
import uuid
from datetime import datetime


class AuthInputBase(BaseModel):
    email: EmailStr
    password: str


@strawberry.input
class AuthInput:
    email: str
    password: str


@strawberry.type
class LoginType:
    email: str
    token: str


@strawberry.type
class UserType:
    id: uuid.UUID
    email: str
    hash_password: str
    create_date: datetime