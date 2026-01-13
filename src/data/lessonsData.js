export const lessonsData = [
    // Nivel 1: Fundamentos
    {
        id: 1,
        level: 1,
        levelName: 'Fundamentos',
        title: 'Saludos Básicos',
        description: 'Aprende a decir hola, adiós y a presentarte respetuosamente en la cultura Shuar.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
        locked: false,
    },
    {
        id: 2,
        level: 1,
        levelName: 'Fundamentos',
        title: 'La Familia',
        description: 'Vocabulario esencial para describir a los miembros de tu familia y las relaciones de parentesco.',
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
        locked: false,
    },
    {
        id: 3,
        level: 1,
        levelName: 'Fundamentos',
        title: 'Los Números',
        description: 'Aprende a contar del 1 al 20 y los conceptos básicos de cantidad en Shuar.',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
        locked: false,
    },
    // Nivel 2: Intermedio
    {
        id: 4,
        level: 2,
        levelName: 'Intermedio',
        title: 'Verbos Comunes',
        description: 'Acciones cotidianas: comer, dormir, caminar y trabajar.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        locked: false,
    },
    {
        id: 5,
        level: 2,
        levelName: 'Intermedio',
        title: 'La Naturaleza',
        description: 'Nombres de árboles, plantas y fenómenos naturales de la selva.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
        locked: false,
    },
    {
        id: 6,
        level: 2,
        levelName: 'Intermedio',
        title: 'Cultura y Tradición',
        description: 'Explora las costumbres, vestimenta y rituales del pueblo Shuar.',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
        locked: false,
    },
];

// Agrupar lecciones por nivel
export const getLessonsByLevel = () => {
    const grouped = {};
    lessonsData.forEach((lesson) => {
        if (!grouped[lesson.level]) {
            grouped[lesson.level] = {
                level: lesson.level,
                levelName: lesson.levelName,
                lessons: [],
            };
        }
        grouped[lesson.level].lessons.push(lesson);
    });
    return Object.values(grouped);
};
