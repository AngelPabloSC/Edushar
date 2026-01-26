# 🔐 Guía de Seguridad - EduShuar

## ⚠️ IMPORTANTE: Variables de Entorno

Este proyecto utiliza variables de entorno para proteger información sensible. **NUNCA** subas el archivo `.env` a GitHub.

## 📋 Configuración Inicial

### 1. Crear tu archivo .env

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

### 2. Configurar las Variables de Entorno

Edita el archivo `.env` y reemplaza los valores de ejemplo con tus credenciales reales:

#### Backend API
```bash
VITE_URL_FETCH=https://tu-backend-url.com
```

#### Firebase Web Client (Frontend)
Obtén estas credenciales desde: **Firebase Console → Project Settings → General → Your apps → Web app**

```bash
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

#### Firebase Admin SDK (Backend) - OPCIONAL
Solo si tienes un backend Node.js. Obtén desde: **Firebase Console → Project Settings → Service Accounts → Generate new private key**

```bash
FIREBASE_API_KEY=tu_api_key_aqui
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
```

## 🛡️ Archivos Protegidos

Los siguientes archivos están en `.gitignore` y **NO** se subirán a GitHub:

- ✅ `.env` - Variables de entorno (credenciales)
- ✅ `.env.local`
- ✅ `.env.*.local`
- ✅ `node_modules/` - Dependencias
- ✅ `dist/` - Archivos de compilación
- ✅ `.firebase/` - Configuración local de Firebase

## ⚡ Validación de Variables

El archivo `src/config/firebase.js` incluye validación automática. Si faltan variables de entorno, verás un error en la consola:

```
❌ Faltan las siguientes variables de entorno en .env: VITE_FIREBASE_API_KEY, ...
Por favor, copia .env.example a .env y configura todas las variables.
```

## 🚨 Qué NO Hacer

- ❌ **NO** subas el archivo `.env` a GitHub
- ❌ **NO** compartas tus credenciales de Firebase Admin SDK públicamente
- ❌ **NO** incluyas credenciales en el código fuente
- ❌ **NO** hagas commit de archivos con credenciales hardcodeadas

## ✅ Qué SÍ Hacer

- ✅ Usa siempre variables de entorno para credenciales
- ✅ Mantén actualizado el archivo `.env.example` (sin credenciales reales)
- ✅ Comparte el archivo `.env.example` con tu equipo
- ✅ Documenta las variables necesarias en este archivo

## 🔄 Si Accidentalmente Subiste Credenciales

1. **Revoca inmediatamente** las credenciales comprometidas en Firebase Console
2. Genera nuevas credenciales
3. Actualiza tu archivo `.env` local
4. Elimina el archivo del historial de Git:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
5. Fuerza el push:
   ```bash
   git push origin --force --all
   ```

## 📚 Recursos Adicionales

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Git Ignore Documentation](https://git-scm.com/docs/gitignore)
