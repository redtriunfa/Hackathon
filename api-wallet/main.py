from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import bcrypt

# Ejemplo de integración con el SDK de Open Payments (ajustar el import según el paquete real)
# import openpayments

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
    # Validar PIN contra base de datos
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT pin_hash FROM productores_wallet WHERE usuario_id=%s", (req.usuario_id,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(req.pin.encode(), user["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
    db.close()
    # Integración con SDK Open Payments (simulado)
    # saldo = openpayments.get_balance(req.usuario_id)
    saldo = 1000.0  # Simulación, reemplazar por saldo real del SDK
    return {"usuario_id": req.usuario_id, "balance": saldo, "moneda": "MXN"}

@app.post("/api/transfer")
async def transfer(req: TransferRequest):
    # Validar PIN contra base de datos
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT id, pin_hash FROM productores_wallet WHERE usuario_id=%s", (req.from_usuario_id,))
        payer = cursor.fetchone()
        cursor.execute("SELECT id FROM productores_wallet WHERE usuario_id=%s", (req.to_usuario_id,))
        payee = cursor.fetchone()
        if not payer or not bcrypt.checkpw(req.pin.encode(), payer["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
        if not payee:
            db.close()
            raise HTTPException(status_code=404, detail="DESTINATARIO_NO_ENCONTRADO")
        # Integración con SDK Open Payments (simulado)
        # resultado = openpayments.transfer(req.from_usuario_id, req.to_usuario_id, req.amount)
        resultado = "ok"  # Simulación, reemplazar por resultado real del SDK

        # Registrar la transacción en la tabla transacciones
        cursor.execute(
            """
            INSERT INTO transacciones (
                id_wallet_payer, id_wallet_payee, amount, currency, concept, status, prefer_method
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                payer["id"],
                payee["id"],
                req.amount,
                "MXN",
                "Transferencia entre usuarios",
                "COMPLETADA" if resultado == "ok" else "FALLIDA",
                "open_payments"
            )
        )
        db.commit()
    db.close()
    return {
        "from_usuario_id": req.from_usuario_id,
        "to_usuario_id": req.to_usuario_id,
        "amount": req.amount,
        "moneda": "MXN",
        "resultado": resultado
    }

# NOTA: Cuando el equipo 1 defina el JSON, ajustar los modelos y la lógica de los endpoints.
