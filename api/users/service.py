from users.repository import UserRepository
from users.model import User
from users.schemas import AuthInput, LoginType, AuthInputBase
from users.hashing import BcryptHasher
import jwt


SECRET_KEY = "KITTY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


async def registration(data: AuthInput):
    if await UserRepository.get_by_email(data.email):
        raise ValueError("EMAIL_ALREADY_REGISTERED")
    else:
        _user = User(email=data.email, hash_password=BcryptHasher.get_password_hash(data.password))
        await UserRepository.insert(new_user=_user)
        return "USER IS REGISTER"


async def login_user(data: AuthInput):

    try:
        AuthInputBase(**(data.__dict__))
    except Exception as e:
        raise ValueError("INVALID_EMAIL_FORMAT")


    if user:=await UserRepository.get_by_email(data.email):
        if BcryptHasher.verify_password(data.password, user.hash_password):
            token = jwt.encode({"sub": data.email}, SECRET_KEY, algorithm="HS256")
            return LoginType(email=data.email,token=token)
        else:
            raise ValueError("PASS IS WRONG")
    else:
        raise ValueError("USER IS NOT REGISTER")
