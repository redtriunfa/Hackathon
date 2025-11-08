// Mock inicial para POST /api/set-pin

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: { success: true, message: "PIN configurado" }
  };
};
