import { useState, useMemo } from 'react';

// Mock data expandido basado en dictionaryData.js
const mockDictionaryEntries = [
    {
        id: 1,
        wordShuar: 'Nua',
        wordSpanish: 'Mujer',
        category: 'Sustantivo',
        exampleShuar: 'Ii nuari jutai.',
        exampleSpanish: 'Nuestra mujer es fuerte.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        createdAt: '2024-01-15',
        status: 'Publicado'
    },
    {
        id: 2,
        wordShuar: 'Jia',
        wordSpanish: 'Jaguar / Tigre',
        category: 'Sustantivo',
        exampleShuar: 'Jia ikiamnum pujawai.',
        exampleSpanish: 'El jaguar vive en la selva.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
        createdAt: '2024-01-14',
        status: 'Publicado'
    },
    {
        id: 3,
        wordShuar: 'Entsa',
        wordSpanish: 'Agua / Río',
        category: 'Sustantivo',
        exampleShuar: 'Entsa pichiitui.',
        exampleSpanish: 'El agua está limpia.',
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
        createdAt: '2024-01-13',
        status: 'Publicado'
    },
    {
        id: 4,
        wordShuar: 'Wakan',
        wordSpanish: 'Hablar',
        category: 'Verbo',
        exampleShuar: 'Winia wakan najanajai.',
        exampleSpanish: 'Yo hablo despacio.',
        image: null,
        createdAt: '2024-01-12',
        status: 'Borrador'
    },
    {
        id: 5,
        wordShuar: 'Yurumak',
        wordSpanish: 'Pensar',
        category: 'Verbo',
        exampleShuar: 'Yurumaktasan wakerujai.',
        exampleSpanish: 'Quiero pensar.',
        image: null,
        createdAt: '2024-01-11',
        status: 'Publicado'
    },
    {
        id: 6,
        wordShuar: 'Pujut',
        wordSpanish: 'Grande',
        category: 'Adjetivo',
        exampleShuar: 'Jea pujutai.',
        exampleSpanish: 'La casa es grande.',
        image: null,
        createdAt: '2024-01-10',
        status: 'Publicado'
    },
];

export const useAdminDictionary = () => {
    const [entries, setEntries] = useState(mockDictionaryEntries);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    // Filtrar entradas
    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const matchesSearch =
                entry.wordShuar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.wordSpanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.exampleShuar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.exampleSpanish.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = categoryFilter === 'Todos' || entry.category === categoryFilter;
            const matchesStatus = statusFilter === 'Todos' || entry.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [entries, searchTerm, categoryFilter, statusFilter]);

    // Estadísticas
    const stats = useMemo(() => ({
        total: entries.length,
        published: entries.filter(e => e.status === 'Publicado').length,
        draft: entries.filter(e => e.status === 'Borrador').length,
        byCategory: {
            sustantivo: entries.filter(e => e.category === 'Sustantivo').length,
            verbo: entries.filter(e => e.category === 'Verbo').length,
            adjetivo: entries.filter(e => e.category === 'Adjetivo').length,
        }
    }), [entries]);

    // CRUD Operations (mock)
    const deleteEntry = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const updateEntry = (id, updatedData) => {
        setEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, ...updatedData } : entry
        ));
    };

    const addEntry = (newEntry) => {
        const entry = {
            ...newEntry,
            id: Math.max(...entries.map(e => e.id)) + 1,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setEntries(prev => [...prev, entry]);
    };

    return {
        entries: filteredEntries,
        allEntries: entries,
        stats,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        deleteEntry,
        updateEntry,
        addEntry,
    };
};
