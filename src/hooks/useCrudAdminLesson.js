import { useState, useEffect, useCallback } from 'react';
import { useFetchDataPromise } from './useFetchDataPromise';

/**
 * Comprehensive hook for all lesson CRUD operations with optimized state management
 * @returns {Object} - All lesson management functions and states
 */
export const useCrudAdminLesson = () => {
    const { getFechData } = useFetchDataPromise();

    // Structured state for lesson data (similar to courseData pattern)
    const [lessonData, setLessonData] = useState({
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

    // Individual lesson state (for edit mode)
    const [currentLesson, setCurrentLesson] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);

    // Operation loading states
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ========== FETCH ALL LESSONS ==========
    const fetchLessons = useCallback(async (page = 1, limit = 1000) => {
        setLessonData(prev => ({ ...prev, loading: true }));

        try {
            const response = await getFechData({
                endPoint: 'api/lessons/list',
                method: 'POST',
                additionalData: { page, limit }
            });

            if (response.code === 'COD_OK') {
                setLessonData({
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
                setLessonData({
                    code: response.code,
                    data: {},
                    message: response.message || 'Error al cargar las lecciones',
                    loading: false
                });
            }
        } catch (err) {
            setLessonData({
                code: 'COD_ERROR',
                data: {},
                message: err.message || 'Error al cargar las lecciones',
                loading: false
            });
            console.error('Error fetching lessons:', err);
        }
    }, [getFechData]);

    // Auto-fetch lessons on mount and when isFetch changes
    useEffect(() => {
        if (!isFetch) return;

        fetchLessons(1, 1000); // Fetch all lessons
        setIsFetch(false);
    }, [isFetch]);

    // ========== FETCH LESSON BY ID ==========
    const fetchLessonById = async (lessonId) => {
        if (!lessonId) {
            setFetchLoading(false);
            return null;
        }

        setFetchLoading(true);

        try {
            const response = await getFechData({
                endPoint: 'api/lessons/get',
                method: 'POST',
                additionalData: { id: lessonId }
            });

            if (response.code === 'COD_OK') {
                setCurrentLesson(response.data?.lesson || null);
                return response.data?.lesson;
            } else {
                console.error('Error al cargar la lección');
                return null;
            }
        } catch (err) {
            console.error('Error fetching lesson:', err);
            return null;
        } finally {
            setFetchLoading(false);
        }
    };

    // ========== CREATE LESSON ==========
    const createLesson = async (lessonDataToCreate) => {
        try {
            setCreateLoading(true);

            if (!lessonDataToCreate.title || !lessonDataToCreate.level || !lessonDataToCreate.description) {
                throw new Error('Faltan campos obligatorios: título, nivel y descripción');
            }

            const response = await getFechData({
                endPoint: 'api/lessons/create',
                method: 'POST',
                additionalData: lessonDataToCreate
            });

            if (response.code === 'COD_OK') {
                // Refresh the list after creation
                await fetchLessons(tableState.currentPage + 1, tableState.perPage);

                return {
                    success: true,
                    data: response.data,
                    message: 'Lección creada exitosamente'
                };
            } else {
                throw new Error(response.message || 'Error al crear la lección');
            }
        } catch (err) {
            console.error('Error creating lesson:', err);
            return {
                success: false,
                error: err.message
            };
        } finally {
            setCreateLoading(false);
        }
    };

    // ========== UPDATE LESSON ==========
    const updateLesson = async (lessonId, lessonDataToUpdate) => {
        try {
            setUpdateLoading(true);

            if (!lessonId) {
                throw new Error('ID de lección requerido');
            }

            if (!lessonDataToUpdate.title || !lessonDataToUpdate.level || !lessonDataToUpdate.description) {
                throw new Error('Faltan campos obligatorios: título, nivel y descripción');
            }

            const response = await getFechData({
                endPoint: 'api/lessons/update',
                method: 'POST',
                additionalData: {
                    id: lessonId,
                    ...lessonDataToUpdate
                }
            });

            if (response.code === 'COD_OK') {
                // Refresh the list after update
                await fetchLessons(tableState.currentPage + 1, tableState.perPage);

                return {
                    success: true,
                    data: response.data,
                    message: 'Lección actualizada exitosamente'
                };
            } else {
                throw new Error(response.message || 'Error al actualizar la lección');
            }
        } catch (err) {
            console.error('Error updating lesson:', err);
            return {
                success: false,
                error: err.message
            };
        } finally {
            setUpdateLoading(false);
        }
    };

    // ========== DELETE LESSON ==========
    const deleteLesson = async (lessonId) => {
        try {
            setDeleteLoading(true);

            if (!lessonId) {
                throw new Error('ID de lección requerido');
            }

            const response = await getFechData({
                endPoint: 'api/lessons/delete',
                method: 'POST',
                additionalData: { id: lessonId }
            });

            if (response.code === 'COD_OK') {
                // Refresh the list after deletion
                await fetchLessons(tableState.currentPage + 1, tableState.perPage);

                return {
                    success: true,
                    message: 'Lección eliminada exitosamente'
                };
            } else {
                throw new Error(response.message || 'Error al eliminar la lección');
            }
        } catch (err) {
            console.error('Error deleting lesson:', err);
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
        fetchLessons(page + 1, rowsPerPage); // API uses 1-based, MUI uses 0-based
    };

    // ========== RESET/REFRESH ==========
    const handleReset = () => {
        setIsFetch(true);
    };

    const handleReloadLessons = () => {
        setIsFetch(true);
    };

    // Extract lessons array from data
    const lessons = lessonData.data?.items || [];

    return {
        // Data states
        lessonData,
        lessons,
        currentLesson,
        tableState,

        // Loading states
        loading: lessonData.loading,
        fetchLoading,
        createLoading,
        updateLoading,
        deleteLoading,

        // CRUD operations
        createLesson,
        updateLesson,
        deleteLesson,
        fetchLessonById,
        fetchLessons,

        // Utilities
        handlePageChange,
        handleReset,
        handleReloadLessons,
        isFetch,
    };
};

