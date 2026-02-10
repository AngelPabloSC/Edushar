import { useState, useMemo } from 'react';
import { useCrudAdminStory } from '../../../features/admin/hooks/useCrudAdminStory';

export const usePublicStories = () => {
    const [selectedCategory, setSelectedCategory] = useState('Todos los relatos');
    const [searchQuery, setSearchQuery] = useState('');

    // Use the CRUD hook to fetch stories from the API
    const { stories: apiStories, loading, handleReloadStories } = useCrudAdminStory();

    // Transform API data to match component expectations
    const transformedStories = useMemo(() => {
        return apiStories.map(story => ({
            id: story.id || story._id,
            title: {
                shuar: story.title_shuar || '',
                es: story.title_español || ''
            },
            category: story.category || 'Mito',
            author: story.author || 'Desconocido',
            status: story.status || 'Publicado',
            cover: story.coverImage || ''
        }));
    }, [apiStories]);

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
