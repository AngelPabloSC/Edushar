import { useState, useMemo, useEffect, useCallback } from 'react';
import { useFetchDataPromise } from '../api/useFetchDataPromise';

export const usePublicDictionary = () => {
    const { getFechData } = useFetchDataPromise();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Dictionary Entries
    const fetchDictionary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getFechData({
                endPoint: 'api/dictionary/list',
                method: 'POST', // Typically POST for search/filter endpoints in this API
                additionalData: {}
            });

            if (response.code === 'COD_OK') {
                const items = response.data?.items || [];

                // Filter for only 'Publicado' and process data
                const processedItems = items
                    .filter(item => (item.status || 'Publicado') === 'Publicado')
                    .map(item => ({
                        ...item,
                        exampleShuar: Array.isArray(item.examples) ? item.examples[0] : (item.examples || ''),
                        // Ensure other necessary fields are present
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
        fetchDictionary();
    }, [fetchDictionary]);

    // Estadísticas for Public Page
    const stats = useMemo(() => ({
        words: entries.length,
        // Count words with Shuar text (all can be played with TTS)
        audioClips: entries.filter(e => e.wordShuar && e.wordShuar.trim()).length,
        contributors: 5, // Static for now as user data might not come with dictionary list
    }), [entries]);

    return {
        entries,
        loading,
        error,
        stats,
        refetch: fetchDictionary
    };
};
