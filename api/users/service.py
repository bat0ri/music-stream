from users.repository import UserRepository
from users.model import User
from users.schemas import RegisterInput


async def registration(data: RegisterInput):
    _user = data.to_user()
    return await UserRepository.insert(new_user=_user)