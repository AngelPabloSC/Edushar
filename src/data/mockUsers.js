/**
 * Mock users for authentication testing
 * These users simulate a backend authentication system
 */

export const mockUsers = [
    {
        id: 1,
        nombre: 'Admin',
        apellido: 'EduShar',
        email: 'admin@edushar.com',
        password: 'Admin123',
        rol: 'ADMIN',
    },
    {
        id: 2,
        nombre: 'Juan',
        apellido: 'Shuar',
        email: 'estudiante@edushar.com',
        password: 'Estudiante123',
        rol: 'ESTUDIANTE',
    },
    {
        id: 3,
        nombre: 'María',
        apellido: 'Tsantsa',
        email: 'maria@edushar.com',
        password: 'Maria123',
        rol: 'ESTUDIANTE',
    },
];

/**
 * Simulates authentication by validating credentials against mock users
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const authenticateUser = async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        return {
            success: false,
            error: 'No existe una cuenta con este correo electrónico',
        };
    }

    if (user.password !== password) {
        return {
            success: false,
            error: 'Contraseña incorrecta',
        };
    }

    // Return user data without password
    const { password: _, ...userData } = user;

    return {
        success: true,
        data: {
            user: userData,
            accessToken: `mock-token-${user.id}-${Date.now()}`,
        },
    };
};

/**
 * Simulates user registration
 * @param {object} userData - User registration data
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const registerUser = async (userData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = mockUsers.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingUser) {
        return {
            success: false,
            error: 'Ya existe una cuenta con este correo electrónico',
        };
    }

    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
        id: mockUsers.length + 1,
        nombre: userData.firstName,
        apellido: userData.lastName,
        email: userData.email,
        rol: 'ESTUDIANTE', // New users are students by default
    };

    return {
        success: true,
        data: {
            user: newUser,
            accessToken: `mock-token-${newUser.id}-${Date.now()}`,
        },
    };
};
