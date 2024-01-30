import strawberry
from typing import Optional, Union
from users.schemas import AuthInput, AuthInputBase, LoginType
from users.service import registration, login_user



@strawberry.type
class Mutation:

    @strawberry.mutation
    async def register(self, data: AuthInput) -> str:
        try:
            AuthInputBase(**(data.__dict__))
            return await registration(data=data)
        except Exception as e:
            if 'email' in str(e).lower() and 'validation error' in str(e).lower():
                raise ValueError("INVALID_EMAIL_FORMAT")
            return str(e)


    @strawberry.mutation
    async def login(self, data: AuthInput) -> LoginType:
        return await login_user(data=data)
    


