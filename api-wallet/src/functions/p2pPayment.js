// Mock inicial para POST /api/p2p-payment

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: {
      success: true,
      new_balance: 350.00,
      recipient_name: "Juan"
    }
  };
};
