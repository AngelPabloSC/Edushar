/**
 * Datos simulados para el perfil del estudiante
 */

export const studentProfileData = {
    user: {
        name: 'Juan Pérez',
        level: 'Nivel 4',
        streak: 5,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    },
    stats: {
        lessonsCompleted: 12,
        totalLessons: 20,
        wordsLearned: 150,
        lessonsProgress: 60,
    },
    medals: [
        {
            id: 1,
            name: 'Guardián Amazónico',
            iconType: 'military',
            color: 'warning',
            earned: true
        },
        {
            id: 2,
            name: 'Primer Cuento',
            iconType: 'story',
            color: 'info',
            earned: true
        },
        {
            id: 3,
            name: 'Maestro Vocabulario',
            iconType: 'trophy',
            color: 'success',
            earned: true
        },
        {
            id: 4,
            name: 'Políglota Shuar',
            iconType: 'brain',
            color: 'default',
            earned: false
        },
        {
            id: 5,
            name: 'Líder Comunitario',
            iconType: 'group',
            color: 'default',
            earned: false
        },
    ],
    activities: [
        {
            id: 1,
            title: 'Lección Completada: Saludos',
            time: 'Hace 2 horas',
            type: 'lesson',
            exp: 50
        },
        {
            id: 2,
            title: 'Leíste: El Origen del Sol',
            time: 'Ayer',
            type: 'story'
        },
        {
            id: 3,
            title: 'Nueva Medalla: Maestro Vocabulario',
            time: 'Hace 2 días',
            type: 'medal'
        },
        {
            id: 4,
            title: 'Quiz: Animales de la Selva',
            time: 'Lunes',
            type: 'quiz',
            score: '100%'
        },
    ]
};
