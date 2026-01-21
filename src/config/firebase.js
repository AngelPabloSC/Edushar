import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase con credenciales del cliente web
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAwbGeddwSHey_hpIziYxB4yIDXfX6bjU0",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "backend-edushua.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "backend-edushua",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "backend-edushua.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar el provider para solicitar email y perfil
googleProvider.addScope('email');
googleProvider.addScope('profile');
