export const lessonsData = [
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

    lessonsData.forEach(lesson => {
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
