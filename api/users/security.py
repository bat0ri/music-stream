import typing

from strawberry.permission import BasePermission
from strawberry.types import Info
import jwt


SECRET_KEY = "KITTY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class IsAuthenticated(BasePermission):
    message = "User is not Authenticated"

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        request = info.context["request"]
        # Access headers authentication
        authentication = request.headers["authentication"]
        if authentication:
            token = authentication.split("Bearer ")[-1]
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return False