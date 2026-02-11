import { useState, useMemo, useEffect, useCallback } from 'react';
import { useFetchDataPromise } from '@shared/hooks/useFetchDataPromise';

export const useAdminDictionary = () => {
    const { getFechData } = useFetchDataPromise();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('adminDictionarySearch') || '');
    const [categoryFilter, setCategoryFilter] = useState(() => sessionStorage.getItem('adminDictionaryCategory') || 'Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [isFetch, setIsFetch] = useState(true);

    // Fetch Dictionary Entries
    const fetchDictionary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getFechData({
                endPoint: 'api/dictionary/list',
                method: 'POST',
                additionalData: {} // Add pagination params if needed later
            });

            if (response.code === 'COD_OK') {
                const items = response.data?.items || [];
                // Transform data if needed or use as is if it matches UI
                // Current UI expects: wordShuar, wordSpanish, category, exampleShuar, etc.
                // Assuming backend returns similar structure due to create payload.
                // If backend examples is an array, we might need to pick the first one or join them.

                const processedItems = items.map(item => ({
                    ...item,
                    exampleShuar: Array.isArray(item.examples) ? item.examples[0] : (item.examples || ''),
                    status: item.status || 'pending'
                }));

                setEntries(processedItems);
            } else {
                setError('Error al cargar el diccionario');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    }, [getFechData]);

    useEffect(() => {
        if (!isFetch) return;

        fetchDictionary();
        setIsFetch(false);
    }, [isFetch, fetchDictionary]);

    // Save filters to session storage
    useEffect(() => {
        sessionStorage.setItem('adminDictionarySearch', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        sessionStorage.setItem('adminDictionaryCategory', categoryFilter);
    }, [categoryFilter]);

    // Filtrar entradas
    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (entry.wordShuar || '').toLowerCase().includes(searchLower) ||
                (entry.wordSpanish || '').toLowerCase().includes(searchLower);
            // Can add example search if needed

            const isPending = (entry.status || '').toLowerCase() === 'pending';
            if (!isPending) return false;

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
            familia: entries.filter(e => e.category?.toLowerCase() === 'familia').length,
            naturaleza: entries.filter(e => e.category?.toLowerCase() === 'naturaleza').length,
            animales: entries.filter(e => e.category?.toLowerCase() === 'animales').length,
            alimentos: entries.filter(e => (e.category?.toLowerCase() === 'alimentos y plantas' || e.category?.toLowerCase() === 'plantas')).length,
            objetos: entries.filter(e => e.category?.toLowerCase() === 'objetos').length,
            numeros: entries.filter(e => e.category?.toLowerCase() === 'números y colores').length,
        }
    }), [entries]);

    // Operations
    const deleteEntry = async (id) => {
        try {
            const response = await getFechData({
                endPoint: 'api/dictionary/delete',
                method: 'POST',
                additionalData: { id }
            });

            if (response.code === 'COD_OK') {
                setEntries(prev => prev.filter(entry => entry.id !== id));
            } else {
                throw new Error(response.message || 'No se pudo eliminar');
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            // Optionally handle error state specifically for delete
        }
    };

    // Placeholder for update (if needed later with API)
    const updateEntry = async (id, updatedData) => {
        try {
            const response = await getFechData({
                endPoint: 'api/dictionary/update',
                method: 'POST',
                additionalData: { id, ...updatedData }
            });

            if (response.code === 'COD_OK') {
                setEntries(prev => prev.map(entry =>
                    entry.id === id ? { ...entry, ...updatedData } : entry
                ));
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Error al actualizar' };
            }
        } catch (error) {
            console.error("Error updating entry:", error);
            return { success: false, message: error.message || 'Error de conexión' };
        }
    };

    // Placeholder for add (handled in create page, but here for context)
    const addEntry = (newEntry) => {
        setEntries(prev => [...prev, newEntry]);
    };

    // Reload function (matching useCrudAdminLesson pattern)
    const handleReloadDictionary = () => {
        setIsFetch(true);
    };

    return {
        entries: filteredEntries,
        allEntries: entries,
        stats,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        deleteEntry,
        updateEntry, // Kept for compatibility
        addEntry,    // Kept for compatibility
        refetch: handleReloadDictionary,
        handleReloadDictionary
    };
};
