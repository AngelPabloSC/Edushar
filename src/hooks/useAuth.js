import { useState } from 'react';
import validationRules from '../utils/validationRules';

const useAuth = () => {
    const [tabValue, setTabValue] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    // Estados para errores de validación
    const [loginErrors, setLoginErrors] = useState({});
    const [registerErrors, setRegisterErrors] = useState({});

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // Limpiar errores al cambiar de tab
        setLoginErrors({});
        setRegisterErrors({});
    };

    // Función de validación genérica
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

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });

        // Validar en tiempo real
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

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setRegisterData({
            ...registerData,
            [name]: fieldValue,
        });

        // Validar en tiempo real
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
            // Validar edad mínima (13 años)
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

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        // Validar todos los campos
        const errors = {};
        errors.email = validateField('email', loginData.email, {
            required: true,
            pattern: validationRules.email
        });
        errors.password = validateField('password', loginData.password, { required: true });

        setLoginErrors(errors);

        // Si hay errores, no enviar
        if (Object.values(errors).some(error => error !== '')) {
            return;
        }

        // TODO: Implementar lógica de autenticación con Firebase
        console.log('Login:', loginData);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        // Validar todos los campos
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

        // Validar edad
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

        // Si hay errores, no enviar
        if (Object.values(errors).some(error => error !== '')) {
            return;
        }

        // TODO: Implementar lógica de registro con Firebase
        console.log('Register:', registerData);
    };

    return {
        // States
        tabValue,
        showPassword,
        showConfirmPassword,
        loginData,
        registerData,
        loginErrors,
        registerErrors,

        // Setters
        setShowPassword,
        setShowConfirmPassword,

        // Handlers
        handleTabChange,
        handleLoginChange,
        handleRegisterChange,
        handleLoginSubmit,
        handleRegisterSubmit,
    };
};

export default useAuth;
