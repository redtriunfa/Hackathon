// Mock inicial para POST /api/distribute-wm

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: {
      success: true,
      distributed_to: 25,
      amount_per_user: 40.00
    }
  };
};
