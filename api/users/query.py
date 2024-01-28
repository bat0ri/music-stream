import strawberry
from typing import List
from users.schemas import UserType
from users.repository import UserRepository
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

@strawberry.type
class Query:

    @strawberry.field
    def hello(self) -> str:
        return "Hello World!"

    @strawberry.field
    async def get_users(self) -> List[UserType]:
        return await UserRepository.get_all()

