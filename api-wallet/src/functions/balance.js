// Mock inicial para GET /api/balance

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: { balance: 500.00 }
  };
};
