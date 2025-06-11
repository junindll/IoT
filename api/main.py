from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware
import json
from bson import json_util

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    async def broadcast(self, message: str):
        for connection in self.active_connections[:]:
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()
app = FastAPI()
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

client = MongoClient(os.getenv("MONGO_URI"))
db = client["iot"]
collection = db["data"]

def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.get("/")
async def read_root():
    return {"message": "API IoT Monitoring está no ar!"}

@app.post("/data")
async def post_data(payload: dict):
    collection.insert_one(payload)
    await manager.broadcast(json.dumps(payload))
    return {"status": "ok"}

# --- MODIFICAÇÃO PRINCIPAL AQUI ---
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    # Adicionamos um print para ver nos logs do Render se a conexão chega aqui
    print(f"!!! CONEXÃO WEBSOCKET ACEITA de {ws.client.host} !!!")
    try:
        # Em vez de enviar pings, vamos apenas esperar por mensagens (mantém a conexão aberta)
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        # Quando o cliente desconectar, registramos e removemos da lista
        print(f"--- CONEXÃO WEBSOCKET FECHADA de {ws.client.host} ---")
        manager.disconnect(ws)
# --- FIM DA MODIFICAÇÃO ---

@app.get("/history/{sensor_id}")
async def get_history(sensor_id: str, limit: int = 20):
    cursor = collection.find({"sensor_id": sensor_id}).sort("_id", -1).limit(limit)
    results = [parse_json(doc) for doc in cursor]
    results.reverse()
    return results