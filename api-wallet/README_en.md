# API Wallet - Interledger Hackathon

## Purpose and Vision

This project is part of the Interledger Hackathon, aiming to create a digital payments and transfers solution integrating WhatsApp, Open Payments, and Rafiki, facilitating financial interoperability for users and rural producers. The architecture seeks simplicity, development speed, and ease of integration between services.

## Project Architecture

### Hackathon-1 (Current)
- **API Wallet:** Implemented in Node.js, exposes REST endpoints for registration, balance inquiry, transfers, and payment confirmation.
- **Database:** Local MySQL.
- **Integration:** Open Payments SDK and Rafiki for Interledger payments.
- **Deployment:** Local execution, configuration via .env file, no Docker or serverless.

### Hackathon-2 (Migration)
- **API Wallet:** Migration to Python (FastAPI), simplifying integration and maintenance.
- **Conversational Orchestrator:** FastAPI receives webhooks from Twilio Sandbox for WhatsApp and manages conversational logic.
- **AI Integration:** Consumption of Azure AI Foundry services from Python.
- **Deployment:** Local and on Linux VM (Azure), no containers or serverless.

## WhatsApp Integration

The main flow connects WhatsApp (Twilio Sandbox) with the Python orchestrator, which in turn consumes the services of the API Wallet and Open Payments. The repository for the API serving WhatsApp is:  
[ui_wasapp](https://github.com/redtriunfa/ui_wasapp)

## Data Flows

- **Balance inquiry:** WhatsApp → Python Orchestrator → API Wallet → Open Payments SDK → Rafiki → Response.
- **Transfer:** WhatsApp → Python Orchestrator → API Wallet → Open Payments SDK → Rafiki → Response.

## Endpoints and Specifications (Node.js, current)

### 1. User Registration (`/api/register`)
- **POST** `/api/register`
- **Sample Body:**  
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
- **Response:**  
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

### 2. Balance Inquiry (`/api/balance`)
- **POST** `/api/balance`
- **Sample Body:**  
  ```json
  {
    "user_id": "u_123",
    "phone": "+5215551234567",
    "interledger_wallet_id": "w_456",
    "preferred_method": "wallet_token"
  }
  ```
- **Response:**  
  ```json
  {
    "user_id": "u_123",
    "phone": "+5215551234567",
    "interledger_wallet_id": "w_456",
    "preferred_method": "wallet_token",
    "Balance": 1000
  }
  ```

### 3. Transfer (`/api/transfer`)
- **POST** `/api/transfer`
- **Sample Body:**  
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
- **Response:**  
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

### 4. Payment Confirmation (`/api/confirm-payment`)
- **POST** `/api/confirm-payment`
- **Sample Body:**  
  ```json
  {
    "session_id": "sess_789",
    "user_id": "u_123",
    "flow": "confirm_payment",
    "step": "awaiting_confirmation",
    "expires_at": 1700000000
  }
  ```
- **Response:**  
  ```json
  {
    "session_id": "sess_789",
    "user_id": "u_123",
    "flow": "confirm_payment",
    "step": "awaiting_confirmation",
    "expires_at": 1700000000
  }
  ```

## Folder Structure

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

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment variables: copy `.env.example` to `.env` and edit.
3. Run the API locally: `npm start`
4. Test endpoints using PowerShell, curl, or Postman.

## Migration and Roadmap

- The project will migrate to Python/FastAPI to facilitate integration and maintenance.
- Deployment will be local and on Linux VM (Azure), without containers or serverless.
- Integration with WhatsApp and Open Payments will be maintained, aligned with the simplified Hackathon architecture.

## References

- [Interledger Hackathon Work Plan](./Plan%20de%20Trabajo2.md)
- [WhatsApp API - ui_wasapp](https://github.com/redtriunfa/ui_wasapp)
- [Open Payments SDK](https://github.com/interledger/open-payments)

---
