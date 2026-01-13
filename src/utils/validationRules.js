const validationRules = {
    required: "Este campo es requerido",
    numeric: {
        value: /^[0-9]+$/,
        message: "Solo se permiten números",
    },
    cedula: {
        value: /^[0-9]{10}$/,
        message: "La cédula debe tener 10 dígitos numéricos",
    },
    email: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Debe ser un correo electrónico válido",
    },
    phone: {
        value: /^[0-9]{10}$/,
        message: "El número de teléfono debe tener 10 dígitos",
    },
    date: {
        value: /^\d{4}-\d{2}-\d{2}$/,
        message: "Debe ser una fecha en formato YYYY-MM-DD",
    },
    alphanumeric: {
        value: /^[a-zA-Z0-9\s]+$/,
        message: "Solo se permiten letras y números",
    },
    password: {
        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        message:
            "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número",
    },
    text: {
        value: /^[a-zA-Z\s]+$/,
        message: "Solo se permiten letras y espacios",
    },
    url: {
        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
        message: "Debe ser una URL válida",
    },
    postalCode: {
        value: /^[0-9]{5}$/,
        message: "Debe ser un código postal válido de 5 dígitos",
    },
    maxLength: (max) => ({
        value: max,
        message: `No puede tener más de ${max} caracteres`,
    }),
    minLength: (min) => ({
        value: min,
        message: `Debe tener al menos ${min} caracteres`,
    }),
    match: (regex, message) => ({
        value: regex,
        message: message || "El formato no es válido",
    }),
};

export default validationRules;
