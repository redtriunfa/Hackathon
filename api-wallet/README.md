# API Wallet - Hackathon Interledger

## Endpoints y Especificaciones (actualizado 2025-11-08)

### 1. Registro de usuario (`/api/register`)
- **POST** `/api/register`
- **Body ejemplo:**
```json
{
  "user_id": "u_123",
  "phone": "+5215551234567",
  "interledger_wallet_id": "w_456",
  "preferred_method": "wallet_token",
  "pin": "1234",
  "wallet_token": "token_simulado"
}
```
- **Respuesta:**
```json
{
  "user_id": "u_123",
  "phone": "+5215551234567",
  "interledger_wallet_id": "w_456",
  "preferred_method": "wallet_token",
  "account_address": "openpayments.example.com/accounts/u_123",
  "wallet_token": "token_simulado"
}
```
- El campo `wallet_token` se almacena en la base de datos en el campo `state_context` (JSON).

### 2. Consulta de saldo (`/api/balance`)
- **POST** `/api/balance`
- **Body ejemplo:**
```json
{
  "user_id": "u_123",
  "phone": "+5215551234567",
  "interledger_wallet_id": "w_456",
  "preferred_method": "wallet_token"
}
```
- **Respuesta:**
```json
{
  "user_id": "u_123",
  "phone": "+5215551234567",
  "interledger_wallet_id": "w_456",
  "preferred_method": "wallet_token",
  "Balance": 1000
}
```

### 3. Transferencia (`/api/transfer`)
- **POST** `/api/transfer`
- **Body ejemplo:**
```json
{
  "tx_id": "tx_20251108_0001",
  "user_id": "u_123",
  "interledger_wallet_id": "w_456",
  "amount": 150.00,
  "currency": "MXN",
  "status": "pending",
  "created_at": "2025-11-08T13:00:00Z",
  "idempotency_key": "uuid-v4"
}
```
- **Respuesta:**
```json
{
  "tx_id": "tx_20251108_0001",
  "user_id": "u_123",
  "interledger_wallet_id": "w_456",
  "amount": 150.00,
  "currency": "MXN",
  "status": "confirmed",
  "created_at": "2025-11-08T13:00:00Z",
  "idempotency_key": "uuid-v4"
}
```

### 4. Confirmación de pago (`/api/confirm-payment`)
- **POST** `/api/confirm-payment`
- **Body ejemplo:**
```json
{
  "session_id": "sess_789",
  "user_id": "u_123",
  "flow": "confirm_payment",
  "step": "awaiting_confirmation",
  "expires_at": 1700000000
}
```
- **Respuesta:**
```json
{
  "session_id": "sess_789",
  "user_id": "u_123",
  "flow": "confirm_payment",
  "step": "awaiting_confirmation",
  "expires_at": 1700000000
}
```

### 5. Notas sobre credenciales y base de datos

- El campo `state_context` en la tabla `productores_wallet` almacena las credenciales del wallet (por ejemplo, `wallet_token`) en formato JSON.
- El campo `interledger_wallet_id` identifica la wallet asociada a cada usuario y se usa en todas las operaciones.
- Para pagos reales, el backend debe usar el `wallet_token` almacenado en `state_context` para autenticar la operación contra Open Payments.

## Pruebas rápidas (PowerShell/Invoke-RestMethod)

#### Registro:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method POST -ContentType "application/json" -Body '{"user_id": "u_123", "phone": "+5215551234567", "interledger_wallet_id": "w_456", "preferred_method": "wallet_token", "pin": "1234", "wallet_token": "token_simulado"}'
```
#### Saldo:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/balance" -Method POST -ContentType "application/json" -Body '{"user_id": "u_123", "phone": "+5215551234567", "interledger_wallet_id": "w_456", "preferred_method": "wallet_token"}'
```
#### Transferencia:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/transfer" -Method POST -ContentType "application/json" -Body '{"tx_id": "tx_20251108_0001", "user_id": "u_123", "interledger_wallet_id": "w_456", "amount": 150.00, "currency": "MXN", "status": "pending", "created_at": "2025-11-08T13:00:00Z", "idempotency_key": "uuid-v4"}'
```
#### Confirmación de pago:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/confirm-payment" -Method POST -ContentType "application/json" -Body '{"session_id": "sess_789", "user_id": "u_123", "flow": "confirm_payment", "step": "awaiting_confirmation", "expires_at": 1700000000}'
```

## Estructura de Carpetas

```
api-wallet/
├── src/
│   ├── functions/
│   │   ├── balance.js
│   │   ├── setPin.js
│   │   ├── p2pPayment.js
│   │   ├── initiateWithdrawal.js
│   │   ├── tandas.js
│   │   ├── creditSale.js
│   │   ├── distributeWm.js
│   │   └── timerTanda.js
│   ├── db/
│   │   ├── mysql.js
│   │   └── schema.sql
│   ├── utils/
│   │   ├── security.js
│   │   └── response.js
│   └── config/
│       └── index.js
├── tests/
│   └── (archivos de pruebas unitarias)
├── .env.example
├── package.json
├── README.md
└── docker-compose.yml
```

## Descripción

- **src/functions/**: Endpoints de la API (Azure Functions).
- **src/db/**: Conexión y scripts de base de datos.
- **src/utils/**: Utilidades para seguridad y respuestas.
- **src/config/**: Configuración y variables de entorno.
- **tests/**: Pruebas unitarias.
- **.env.example**: Ejemplo de configuración.
- **docker-compose.yml**: Para integración local de Rafiki.

## Primeros Pasos

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno: copiar `.env.example` a `.env` y editar.
3. Desplegar funciones en Azure o correr localmente con Azure Functions Core Tools.
4. Ejecutar el script SQL en la base de datos MySQL de Azure.

## Rafiki Local Playground

Para levantar Rafiki localmente para pruebas de Web Monetization y pagos Interledger:

```sh
cd api-wallet
docker-compose up
```

Esto iniciará los servicios de Rafiki, Postgres y Redis en los puertos 3000, 3001, 5432 y 6379. La API puede integrarse con Rafiki usando las variables `RAFIKI_URL` y `RAFIKI_API_KEY` en `.env`.

## Contrato de API

Ver documento "Plan de Proyecto Hackathon Interledger.pdf" sección 2.2 para los endpoints REST a implementar.
