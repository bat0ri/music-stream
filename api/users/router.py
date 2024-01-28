from fastapi import APIRouter

from users.repository import UserRepository


router = APIRouter(prefix='/users')


@router.get('/all')
async def get_all_users():
    with UserRepository() as session:
        users = await session.get_all()
    return users