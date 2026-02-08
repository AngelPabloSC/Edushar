import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase con credenciales del cliente web
// IMPORTANTE: Todas las credenciales deben estar en el archivo .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar que todas las variables de entorno estén configuradas
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];
console.log("Variables de entorno: ", import.meta.env);

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Faltan las siguientes variables de entorno en .env:', missingVars.join(', '));
    console.error('Por favor, copia .env.example a .env y configura todas las variables.');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar el provider para solicitar email y perfil
googleProvider.addScope('email');
googleProvider.addScope('profile');
