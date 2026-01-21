export const helpPermission = () => {
    const objectMenuAdmin = {
        menuItems: [
            {
                id: 1,
                name: 'Dashboard',
                route: '/admin/dashboard',
                icon: 'dashboard',
            },
            {
                id: 1.5,
                name: 'Lecciones',
                route: '/admin/lecciones',
                icon: 'menu_book',
            },
            {
                id: 1.6,
                name: 'Cuentos',
                route: '/admin/cuentos',
                icon: 'auto_stories',
            },
            {
                id: 1.7,
                name: 'Diccionario',
                route: '/admin/diccionario',
                icon: 'translate',
            },
        ],
        routes: [
            '/admin/dashboard',
            '/admin/usuarios',
            '/admin/editor',
            '/admin/configuracion',
            '/admin/lecciones',
            '/admin/estudiantes',
            '/admin/diccionario',
            '/admin/historias',
            '/admin/perfil',
        ],
    };

    const objectMenuStudent = {
        menuItems: [
            {
                id: 1,
                name: 'Inicio',
                route: '/estudiante/inicio',
                icon: 'home',
            },
            {
                id: 2,
                name: 'Mis Lecciones',
                route: '/estudiante/lecciones',
                icon: 'school',
            },
            {
                id: 3,
                name: 'Diccionario',
                route: '/estudiante/diccionario',
                icon: 'translate',
            },
            {
                id: 4,
                name: 'Cuentos',
                route: '/estudiante/cuentos',
                icon: 'auto_stories',
            },
            {
                id: 5,
                name: 'Contribuciones',
                route: '/estudiante/contribuciones',
                icon: 'send',
            },
        ],
        routes: [
            '/estudiante/inicio',
            '/estudiante/lecciones',
            '/leccion/:lessonId',
            '/estudiante/diccionario',
            '/estudiante/cuentos',
            '/estudiante/contribuciones',
            '/estudiante/perfil',
        ],
    };

    // Mapeo de roles del API a roles internos
    const roleMapping = {
        'admin': 'ADMIN',
        'student': 'ESTUDIANTE',
        'ADMIN': 'ADMIN',
        'ESTUDIANTE': 'ESTUDIANTE'
    };

    const objectRol = {
        ADMIN: objectMenuAdmin,
        ESTUDIANTE: objectMenuStudent,
    };

    const filterRouter = (customRol) => {
        const datauser = customRol || localStorage.getItem('user');
        if (!datauser) return { menuItems: [], routes: [] };

        let datauserObject = datauser;
        let rol = datauserObject;

        if (!customRol) {
            try {
                datauserObject = JSON.parse(datauser);
                // Intentar obtener 'role' primero (API nuevo), luego 'rol' (legacy)
                rol = datauserObject['role'] || datauserObject['rol'];
            } catch (error) {
                console.error('Error parsing user data:', error);
                return { menuItems: [], routes: [] };
            }
        }

        // Mapear el rol del API al formato interno
        const mappedRole = roleMapping[rol] || rol;

        const menuFilter = objectRol[mappedRole] || { menuItems: [], routes: [] };
        return menuFilter;
    };

    return {
        filterRouter,
    };
};
