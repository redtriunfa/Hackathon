// Requiere instalar @noble/ed25519 y @noble/hashes@1.3.0:
// npm install @noble/ed25519 @noble/hashes@1.3.0

import * as ed25519 from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha512'
import fs from 'fs'

// Asigna la función hash SHA-512 a ed25519
ed25519.utils.sha512 = sha512

// Lee la clave privada en formato PKCS#8 PEM
const pem = fs.readFileSync('./private.key', 'utf8')

// Extrae la parte base64 del PEM
const base64 = pem
  .replace('-----BEGIN PRIVATE KEY-----', '')
  .replace('-----END PRIVATE KEY-----', '')
  .replace(/\s+/g, '')

// Decodifica base64 a buffer
const pkcs8 = Buffer.from(base64, 'base64')

// Para Ed25519, la clave privada raw son los últimos 32 bytes del PKCS#8
const rawPrivateKey = pkcs8.slice(-32)

// Obtiene la clave pública
const publicKey = await ed25519.getPublicKey(rawPrivateKey)

// Convierte la clave pública a JWK
const jwk = {
  kty: 'OKP',
  crv: 'Ed25519',
  x: Buffer.from(publicKey).toString('base64url')
}
console.log('JWK público:', JSON.stringify(jwk, null, 2))
