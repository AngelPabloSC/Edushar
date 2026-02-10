import { useState, useEffect } from 'react';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

/**
 * Hook to fetch and prepare story details from the API
 * @param {string} storyId - The ID of the story to fetch
 */
export const useStoryDetail = (storyId) => {
    const { getFechData } = useFetchDataPromise();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [story, setStory] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            if (!storyId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log(`Fetching story with ID: ${storyId}`);
                const response = await getFechData({
                    endPoint: 'api/stories/get',
                    method: 'POST',
                    additionalData: { id: storyId }
                });

                console.log("Story API response:", response);

                if (response.code === 'COD_OK') {
                    // Sometimes the API might return the story directly in data, or under a 'story' or 'item' key
                    const apiStory = response.data?.story || response.data?.item || response.data;

                    if (!apiStory || (typeof apiStory === 'object' && Object.keys(apiStory).length === 0)) {
                        setError('No se encontró el contenido de la historia');
                        return;
                    }

                    // Flexible property mapping to handle camelCase and snake_case
                    const titleS = apiStory.title_shuar || apiStory.titleShuar || '';
                    const titleE = apiStory.title_español || apiStory.titleEs || apiStory.titleSpanish || '';
                    const contS = apiStory.contentShuar || apiStory.content_shuar || '';
                    const contE = apiStory.contentSpanish || apiStory.content_español || apiStory.contentEs || '';

                    // Parse content into pages
                    const paragraphsShuar = contS.split('\n').filter(p => p.trim());
                    const paragraphsSpanish = contE.split('\n').filter(p => p.trim());

                    // Zip paragraphs
                    const zippedParagraphs = paragraphsShuar.map((shuar, index) => ({
                        shuar,
                        spanish: paragraphsSpanish[index] || ''
                    }));

                    const pages = [];
                    for (let i = 0; i < zippedParagraphs.length; i += 2) {
                        pages.push({
                            paragraphs: zippedParagraphs.slice(i, i + 2)
                        });
                    }

                    setStory({
                        id: apiStory.id || apiStory._id || storyId,
                        title: {
                            shuar: titleS,
                            es: titleE
                        },
                        category: apiStory.category || 'Mito',
                        cover: apiStory.coverImage || apiStory.cover || '',
                        author: apiStory.author || 'Anónimo',
                        introduction: apiStory.introduction || "Disfruta de este relato de la selva.",
                        pages: pages.length > 0 ? pages : [{ paragraphs: [{ shuar: contS, spanish: contE }] }]
                    });
                } else {
                    setError(response.message || 'Error al cargar la historia');
                }
            } catch (err) {
                console.error("Error fetching story detail:", err);
                setError('Error de conexión con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [storyId, getFechData]);

    return {
        story,
        loading,
        error
    };
};
