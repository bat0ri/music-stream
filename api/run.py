from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from users.mutation import Mutation
from users.query import Query

from strawberry.fastapi import GraphQLRouter
import strawberry


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")


@app.get("/", response_model=dict)
async def check():
    return {'status' : 200}

