from fastapi import FastAPI

from users.mutation import Mutation
from users.query import Query
from users.router import router

from strawberry.fastapi import GraphQLRouter
import strawberry




app = FastAPI()


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")


@app.get("/", response_model=dict)
async def check():
    return {'status' : 200}


app.include_router(router=router)