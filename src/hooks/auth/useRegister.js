import { useState, useCallback } from 'react';
import { useLoginContext } from '../context/LoginContext';
import { useSnackBarContext } from '../context/SnackbarContext';
import { useFormValidation } from '../ui/useFormValidation';
import validationRules from '../../utils/validationRules';

export const useRegister = () => {
    const { login } = useLoginContext();
    const { handleSetDataSnackbar } = useSnackBarContext();

    // States
    const [isLoading, setIsLoading] = useState(false);

    // Form validation hook
    const {
        data: registerData,
        errors: registerErrors,
        handleChange: baseHandleChange,
        validateAll,
        setFieldError,
    } = useFormValidation(
        {
            firstName: '',
            lastName: '',
            email: '',
            birthdate: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
        validationRules
    );

    // Register Form Change Handler - memoized
    const handleRegisterChange = useCallback((e) => {
        const { name, value } = e.target;

        // Determine validation rules based on field
        let fieldRules = null;

        if (name === 'firstName' || name === 'lastName') {
            fieldRules = {
                required: true,
                pattern: validationRules.text
            };
        } else if (name === 'email') {
            fieldRules = {
                required: true,
                pattern: validationRules.email
            };
        } else if (name === 'birthdate') {
            fieldRules = { required: true };

            // Additional age validation
            baseHandleChange(e, fieldRules);

            if (value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 13) {
                    setFieldError(name, 'Debes ser mayor de 13 años');
                }
            }
            return; // Early return to avoid double validation
        } else if (name === 'password') {
            fieldRules = {
                required: true,
                pattern: validationRules.password
            };
        } else if (name === 'confirmPassword') {
            // Custom validation for password match
            baseHandleChange(e, null);
            if (value !== registerData.password) {
                setFieldError(name, 'Las contraseñas no coinciden');
            } else {
                setFieldError(name, '');
            }
            return;
        }

        baseHandleChange(e, fieldRules);
    }, [baseHandleChange, registerData.password, setFieldError]);

    // Register API Call - memoized
    const handleRegisterAPI = useCallback(async (data) => {
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
    }, [login, handleSetDataSnackbar]);

    // Register Form Submit - memoized
    const handleRegisterSubmit = useCallback(async (e) => {
        e.preventDefault();

        // Prevenir múltiples envíos
        if (isLoading) {
            console.warn('⚠️ Registro ya en proceso, ignorando clic duplicado');
            return;
        }

        // Validate all fields
        const fieldsConfig = {
            firstName: {
                required: true,
                pattern: validationRules.text
            },
            lastName: {
                required: true,
                pattern: validationRules.text
            },
            email: {
                required: true,
                pattern: validationRules.email
            },
            birthdate: { required: true },
            password: {
                required: true,
                pattern: validationRules.password
            },
        };

        const isValid = validateAll(fieldsConfig);

        // Additional validations
        if (registerData.birthdate) {
            const birthDate = new Date(registerData.birthdate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                setFieldError('birthdate', 'Debes ser mayor de 13 años');
                return;
            }
        }

        if (registerData.password !== registerData.confirmPassword) {
            setFieldError('confirmPassword', 'Las contraseñas no coinciden');
            return;
        }

        if (!registerData.acceptTerms) {
            setFieldError('acceptTerms', 'Debes aceptar los términos y condiciones');
            return;
        }

        if (!isValid) {
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
    }, [registerData, validateAll, handleRegisterAPI, setFieldError]);

    return {
        // States
        registerData,
        registerErrors,
        isLoading,

        // Handlers - all memoized with useCallback
        handleRegisterChange,
        handleRegisterSubmit,
    };
};
