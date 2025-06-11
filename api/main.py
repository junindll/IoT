from fastapi import FastAPI, WebSocket
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware # Importa o CORS

app = FastAPI()

origins = [
    "*" 
]

.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["iot"]
collection = db["data"]

@app.post("/data")
async def post_data(payload: dict):
    """Recebe os dados dos sensores e armazena no MongoDB[cite: 11, 12]."""
    collection.insert_one(payload)
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """Fornece um endpoint WebSocket para dados em tempo real[cite: 8, 13]."""
    await ws.accept()
    while True:
        await ws.send_text("ping")

@app.get("/")
async def read_root():
    return {"message": "API IoT Monitoring está no ar!"}

@app.get("/history/{sensor_id}")
async def get_history(sensor_id: str, limit: int = 20):
    """Busca os 'limit' (padrão 20) dados mais recentes de um sensor, em ordem cronológica."""
    cursor = collection.find(
        {"sensor_id": sensor_id}
    ).sort("_id", -1).limit(limit)
    
    results = [parse_json(doc) for doc in cursor]
    results.reverse()

    return results