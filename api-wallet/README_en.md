# API Wallet - Interledger Hackathon

## Purpose

This API Wallet is part of the Interledger Hackathon and provides endpoints for user registration, balance inquiry, transfers, and payment confirmation, using Node.js, Express, MySQL, and (optionally) Open Payments SDK.

## Endpoints

### 1. User Registration (`POST /api/register`)

**Request Body:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXXXX",
  "wp_user_id": "456",
  "preferred_method": "wallet_token",
  "pin": "1234",
  "wallet_token": "simulated_token"
}
```
**Required fields:** user_id, phone, wp_user_id, preferred_method, pin, wallet_token

**Response:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXXXX",
  "interledger_wallet_id": "https://ilp.interledger-test.dev/9640001",
  "preferred_method": "wallet_token",
  "account_address": "https://ilp.interledger-test.dev/9640001",
  "wallet_token": "simulated_token",
  "currency": "MXN",
  "created_at": "2025-11-08T13:00:00Z",
  "wp_user_id": "456",
  "initial_deposit": 100
}
```
- Registers a new user, hashes the PIN, assigns a wallet, and gives an initial deposit of 100 MXN.
- Returns 409 if the user already exists.

---

### 2. Balance Inquiry (`POST /api/balance`)

**Request Body:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXX10",
  "wp_user_id": "457",
  "preferred_method": "wallet_token"
}
```
**Required fields:** user_id, phone, wp_user_id, preferred_method

**Response:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXX10",
  "wp_user_id": "457",
  "preferred_method": "wallet_token",
  "balance": 120.00,
  "currency": "MXN"
}
```
- Returns the current balance and currency for the user.

---

### 3. Transfer (`POST /api/transfer`)

**Request Body:**
```json
{
  "tx_id": "tx_20251108_0001",
  "user_id": "u_125",
  "wp_user_id": 456,
  "payee_user_id": 457,
  "payee_wp_user_id": 456,
  "amount": 20.00,
  "currency": "MXN",
  "status": "pending",
  "created_at": "2025-11-08T13:00:00Z",
  "idempotency_key": "uuid-v4",
  "concept": "Payment for tanda",
  "preferred_method": "wallet_token"
}
```
**Required fields:** tx_id, user_id, wp_user_id, payee_user_id, payee_wp_user_id, amount, currency, status, created_at, idempotency_key

**Response:**
```json
{
  "tx_id": "tx_20251108_0001",
  "user_id": "u_125",
  "wp_user_id": 456,
  "payee_user_id": 457,
  "payee_wp_user_id": 456,
  "amount": 20.00,
  "currency": "MXN",
  "status": "confirmed",
  "created_at": "2025-11-08T13:00:00Z",
  "idempotency_key": "uuid-v4",
  "concept": "Payment for tanda",
  "preferred_method": "wallet_token",
  "openPayments": {
    "status": "confirmed",
    "message": "Simulation: integration disabled"
  }
}
```
- Checks for sufficient balance, updates balances, and records the transaction.
- Open Payments integration is currently simulated/disabled.

---

### 4. Payment Confirmation (`POST /api/confirm-payment`)

**Request Body:**
```json
{
  "session_id": "sess_789",
  "user_id": "u_123",
  "flow": "confirm_payment",
  "step": "awaiting_confirmation",
  "expires_at": 1700000000
}
```
**Required fields:** session_id, user_id, flow, step, expires_at

**Response:**
Echoes the request.

---

## Database

- Uses MySQL with a table `productores_wallet` for users and `transacciones` for transactions.
- Connection config is set in the code (host: localhost, user: root, password: hackaton, database: interledger_wallet, port: 3306).

---

## Notes

- All endpoints expect and return JSON.
- Error responses include an `@terminal` field for debugging.
- Open Payments SDK integration is currently disabled due to SDK issues; all transfers are simulated.
- PINs are hashed with bcrypt.
- Initial deposit is 100 MXN for new users.

---

## Example Usage

Register a user:
```bash
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"user_id":"u_123","phone":"+521XXXXXXXXXX","wp_user_id":"456","preferred_method":"wallet_token","pin":"1234","wallet_token":"simulated_token"}'
```

Check balance:
```bash
curl -X POST http://localhost:3000/api/balance -H "Content-Type: application/json" -d '{"user_id":"u_123","phone":"+521XXXXXXXX10","wp_user_id":"457","preferred_method":"wallet_token"}'
```

Transfer:
```bash
curl -X POST http://localhost:3000/api/transfer -H "Content-Type: application/json" -d '{"tx_id":"tx_20251108_0001","user_id":"u_125","wp_user_id":456,"payee_user_id":457,"payee_wp_user_id":456,"amount":20.00,"currency":"MXN","status":"pending","created_at":"2025-11-08T13:00:00Z","idempotency_key":"uuid-v4","concept":"Payment for tanda","preferred_method":"wallet_token"}'
```

---

## Validating Open Payments Connection

To validate that your environment can connect to Open Payments, use the example script `connect.js` located at `open-payments-node/examples/peer-to-peer/connect.js`.

**Purpose:**  
This script demonstrates how to authenticate and retrieve wallet information from an Open Payments-compatible wallet using your private key and keyId.

**How to use:**
1. Set your real `keyId` and the path to your private key in the script.
2. Set the `walletAddressUrl` to your wallet's URL.
3. Run the script from the `open-payments-node/examples/peer-to-peer/` directory:

```bash
node connect.js
```

**Example code:**
```js
import { createAuthenticatedClient } from '../../packages/open-payments/dist/index.js'

const keyId = 'your-key-id'
const privateKeyPath = '../private.key'
const walletAddressUrl = 'https://ilp.interledger-test.dev/9640001'

async function main() {
  const client = await createAuthenticatedClient({
    walletAddressUrl,
    keyId,
    privateKey: privateKeyPath
  })

  // Example: get wallet info
  const walletInfo = await client.walletAddress.get({ url: walletAddressUrl })
  console.log('Wallet info:', walletInfo)
}

main()
```

If the connection and authentication are successful, the wallet information will be printed in the console.  
This is useful for verifying that your Open Payments credentials and environment are correctly configured before integrating with the API Wallet.

## License

MIT
