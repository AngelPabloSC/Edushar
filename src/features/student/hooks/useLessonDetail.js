import { useState, useEffect } from 'react';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

export const useLessonDetail = (lessonId) => {
    const { getFechData } = useFetchDataPromise();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            if (!lessonId) return;

            setLoading(true);
            try {
                const response = await getFechData({
                    endPoint: 'api/lessons/get',
                    method: 'POST',
                    additionalData: { id: lessonId }
                });

                if (response.code === 'COD_OK' && response.data?.lesson) {
                    const apiLesson = response.data.lesson;

                    // Transform API data to match component expectations
                    // API exercises -> questions
                    const questions = (apiLesson.exercises || []).map((ex, index) => ({
                        id: index, // or some unique id
                        type: ex.type,
                        question: ex.question,
                        // Transform string options to objects if needed, or keep as strings 
                        // Component uses option.id and option.text. 
                        // Let's map strings to { id: string, text: string }
                        options: (ex.options || []).map(opt => ({
                            id: opt,
                            text: opt
                        })),
                        correctAnswer: ex.correctAnswer,
                        tip: ex.tip
                    }));

                    setLesson({
                        ...apiLesson,
                        questions,
                        totalQuestions: questions.length
                    });
                } else {
                    setError(response.message || 'Error al cargar la lección');
                }
            } catch (err) {
                console.error("Error fetching lesson detail:", err);
                setError('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId, getFechData]);

    return {
        lesson,
        loading,
        error
    };
};
