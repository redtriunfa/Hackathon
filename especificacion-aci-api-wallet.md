# Especificación Azure Container Instance para el Backend de Pagos (Interledger)

**Suscripción:**  
Patrocinio 5 Microsoft Azure

**Grupo de recursos:**  
Interledger

**Región:**  
East US 2

**Nombre del contenedor:**  
api-wallet

**SKU:**  
Estándar

**Tipo de imagen:**  
Public

**Imagen:**  
mcr.microsoft.com/azuredocs/aci-helloworld:latest

**Tipo de SO:**  
Linux

**Memoria (GiB):**  
4

**Número de núcleos de CPU:**  
2

**Tipo de GPU (versión preliminar):**  
None

**Recuento de GPU:**  
0

**Redes:**  
- Tipo de red: Privado
- Puertos: 80 (TCP)
- Red virtual: (nuevo) Interledger-vnet
- Subred: (nuevo) default (10.0.0.0/24)

**Supervisión:**  
- Habilitar registros de instancia de contenedor: Activado
- Área de trabajo de supervisión: DefaultWorkspace-d1470010-67cf-4224-b35f-a128c8d5891e-EUS2

**Opciones avanzadas:**  
- Directiva de reinicio: En caso de error
- Invalidación de comando: [ ]
- Etiquetas: (ninguno)

---

## Checklist de integración del endpoint /api/register con Open Payments SDK

- [ ] Importar el SDK de Open Payments en el backend
- [ ] Leer el archivo private.key y definir keyId
- [ ] Crear el cliente autenticado con createAuthenticatedClient
- [ ] Realizar POST al endpoint de creación de cuenta en Open Payments (Rafiki)
- [ ] Procesar la respuesta y guardar los datos en la base de datos
- [ ] Probar la integración y validar la creación real de cuentas
