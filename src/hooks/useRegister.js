import { useState } from 'react';
import { useLoginContext } from './context/LoginContext';
import { useSnackBarContext } from './context/SnackbarContext';
import validationRules from '../utils/validationRules';

export const useRegister = () => {
    const { login } = useLoginContext();
    const { handleSetDataSnackbar } = useSnackBarContext();

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [registerErrors, setRegisterErrors] = useState({});

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

    // Register Form Change Handler
    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setRegisterData({
            ...registerData,
            [name]: fieldValue,
        });

        // Real-time validation
        let error = '';
        if (name === 'firstName' || name === 'lastName') {
            error = validateField(name, value, {
                required: true,
                pattern: validationRules.text
            });
        } else if (name === 'email') {
            error = validateField(name, value, {
                required: true,
                pattern: validationRules.email
            });
        } else if (name === 'birthdate') {
            error = validateField(name, value, { required: true });
            if (!error && value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 13) {
                    error = 'Debes ser mayor de 13 años';
                }
            }
        } else if (name === 'password') {
            error = validateField(name, value, {
                required: true,
                pattern: validationRules.password
            });
        } else if (name === 'confirmPassword') {
            if (value !== registerData.password) {
                error = 'Las contraseñas no coinciden';
            }
        }

        setRegisterErrors({
            ...registerErrors,
            [name]: error,
        });
    };

    // Register API Call
    const handleRegisterAPI = async (data) => {
        setIsLoading(true);
        try {
            // Crear FormData para enviar archivo de foto
            const formData = new FormData();

            // Agregar campos de texto
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('birthdate', data.birthdate);
            formData.append('role', data.role || 'student');

            // Agregar foto si existe
            if (data.photoProfile) {
                formData.append('photoProfile', data.photoProfile);
            }

            console.log('📤 Sending registration data...');

            // Enviar al backend
            const response = await fetch(
                `${import.meta.env.VITE_URL_FETCH}/api/users/create`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const responseData = await response.json();
            console.log('📥 Registration response:', responseData);

            if (responseData.code === 'COD_OK') {
                console.log('✅ Registration successful');

                // Mostrar snackbar de éxito
                handleSetDataSnackbar({
                    message: responseData.data?.token
                        ? '¡Cuenta creada! Iniciando sesión...'
                        : '¡Cuenta creada exitosamente! Por favor inicia sesión.',
                    type: 'success'
                });

                // Si el backend retorna token, hacer login automático después de 1.5s
                if (responseData.data && responseData.data.user && responseData.data.token) {
                    console.log('🔐 Has user and token - will auto-login in 1.5s');
                    setTimeout(() => {
                        console.log('🚀 Executing login with data:', responseData.data);
                        login(responseData.data);
                    }, 1500);
                    return { success: true, data: responseData.data, shouldSwitchToLogin: false };
                } else {
                    console.log('⚠️ No auto-login - backend did not return token');
                    return { success: true, data: responseData.data, shouldSwitchToLogin: true };
                }
            } else {
                console.error('❌ Registration failed:', responseData);
                handleSetDataSnackbar({
                    message: responseData.message || 'No se pudo crear la cuenta. Intenta nuevamente.',
                    type: 'error'
                });
                return { success: false, error: responseData.message };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            handleSetDataSnackbar({
                message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
                type: 'error'
            });
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Register Form Submit
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = {};
        errors.firstName = validateField('firstName', registerData.firstName, {
            required: true,
            pattern: validationRules.text
        });
        errors.lastName = validateField('lastName', registerData.lastName, {
            required: true,
            pattern: validationRules.text
        });
        errors.email = validateField('email', registerData.email, {
            required: true,
            pattern: validationRules.email
        });
        errors.birthdate = validateField('birthdate', registerData.birthdate, { required: true });

        if (!errors.birthdate && registerData.birthdate) {
            const birthDate = new Date(registerData.birthdate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                errors.birthdate = 'Debes ser mayor de 13 años';
            }
        }

        errors.password = validateField('password', registerData.password, {
            required: true,
            pattern: validationRules.password
        });

        if (registerData.password !== registerData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!registerData.acceptTerms) {
            errors.acceptTerms = 'Debes aceptar los términos y condiciones';
        }

        setRegisterErrors(errors);

        if (Object.values(errors).some(error => error !== '')) {
            return;
        }

        // Call API
        const result = await handleRegisterAPI({
            email: registerData.email,
            password: registerData.password,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            birthdate: registerData.birthdate,
            role: 'student',
            photoProfile: registerData.photoProfile
        });

        return result;
    };

    return {
        // States
        registerData,
        registerErrors,
        isLoading,

        // Handlers
        handleRegisterChange,
        handleRegisterSubmit,
    };
};
