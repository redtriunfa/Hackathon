// Mock inicial para POST /api/credit-sale

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: { success: true }
  };
};
