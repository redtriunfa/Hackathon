from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import bcrypt

app = FastAPI(
    title="API Wallet Interledger",
    description="Backend de pagos Interledger - Hackathon (Plan v2)",
    version="2.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MySQL (ajustar con variables de entorno reales)
def get_db():
    return pymysql.connect(
        host="AZURE_MYSQL_HOST",
        user="AZURE_MYSQL_USER",
        password="AZURE_MYSQL_PASSWORD",
        database="AZURE_MYSQL_DB",
        cursorclass=pymysql.cursors.DictCursor
    )

# Modelos genéricos para máxima flexibilidad (ajustar cuando equipo 1 defina el JSON)
class BalanceRequest(BaseModel):
    usuario_id: str
    pin: str

class TransferRequest(BaseModel):
    from_usuario_id: str
    to_usuario_id: str
    amount: float
    pin: str

@app.post("/api/balance")
async def balance(req: BalanceRequest):
    # TODO: Integrar con SDK Open Payments para consultar saldo en Rafiki
    # Ejemplo de integración (pendiente de detalles reales):
    # saldo = open_payments_sdk.get_balance(req.usuario_id)
    # Validar PIN contra base de datos si es necesario
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT pin_hash FROM productores_wallet WHERE usuario_id=%s", (req.usuario_id,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(req.pin.encode(), user["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
    db.close()
    # Respuesta simulada (ajustar cuando se integre SDK)
    return {"usuario_id": req.usuario_id, "balance": 1000.0, "moneda": "MXN"}

@app.post("/api/transfer")
async def transfer(req: TransferRequest):
    # TODO: Integrar con SDK Open Payments para transferir entre usuarios Rafiki
    # Ejemplo de integración (pendiente de detalles reales):
    # resultado = open_payments_sdk.transfer(req.from_usuario_id, req.to_usuario_id, req.amount)
    # Validar PIN contra base de datos si es necesario
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT pin_hash FROM productores_wallet WHERE usuario_id=%s", (req.from_usuario_id,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(req.pin.encode(), user["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
    db.close()
    # Respuesta simulada (ajustar cuando se integre SDK)
    return {
        "from_usuario_id": req.from_usuario_id,
        "to_usuario_id": req.to_usuario_id,
        "amount": req.amount,
        "moneda": "MXN",
        "resultado": "ok"
    }

# NOTA: Cuando el equipo 1 defina el JSON, ajustar los modelos y la lógica de los endpoints.
