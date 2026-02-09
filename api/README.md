# Azure Functions Proxy para Traducción

Este directorio contiene Azure Functions que actúan como proxy para APIs externas, evitando problemas de CORS en Azure Static Web Apps.

## Estructura

```
api/
├── translate/          # Función de proxy para traducción
│   ├── index.js       # Lógica de la función
│   └── function.json  # Configuración de la función
├── host.json          # Configuración global
├── package.json       # Dependencias
└── local.settings.json # Configuración local (no versionado)
```

## Desarrollo Local

Para probar las Azure Functions localmente:

1. **Instalar Azure Functions Core Tools**:
   ```bash
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   ```

2. **Iniciar las funciones localmente**:
   ```bash
   cd api
   func start
   ```

   Las funciones estarán disponibles en: `http://localhost:7071/api/translate`

3. **Probar con el frontend**:
   - El frontend debe estar corriendo en otro terminal
   - La configuración ya está lista para usar `/api/translate`

## Despliegue en Azure

Azure Static Web Apps automáticamente detecta y despliega las funciones en la carpeta `/api` cuando haces push al repositorio.

**No requiere configuración adicional** si está configurado correctamente el workflow de GitHub Actions.

## Funciones Disponibles

### POST /api/translate

Traduce texto de español a Shuar usando IA.

**Request:**
```json
{
  "text": "Hola"
}
```

**Response:**
```json
{
  "ok": true,
  "translation": "...",
  "justification": "..."
}
```

## Nota de Seguridad

- Las funciones están configuradas con `authLevel: "anonymous"` para facilitar el acceso
- En producción, considera agregar autenticación si es necesario
- Los logs están habilitados para debugging
