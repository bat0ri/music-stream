FROM python:3.11.2-alpine

EXPOSE 50051

WORKDIR /code

RUN pip install --upgrade pip
RUN apk add gcc musl-dev libffi-dev

RUN pip install grpcio grpcio-tools 

COPY . /code

CMD ["python", "main.py"]