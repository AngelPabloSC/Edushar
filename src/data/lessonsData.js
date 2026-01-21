// Comprehensive lessons data with images, progress, and lock states
export const lessonsData = [
    // Nivel 1: Fundamentos
    {
        id: 1,
        title: 'Saludos Básicos',
        description: 'Aprende a decir hola, adiós y a presentarte respetuosamente en la cultura Shuar.',
        levelName: 'Nivel 1: Fundamentos',
        level: 1,
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
        completed: true,
        inProgress: false,
        locked: false,
        progress: 100,
    },
    {
        id: 2,
        title: 'La Familia',
        description: 'Vocabulario esencial para describir a los miembros de tu familia y las relaciones de parentesco.',
        levelName: 'Nivel 1: Fundamentos',
        level: 1,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
        completed: false,
        inProgress: true,
        locked: false,
        progress: 60,
    },
    {
        id: 3,
        title: 'Los Números',
        description: 'Aprende a contar del 1 al 20 y los conceptos básicos de cantidad en Shuar.',
        levelName: 'Nivel 1: Fundamentos',
        level: 1,
        image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80',
        completed: false,
        inProgress: false,
        locked: true,
        progress: 0,
    },
    // Nivel 2: Intermedio
    {
        id: 4,
        title: 'Verbos Comunes',
        description: 'Acciones cotidianas: comer, dormir, caminar y trabajar.',
        levelName: 'Nivel 2: Intermedio',
        level: 2,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
        completed: false,
        inProgress: false,
        locked: true,
        progress: 0,
    },
    {
        id: 5,
        title: 'La Naturaleza',
        description: 'Nombres de árboles, plantas y fenómenos naturales de la selva.',
        levelName: 'Nivel 2: Intermedio',
        level: 2,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        completed: false,
        inProgress: false,
        locked: true,
        progress: 0,
    },
    {
        id: 6,
        title: 'Cultura y Tradición',
        description: 'Explora las costumbres, vestimenta y rituales del pueblo Shuar.',
        levelName: 'Nivel 2: Intermedio',
        level: 2,
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
        completed: false,
        inProgress: false,
        locked: true,
        progress: 0,
    },
];

// Legacy data for admin panel
export const lessonsDataLegacy = [
    {
        id: 1,
        order: '01',
        title: 'Saludos y Presentaciones',
        level: 'A1 - Principiante',
        status: 'Publicada',
        icon: 'menu_book',
    },
    {
        id: 2,
        order: '02',
        title: 'Números del 1 al 100',
        level: 'A1 - Principiante',
        status: 'Borrador',
        icon: 'calculate',
    },
    {
        id: 3,
        order: '03',
        title: 'Miembros de la Familia',
        level: 'A2 - Elemental',
        status: 'Publicada',
        icon: 'family_history',
    },
    {
        id: 4,
        order: '04',
        title: 'Comida y Tradición',
        level: 'B1 - Intermedio',
        status: 'Publicada',
        icon: 'restaurant',
    },
];

export const lessonColumns = [
    {
        name: "order",
        label: "Orden",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "title",
        label: "Título de la Lección",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "level",
        label: "Nivel",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "status",
        label: "Estado",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "actions",
        label: "Acciones",
        options: {
            filter: false,
            sort: false,
            empty: true,
        }
    }
];

// Helper function to group lessons by level - returns array
export const getLessonsByLevel = () => {
    const grouped = {};

    lessonsDataLegacy.forEach(lesson => {
        const level = lesson.level;
        if (!grouped[level]) {
            grouped[level] = {
                level: level,
                lessons: []
            };
        }
        grouped[level].lessons.push(lesson);
    });

    // Convert object to array and sort by level
    const levelOrder = {
        'A1 - Principiante': 1,
        'A2 - Elemental': 2,
        'B1 - Intermedio': 3,
        'B2 - Intermedio Alto': 4,
        'C1 - Avanzado': 5
    };

    return Object.values(grouped).sort((a, b) => {
        return (levelOrder[a.level] || 999) - (levelOrder[b.level] || 999);
    });
};
