import strawberry
from users.schemas import RegisterInput
from users.service import registration



@strawberry.type
class Mutation:

    @strawberry.mutation
    async def register(self, data: RegisterInput)-> str :
        try:
            user = await registration(data=data)
            return "201 success"
        except Exception as e:
            return "FAIL"