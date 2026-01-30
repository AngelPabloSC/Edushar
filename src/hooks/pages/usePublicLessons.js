import { useState, useEffect, useMemo } from 'react';
import { useFetchDataPromise } from '../api/useFetchDataPromise';

export const usePublicLessons = () => {
    const { getFechData } = useFetchDataPromise();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rawLessons, setRawLessons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            try {
                // Fetch all lessons (assuming pagination limit is high enough for now)
                const response = await getFechData({
                    endPoint: 'api/lessons/list',
                    method: 'POST',
                    additionalData: { page: 1, limit: 100 }
                });

                if (response.code === 'COD_OK') {
                    const allLessons = response.data?.items || [];

                    // Consider only published lessons if status is available
                    // For now, we take all as we refine the backend data
                    const validLessons = allLessons;

                    setRawLessons(validLessons);
                } else {
                    setError(response.message || 'Error al cargar las lecciones');
                }
            } catch (err) {
                console.error("Error fetching public lessons:", err);
                setError('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [getFechData]);

    // Derived state: Filtered and Grouped Lessons
    const lessonsByLevel = useMemo(() => {
        let filtered = rawLessons;

        // 1. Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.title?.toLowerCase().includes(query) ||
                l.description?.toLowerCase().includes(query)
            );
        }

        // 2. Group by Level
        const levelOrder = {
            'Básico': 1,
            'Intermedio': 2,
            'Avanzado': 3
        };

        const grouped = {};

        filtered.forEach(lesson => {
            const level = lesson.level || 'Otros';
            // Normalize level key if needed

            if (!grouped[level]) {
                grouped[level] = {
                    level: levelOrder[level] || 99,
                    levelName: level,
                    lessons: []
                };
            }
            grouped[level].lessons.push(lesson);
        });

        // 3. Sort Levels
        return Object.values(grouped).sort((a, b) => a.level - b.level);
    }, [rawLessons, searchQuery]);

    return {
        loading,
        error,
        lessonsByLevel,
        searchQuery,
        setSearchQuery
    };
};
