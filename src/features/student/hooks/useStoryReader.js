import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

export const useStoryReader = () => {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const { getFechData } = useFetchDataPromise();

    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showTranslation, setShowTranslation] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            if (!storyId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await getFechData({
                    endPoint: 'api/stories/get',
                    method: 'POST',
                    additionalData: { id: storyId }
                });

                if (response.code === 'COD_OK' && response.data && response.data.story) {
                    const apiStory = response.data.story;

                    // Transform API data to component structure
                    const transformedStory = {
                        id: apiStory.id,
                        titleShuar: apiStory.title_shuar,
                        titleSpanish: apiStory.title_español,
                        category: apiStory.category,
                        image: apiStory.coverImage,
                        introduction: apiStory.imageDescription || "Una historia de la tradición Shuar",
                        pages: [
                            {
                                paragraphs: [
                                    {
                                        shuar: apiStory.contentShuar,
                                        spanish: apiStory.contentSpanish
                                    }
                                ]
                            }
                        ]
                    };

                    setStory(transformedStory);
                } else {
                    setError('No se pudo cargar el cuento.');
                }
            } catch (err) {
                console.error('Error fetching story:', err);
                setError('Error de conexión al cargar el cuento.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [storyId, getFechData]);

    const totalPages = story?.pages?.length || 0;
    const progress = totalPages > 0 ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;
    const currentPageData = story?.pages?.[currentPage];


    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        story,
        loading,
        error,
        showTranslation,
        setShowTranslation,
        currentPage,
        totalPages,
        progress,
        handleNextPage,
        handlePrevPage,
        navigate,
        currentPageData
    };
};
