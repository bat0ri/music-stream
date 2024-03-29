import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv


load_dotenv()

DB_URL = os.getenv('DB_CONFIG')


#engine = create_async_engine(DB_URL, future=True, echo=True)

#async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

#async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
#    async with async_session() as session:
#        yield session


class DatabaseSession:
    def __init__(self, url: str = DB_URL):
        self.engine = create_async_engine(url, future=True, echo=True)
        self.SessionLocal = sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )


    async def close(self):
        await self.engine.dispose()


    async def __aenter__(self) -> AsyncSession:
        self.session = self.SessionLocal()
        return self.session


    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.close()


    async def get_db(self) -> AsyncSession:
        async with self as db:
            yield db


    async def commit_rollback(self):
        try:
            await self.session.commit()
        except Exception as e:
            print(e)
            await self.session.rollback()
            raise


db = DatabaseSession()