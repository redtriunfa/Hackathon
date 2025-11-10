# API Wallet - Hackathon Interledger

## Propósito

Esta API Wallet forma parte del Hackathon Interledger y provee endpoints para registro de usuarios, consulta de saldo, transferencias y confirmación de pagos, utilizando Node.js, Express, MySQL y (opcionalmente) el SDK de Open Payments.

## Endpoints

### 1. Registro de usuario (`POST /api/register`)

**Cuerpo de la solicitud:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXXXX",
  "wp_user_id": "456",
  "preferred_method": "wallet_token",
  "pin": "1234",
  "wallet_token": "token_simulado"
}
```
**Campos requeridos:** user_id, phone, wp_user_id, preferred_method, pin, wallet_token

**Respuesta:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXXXX",
  "interledger_wallet_id": "https://ilp.interledger-test.dev/9640001",
  "preferred_method": "wallet_token",
  "account_address": "https://ilp.interledger-test.dev/9640001",
  "wallet_token": "token_simulado",
  "currency": "MXN",
  "created_at": "2025-11-08T13:00:00Z",
  "wp_user_id": "456",
  "initial_deposit": 100
}
```
- Registra un nuevo usuario, hashea el PIN, asigna una wallet y otorga un depósito inicial de 100 MXN.
- Devuelve 409 si el usuario ya existe.

---

### 2. Consulta de saldo (`POST /api/balance`)

**Cuerpo de la solicitud:**
```json
{
  "user_id": "u_123",
  "phone": "+521XXXXXXXX10",
  "wp_user_id": "457",
  "preferred_method": "wallet_token"
}
```
**Campos requeridos:** user_id, phone, wp_user_id, preferred_method

**Respuesta:**
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
- Devuelve el saldo actual y la moneda del usuario.

---

### 3. Transferencia (`POST /api/transfer`)

**Cuerpo de la solicitud:**
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
  "concept": "Pago de tanda",
  "preferred_method": "wallet_token"
}
```
**Campos requeridos:** tx_id, user_id, wp_user_id, payee_user_id, payee_wp_user_id, amount, currency, status, created_at, idempotency_key

**Respuesta:**
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
  "concept": "Pago de tanda",
  "preferred_method": "wallet_token",
  "openPayments": {
    "status": "confirmed",
    "message": "Simulación: integración deshabilitada"
  }
}
```
- Verifica saldo suficiente, actualiza saldos y registra la transacción.
- La integración con Open Payments está simulada/deshabilitada actualmente.

---

### 4. Confirmación de pago (`POST /api/confirm-payment`)

**Cuerpo de la solicitud:**
```json
{
  "session_id": "sess_789",
  "user_id": "u_123",
  "flow": "confirm_payment",
  "step": "awaiting_confirmation",
  "expires_at": 1700000000
}
```
**Campos requeridos:** session_id, user_id, flow, step, expires_at

**Respuesta:**
Devuelve un eco de la solicitud.

---

## Base de datos

- Utiliza MySQL con la tabla `productores_wallet` para usuarios y `transacciones` para movimientos.
- La configuración de conexión está en el código (host: localhost, user: root, password: hackaton, database: interledger_wallet, port: 3306).

---

## Notas

- Todos los endpoints esperan y devuelven JSON.
- Las respuestas de error incluyen el campo `@terminal` para depuración.
- La integración con el SDK de Open Payments está deshabilitada por problemas con el SDK; todas las transferencias son simuladas.
- Los PIN se almacenan hasheados con bcrypt.
- El depósito inicial para nuevos usuarios es de 100 MXN.

---

## Ejemplo de uso

Registrar usuario:
```bash
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"user_id":"u_123","phone":"+521XXXXXXXXXX","wp_user_id":"456","preferred_method":"wallet_token","pin":"1234","wallet_token":"token_simulado"}'
```

Consultar saldo:
```bash
curl -X POST http://localhost:3000/api/balance -H "Content-Type: application/json" -d '{"user_id":"u_123","phone":"+521XXXXXXXX10","wp_user_id":"457","preferred_method":"wallet_token"}'
```

Transferir:
```bash
curl -X POST http://localhost:3000/api/transfer -H "Content-Type: application/json" -d '{"tx_id":"tx_20251108_0001","user_id":"u_125","wp_user_id":456,"payee_user_id":457,"payee_wp_user_id":456,"amount":20.00,"currency":"MXN","status":"pending","created_at":"2025-11-08T13:00:00Z","idempotency_key":"uuid-v4","concept":"Pago de tanda","preferred_method":"wallet_token"}'
```

---

## Validación de conexión con Open Payments

Para validar que tu entorno puede conectarse con Open Payments, utiliza el script de ejemplo `connect.js` ubicado en `open-payments-node/examples/peer-to-peer/connect.js`.

**Propósito:**  
Este script demuestra cómo autenticarte y obtener información de una wallet compatible con Open Payments usando tu clave privada y keyId.

**Cómo usarlo:**
1. Configura tu `keyId` real y la ruta a tu clave privada en el script.
2. Establece el `walletAddressUrl` con la URL de tu wallet.
3. Ejecuta el script desde el directorio `open-payments-node/examples/peer-to-peer/`:

```bash
node connect.js
```

**Ejemplo de código:**
```js
import { createAuthenticatedClient } from '../../packages/open-payments/dist/index.js'

const keyId = 'tu-key-id'
const privateKeyPath = '../private.key'
const walletAddressUrl = 'https://ilp.interledger-test.dev/9640001'

async function main() {
  const client = await createAuthenticatedClient({
    walletAddressUrl,
    keyId,
    privateKey: privateKeyPath
  })

  // Ejemplo: obtener información de la wallet
  const walletInfo = await client.walletAddress.get({ url: walletAddressUrl })
  console.log('Información de la wallet:', walletInfo)
}

main()
```

Si la conexión y autenticación son exitosas, la información de la wallet se imprimirá en consola.  
Esto es útil para verificar que tus credenciales y entorno de Open Payments están correctamente configurados antes de integrar con la API Wallet.

## Licencia

MIT
