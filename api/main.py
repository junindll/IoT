from fastapi import FastAPI, WebSocket
from pymongo import MongoClient
import os

app = FastAPI()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["iot"]
collection = db["data"]

@app.post("/data")
async def post_data(payload: dict):
    collection.insert_one(payload)
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    while True:
        await ws.send_text("ping")

from fastapi import FastAPI, WebSocket
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers["*"]
)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["iot"]
collection = db["data"]

@app.post("/data")
async def post_data(payload: dict):
    collection.insert_one(payload)
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    while True:
        await ws.send_text("ping")