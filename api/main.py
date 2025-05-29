from fastapi import FastAPI, WebSocket
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware # Importa o CORS

# 1. Cria a instância do FastAPI APENAS UMA VEZ
app = FastAPI()

# 2. Define as origens permitidas
origins = [
    "*" # Permite tudo para testes. Idealmente, coloque a URL da Vercel aqui.
]

# 3. Adiciona o middleware CORS CORRETAMENTE
#    Esta é a solução para a integração entre serviços (CORS)[cite: 36].
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], # <--- CORRIGIDO AQUI
)

# 4. Configura o MongoDB APENAS UMA VEZ
#    Lê a variável de ambiente MONGO_URI[cite: 30].
#    Conecta ao MongoDB Atlas[cite: 7].
client = MongoClient(os.getenv("MONGO_URI"))
db = client["iot"]
collection = db["data"]

# 5. Define as rotas APENAS UMA VEZ
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
        # Por enquanto, apenas envia 'ping'. Idealmente, enviaria dados reais.
        await ws.send_text("ping")

# (Opcional, mas recomendado para testes - a rota raiz que sugerimos antes)
@app.get("/")
async def read_root():
    return {"message": "API IoT Monitoring está no ar!"}