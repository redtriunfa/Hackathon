# Plan de Trabajo Hackathon Interledger (Versión 2 - Actualizado y Simplificado)

## Cambios recientes y estrategia simplificada:
- La API de la Wallet y la base de datos se ejecutarán primero localmente y luego en una VM Linux en Azure, sin uso de Docker ni Azure Functions.
- Todo el desarrollo se unifica a Python, eliminando Node.js para evitar conflictos y facilitar la integración.
- El acceso a Rafiki se realizará mediante el SDK de Open Payments de Interledger (Python).
- Los casos de uso a implementar son: 1) consulta de saldos y 2) transferencias entre usuarios Rafiki.
- La arquitectura se simplifica para reducir barreras técnicas y acelerar el desarrollo y despliegue.

---

## 1. Arquitectura de Solución Unificada (Simplificada)

### 1.1. Componentes principales

- **Capa de Interfaz (Equipo 1):**
  - Twilio Sandbox para WhatsApp.
  - Orquestador en Python (puede ser FastAPI) para recibir webhooks y gestionar la conversación.
  - Consumo de servicios de IA (Azure AI Foundry) desde Python.

- **Capa de Negocio (Equipo 2):**
  - **API Wallet:** FastAPI corriendo localmente y luego en VM Linux, expone endpoints REST para consulta de saldo y transferencias.
  - **Base de datos:** MySQL corriendo localmente y luego en VM Linux.
  - **Pagos Interledger:** Integración directa con Rafiki usando el SDK de Open Payments (Python).

---

## 2. Tareas detalladas para el Equipo 1

### 2.1. Preparación del entorno

- Configurar Twilio Sandbox para WhatsApp y obtener credenciales.
- Instalar Python y dependencias necesarias (FastAPI, requests, librerías de Twilio, etc.).
- Configurar acceso a servicios de IA (Azure AI Foundry).

### 2.2. Implementación del Orquestador Conversacional

- Desarrollar un orquestador en Python (puede ser FastAPI) que reciba webhooks de Twilio y gestione la lógica conversacional.
- Implementar endpoints para recibir mensajes entrantes de WhatsApp y enviar respuestas.
- Integrar el consumo de servicios de IA (STT, NLU, etc.) usando Azure AI Foundry.
- Definir y documentar el formato JSON de entrada/salida para la comunicación con la API Wallet.
- Coordinar con el equipo 2 para validar y ajustar el formato JSON según necesidades de ambos equipos.

### 2.3. Pruebas y validación

- Pruebas unitarias y de integración para el orquestador y la integración con Twilio.
- Pruebas E2E simulando flujos conversacionales completos.
- Documentar el proceso y los endpoints para el equipo 2.

---

## 3. Tareas detalladas para el Equipo 2

### 2.1. Preparación del entorno

- Instalar Python y dependencias (FastAPI, Uvicorn, PyMySQL, Bcrypt, Open Payments SDK).
- Instalar y configurar MySQL localmente y en la VM.
- Configurar variables de entorno para la conexión segura a MySQL y a Rafiki.

### 2.2. Implementación de la API Wallet (FastAPI)

- Todos los endpoints deben recibir y responder en formato JSON.
- La estructura exacta del JSON será definida por el equipo 1 y se ajustará cuando esté disponible.
- Crear el proyecto FastAPI con los siguientes endpoints:
  - `POST /api/balance`  
    Recibe un JSON con los datos del usuario y responde con el saldo en JSON.
  - `POST /api/transfer`  
    Recibe un JSON con los datos de la transferencia y responde con el resultado en JSON.
- Implementar la lógica de negocio y seguridad (hash de PIN, validaciones).
- Integrar la base de datos MySQL para persistencia de usuarios y saldos.
- Mantener flexibilidad para adaptar la estructura de los JSON según lo que defina el equipo 1.

### 2.3. Integración con Rafiki (Open Payments SDK)

- Configurar el SDK de Open Payments para conectarse a la instancia de Rafiki.
- Implementar funciones para:
  - Consultar saldo de usuario Rafiki.
  - Realizar transferencias entre usuarios Rafiki.
- Probar la integración localmente y luego en la VM.

### 2.4. Despliegue en VM Linux

- Migrar el proyecto y la base de datos a una VM Linux en Azure.
- Configurar el firewall y la red para acceso seguro.
- Validar el funcionamiento de la API y la integración con Rafiki en la VM.

### 2.5. Pruebas y validación

- Pruebas unitarias y de integración para los endpoints principales.
- Pruebas E2E de los casos de uso: consulta de saldo y transferencia.
- Documentar el proceso y los endpoints para el equipo 1.

---

## 3. Flujos de datos principales

- **Consulta de saldo:** WhatsApp → Orquestador Python → API Wallet (FastAPI) → SDK Open Payments → Rafiki → Respuesta.
- **Transferencia:** WhatsApp → Orquestador Python → API Wallet (FastAPI) → SDK Open Payments → Rafiki → Respuesta.

---

## 4. Seguridad

- Comunicación entre servicios protegida por claves y red privada.
- PIN de usuario almacenado con hash + salt (bcrypt).
- Acceso a la base de datos mediante credenciales seguras.

---

## 5. Hoja de Ruta del Hackathon (Equipo 2)

- **Hora 0:00 - 1:00:** Preparar entorno local (Python, MySQL, dependencias, SDK).
- **Hora 1:00 - 2:00:** Implementar endpoints mock en FastAPI y probar integración con SDK Open Payments.
- **Hora 2:00 - 3:00:** Migrar lógica real, conectar base de datos y Rafiki, pruebas locales.
- **Hora 3:00 - 4:00:** Migrar a VM Linux, configurar seguridad y red, pruebas en VM.
- **Hora 4:00 - 5:00:** Pruebas E2E, integración final, documentación y demo.

---

## 6. Notas Finales

- Todo el backend y la integración con Rafiki se desarrollan en Python para evitar conflictos y facilitar el mantenimiento.
- El despliegue se realiza primero localmente y luego en VM Linux, sin contenedores ni serverless.
- El equipo 2 se enfoca en los casos de uso clave: consulta de saldo y transferencias entre usuarios Rafiki.
- La arquitectura y el roadmap están alineados para maximizar la velocidad y simplicidad del desarrollo.
