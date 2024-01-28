from fastapi import Depends
from sqlalchemy import select, delete, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from users.model import User
from config import db



class UserRepository:


    @staticmethod
    async def insert(new_user: User) -> User:
        async with db as session:
            async with session.begin():
                session.add(new_user)
            await db.commit_rollback()


    @staticmethod
    async def get_all():
        async with db as session:
            query = select(User)
            result = await session.execute(query)
            return result.scalars().all()