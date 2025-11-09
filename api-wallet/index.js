// API Wallet Interledger - Node.js + Open Payments SDK

import express from 'express'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import axios from 'axios' // Para consumir APIs Open Payments vía HTTP

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'hackaton',
  database: 'interledger_wallet',
  port: 3306
}

const app = express()
app.use(express.json())

console.log('[DEBUG] Inicializando API Wallet Interledger')



/**
 * Endpoint: POST /api/balance
 * Solicitud:
 * {
 *   "user_id": "u_123",
 *   "phone": "+521XXXXXXXXXX",
 *   "interledger_wallet_id": "w_456",
 *   "preferred_method": "wallet_token"
 * }
 * Respuesta:
 * {
 *   "user_id": "u_123",
 *   "phone": "+521XXXXXXXXXX",
 *   "interledger_wallet_id": "w_456",
 *   "preferred_method": "wallet_token",
 *   "Balance": 1000
 * }
 */
app.post('/api/balance', async (req, res) => {
  const { user_id, phone, interledger_wallet_id, preferred_method } = req.body
  console.log('[DEBUG] /api/balance request:', req.body)
  if (!user_id || !phone || !interledger_wallet_id || !preferred_method) {
    console.error('[ERROR] Faltan campos requeridos')
    return res.status(400).json({ error: 'Faltan campos requeridos', '@terminal': 'Solicitud incompleta' })
  }
  let conn
  try {
    conn = await mysql.createConnection(dbConfig)
    console.log('[DEBUG] Conexión a MySQL establecida')
    // Buscar el usuario por user_id y interledger_wallet_id
    const [rows] = await conn.execute(
      'SELECT saldo_mxn FROM productores_wallet WHERE usuario_id = ? AND clabe_registrada = ?',
      [user_id, interledger_wallet_id]
    )
    console.log('[DEBUG] Resultado de consulta:', rows)
    let balance = 0
    if (rows.length) {
      balance = parseFloat(rows[0].saldo_mxn)
    }
    // Respuesta con el formato solicitado
    return res.json({
      user_id,
      phone,
      interledger_wallet_id,
      preferred_method,
      Balance: balance
    })
  } catch (err) {
    console.error('[ERROR] Excepción en /api/balance:', err)
    return res.status(500).json({ error: err.message, '@terminal': err.stack })
  } finally {
    if (conn) {
      await conn.end()
      console.log('[DEBUG] Conexión a MySQL cerrada')
    }
  }
})

/**
 * Endpoint: POST /api/transfer
 * Solicitud:
 * {
 *   "tx_id": "tx_20251108_0001",
 *   "user_id": "u_123",
 *   "interledger_wallet_id": "w_456",
 *   "amount": 150.00,
 *   "currency": "MXN",
 *   "status": "pending|confirmed|failed",
 *   "created_at": "2025-11-08T13:00:00Z",
 *   "idempotency_key": "uuid-v4"
 * }
 * Respuesta (eco de la transacción, ejemplo):
 * {
 *   "tx_id": "tx_20251108_0001",
 *   "user_id": "u_123",
 *   "interledger_wallet_id": "w_456",
 *   "amount": 150.00,
 *   "currency": "MXN",
 *   "status": "confirmed",
 *   "created_at": "2025-11-08T13:00:00Z",
 *   "idempotency_key": "uuid-v4"
 * }
 */
