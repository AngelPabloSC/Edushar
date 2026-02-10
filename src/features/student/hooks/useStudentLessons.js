import { useState, useEffect, useMemo } from 'react';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

export const useStudentLessons = () => {
    const { getFechData } = useFetchDataPromise();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lessonsByLevel, setLessonsByLevel] = useState({});
    const [globalStats, setGlobalStats] = useState({ completed: 0, total: 0, percentage: 0, streak: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [rawLessons, setRawLessons] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get User ID
                const userToken = localStorage.getItem("user");
                const tokenData = JSON.parse(userToken || "{}");
                const userId = tokenData.uid || tokenData.id;

                if (!userId) {
                    throw new Error("Usuario no identificado");
                }

                // 2. Fetch All Lessons and User Progress in parallel
                const [lessonsResponse, progressResponse] = await Promise.all([
                    getFechData({
                        endPoint: 'api/lessons/list',
                        method: 'POST',
                        additionalData: { page: 1, limit: 1000 } // Get all lessons
                    }),
                    getFechData({
                        endPoint: 'api/progress/list',
                        method: 'POST',
                        additionalData: { userId: userId }
                    })
                ]);

                // 3. Process Data
                if (lessonsResponse.code === 'COD_OK') {
                    let lessons = lessonsResponse.data?.items || [];

                    // Sort lessons by 'order' field
                    lessons.sort((a, b) => (a.order || 0) - (b.order || 0));

                    const progressItems = progressResponse.code === 'COD_OK' ? (progressResponse.data?.items || []) : [];

                    // Map progress by lessonId for faster lookup
                    const progressMap = {};
                    progressItems.forEach(item => {
                        progressMap[item.lessonId] = item;
                    });

                    // Identify the first lesson of EACH level to unlock by default
                    // Assuming API returns sorted lessons, otherwise we should sort
                    const firstLessonsByLevel = {}; // { 'Básico': 'id1', 'Intermedio': 'id2', ... }

                    lessons.forEach(lesson => {
                        const level = lesson.level || 'Otros';
                        if (!firstLessonsByLevel[level]) {
                            firstLessonsByLevel[level] = lesson.id;
                        }
                    });

                    // Merge Data
                    const mergedLessons = lessons.map((lesson, index) => {
                        const userProgress = progressMap[lesson.id];
                        const level = lesson.level || 'Otros';

                        let status = 'locked';
                        let score = 0;
                        let percentage = 0;

                        if (userProgress) {
                            // Map API status to UI status
                            // API: 'unlocked', 'completed'
                            // UI: 'available', 'in-progress', 'completed', 'locked'
                            if (userProgress.status === 'completed') status = 'completed';
                            else if (userProgress.status === 'unlocked') status = 'available';
                            else status = 'locked';

                            // If percentage > 0 but not completed, it's in-progress
                            if (status === 'available' && userProgress.percentage > 0) {
                                status = 'in-progress';
                            }

                            score = userProgress.score || 0;
                            percentage = userProgress.percentage || 0;
                        } else {
                            // Default unlocking logic
                            // 1. First lesson of ALL is always available
                            if (index === 0) {
                                status = 'available';
                            }
                            // 2. Unlock if PREVIOUS lesson is completed
                            else {
                                const prevLesson = lessons[index - 1];
                                const prevProgress = progressMap[prevLesson.id];

                                if (prevProgress && prevProgress.status === 'completed') {
                                    status = 'available';
                                }
                                // Fallback: Unlock first lesson of a level if not already handled
                                // (Useful if levels act as "chapters" somewhat independently, though we prefer sequential)
                                else if (firstLessonsByLevel[level] === lesson.id) {
                                    // Only unlock first of level if we want loose progression. 
                                    // For strict sequential, this might skip logic, but let's keep it for now as a fallback
                                    // However, user wants sequential. Let's make it available ONLY if strict sequential fails?
                                    // Actually, let's keep strict sequential as priority.
                                    // If previous is NOT completed, it remains locked unless it's the very first one.
                                    status = 'locked';
                                }
                            }
                        }

                        // Override for now for testing if no progress data at all
                        // status = 'available'; 

                        return {
                            ...lesson,
                            status,         // 'locked', 'available', 'in-progress', 'completed'
                            progress: percentage,
                            score,
                            completed: status === 'completed',
                            locked: status === 'locked',
                            inProgress: status === 'in-progress'
                        };
                    });

                    setRawLessons(mergedLessons);

                    // valid stats
                    const completed = mergedLessons.filter(l => l.completed).length;
                    const total = mergedLessons.length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                    // Determine "Current Level" Text
                    // Logic: Find the first lesson that is 'available' or 'in-progress'. The level of that lesson is the current user level.
                    // If all are completed, show the highest level.
                    // If none, default to 'Básico'.
                    const activeLesson = mergedLessons.find(l => l.status === 'in-progress' || l.status === 'available');
                    const lastCompleted = [...mergedLessons].reverse().find(l => l.status === 'completed');

                    let levelLabel = 'Nivel 1 • Fundamentos'; // default

                    const targetLesson = activeLesson || lastCompleted;

                    if (targetLesson) {
                        const rawLevel = targetLesson.level || 'Básico';
                        // Parse level to friendly string
                        if (rawLevel === 'Básico') levelLabel = 'Nivel 1 • Fundamentos';
                        else if (rawLevel === 'Intermedio') levelLabel = 'Nivel 2 • Intermedio';
                        else if (rawLevel === 'Avanzado') levelLabel = 'Nivel 3 • Avanzado';
                        else levelLabel = `${rawLevel}`;
                    } else if (mergedLessons.length > 0) {
                        // Edge case: nothing started? Default to first lesson's level
                        const first = mergedLessons[0];
                        const rawLevel = first.level || 'Básico';
                        if (rawLevel === 'Básico') levelLabel = 'Nivel 1 • Fundamentos';
                        else if (rawLevel === 'Intermedio') levelLabel = 'Nivel 2 • Intermedio';
                        else if (rawLevel === 'Avanzado') levelLabel = 'Nivel 3 • Avanzado';
                    }

                    // Calculate Streak
                    // Logic: Count consecutive days where at least one lesson was updated/completed.
                    // 1. Extract unique dates (YYYY-MM-DD) from progressItems
                    const dates = [...new Set(progressItems
                        .filter(p => p.updatedAt)
                        .map(p => new Date(p.updatedAt).toISOString().split('T')[0])
                    )].sort((a, b) => new Date(b) - new Date(a)); // Descending

                    let streak = 0;
                    if (dates.length > 0) {
                        const today = new Date().toISOString().split('T')[0];
                        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                        // Check if streak is active (today or yesterday present)
                        let currentDate = dates[0] === today ? today : (dates[0] === yesterday ? yesterday : null);

                        if (currentDate) {
                            streak = 1;
                            let checkDate = new Date(currentDate);

                            // Check previous days
                            for (let i = 1; i < dates.length; i++) {
                                checkDate.setDate(checkDate.getDate() - 1); // Go back 1 day
                                const expectedDate = checkDate.toISOString().split('T')[0];

                                if (dates[i] === expectedDate) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }

                    setGlobalStats({ completed, total, percentage, levelLabel, streak });

                    // Process Recent Activity (History)
                    const activityList = progressItems
                        .filter(p => p.updatedAt) // Ensure we have a date
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .slice(0, 5) // Last 5 items
                        .map(item => {
                            const lesson = lessons.find(l => l.id === item.lessonId);
                            if (!lesson) return null;

                            // Format relative time (e.g., "Hace 2 horas")
                            const date = new Date(item.updatedAt);
                            const now = new Date();
                            const diffInSeconds = Math.floor((now - date) / 1000);
                            let timeLabel = '';

                            if (diffInSeconds < 60) timeLabel = 'Hace unos segundos';
                            else if (diffInSeconds < 3600) timeLabel = `Hace ${Math.floor(diffInSeconds / 60)} min`;
                            else if (diffInSeconds < 86400) timeLabel = `Hace ${Math.floor(diffInSeconds / 3600)} h`;
                            else timeLabel = `Hace ${Math.floor(diffInSeconds / 86400)} días`;

                            return {
                                id: item.id || item._id || `${item.lessonId}-${Date.now()}`,
                                type: 'lesson',
                                title: `Lección: ${lesson.title}`,
                                time: timeLabel,
                                score: item.score,
                                exp: item.score, // Assuming Score = XP for now
                                percentage: item.percentage
                            };
                        })
                        .filter(Boolean);

                    setRecentActivity(activityList);

                } else {
                    setError('Error al cargar las lecciones');
                }
            } catch (err) {
                console.error("Error fetching student lessons:", err);
                setError(err.message || 'Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getFechData]);

    // Derived state
    const processedData = useMemo(() => {
        let filtered = rawLessons;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.title?.toLowerCase().includes(query) ||
                l.description?.toLowerCase().includes(query)
            );
        }

        // Group by Level
        const levelMapping = {
            'Básico': 'Nivel 1: Principiante',
            'Intermedio': 'Nivel 2: Intermedio',
            'Avanzado': 'Nivel 3: Avanzado'
        };

        const grouped = {};

        filtered.forEach(lesson => {
            const rawLevel = lesson.level || 'Otros';
            // Map legacy or new level names to UI standards
            const levelName = levelMapping[rawLevel] || rawLevel;

            if (!grouped[levelName]) {
                grouped[levelName] = [];
            }
            grouped[levelName].push(lesson);
        });

        // Ensure consistent sorting
        const orderedGrouped = {};
        const orderedKeys = ['Nivel 1: Principiante', 'Nivel 2: Intermedio', 'Nivel 3: Avanzado', 'Otros'];

        orderedKeys.forEach(key => {
            if (grouped[key]) orderedGrouped[key] = grouped[key];
        });

        // Add others not in the list
        Object.keys(grouped).forEach(key => {
            if (!orderedGrouped[key]) orderedGrouped[key] = grouped[key];
        });

        return orderedGrouped;

    }, [rawLessons, searchQuery]);

    return {
        rawLessons, // Expose flat list for finding active lesson
        lessonsByLevel: processedData,
        globalStats,
        recentActivity,
        loading,
        error,
        searchQuery,
        setSearchQuery
    };
};
