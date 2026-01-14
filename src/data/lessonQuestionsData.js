export const lessonQuestionsData = {
    1: {
        // Lección 1: Saludos Básicos
        title: 'Saludos Básicos',
        totalQuestions: 10,
        questions: [
            {
                id: 1,
                type: 'translation',
                question: '¿Cómo estás?',
                options: [
                    { id: 'a', text: 'Winia nuku', correct: false },
                    { id: 'b', text: '¿Pujameck?', correct: true },
                    { id: 'c', text: 'Ma ket', correct: false },
                ],
            },
            {
                id: 2,
                type: 'translation',
                question: 'Buenos días',
                options: [
                    { id: 'a', text: 'Tsawant', correct: true },
                    { id: 'b', text: 'Kashik', correct: false },
                    { id: 'c', text: 'Kashi', correct: false },
                ],
            },
            {
                id: 3,
                type: 'translation',
                question: 'Adiós',
                options: [
                    { id: 'a', text: 'Pujut', correct: false },
                    { id: 'b', text: 'Winia', correct: false },
                    { id: 'c', text: 'Kashi', correct: true },
                ],
            },
            // Agregar más preguntas según sea necesario
        ],
    },
    // Agregar más lecciones aquí
};

export const getLessonQuestions = (lessonId) => {
    return lessonQuestionsData[lessonId] || null;
};
