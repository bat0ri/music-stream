from auth.models import User
from auth.schema import CreateUser, GetUserByEmail, GetUserByUsername
from config import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from sqlalchemy import select, delete, update, func
from auth.hashing import BcryptHasher
import datetime


class UserRepository():

    def __init__(self, session: AsyncSession = Depends(get_async_session)):
        self.session = session

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.session.close()

    async def close(self):
        await self.session.close()


    async def insert_user(self, new_user: User):
        '''
            Добавление пользователя в базу данных
        '''
        self.session.add(new_user)
        await self.session.commit()
        return new_user


    async def get_all_users(self):
        '''
            Вывод всех пользователей
        '''
        query = select(User).filter(User.is_active==True)
        user_list = await self.session.execute(query)
        return user_list.scalars().all()


    async def get_user_by_email(self, email: GetUserByEmail):
        '''
            Вывод пользователяя по почте
        '''
        query = select(User).where(User.email==email)
        user = await self.session.execute(query)
        return user.scalars().first()


    async def check_new_email(self, email: GetUserByEmail):
        '''
            Проверка почты 
        '''
        query = select(User).where(User.email==email)
        user = await self.session.execute(query)
        if user.scalars().first() is not None:
            return True
        else:
            return False


    async def get_user_by_username(self, username: GetUserByUsername):
        '''
            Вывод пользователя по имени
        '''
        query = select(User).where(User.username==username)
        user = await self.session.execute(query)
        return user.scalars().first()


    async def delete_user(self, username: GetUserByUsername):
        '''
            Удаление пользователя (бан)
        '''
        query = update(User).where(User.username==username).values(is_active=False)
        await self.session.execute(query)
        await self.session.commit()
        return await self.get_user_by_username(username=username)


    async def drop_user(self, username: str):
        '''
            Удаление пользователя (дроп с бд)
        '''
        delete_query = delete(User).where(User.username == username)
        await self.session.execute(delete_query)
        await self.session.commit()
        
    