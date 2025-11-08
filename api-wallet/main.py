from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pymysql
import bcrypt

app = FastAPI(
    title="API Wallet Interledger",
    description="Backend de pagos Interledger - Hackathon",
    version="1.0.0"
)

# Configuración CORS (ajustar según necesidades)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de conexión a MySQL (ajustar con variables de entorno reales)
def get_db():
    return pymysql.connect(
        host="AZURE_MYSQL_HOST",
        user="AZURE_MYSQL_USER",
        password="AZURE_MYSQL_PASSWORD",
        database="AZURE_MYSQL_DB",
        cursorclass=pymysql.cursors.DictCursor
    )

# Modelos de datos
class BalanceRequest(BaseModel):
    telefono_wa: str

class SetPinRequest(BaseModel):
    telefono_wa: str
    new_pin: str

class P2PPaymentRequest(BaseModel):
    from_wa: str
    to_wa: str
    amount: float
    pin: str

class WithdrawalRequest(BaseModel):
    telefono_wa: str
    amount: float
    pin: str

class CreditSaleRequest(BaseModel):
    wp_user_id: Optional[int] = None
    telefono_wa: Optional[str] = None
    amount: float

class DistributeWMRequest(BaseModel):
    amount: float

# Endpoint: GET /api/balance
@app.get("/api/balance")
def get_balance(telefono_wa: str):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT saldo_mxn FROM productores_wallet WHERE telefono_wa=%s", (telefono_wa,))
        result = cursor.fetchone()
    db.close()
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"balance": result["saldo_mxn"]}

# Endpoint: POST /api/set-pin
@app.post("/api/set-pin")
def set_pin(req: SetPinRequest):
    salt = bcrypt.gensalt()
    pin_hash = bcrypt.hashpw(req.new_pin.encode(), salt)
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("UPDATE productores_wallet SET pin_hash=%s WHERE telefono_wa=%s", (pin_hash, req.telefono_wa))
        db.commit()
    db.close()
    return {"success": True, "message": "PIN configurado"}

# Endpoint: POST /api/p2p-payment
@app.post("/api/p2p-payment")
def p2p_payment(req: P2PPaymentRequest):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT pin_hash, saldo_mxn FROM productores_wallet WHERE telefono_wa=%s", (req.from_wa,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(req.pin.encode(), user["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
        if user["saldo_mxn"] < req.amount:
            db.close()
            raise HTTPException(status_code=400, detail="FONDOS_INSUFICIENTES")
        cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn-%s WHERE telefono_wa=%s", (req.amount, req.from_wa))
        cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn+%s WHERE telefono_wa=%s", (req.amount, req.to_wa))
        db.commit()
    db.close()
    return {"success": True, "new_balance": user["saldo_mxn"] - req.amount}

# Endpoint: POST /api/initiate-withdrawal
@app.post("/api/initiate-withdrawal")
def initiate_withdrawal(req: WithdrawalRequest):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT pin_hash, saldo_mxn, clabe_registrada FROM productores_wallet WHERE telefono_wa=%s", (req.telefono_wa,))
        user = cursor.fetchone()
        if not user or not bcrypt.checkpw(req.pin.encode(), user["pin_hash"].encode()):
            db.close()
            raise HTTPException(status_code=401, detail="PIN_INCORRECTO")
        if user["saldo_mxn"] < req.amount:
            db.close()
            raise HTTPException(status_code=400, detail="FONDOS_INSUFICIENTES")
        cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn-%s WHERE telefono_wa=%s", (req.amount, req.telefono_wa))
        db.commit()
    db.close()
    return {"success": True, "message": f"Simulación de SPEI a CLABE [{user['clabe_registrada']}] exitosa."}

# Endpoint: GET /api/tandas
@app.get("/api/tandas")
def get_tandas(telefono_wa: str):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM tanda_miembros WHERE telefono_wa=%s", (telefono_wa,))
        tandas = cursor.fetchall()
    db.close()
    if not tandas:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"tandas": tandas}

# Endpoint: POST /api/credit-sale
@app.post("/api/credit-sale")
def credit_sale(req: CreditSaleRequest):
    db = get_db()
    with db.cursor() as cursor:
        if req.telefono_wa:
            cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn+%s WHERE telefono_wa=%s", (req.amount, req.telefono_wa))
        elif req.wp_user_id:
            cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn+%s WHERE wp_user_id=%s", (req.amount, req.wp_user_id))
        db.commit()
    db.close()
    return {"success": True}

# Endpoint: POST /api/distribute-wm
@app.post("/api/distribute-wm")
def distribute_wm(req: DistributeWMRequest):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as total FROM productores_wallet")
        result = cursor.fetchone()
        total = result["total"] if result and result["total"] is not None else 0
        if total == 0:
            db.close()
            raise HTTPException(status_code=400, detail="No hay usuarios para distribuir")
        amount_per_user = req.amount / total
        cursor.execute("UPDATE productores_wallet SET saldo_mxn=saldo_mxn+%s", (amount_per_user,))
        db.commit()
    db.close()
    return {"success": True, "distributed_to": total, "amount_per_user": amount_per_user}
