# API Wallet - Hackathon Interledger

## Propósito y Visión

Este proyecto forma parte del Hackathon Interledger, cuyo objetivo es crear una solución de pagos y transferencias digitales integrando WhatsApp, Open Payments y Rafiki, facilitando la interoperabilidad financiera para usuarios y productores rurales. La arquitectura busca simplicidad, velocidad de desarrollo y facilidad de integración entre servicios.

## Arquitectura del Proyecto

### Hackathon-1 (Actual)
- **API Wallet:** Implementada en Node.js, expone endpoints REST para registro, consulta de saldo, transferencias y confirmación de pagos.
- **Base de datos:** MySQL local.
- **Integración:** SDK Open Payments y Rafiki para pagos Interledger.
- **Despliegue:** Ejecución local, configuración por archivo .env, sin Docker ni serverless.

### Hackathon-2 (Migración)
- **API Wallet:** Migración a Python (FastAPI), simplificando la integración y mantenimiento.
- **Orquestador Conversacional:** FastAPI recibe webhooks de Twilio Sandbox para WhatsApp y gestiona la lógica conversacional.
- **Integración con IA:** Consumo de servicios de Azure AI Foundry desde Python.
- **Despliegue:** Local y en VM Linux (Azure), sin contenedores ni serverless.

## Integración con WhatsApp

El flujo principal conecta WhatsApp (Twilio Sandbox) con el orquestador Python, que a su vez consume los servicios de la API Wallet y Open Payments. El repositorio de la API que da servicio a WhatsApp es:  
[ui_wasapp](https://github.com/redtriunfa/ui_wasapp)

## Flujos de Datos

- **Consulta de saldo:** WhatsApp → Orquestador Python → API Wallet → SDK Open Payments → Rafiki → Respuesta.
- **Transferencia:** WhatsApp → Orquestador Python → API Wallet → SDK Open Payments → Rafiki → Respuesta.

## Endpoints y Especificaciones (Node.js, actual)

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

## Estructura de Carpetas

```
api-wallet/
├── src/
│   ├── functions/
│   ├── db/
│   ├── utils/
│   └── config/
├── tests/
├── .env.example
├── package.json
├── README.md
└── docker-compose.yml
```

## Primeros Pasos

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno: copiar `.env.example` a `.env` y editar.
3. Ejecutar la API localmente: `npm start`
4. Probar los endpoints usando PowerShell, curl o Postman.

## Migración y Roadmap

- El proyecto se migrará a Python/FastAPI para facilitar la integración y mantenimiento.
- El despliegue será local y en VM Linux (Azure), sin contenedores ni serverless.
- La integración con WhatsApp y Open Payments se mantendrá, alineada con la arquitectura simplificada del Hackathon.

## Referencias

- [Plan de Trabajo Hackathon Interledger](./Plan%20de%20Trabajo2.md)
- [API WhatsApp - ui_wasapp](https://github.com/redtriunfa/ui_wasapp)
- [Open Payments SDK](https://github.com/interledger/open-payments)

---
