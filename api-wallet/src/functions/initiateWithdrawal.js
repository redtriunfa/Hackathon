// Mock inicial para POST /api/initiate-withdrawal

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: {
      success: true,
      message: "Simulación de SPEI a CLABE [XXXX] exitosa."
    }
  };
};
