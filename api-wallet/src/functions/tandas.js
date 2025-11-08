// Mock inicial para GET /api/tandas

module.exports = async function (context, req) {
  // Simulación de respuesta
  context.res = {
    status: 200,
    body: {
      tandas: [
        {
          id: 1,
          nombre_grupo: "Tanda Semanal",
          monto_aporte: 100.00,
          periodicidad: "weekly",
          num_miembros: 10,
          fecha_inicio: "2025-11-01"
        }
      ]
    }
  };
};
