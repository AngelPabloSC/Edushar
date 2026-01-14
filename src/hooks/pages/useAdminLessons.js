import { useState } from 'react';
import { lessonsData } from '../../data/lessonsData';

export const useAdminLessons = () => {
    const [activeTab, setActiveTab] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Data filtering logic
    const filteredData = lessonsData.filter(lesson => {
        // Filter by tab/status
        if (activeTab !== 'Todas') {
            // Mapping tab names to status values loosely for this mock
            const statusMap = {
                'Borradores': 'Borrador',
                'Publicada': 'Publicada',
                'Archivada': 'Archivada'
            };
            if (lesson.status !== statusMap[activeTab]) return false;
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return lesson.title.toLowerCase().includes(query);
        }

        return true;
    });

    return {
        activeTab,
        handleTabChange,
        searchQuery,
        setSearchQuery,
        stats: {
            total: lessonsData.length,
            published: lessonsData.filter(l => l.status === 'Publicada').length,
            review: lessonsData.filter(l => l.status === 'Borrador').length // Assuming Drafts are "in review" contextually or similar
        },
        data: filteredData
    };
};
