import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { useSidebarContext } from '@shared/context/SidebarContext';
import { useSnackBarContext } from '@shared/context/SnackbarContext';
import { useDialog } from '@shared/hooks/useDialog';
import { useCrudAdminLesson } from '@features/admin/hooks/useCrudAdminLesson';

export const useAdminLessonEditor = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { isOpen } = useSidebarContext();
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialogContent, handleOpenDialog, handleCloseDialog, setDialogContent } = useDialog();

    const {
        createLesson,
        createLoading,
        updateLesson,
        updateLoading,
        fetchLessonById,
        currentLesson,
        fetchLoading: loadingLesson
    } = useCrudAdminLesson();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [pendingAction, setPendingAction] = useState(null);

    const [lessonData, setLessonData] = useState({
        title: '',
        level: 'Básico',
        description: '',
        duration: 15,
        totalPoints: 100,
        image: '',
        imageFile: null,
        imageDescription: '',
        order: 1,
        content: {
            intro: '',
            videoUrl: '',
            text: ''
        },
        exercises: []
    });

    // Load lesson data when in edit mode
    useEffect(() => {
        if (isEditMode && currentLesson) {
            setLessonData({
                title: currentLesson.title || '',
                level: currentLesson.level || 'Básico',
                description: currentLesson.description || '',
                duration: currentLesson.duration || 15,
                totalPoints: currentLesson.totalPoints || 100,
                image: currentLesson.image || '',
                imageDescription: currentLesson.imageDescription || '',
                imageFile: null, // Reset file input on load
                order: currentLesson.order || 1,
                content: {
                    intro: currentLesson.content?.intro || '',
                    videoUrl: currentLesson.content?.videoUrl || '',
                    text: currentLesson.content?.text || ''
                },
                exercises: (currentLesson.exercises || []).map(ex => ({
                    ...ex,
                    id: ex.id || ex._id || Date.now() + Math.random() // Ensure ID exists
                }))
            });
        }
    }, [isEditMode, currentLesson]);

    // Fetch lesson data when in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            fetchLessonById(id);
        }
    }, [isEditMode, id, fetchLessonById]);

    const handleBack = () => {
        navigate('/admin/lecciones');
    };

    const performPublish = async () => {
        try {
            // Format exercises to match API structure
            const formattedExercises = lessonData.exercises.map(ex => ({
                type: ex.type,
                question: ex.question,
                options: ex.options || [],
                correctAnswer: ex.correctAnswer || '',
                tip: ex.tip || ''
            }));

            // Convert file to Base64 if a new file is selected
            const convertFileToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            };

            let base64Image = lessonData.image;
            if (lessonData.imageFile) {
                try {
                    base64Image = await convertFileToBase64(lessonData.imageFile);
                } catch (error) {
                    console.error("Error converting image to Base64:", error);
                    handleSetDataSnackbar({ message: 'Error al procesar la imagen', type: 'error' });
                    return;
                }
            }

            // Prepare lesson data for API
            const lessonPayload = {
                title: lessonData.title,
                level: lessonData.level,
                description: lessonData.description,
                duration: lessonData.duration,
                totalPoints: lessonData.totalPoints,
                image: base64Image, // Send Base64 string
                imageDescription: lessonData.imageDescription,
                content: {
                    intro: lessonData.content.intro,
                    videoUrl: lessonData.content.videoUrl,
                    text: lessonData.content.text
                },
                exercises: formattedExercises
            };

            const result = isEditMode
                ? await updateLesson(id, lessonPayload)
                : await createLesson(lessonPayload);

            if (result.success) {
                handleSetDataSnackbar({
                    message: isEditMode ? 'Lección actualizada correctamente' : 'Lección publicada correctamente',
                    type: 'success'
                });
                handleCloseDialog();
                setTimeout(() => {
                    navigate('/admin/lecciones');
                }, 1500);
            } else {
                handleSetDataSnackbar({ message: result.error || 'Error al publicar la lección', type: 'error' });
                handleCloseDialog();
            }
        } catch (error) {
            handleSetDataSnackbar({ message: 'Error al publicar la lección', type: 'error' });
            handleCloseDialog();
        }
    };

    const performSaveDraft = () => {
        // Implement save draft logic here if distinct from publish
        // For now, mirroring publish or standard save
        performPublish();
    };

    const handleConfirmAction = () => {
        if (pendingAction === 'save_draft') {
            performSaveDraft();
        } else if (pendingAction === 'publish') {
            performPublish();
        }
    };

    // Exercise management
    const handleAddExercise = (type) => {
        const newExercise = {
            id: Date.now(),
            type: type,
            question: '',
            options: type === 'multiple_choice' ? ['', ''] : (type === 'true_false' ? ['Verdadero', 'Falso'] : []),
            correctAnswer: '',
            tip: ''
        };
        setLessonData({
            ...lessonData,
            exercises: [...lessonData.exercises, newExercise]
        });
        handleSetDataSnackbar({ message: 'Ejercicio agregado', type: 'info' });
    };

    const handleRemoveExercise = (exerciseId) => {
        setLessonData({
            ...lessonData,
            exercises: lessonData.exercises.filter(ex => ex.id !== exerciseId)
        });
        handleSetDataSnackbar({ message: 'Ejercicio eliminado', type: 'info' });
    };

    const handleExerciseChange = (exerciseId, field, value) => {
        setLessonData({
            ...lessonData,
            exercises: lessonData.exercises.map(ex =>
                ex.id === exerciseId ? { ...ex, [field]: value } : ex
            )
        });
    };

    const handleOptionChange = (exerciseId, index, value) => {
        setLessonData({
            ...lessonData,
            exercises: lessonData.exercises.map(ex => {
                if (ex.id !== exerciseId) return ex;
                const newOptions = [...ex.options];
                newOptions[index] = value;
                return { ...ex, options: newOptions };
            })
        });
    };

    const handleAddOption = (exerciseId) => {
        setLessonData({
            ...lessonData,
            exercises: lessonData.exercises.map(ex => {
                if (ex.id !== exerciseId) return ex;
                if (ex.options.length >= 4) return ex; // Max 4 options
                return { ...ex, options: [...ex.options, ''] };
            })
        });
    };

    const handleRemoveOption = (exerciseId, index) => {
        setLessonData({
            ...lessonData,
            exercises: lessonData.exercises.map(ex => {
                if (ex.id !== exerciseId) return ex;
                if (ex.options.length <= 2) return ex; // Min 2 options
                const newOptions = ex.options.filter((_, i) => i !== index);
                return { ...ex, options: newOptions };
            })
        });
    };

    return {
        // State
        lessonData,
        setLessonData,
        isEditMode,
        isMobile,
        isDialogOpen,
        dialogContent,
        setDialogContent,
        loadingLesson,
        createLoading,
        updateLoading,
        id,
        theme,
        isOpen, // sidebar state

        // Actions
        handleBack,
        setPendingAction,
        handleOpenDialog,
        handleCloseDialog,
        handleConfirmAction,
        handleAddExercise,
        handleRemoveExercise,
        handleExerciseChange,
        handleOptionChange,
        handleAddOption,
        handleRemoveOption,
        navigate
    };
};
