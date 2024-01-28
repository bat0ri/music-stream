import strawberry
from users.model import User
import uuid
from datetime import datetime


@strawberry.input
class RegisterInput:
    email: str
    password: str

    def to_user(self):
        return User(email=self.email, hash_password=self.password)


@strawberry.type
class UserType:
    id: uuid.UUID
    email: str
    hash_password: str
    create_date: datetime