import { useState, useMemo } from 'react';
import { useCrudAdminStory } from '@features/admin/hooks/useCrudAdminStory';

export const useAdminStories = () => {
    const [activeTab, setActiveTab] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    // Use the CRUD hook to fetch stories from the API
    const { stories: apiStories, loading, deleteStory, handleReloadStories } = useCrudAdminStory();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleDelete = async (id) => {
        await deleteStory(id);
    };

    // Transform API data to match component expectations
    const transformedStories = useMemo(() => {
        return apiStories.map(story => ({
            id: story.id,
            title: {
                shuar: story.title_shuar || '',
                es: story.title_español || ''
            },
            category: story.category || 'Mito',
            author: story.author || 'Desconocido',
            status: story.status || 'pending',
            cover: story.coverImage || ''
        }));
    }, [apiStories]);

    // Extract unique categories from stories
    const uniqueCategories = useMemo(() => {
        if (!transformedStories?.length) return ['Mito', 'Leyenda']; // Defaults
        const categories = new Set(transformedStories.map(story => story.category).filter(Boolean));
        // Ensure standard categories exist if desired, or just use what is there.
        // Let's mix defaults with actuals to ensure tabs exist even if data is empty? 
        // Or better, just use data.
        // User request: "filtre de acuerdo a lo que viene". So purely data driven.
        // But we probably want 'Todos' as the first option always.
        // Let's return just the categories here, component will add 'Todos'
        return Array.from(categories).sort();
    }, [transformedStories]);

    const filteredData = useMemo(() => {
        return transformedStories.filter(story => {
            // Filter by tab
            if (activeTab !== 'Todos') {
                // Case-insensitive comparison just in case
                if (story.category?.toLowerCase() !== activeTab?.toLowerCase()) return false;
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

            // Filter by status (strict pending)
            if ((story.status || '').toLowerCase() !== 'pending') return false;

            return true;
        });
    }, [transformedStories, activeTab, searchQuery]);

    return {
        activeTab,
        handleTabChange,
        searchQuery,
        setSearchQuery,
        data: filteredData,
        handleDelete,
        loading,
        handleReloadStories,
        uniqueCategories, // Export this
        stats: {
            total: transformedStories.length,
            pending: transformedStories.filter(s => (s.status || '').toLowerCase() === 'pending').length,
        }
    };
};

