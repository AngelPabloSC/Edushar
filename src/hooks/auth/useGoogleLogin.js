import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useFetchDataPromise } from '../api/useFetchDataPromise';
import { useLoginContext } from '../context/LoginContext';
import { useDialong } from '../ui/useDialog';

export const useGoogleLogin = () => {
    const { getFechData } = useFetchDataPromise();
    const { login } = useLoginContext();
    const {
        handleOpenDialog,
        setDialongContent,
    } = useDialong();

    const handleGoogleLogin = async () => {
        try {
            // 1. Autenticar con Firebase usando popup
            const result = await signInWithPopup(auth, googleProvider);

            // 2. Obtener el ID token
            const idToken = await result.user.getIdToken();

            console.log('✅ Google authentication successful');
            console.log('User info:', {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                uid: result.user.uid
            });
            console.log('📤 Sending idToken to backend...');

            // 3. Enviar token al backend para verificación y registro/login
            const response = await getFechData({
                endPoint: 'api/google-login',
                method: 'POST',
                additionalData: { idToken }
            });

            console.log('📥 Backend response:', response);

           
            if (response.code === 'COD_OK') {
                console.log('✅ Login successful, saving to context');
                login(response.data);
            } else {
              
                handleOpenDialog();
                setDialongContent({
                    title: "Error",
                    message: response.message || "Error al iniciar sesión con Google"
                });
            }
        } catch (error) {
            console.error('Error en Google login:', error);

            // Manejar errores específicos de Firebase
            let errorMessage = "Error al iniciar sesión con Google";

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Ventana de Google cerrada. Intenta nuevamente.";
            } else if (error.code === 'auth/cancelled-popup-request') {
                // Usuario canceló, no mostrar error
                return;
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Error de conexión. Verifica tu internet.";
            }

            handleOpenDialog();
            setDialongContent({
                title: "Error",
                message: errorMessage
            });

            throw error;
        }
    };

    return { handleGoogleLogin };
};
