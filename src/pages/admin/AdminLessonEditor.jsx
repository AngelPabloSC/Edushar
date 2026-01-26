import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    TextField,
    Select,
    MenuItem,
    useMediaQuery,
    useTheme,
    alpha,
    Tooltip,
    Container,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import TranslateIcon from '@mui/icons-material/Translate';
import QuizIcon from '@mui/icons-material/Quiz';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import SyncIcon from '@mui/icons-material/Sync';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useSidebarContext } from '../../hooks/context/sidebardContext';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/useDialog';
import { useCrudAdminLesson } from '../../hooks/useCrudAdminLesson';
import EditorHeader from '../../components/EditorHeader';
import EditorFooter from '../../components/EditorFooter';
import PageHeader from '../../components/PageHeader';

const AdminLessonEditor = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { isOpen } = useSidebarContext();
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();
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

    const performSaveDraft = async () => {
        // For now, just show success message (draft functionality could be added later)
        handleSetDataSnackbar({ message: 'Borrador guardado exitosamente', type: 'success' });
        handleCloseDialog();
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

            // Prepare lesson data for API
            const lessonPayload = {
                title: lessonData.title,
                level: lessonData.level,
                description: lessonData.description,
                duration: lessonData.duration,
                totalPoints: lessonData.totalPoints,
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

    const handleConfirmAction = () => {
        if (pendingAction === 'save_draft') {
            performSaveDraft();
        } else if (pendingAction === 'publish') {
            performPublish();
        }
    };

    const handleSaveDraftClick = () => {
        setPendingAction('save_draft');
        setDialongContent({
            title: "Guardar Borrador",
            message: "¿Deseas guardar el progreso actual como borrador?",
            confirmText: "Guardar",
            color: "primary" // Default blue for non-destructive
        });
        handleOpenDialog();
    };

    const handlePublishClick = () => {
        setPendingAction('publish');
        setDialongContent({
            title: "Publicar Lección",
            message: "¿Estás seguro de que deseas publicar esta lección? Será visible inmediatamente para los estudiantes.",
            confirmText: "Publicar Ahora",
            color: "success" // Green for publish
        });
        handleOpenDialog();
    };

    const [lessonData, setLessonData] = useState({
        title: '',
        level: 'Básico',
        description: '',
        duration: 15,
        totalPoints: 100,
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
                content: {
                    intro: currentLesson.content?.intro || '',
                    videoUrl: currentLesson.content?.videoUrl || '',
                    text: currentLesson.content?.text || ''
                },
                exercises: currentLesson.exercises || []
            });
        }
    }, [isEditMode, currentLesson]);

    // Fetch lesson data when in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            fetchLessonById(id);
        }
    }, [isEditMode, id]);

    const handleBack = () => {
        navigate('/admin/lecciones');
    };

    // Exercise management functions
    const handleAddExercise = (type) => {
        const newExercise = {
            id: Date.now(),
            type: type,
            question: '',
            options: type === 'multiple_choice' ? ['', '', '', ''] : ['Verdadero', 'Falso'],
            correctAnswer: '',
            tip: ''
        };
        setLessonData({ ...lessonData, exercises: [...lessonData.exercises, newExercise] });
    };

    const handleUpdateExercise = (index, field, value) => {
        const updatedExercises = [...lessonData.exercises];
        updatedExercises[index] = { ...updatedExercises[index], [field]: value };
        setLessonData({ ...lessonData, exercises: updatedExercises });
    };

    const handleUpdateExerciseOption = (exerciseIndex, optionIndex, value) => {
        const updatedExercises = [...lessonData.exercises];
        const updatedOptions = [...updatedExercises[exerciseIndex].options];
        updatedOptions[optionIndex] = value;
        updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], options: updatedOptions };
        setLessonData({ ...lessonData, exercises: updatedExercises });
    };

    const handleSetCorrectAnswer = (exerciseIndex, answer) => {
        const updatedExercises = [...lessonData.exercises];
        updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], correctAnswer: answer };
        setLessonData({ ...lessonData, exercises: updatedExercises });
    };

    const handleDeleteExercise = (index) => {
        const updatedExercises = lessonData.exercises.filter((_, i) => i !== index);
        setLessonData({ ...lessonData, exercises: updatedExercises });
    };

    const actions = (
        <>
            <Button
                variant="outlined"
                onClick={handleSaveDraftClick}
                sx={{
                    borderRadius: 3, px: 4, py: 1, fontWeight: 700,
                    borderColor: 'divider', color: 'text.primary',
                    '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' }
                }}
            >
                Guardar Borrador
            </Button>
            <Button
                variant="contained"
                onClick={handlePublishClick}
                sx={{
                    borderRadius: 3, px: 5, py: 1, fontWeight: 800,
                    bgcolor: 'text.primary', color: 'white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' }
                }}
            >
                Publicar Lección
            </Button>
        </>
    );

    const breadcrumbs = [
        { label: 'Lecciones', onClick: handleBack },
        { label: isEditMode ? 'Editar Lección' : 'Editor de Lección', onClick: null }
    ];

    return (
        <>
            <EditorHeader
                breadcrumbs={breadcrumbs}
                onBack={handleBack}
                lastSaved="Guardado: Hace 2 min"
                showLastSaved={true}
            />

            <Container maxWidth="lg" sx={{ pt: 4, pb: 12, px: { xs: 3, sm: 4, md: 6 } }}>
                <PageHeader
                    title={isEditMode ? 'Editar Lección' : 'Crear Nueva Lección'}
                    subtitle="Configure el contenido educativo y los ejercicios para los estudiantes Shuar."
                />

                <Grid container spacing={4} direction="column">

                    {/* CONF: Basic Information Card */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                px: 3, py: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: alpha(theme.palette.background.paper, 0.5)
                            }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InfoIcon color="primary" /> Información Básica
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Título de la Lección</Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Ej. Saludos básicos y presentaciones"
                                            value={lessonData.title}
                                            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Descripción</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Describe brevemente el contenido de esta lección..."
                                            value={lessonData.description}
                                            onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Nivel</Typography>
                                        <Select
                                            fullWidth
                                            value={lessonData.level}
                                            onChange={(e) => setLessonData({ ...lessonData, level: e.target.value })}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="Básico">Básico</MenuItem>
                                            <MenuItem value="Intermedio">Intermedio</MenuItem>
                                            <MenuItem value="Avanzado">Avanzado</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Duración (minutos)</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={lessonData.duration}
                                            onChange={(e) => setLessonData({ ...lessonData, duration: parseInt(e.target.value) || 0 })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Puntos Totales</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={lessonData.totalPoints}
                                            onChange={(e) => setLessonData({ ...lessonData, totalPoints: parseInt(e.target.value) || 0 })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* CONF: Lesson Content Card */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ArticleIcon color="primary" /> Contenido de la Lección
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Introducción</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Introduce la lección y explica qué aprenderán los estudiantes..."
                                            value={lessonData.content.intro}
                                            onChange={(e) => setLessonData({ 
                                                ...lessonData, 
                                                content: { ...lessonData.content, intro: e.target.value }
                                            })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>URL del Video (opcional)</Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="https://youtube.com/ejemplo"
                                            value={lessonData.content.videoUrl}
                                            onChange={(e) => setLessonData({ 
                                                ...lessonData, 
                                                content: { ...lessonData.content, videoUrl: e.target.value }
                                            })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Contenido de la Lección</Typography>
                                        <TextField
                                    fullWidth
                                    multiline
                                    minRows={12}
                                    placeholder="Escriba aquí el cuerpo de la lección, incluya vocabulario y contextos culturales..."
                                    value={lessonData.content.text}
                                    onChange={(e) => setLessonData({ ...lessonData, content: { ...lessonData.content, text: e.target.value } })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 2
                                        }
                                    }}
                                />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* CONF: Exercises Section */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <QuizIcon color="primary" /> Sección de Ejercicios
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                                {lessonData.exercises.map((ex, index) => (
                                    <Paper key={ex.id} elevation={0} sx={{
                                        p: 3,
                                        border: '1px solid', borderColor: 'divider',
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.background.default, 0.3),
                                        position: 'relative'
                                    }}>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleDeleteExercise(index)}
                                            sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main', bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Box sx={{
                                                minWidth: 24, height: 24, borderRadius: 1,
                                                bgcolor: 'primary.main', color: 'background.paper',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: 800
                                            }}>
                                                {index + 1}
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                                                {ex.type === 'multiple_choice' ? 'Opción Múltiple' : ex.type === 'true_false' ? 'Verdadero/Falso' : 'Completar Espacios'}
                                            </Typography>
                                        </Box>

                                        {/* Question Field */}
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            placeholder="Escribe la pregunta aquí..."
                                            value={ex.question}
                                            onChange={(e) => handleUpdateExercise(index, 'question', e.target.value)}
                                            sx={{ mb: 2, '& .MuiInput-input': { fontSize: '1.1rem', fontWeight: 600 } }}
                                        />

                                        {/* Options */}
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            {ex.options.map((opt, optIndex) => (
                                                <Grid item xs={12} key={optIndex}>
                                                    <Paper elevation={0} sx={{
                                                        p: 1.5,
                                                        border: '2px solid',
                                                        borderColor: ex.correctAnswer === opt && opt !== '' ? 'success.main' : 'divider',
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                        display: 'flex', alignItems: 'center', gap: 1
                                                    }}>
                                                        <Radio 
                                                            checked={ex.correctAnswer === opt && opt !== ''} 
                                                            size="small"
                                                            onChange={() => handleSetCorrectAnswer(index, opt)}
                                                            disabled={opt === ''}
                                                        />
                                                        <TextField 
                                                            fullWidth 
                                                            variant="standard" 
                                                            value={opt} 
                                                            onChange={(e) => handleUpdateExerciseOption(index, optIndex, e.target.value)}
                                                            placeholder={`Opción ${optIndex + 1}`}
                                                            disabled={ex.type === 'true_false'}
                                                            InputProps={{ disableUnderline: true }} 
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {/* Tip Field */}
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Pista o ayuda para el estudiante (opcional)..."
                                            value={ex.tip}
                                            onChange={(e) => handleUpdateExercise(index, 'tip', e.target.value)}
                                            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                            label="Pista"
                                        />
                                    </Paper>
                                ))}

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<AddCircleIcon />} 
                                        onClick={() => handleAddExercise('multiple_choice')}
                                        sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}
                                    >
                                        Añadir Opción Múltiple
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        startIcon={<CheckCircleIcon />} 
                                        onClick={() => handleAddExercise('true_false')}
                                        sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}
                                    >
                                        Añadir Verdadero/Falso
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <EditorFooter
                actions={actions}
                savingStatus="Campos obligatorios completos"
            />

            {/* Confirmation Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>{dialongContent.title}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {dialongContent.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        variant="contained"
                        color={dialongContent.color || 'primary'}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, boxShadow: 'none' }}
                        autoFocus
                    >
                        {dialongContent.confirmText || 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default AdminLessonEditor;
