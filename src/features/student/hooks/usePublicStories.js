import { useState, useMemo, useEffect } from 'react';
import { useCrudAdminStory } from '../../../features/admin/hooks/useCrudAdminStory';
import { useAuth } from '../../../features/auth/context/LoginContext';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

export const usePublicStories = () => {
    const [selectedCategory, setSelectedCategory] = useState('Todos los relatos');
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth();
    const { getFechData } = useFetchDataPromise();

    // Use the CRUD hook to fetch stories from the API
    const { stories: apiStories, loading: storiesLoading, handleReloadStories } = useCrudAdminStory();
    const [progress, setProgress] = useState([]);
    const [progressLoading, setProgressLoading] = useState(false);

    // Fetch user progress
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user || !user.id) return;

            setProgressLoading(true);
            try {
                const response = await getFechData({
                    endPoint: 'api/progress/list',
                    method: 'POST',
                    additionalData: { userId: user.id }
                });

                if (response.code === 'COD_OK') {
                    setProgress(response.data?.items || []);
                }
            } catch (error) {
                console.error('Error fetching story progress:', error);
            } finally {
                setProgressLoading(false);
            }
        };

        fetchProgress();
    }, [user, getFechData]);

    const loading = storiesLoading || progressLoading;

    // Transform API data to match component expectations
    const transformedStories = useMemo(() => {
        // Map progress by lessonId (which we use for storyId)
        const progressMap = {};
        progress.forEach(p => {
            progressMap[p.lessonId] = p.status;
        });

        return apiStories.map(story => {
            const id = story.id || story._id;
            return {
                id,
                title: {
                    shuar: story.title_shuar || '',
                    es: story.title_español || ''
                },
                category: story.category || 'Mito',
                author: story.author || 'Desconocido',
                status: story.status || 'Publicado',
                cover: story.coverImage || '',
                isRead: progressMap[id] === 'completed'
            };
        });
    }, [apiStories, progress]);

    // Extract unique categories from stories
    const categories = useMemo(() => {
        const uniqueCats = new Set(transformedStories.map(story => story.category));
        return ['Todos los relatos', ...Array.from(uniqueCats)];
    }, [transformedStories]);

    const filteredData = useMemo(() => {
        return transformedStories
            .filter(story => story.status === 'Publicado') // Only show published stories
            .filter(story => {
                // Filter by category
                if (selectedCategory !== 'Todos los relatos') {
                    if (story.category !== selectedCategory) return false;
                }

                // Filter by search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        story.title.es.toLowerCase().includes(query) ||
                        story.title.shuar.toLowerCase().includes(query) ||
                        story.author.toLowerCase().includes(query)
                    );
                }

                return true;
            });
    }, [transformedStories, selectedCategory, searchQuery]);

    return {
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        stories: filteredData,
        categories,
        loading,
        refetch: handleReloadStories
    };
};