app.post('/api/transfer', async (req, res) => {
  const { tx_id, user_id, interledger_wallet_id, amount, currency, status, created_at, idempotency_key, payee_user_id, payee_interledger_wallet_id, concept, prefer_method } = req.body
  console.log('[DEBUG] /api/transfer request:', req.body)
  if (!tx_id || !user_id || !interledger_wallet_id || !amount || !currency || !status || !created_at || !idempotency_key || !payee_user_id || !payee_interledger_wallet_id) {
    console.error('[ERROR] Faltan campos requeridos en la transacción')
    return res.status(400).json({ error: 'Faltan campos requeridos', '@terminal': 'Solicitud incompleta' })
  }
  let conn
  try {
    conn = await mysql.createConnection(dbConfig)
    console.log('[DEBUG] Conexión a MySQL establecida')
    // Obtener IDs de payer y payee
    const [payerRows] = await conn.execute(
      'SELECT id FROM productores_wallet WHERE usuario_id = ? AND clabe_registrada = ?',
      [user_id, interledger_wallet_id]
    )
    const [payeeRows] = await conn.execute(
      'SELECT id FROM productores_wallet WHERE usuario_id = ? AND clabe_registrada = ?',
      [payee_user_id, payee_interledger_wallet_id]
    )
    if (!payerRows.length || !payeeRows.length) {
      return res.status(404).json({ error: 'Payer o Payee no encontrado', '@terminal': 'No existe usuario/cuenta' })
    }
    const id_wallet_payer = payerRows[0].id
    const id_wallet_payee = payeeRows[0].id

    // Simulación de integración con Open Payments (aquí iría la llamada real)
    // const openPaymentsResult = await axios.post('https://rafiki.example.com/payments', { ... })
    // const openPaymentsStatus = openPaymentsResult.data.status || "confirmed"
    const openPaymentsStatus = "confirmed"

    // Registrar la transacción en la base de datos
    await conn.execute(
      `INSERT INTO transacciones
        (id_wallet_payer, id_wallet_payee, amount, currency, concept, timestamp, status, prefer_method)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_wallet_payer,
        id_wallet_payee,
        amount,
        currency,
        concept || "Transferencia entre usuarios",
        created_at.replace("T", " ").replace("Z", ""), // Formato DATETIME
        openPaymentsStatus,
        prefer_method || "open_payments"
      ]
    )
    // Responder con eco de la transacción
    return res.json({
      tx_id,
      user_id,
      interledger_wallet_id,
      payee_user_id,
      payee_interledger_wallet_id,
      amount,
      currency,
      status: openPaymentsStatus,
      created_at,
      idempotency_key,
      concept: concept || "Transferencia entre usuarios",
      prefer_method: prefer_method || "open_payments"
    })
  } catch (err) {
    console.error('[ERROR] Excepción en /api/transfer:', err)
    return res.status(500).json({ error: err.message, '@terminal': err.stack })
  } finally {
    if (conn) {
      await conn.end()
      console.log('[DEBUG] Conexión a MySQL cerrada')
    }
  }
})

/**
 * Endpoint: POST /api/confirm-payment
 * Solicitud:
 * {
 *   "session_id": "sess_789",
 *   "user_id": "u_123",
 *   "flow": "confirm_payment",
 *   "step": "awaiting_confirmation",
 *   "expires_at": 1700000000
 * }
 * Respuesta (eco de la confirmación, ejemplo):
 * {
 *   "session_id": "sess_789",
 *   "user_id": "u_123",
 *   "flow": "confirm_payment",
 *   "step": "awaiting_confirmation",
 *   "expires_at": 1700000000
 * }
 */
app.post('/api/confirm-payment', (req, res) => {
  const { session_id, user_id, flow, step, expires_at } = req.body
  console.log('[DEBUG] /api/confirm-payment request:', req.body)
  if (!session_id || !user_id || !flow || !step || !expires_at) {
    console.error('[ERROR] Faltan campos requeridos en la confirmación')
    return res.status(400).json({ error: 'Faltan campos requeridos', '@terminal': 'Solicitud incompleta' })
  }
  // Simulación: eco de la confirmación
  return res.json({
    session_id,
    user_id,
    flow,
    step,
    expires_at
  })
})

/**
 * Endpoint: POST /api/register
 * Solicitud:
 * {
 *   "user_id": "u_123",
 *   "phone": "+521XXXXXXXXXX",
 *   "interledger_wallet_id": "w_456",
 *   "preferred_method": "wallet_token",
 *   "pin": "1234",
 *   "wallet_token": "token_simulado"
 * }
 * Respuesta:
 * {
 *   "user_id": "u_123",
 *   "phone": "+521XXXXXXXXXX",
 *   "interledger_wallet_id": "w_456",
 *   "preferred_method": "wallet_token",
 *   "account_address": "openpayments.example.com/accounts/u_123",
 *   "wallet_token": "token_simulado"
 * }
 */
app.post('/api/register', async (req, res) => {
  const { user_id, phone, interledger_wallet_id, preferred_method, pin, wallet_token } = req.body
  console.log('[DEBUG] /api/register request:', req.body)
  if (!user_id || !phone || !interledger_wallet_id || !preferred_method || !pin || !wallet_token) {
    console.error('[ERROR] Faltan campos requeridos para registro')
    return res.status(400).json({ error: 'Faltan campos requeridos', '@terminal': 'Solicitud incompleta' })
  }
  let conn
  try {
    conn = await mysql.createConnection(dbConfig)
    console.log('[DEBUG] Conexión a MySQL establecida')
    // Verificar si el usuario ya existe
    const [exists] = await conn.execute(
      'SELECT id FROM productores_wallet WHERE usuario_id = ?',
      [user_id]
    )
    if (exists.length) {
      return res.status(409).json({ error: 'Usuario ya existe', '@terminal': 'Registro duplicado' })
    }
    // Hashear el PIN
    const pin_hash = await bcrypt.hash(pin, 10)
    // Insertar usuario con interledger_wallet_id y wallet_token
    await conn.execute(
      'INSERT INTO productores_wallet (usuario_id, telefono_wa, saldo_mxn, pin_hash, clabe_registrada, state_context) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, phone, 0, pin_hash, interledger_wallet_id, JSON.stringify({ wallet_token })]
    )
    // Simular creación de cuenta en Open Payments (aquí deberías hacer la llamada real)
    // const { data } = await axios.post('https://rafiki.example.com/accounts', { ... })
    // const account_address = data.account_address
    const account_address = `openpayments.example.com/accounts/${user_id}` // Simulación
    return res.status(201).json({
      user_id,
      phone,
      interledger_wallet_id,
      preferred_method,
      account_address,
      wallet_token
    })
  } catch (err) {
    console.error('[ERROR] Excepción en /api/register:', err)
    return res.status(500).json({ error: err.message, '@terminal': err.stack })
  } finally {
    if (conn) {
      await conn.end()
      console.log('[DEBUG] Conexión a MySQL cerrada')
    }
  }
})

/**
 * Middleware global para manejo de errores
 */
app.use((err, req, res, next) => {
  console.error('[ERROR] Middleware global:', err)
  res.status(500).json({ error: err.message, '@terminal': err.stack })
})

// Puerto de escucha
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[DEBUG] API Wallet escuchando en puerto ${PORT}`)
})

// NOTA: Cuando el equipo 1 defina el JSON, ajustar la estructura de request/response y la lรณgica de los endpoints.
