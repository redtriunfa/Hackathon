# API Wallet - Hackathon Interledger

Estructura inicial del proyecto para el equipo 2 (API de Wallet y Ledger).

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

## Contrato de API

Ver documento "Plan de Proyecto Hackathon Interledger.pdf" sección 2.2 para los endpoints REST a implementar.
