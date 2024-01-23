from fastapi import FastAPI


app = FastAPI()


@app.get("/", response_model=dict)
async def check():
    return {'status' : 200}

