import { useState } from 'react';
import { useFetchDataPromise } from './useFetchDataPromise';
import { useDialong } from './useDialog';
import { useLoginContext } from './context/LoginContext';
import { useGoogleLogin } from './useGoogleLogin';
import validationRules from '../utils/validationRules';

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

    // UI States
    const [tabValue, setTabValue] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    // Form Data
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Validation Errors
    const [loginErrors, setLoginErrors] = useState({});

    // Tab Change Handler
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setLoginErrors({});
        setAuthError('');
    };

    // Generic Field Validation
    const validateField = (name, value, rules) => {
        if (!value && rules.required) {
            return validationRules.required;
        }

        if (rules.pattern && value && !rules.pattern.value.test(value)) {
            return rules.pattern.message;
        }

        if (rules.minLength && value && value.length < rules.minLength) {
            return validationRules.minLength(rules.minLength).message;
        }

        if (rules.maxLength && value && value.length > rules.maxLength) {
            return validationRules.maxLength(rules.maxLength).message;
        }

        return '';
    };

    // Login Form Change Handler
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });

        // Real-time validation
        let error = '';
        if (name === 'email') {
            error = validateField(name, value, {
                required: true,
                pattern: validationRules.email
            });
        } else if (name === 'password') {
            error = validateField(name, value, { required: true });
        }

        setLoginErrors({
            ...loginErrors,
            [name]: error,
        });
    };

    // Login API Call
    const handleLoginAPI = async (data) => {
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
    };

    // Login Form Submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        // Validate all fields
        const errors = {};
        errors.email = validateField('email', loginData.email, {
            required: true,
            pattern: validationRules.email
        });
        errors.password = validateField('password', loginData.password, { required: true });

        setLoginErrors(errors);

        if (Object.values(errors).some(error => error !== '')) {
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
    };

    // Google Sign In
    const handleGoogleSignIn = async () => {
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
    };

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

        // Setters
        setShowPassword,
        setShowConfirmPassword,

        // Handlers
        handleTabChange,
        handleLoginChange,
        handleLoginSubmit,
        handleGoogleSignIn,
        handleOpenDialog,
        handleCloseDialog,
    };
};
