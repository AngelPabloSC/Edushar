import { useState, useCallback } from 'react';
import { useFetchDataPromise } from '../api/useFetchDataPromise';
import { useLoginContext } from '../context/LoginContext';
import { useGoogleLogin } from './useGoogleLogin';
import { useToggle } from '../ui/useToggle';
import { useFormValidation } from '../ui/useFormValidation';
import validationRules from '../../utils/validationRules';

export const useLogin = () => {
    const { getFechData } = useFetchDataPromise();
    const { login } = useLoginContext();
    const { handleGoogleLogin } = useGoogleLogin();

    const [tabValue, setTabValue] = useState(0);
    const [showPassword, toggleShowPassword] = useToggle(false);
    const [showConfirmPassword, toggleShowConfirmPassword] = useToggle(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const {
        data: loginData,
        errors: loginErrors,
        handleChange: baseHandleChange,
        validateAll,
        setErrors: setLoginErrors,
    } = useFormValidation(
        {
            email: '',
            password: '',
        },
        validationRules
    );

    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
        setLoginErrors({});
        setAuthError('');
    }, [setLoginErrors]);

    const handleLoginChange = useCallback((e) => {
        const { name, value } = e.target;

        let fieldRules = null;
        if (name === 'email') {
            fieldRules = {
                required: true,
                pattern: validationRules.email
            };
        } else if (name === 'password') {
            fieldRules = { required: true };
        }

        baseHandleChange(e, fieldRules);
    }, [baseHandleChange]);

    const translateErrorMessage = (message) => {
        const errorMessages = {
            'INVALID_LOGIN_CREDENTIALS': 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.',
            'USER_NOT_FOUND': 'Usuario no encontrado.',
            'INCORRECT_PASSWORD': 'Contraseña incorrecta.',
            'EMAIL_NOT_VERIFIED': 'Por favor, verifica tu correo electrónico.',
            'ACCOUNT_DISABLED': 'Esta cuenta ha sido deshabilitada.',
            'TOO_MANY_ATTEMPTS': 'Demasiados intentos fallidos. Por favor, intenta más tarde.',
        };

        return errorMessages[message] || message || 'Error al iniciar sesión';
    };

    const handleLoginAPI = useCallback(async (data) => {
        try {
            const response = await getFechData({
                endPoint: 'api/login',
                method: "POST",
                additionalData: data,
            });

            if (response.code === "COD_OK") {
                login(response.data);
            } else {
                const { message, error } = response;
                const errorMessage = translateErrorMessage(message || error);
                setAuthError(errorMessage);
            }
        } catch (error) {
            console.error("Error en login:", error);
            setAuthError("Error al momento de enviar los datos");
        }
    }, [getFechData, login]);

    const handleLoginSubmit = useCallback(async (e) => {
        e.preventDefault();
        setAuthError('');

        const isValid = validateAll({
            email: {
                required: true,
                pattern: validationRules.email
            },
            password: { required: true }
        });

        if (!isValid) {
            return;
        }

        setIsLoading(true);
        try {
            await handleLoginAPI({
                email: loginData.email,
                password: loginData.password
            });
        } catch (error) {
            console.error('Error during login:', error);
            setAuthError('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [loginData, validateAll, handleLoginAPI]);

    const handleGoogleSignIn = useCallback(async () => {
        setIsLoading(true);
        setAuthError('');
        try {
            await handleGoogleLogin();
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setAuthError('Error al iniciar sesión con Google. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [handleGoogleLogin]);

    return {
        tabValue,
        showPassword,
        showConfirmPassword,
        loginData,
        loginErrors,
        isLoading,
        authError,
        setShowPassword: toggleShowPassword,
        setShowConfirmPassword: toggleShowConfirmPassword,
        handleTabChange,
        handleLoginChange,
        handleLoginSubmit,
        handleGoogleSignIn,
    };
};
