import { useState, useCallback } from 'react';
import { useFetchDataPromise } from '../api/useFetchDataPromise';
import { useDialong } from '../ui/useDialog';
import { useLoginContext } from '../context/LoginContext';
import { useGoogleLogin } from './useGoogleLogin';
import { useToggle } from '../ui/useToggle';
import { useFormValidation } from '../ui/useFormValidation';
import validationRules from '../../utils/validationRules';

export const useLogin = () => {
    // API hooks
    const { getFechData } = useFetchDataPromise();
    const {
        isOpen,
        dialongContent,
        handleOpenDialog,
        handleCloseDialog,
        setDialongContent,
    } = useDialong();
    const { login } = useLoginContext();
    const { handleGoogleLogin } = useGoogleLogin();

    // UI States - using useToggle for boolean states
    const [tabValue, setTabValue] = useState(0);
    const [showPassword, toggleShowPassword] = useToggle(false);
    const [showConfirmPassword, toggleShowConfirmPassword] = useToggle(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    // Form validation hook
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

    // Tab Change Handler - memoized
    const handleTabChange = useCallback((event, newValue) => {
        setTabValue(newValue);
        setLoginErrors({});
        setAuthError('');
    }, [setLoginErrors]);

    // Login Form Change Handler - memoized with proper event typing
    const handleLoginChange = useCallback((e) => {
        const { name, value } = e.target;

        // Determine validation rules based on field
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

    // Login API Call - memoized
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
                const { message } = response;
                handleOpenDialog();
                setDialongContent({
                    title: "Error",
                    message: message || "Error al iniciar sesión"
                });
            }
        } catch (error) {
            console.error("Error en login:", error);
            handleOpenDialog();
            setDialongContent({
                title: "Error",
                message: "Error al momento de enviar los datos"
            });
        }
    }, [getFechData, login, handleOpenDialog, setDialongContent]);

    // Login Form Submit - memoized
    const handleLoginSubmit = useCallback(async (e) => {
        e.preventDefault();
        setAuthError('');

        // Validate all fields
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

    // Google Sign In - memoized
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
        // States
        tabValue,
        showPassword,
        showConfirmPassword,
        loginData,
        loginErrors,
        isLoading,
        authError,
        isOpen,
        dialongContent,

        // Setters - now using toggle functions
        setShowPassword: toggleShowPassword,
        setShowConfirmPassword: toggleShowConfirmPassword,

        // Handlers - all memoized with useCallback
        handleTabChange,
        handleLoginChange,
        handleLoginSubmit,
        handleGoogleSignIn,
        handleOpenDialog,
        handleCloseDialog,
    };
};
