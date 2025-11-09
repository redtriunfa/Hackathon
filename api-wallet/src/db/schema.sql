-- Script SQL para crear el ledger virtual y tablas relacionadas (Hackathon Interledger)

-- Tabla principal de productores (wallet)
CREATE TABLE IF NOT EXISTS productores_wallet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(50) UNIQUE NOT NULL,
  telefono_wa VARCHAR(20) UNIQUE,
  wp_user_id BIGINT,
  saldo_mxn DECIMAL(10,2) NOT NULL DEFAULT 0,
  clabe_registrada VARCHAR(18),
  interledger_wallet_id VARCHAR(100),
  pin_hash VARCHAR(60),
  conversation_state VARCHAR(50),
  state_context JSON,
  currency VARCHAR(8) NOT NULL DEFAULT 'MXN',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tandas (grupos de ahorro)
CREATE TABLE IF NOT EXISTS tandas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_grupo VARCHAR(100) NOT NULL,
  monto_aporte DECIMAL(10,2) NOT NULL,
  periodicidad VARCHAR(20) NOT NULL,
  num_miembros INT NOT NULL,
  fecha_inicio DATE NOT NULL
);

-- Miembros de cada tanda
CREATE TABLE IF NOT EXISTS tanda_miembros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanda_id INT NOT NULL,
  telefono_wa VARCHAR(20) NOT NULL,
  num_sorteo INT NOT NULL,
  FOREIGN KEY (tanda_id) REFERENCES tandas(id),
  FOREIGN KEY (telefono_wa) REFERENCES productores_wallet(telefono_wa)
);

-- Calendario de pagos de cada tanda
CREATE TABLE IF NOT EXISTS tanda_calendario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanda_id INT NOT NULL,
  fecha_pago DATE NOT NULL,
  telefono_wa_recibe VARCHAR(20) NOT NULL,
  FOREIGN KEY (tanda_id) REFERENCES tandas(id),
  FOREIGN KEY (telefono_wa_recibe) REFERENCES productores_wallet(telefono_wa)
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_wallet_payer INT NOT NULL,
  id_wallet_payee INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  concept VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  prefer_method VARCHAR(50),
  FOREIGN KEY (id_wallet_payer) REFERENCES productores_wallet(id),
  FOREIGN KEY (id_wallet_payee) REFERENCES productores_wallet(id)
);
