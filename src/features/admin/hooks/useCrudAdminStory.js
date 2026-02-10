import { useState, useEffect, useCallback, useRef } from 'react';
import { useFetchDataPromise } from '../../../shared/hooks/useFetchDataPromise';

/**
 * Comprehensive hook for all story CRUD operations with optimized state management
 * @returns {Object} - All story management functions and states
 */
export const useCrudAdminStory = () => {
    const { getFechData } = useFetchDataPromise();

    // Structured state for story data
    const [storyData, setStoryData] = useState({
        code: null,
        data: {},
        message: "",
        loading: true
    });

    // Table state for pagination
    const [tableState, setTableState] = useState({
        count: 0,
        currentPage: 0,
        perPage: 1000
    });

    // Fetch control state
    const [isFetch, setIsFetch] = useState(true);

    // Individual story state (for edit mode)
    const [currentStory, setCurrentStory] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);

    // Operation loading states
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Refs for duplicate prevention
    const isCreatingRef = useRef(false);
    const isUpdatingRef = useRef(false);

    // ========== FETCH ALL STORIES ==========
    const fetchStories = useCallback(async (page = 1, limit = 1000) => {
        setStoryData(prev => ({ ...prev, loading: true }));

        try {
            const response = await getFechData({
                endPoint: 'api/stories/list',
                method: 'POST',
                additionalData: { page, limit }
            });

            if (response.code === 'COD_OK') {
                setStoryData({
                    code: response.code,
                    data: response.data || {},
                    message: response.message || '',
                    loading: false
                });

                // Update table state with pagination info
                const pagination = response.data?.pagination || {};
                setTableState({
                    count: pagination.total || 0,
                    currentPage: (pagination.page || 1) - 1, // MUI uses 0-based index
                    perPage: pagination.limit || 1000
                });
            } else {
                setStoryData({
                    code: response.code,
                    data: {},
                    message: response.message || 'Error al cargar las historias',
                    loading: false
                });
            }
        } catch (err) {
            setStoryData({
                code: 'COD_ERROR',
                data: {},
                message: err.message || 'Error al cargar las historias',
                loading: false
            });
            console.error('Error fetching stories:', err);
        }
    }, [getFechData]);

    // Auto-fetch stories on mount and when isFetch changes
    useEffect(() => {
        if (!isFetch) return;

        fetchStories(1, 1000); // Fetch all stories
        setIsFetch(false);
    }, [isFetch, fetchStories]);

    // ========== FETCH STORY BY ID ==========
    const fetchStoryById = useCallback(async (storyId) => {
        if (!storyId) {
            setFetchLoading(false);
            return null;
        }

        setFetchLoading(true);

        try {
            const response = await getFechData({
                endPoint: 'api/stories/get',
                method: 'POST',
                additionalData: { id: storyId }
            });

            if (response.code === 'COD_OK') {
                setCurrentStory(response.data?.story || null);
                return response.data?.story;
            } else {
                console.error('Error al cargar la historia');
                return null;
            }
        } catch (err) {
            console.error('Error fetching story:', err);
            return null;
        } finally {
            setFetchLoading(false);
        }
    }, [getFechData]);

    // Helper to transform frontend data to API format
    const transformStoryDataForAPI = (frontendData) => {
        return {
            title_shuar: frontendData.titleShuar,
            title_español: frontendData.titleEs,
            author: frontendData.author,
            contentShuar: frontendData.contentShuar,
            contentSpanish: frontendData.contentEs,
            coverImage: frontendData.cover, // Should be base64
            category: frontendData.category
        };
    };

    // ========== CREATE STORY ==========
    const createStory = async (storyDataToCreate) => {
        // Prevenir múltiples envíos
        if (isCreatingRef.current) {
            console.warn('⚠️ Creación de historia ya en proceso, ignorando clic duplicado');
            return { success: false, error: 'Operación en proceso' };
        }

        try {
            isCreatingRef.current = true;
            setCreateLoading(true);

            if (!storyDataToCreate.titleShuar || !storyDataToCreate.titleEs || !storyDataToCreate.category) {
                throw new Error('Faltan campos obligatorios: títulos en Shuar y Español, y categoría');
            }

            // Transform data to API format
            const apiData = transformStoryDataForAPI(storyDataToCreate);

            // Use standard hook for JSON with base64 image
            const response = await getFechData({
                endPoint: 'api/stories/create',
                method: 'POST',
                additionalData: apiData
            });

            if (response.code === 'COD_OK') {
                await fetchStories(tableState.currentPage + 1, tableState.perPage);
                return { success: true, data: response.data, message: 'Historia creada exitosamente' };
            } else {
                throw new Error(response.message || 'Error al crear la historia');
            }
        } catch (err) {
            console.error('Error creating story:', err);
            return { success: false, error: err.message };
        } finally {
            isCreatingRef.current = false;
            setCreateLoading(false);
        }
    };

    // ========== UPDATE STORY ==========
    const updateStory = async (storyId, storyDataToUpdate) => {
        // Prevenir múltiples envíos
        if (isUpdatingRef.current) {
            console.warn('⚠️ Actualización de historia ya en proceso, ignorando clic duplicado');
            return { success: false, error: 'Operación en proceso' };
        }

        try {
            isUpdatingRef.current = true;
            setUpdateLoading(true);

            if (!storyId) {
                throw new Error('ID de historia requerido');
            }

            if (!storyDataToUpdate.titleShuar || !storyDataToUpdate.titleEs || !storyDataToUpdate.category) {
                throw new Error('Faltan campos obligatorios: títulos en Shuar y Español, y categoría');
            }

            // Transform data to API format
            const apiData = {
                id: storyId,
                ...transformStoryDataForAPI(storyDataToUpdate)
            };

            // Use standard hook for JSON
            const response = await getFechData({
                endPoint: 'api/stories/update',
                method: 'POST',
                additionalData: apiData
            });

            if (response.code === 'COD_OK') {
                // Refresh the list after update
                await fetchStories(tableState.currentPage + 1, tableState.perPage);

                return {
                    success: true,
                    data: response.data,
                    message: 'Historia actualizada exitosamente'
                };
            } else {
                throw new Error(response.message || 'Error al actualizar la historia');
            }
        } catch (err) {
            console.error('Error updating story:', err);
            return {
                success: false,
                error: err.message
            };
        } finally {
            isUpdatingRef.current = false;
            setUpdateLoading(false);
        }
    };

    // ========== DELETE STORY ==========
    const deleteStory = async (storyId) => {
        try {
            setDeleteLoading(true);

            if (!storyId) {
                throw new Error('ID de historia requerido');
            }

            const response = await getFechData({
                endPoint: 'api/stories/delete',
                method: 'POST',
                additionalData: { id: storyId }
            });

            if (response.code === 'COD_OK') {
                // Refresh the list after deletion
                await fetchStories(tableState.currentPage + 1, tableState.perPage);

                return {
                    success: true,
                    message: 'Historia eliminada exitosamente'
                };
            } else {
                throw new Error(response.message || 'Error al eliminar la historia');
            }
        } catch (err) {
            console.error('Error deleting story:', err);
            return {
                success: false,
                error: err.message
            };
        } finally {
            setDeleteLoading(false);
        }
    };

    // ========== HANDLE PAGINATION CHANGE ==========
    const handlePageChange = (page, rowsPerPage) => {
        fetchStories(page + 1, rowsPerPage); // API uses 1-based, MUI uses 0-based
    };

    // ========== RESET/REFRESH ==========
    const handleReset = () => {
        setIsFetch(true);
    };

    const handleReloadStories = () => {
        setIsFetch(true);
    };

    // Extract stories array from data
    const stories = storyData.data?.items || [];

    return {
        // Data states
        storyData,
        stories,
        currentStory,
        tableState,

        // Loading states
        loading: storyData.loading,
        fetchLoading,
        createLoading,
        updateLoading,
        deleteLoading,

        // CRUD operations
        createStory,
        updateStory,
        deleteStory,
        fetchStoryById,
        fetchStories,

        // Utilities
        handlePageChange,
        handleReset,
        handleReloadStories,
        isFetch,
    };
};
