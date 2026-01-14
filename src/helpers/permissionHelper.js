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
                id: 2,
                name: 'Gestión de Lecciones',
                route: '/admin/lecciones',
                icon: 'menu_book',
            },
            {
                id: 3,
                name: 'Gestión de Estudiantes',
                route: '/admin/estudiantes',
                icon: 'group',
            },
            {
                id: 4,
                name: 'Diccionario',
                route: '/admin/diccionario',
                icon: 'translate',
            },
            {
                id: 5,
                name: 'Historias',
                route: '/admin/historias',
                icon: 'auto_stories',
            },
        ],
        routes: [
            '/admin/dashboard',
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
                rol = datauserObject['rol'];
            } catch (error) {
                console.error('Error parsing user data:', error);
                return { menuItems: [], routes: [] };
            }
        }

        const menuFilter = objectRol[rol] || { menuItems: [], routes: [] };
        return menuFilter;
    };

    return {
        filterRouter,
    };
};
