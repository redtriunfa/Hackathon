# Especificación correcta para Azure Container Instance (ACI)  
**Backend de Pagos Interledger – Fase 1 (según plan de trabajo Hackathon)**

| Parámetro                        | Valor recomendado                                  | Comentario                                                      |
|-----------------------------------|----------------------------------------------------|-----------------------------------------------------------------|
| Suscripción                      | Patrocinio 5 Microsoft Azure                      | Usar la suscripción habilitada para el Hackathon                |
| Grupo de recursos                | Interledger                                       | Grupo de recursos del proyecto                                  |
| Región                           | East US 2                                         | Sugerido por baja latencia y disponibilidad                     |
| Nombre del contenedor            | rafiki-playground                                 | Debe reflejar el playground de Rafiki                           |
| SKU                              | Estándar                                          | Suficiente para pruebas y MVP                                   |
| Tipo de imagen                   | Compose (docker-compose)                          | Usar docker-compose del playground de Rafiki                    |
| Archivo Compose                  | docker-compose.yml (playground Rafiki)            | Subir el archivo desde el repositorio oficial                   |
| Tipo de SO                       | Linux                                             | Recomendado para Rafiki y Node.js                               |
| Memoria (GiB)                    | 4                                                 | Ajustar según requerimientos, 4 GiB es adecuado para pruebas    |
| Núcleos de CPU                   | 2                                                 | Suficiente para carga inicial                                   |
| Tipo de GPU                      | None                                              | No requerido                                                    |
| Recuento de GPU                  | 0                                                 | No requerido                                                    |
| Tipo de red                      | Privado                                           | Mejor para seguridad, exponer solo los puertos necesarios       |
| Puertos                          | 3000, 4000, 8080 (TCP)                            | Según docker-compose de Rafiki playground                       |
| Red virtual                      | (nuevo) Interledger-vnet                          | Crear una nueva VNet para aislar el backend                     |
| Subred                           | (nuevo) default (10.0.0.0/24)                     | Subred por defecto para la VNet                                 |
| Habilitar registros de instancia  | Activado                                          | Para monitoreo y troubleshooting                                |
| Área de trabajo de supervisión    | DefaultWorkspace-...                              | Usar el workspace por defecto o uno dedicado                    |
| Directiva de reinicio            | En caso de error                                  | Recomendada para alta disponibilidad                            |
| Invalidación de comando           | [ ]                                               | Dejar vacío si no se requiere override                          |
| Etiquetas                        | (ninguno)                                         | Opcional, para organización                                     |

**Notas específicas del Hackathon:**
- El archivo docker-compose.yml debe ser el del playground oficial de Rafiki ([ver repositorio](https://github.com/interledger/rafiki)).
- Configura el wallet maestro de Kostik en Rafiki para simular la recepción de fondos Web Monetization.
- Los puertos expuestos deben coincidir con los servicios del playground (usualmente 3000, 4000, 8080).
- Integra la instancia con la Function App y la base de datos MySQL según el plan.
- No uses imágenes genéricas, usa la configuración de Rafiki playground.
- Para variables de entorno, revisa el docker-compose y agrega las necesarias para la integración con el resto del sistema.
- Seguridad: Red privada, acceso solo desde la VNet del proyecto.
