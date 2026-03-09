# Kiosko Multimedia Municipalidad de Arequipa
Este kiosko multimedia se va a realizar con react.js para poder unir las API's mas rapido y eficaz

# Instalación
Para la instalación primero se corre

npm install

luego

npm run dev

# Funciones

## Funciones Web
- **Función Web 1**: Display principal del kiosko (`Home.jsx`)
- **Función Web 2**: Formulario para búsqueda de expedientes (`BusquedaExpedientes.jsx`)
- **Función Web 3**: Pantalla de inicio de sesión para pagos en línea (`Login.jsx`)
- **Función Web 4**: Pantalla de inicio de sesión para consultas en línea (`LoginConsultas.jsx`)
- **Función Web 5**: Muestra el estado de cuenta del contribuyente para pagos (`EstadoCuenta.jsx`)
- **Función Web 6**: Muestra el estado de cuenta del contribuyente para consultas (`Consultas.jsx`)
- **Función Web 7**: Carrito y envío de PDF por correo (`Checkout_pdf.jsx`)

## Funciones de Consulta
- **Función de Consulta 1**: Realiza peticiones HTTP con manejo de autenticación, caché y reintentos (`apiClient.js` - `apiRequest`)
- **Función de Consulta 2**: Renueva el token de acceso usando refresh token (`apiClient.js` - `refreshAccessToken`)
- **Función de Consulta 3**: Cancela todas las peticiones en curso (`apiClient.js` - `abortAllRequests`)
- **Función de Consulta 4**: Limpia la caché de respuestas (`apiClient.js` - `clearCache`)
- **Función de Consulta 5**: Obtiene la expiración del token almacenada (`apiClient.js` - `getAuthExpiryEpochMs`)
- **Función de Consulta 6**: Almacena la expiración del token (`apiClient.js` - `setAuthExpiry`)
- **Función de Consulta 7**: Elimina la expiración del token (`apiClient.js` - `clearAuthExpiry`)
- **Función de Consulta 8**: Autentica al usuario con DNI, correo y celular (`authService.js` - `login`)
- **Función de Consulta 9**: Cierra sesión: limpia tokens, cancela peticiones, vacía caché y carrito (`authService.js` - `logout`)
- **Función de Consulta 10**: Inicia el temporizador de auto-refresh (`authService.js` - `initAuthAutoRefresh`)
- **Función de Consulta 11**: Busca contribuyentes asociados a un número de documento (`impuestosService.js` - `buscarContribuyentes`)
- **Función de Consulta 12**: Obtiene deuda de impuesto predial o vehicular (`impuestosService.js` - `traerDeudaImpuestos`)
- **Función de Consulta 13**: Obtiene lista de predios de un contribuyente (`impuestosService.js` - `traerPredios`)
- **Función de Consulta 14**: Obtiene todas las deudas de arbitrios (`impuestosService.js` - `traerDeudaArbitrios`)
- **Función de Consulta 15**: Obtiene deudas de infracciones de tránsito (`impuestosService.js` - `traerDeudaInfracciones`)

## Funciones de Utilidad
- **Función de Utilidad 1**: Limpieza de autenticación (llama a logout) (`authCleanup.js` - `logoutCleanup`)

## Funciones de Estado
- **Función de Estado 1**: Store global de autenticación (`authStore.js` - `useAuthStore`)
- **Función de Estado 2**: Store global del carrito para consultas (`cartStore.js` - `useCartStore`)

## Funciones de Backend
- **Función de Backend 1**: Endpoint POST /consultas/enviar-pdf para enviar correo con PDF (`consultas.js` - `router.post`)
- **Función de Backend 2**: Punto de entrada del servidor Express, configura middlewares y monta rutas (`server.js`)
