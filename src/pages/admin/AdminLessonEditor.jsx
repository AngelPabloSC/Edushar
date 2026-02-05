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
    alpha,
    Container,
    Grid,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublishIcon from '@mui/icons-material/Publish';
import EditorHeader from '../../components/EditorHeader';
import EditorFooter from '../../components/EditorFooter';
import PageHeader from '../../components/PageHeader';
import FullPageLoader from '../../components/FullPageLoader';
import { useAdminLessonEditor } from '../../hooks/features/useAdminLessonEditor';

const AdminLessonEditor = () => {
    const {
        // State
        lessonData,
        setLessonData,
        isEditMode,
        isMobile,
        isDialogOpen,
        dialongContent,
        setDialongContent,
        loadingLesson,
        createLoading,
        updateLoading,
        id,
        theme,
        isOpen,

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
        performSaveDraft,
        performPublish,
        navigate
    } = useAdminLessonEditor();


    // Validate if the lesson is ready to be published
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Basic fields check
        if (!lessonData.title.trim()) {
            newErrors.title = 'El título es obligatorio';
            isValid = false;
        }
        if (!lessonData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
            isValid = false;
        }

        // Content fields check
        if (!lessonData.content.intro?.trim()) {
            newErrors.intro = 'La introducción es obligatoria';
            isValid = false;
        }
        if (!lessonData.content.text?.trim()) {
            newErrors.contentText = 'El contenido de la lección es obligatorio';
            isValid = false;
        }
        
        // At least one exercise required
        if (lessonData.exercises.length === 0) {
            newErrors.exercises = 'Debe agregar al menos un ejercicio';
            isValid = false;
        }

        // Check each exercise for validity
        const exerciseErrors = {};
        let hasExerciseErrors = false;

        lessonData.exercises.forEach((ex, index) => {
            const exErrors = {};
            if (!ex.question?.trim()) {
                exErrors.question = true;
                hasExerciseErrors = true;
            }
            
            if (ex.type === 'multiple_choice') {
                const validOptions = ex.options.filter(opt => opt.trim() !== '').length;
                if (validOptions < 2) {
                    exErrors.options = true;
                    hasExerciseErrors = true;
                }
                if (ex.correctAnswer === '') {
                    exErrors.correctAnswer = true;
                    hasExerciseErrors = true;
                }
            } else if (ex.type === 'true_false') {
                if (ex.correctAnswer === '') {
                    exErrors.correctAnswer = true;
                    hasExerciseErrors = true;
                }
            }

            if (Object.keys(exErrors).length > 0) {
                exerciseErrors[index] = exErrors;
            }
        });

        if (hasExerciseErrors) {
            newErrors.exercises = exerciseErrors;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePublishClick = () => {
        if (validateForm()) {
            setPendingAction('publish');
            setDialongContent({
                title: "Publicar Lección",
                message: "¿Estás seguro de que deseas publicar esta lección? Será visible inmediatamente para los estudiantes.",
                confirmText: "Publicar Ahora",
                color: "success"
            });
            handleOpenDialog();
        } else {
             // Show specific error message based on what's missing
             if (errors.exercises && typeof errors.exercises === 'string') {
                 // Case: No exercises added (error is the string message we set in validateForm)
                 handleSetDataSnackbar({ message: 'Agregue al menos un ejercicio', type: 'warning' });
             } else if (errors.exercises && typeof errors.exercises === 'object') {
                 // Case: Exercises exist but have errors
                 handleSetDataSnackbar({ message: 'Complete los ejercicios marcados en rojo', type: 'warning' });
             } else {
                 // Case: Basic fields missing
                 handleSetDataSnackbar({ message: 'Completa los campos obligatorios marcados en rojo', type: 'warning' });
             }
        }
    };

    const actions = (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="outlined"
                onClick={handleBack}
                disabled={createLoading || updateLoading}
                sx={{
                    borderRadius: 3, px: 3, py: 1, fontWeight: 700,
                    color: 'text.secondary', borderColor: 'divider',
                    '&:hover': { borderColor: 'text.secondary', bgcolor: 'transparent' },
                    '&:disabled': {
                        borderColor: 'action.disabledBackground',
                        color: 'action.disabled',
                    }
                }}
            >
                Cancelar
            </Button>
            <Button
                variant="contained"
                onClick={handlePublishClick}
                disabled={createLoading || updateLoading}
                startIcon={createLoading || updateLoading ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
                sx={{
                    borderRadius: 3, px: 5, py: 1, fontWeight: 800,
                    bgcolor: 'text.primary', color: 'white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' },
                    '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                    }
                }}
            >
                {createLoading || updateLoading ? (isEditMode ? 'Guardando...' : 'Publicando...') : 'Publicar Lección'}
            </Button>
        </Box>
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
                            borderColor: errors.title || errors.description ? 'error.main' : 'divider',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                px: 3, py: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: alpha(theme.palette.background.paper, 0.5)
                            }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InfoIcon color="primary" /> Detalles de la Lección
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    
                                    {/* 1. Essential Data */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} gutterBottom 
                                                color={errors.title ? 'error.main' : 'text.primary'}>
                                                Título de la Lección *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                error={!!errors.title}
                                                helperText={errors.title}
                                                placeholder="Ej. Saludos básicos y presentaciones"
                                                value={lessonData.title}
                                                onChange={(e) => {
                                                    setLessonData({ ...lessonData, title: e.target.value });
                                                    if(errors.title) setErrors({...errors, title: null});
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} gutterBottom
                                                color={errors.description ? 'error.main' : 'text.primary'}>
                                                Descripción *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                error={!!errors.description}
                                                helperText={errors.description}
                                                minRows={3}
                                                placeholder="Describe brevemente el contenido de esta lección..."
                                                value={lessonData.description}
                                                onChange={(e) => {
                                                    setLessonData({ ...lessonData, description: e.target.value });
                                                    if(errors.description) setErrors({...errors, description: null});
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} gutterBottom
                                                color={errors.intro ? 'error.main' : 'text.primary'}>
                                                Introducción *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                error={!!errors.intro}
                                                helperText={errors.intro}
                                                minRows={2}
                                                placeholder="Introduce la lección y explica qué aprenderán los estudiantes..."
                                                value={lessonData.content.intro}
                                                onChange={(e) => {
                                                    setLessonData({ 
                                                        ...lessonData, 
                                                        content: { ...lessonData.content, intro: e.target.value }
                                                    });
                                                    if(errors.intro) setErrors({...errors, intro: null});
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* 2. Main Content */}
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom
                                            color={errors.contentText ? 'error.main' : 'text.primary'}>
                                            Contenido de la Lección *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={12}
                                            error={!!errors.contentText}
                                            helperText={errors.contentText}
                                            placeholder="Escriba aquí el cuerpo de la lección, incluya vocabulario y contextos culturales..."
                                            value={lessonData.content.text}
                                            onChange={(e) => {
                                                setLessonData({ ...lessonData, content: { ...lessonData.content, text: e.target.value } });
                                                if(errors.contentText) setErrors({...errors, contentText: null});
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.default' } }}
                                        />
                                    </Box>

                                    {/* 3. Video URL */}
                                    <Box>
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
                                            InputProps={{
                                                startAdornment: <VideoLibraryIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Box>

                                    {/* 4. Configuration (Collapsible) */}
                                    <Accordion elevation={0} variant="outlined" sx={{ borderRadius: 2, '&::before': { display: 'none' } }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InfoIcon fontSize="small" color="action" /> Configuraciones y Recursos
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" fontWeight={700} gutterBottom>Imagen de Portada</Typography>
                                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderStyle: 'dashed', mt: 1 }}>
                                                        <Box sx={{ 
                                                            border: '1px solid', 
                                                            borderColor: 'divider', 
                                                            borderRadius: 2, 
                                                            mb: 2,
                                                            textAlign: 'center',
                                                            bgcolor: 'white',
                                                            cursor: 'pointer',
                                                            overflow: 'hidden',
                                                            height: 140,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            position: 'relative',
                                                            transition: 'all 0.2s',
                                                            '&:hover': { transform: 'scale(1.01)', boxShadow: 1 }
                                                        }}
                                                        onClick={() => document.getElementById('lesson-image-input').click()}
                                                        >
                                                            <input
                                                                type="file"
                                                                id="lesson-image-input"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onloadend = () => {
                                                                            setLessonData({ 
                                                                                ...lessonData, 
                                                                                imageFile: file,
                                                                                image: reader.result 
                                                                            });
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                            {lessonData.image ? (
                                                                <img 
                                                                    src={lessonData.image} 
                                                                    alt="Vista previa" 
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                                />
                                                            ) : (
                                                                <Box sx={{ p: 2 }}>
                                                                    <CloudUploadIcon sx={{ fontSize: 30, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
                                                                    <Typography variant="caption" display="block" color="text.secondary" fontWeight={600}>
                                                                        Subir
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            {lessonData.image && (
                                                                <Box sx={{ 
                                                                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                                                                    bgcolor: 'rgba(0,0,0,0.6)', color: 'white', py: 0.5,
                                                                    backdropFilter: 'blur(2px)'
                                                                }}>
                                                                    <Typography variant="caption" fontWeight={600}>Cambiar</Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Alt text..."
                                                            value={lessonData.imageDescription}
                                                            onChange={(e) => setLessonData({ ...lessonData, imageDescription: e.target.value })}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white', fontSize: '0.8rem' } }}
                                                        />
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Grid container spacing={3}>
                                                         <Grid item xs={12}>
                                                            <Typography variant="caption" fontWeight={700} gutterBottom>Nivel</Typography>
                                                            <Select
                                                                fullWidth
                                                                size="small"
                                                                value={lessonData.level}
                                                                onChange={(e) => setLessonData({ ...lessonData, level: e.target.value })}
                                                                sx={{ borderRadius: 2, mt: 1 }}
                                                            >
                                                                <MenuItem value="Básico">Básico</MenuItem>
                                                                <MenuItem value="Intermedio">Intermedio</MenuItem>
                                                                <MenuItem value="Avanzado">Avanzado</MenuItem>
                                                            </Select>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" fontWeight={700} gutterBottom>Duración (min)</Typography>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="number"
                                                                value={lessonData.duration}
                                                                onChange={(e) => setLessonData({ ...lessonData, duration: parseInt(e.target.value) || 0 })}
                                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mt: 1 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" fontWeight={700} gutterBottom>Puntos</Typography>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="number"
                                                                value={lessonData.totalPoints}
                                                                onChange={(e) => setLessonData({ ...lessonData, totalPoints: parseInt(e.target.value) || 0 })}
                                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mt: 1 }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
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

                                {lessonData.exercises.map((ex, index) => {
                                    const exErrors = errors.exercises?.[index] || {};
                                    return (
                                    <Paper key={ex.id} elevation={0} sx={{
                                        p: 3,
                                        border: '1px solid', 
                                        borderColor: Object.keys(exErrors).length > 0 ? 'error.main' : 'divider',
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.background.default, 0.3),
                                        position: 'relative'
                                    }}>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleRemoveExercise(ex.id)}
                                            sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main', bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Box sx={{
                                                minWidth: 24, height: 24, borderRadius: 1,
                                                bgcolor: Object.keys(exErrors).length > 0 ? 'error.main' : 'primary.main', 
                                                color: 'background.paper',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: 800
                                            }}>
                                                {index + 1}
                                            </Box>
                                            <Typography variant="subtitle2" fontWeight={700} color={Object.keys(exErrors).length > 0 ? 'error.main' : 'text.secondary'}>
                                                {ex.type === 'multiple_choice' ? 'Opción Múltiple' : ex.type === 'true_false' ? 'Verdadero/Falso' : 'Completar Espacios'}
                                            </Typography>
                                            {exErrors.question && <Typography variant="caption" color="error">Falta pregunta</Typography>}
                                            {exErrors.correctAnswer && <Typography variant="caption" color="error">- Falta respuesta correcta</Typography>}
                                        </Box>

                                        {/* Question Field */}
                                        <TextField
                                            fullWidth
                                            error={!!exErrors.question}
                                            variant="standard"
                                            placeholder="Escribe la pregunta aquí..."
                                            value={ex.question}
                                            onChange={(e) => handleExerciseChange(ex.id, 'question', e.target.value)}
                                            sx={{ mb: 2, '& .MuiInput-input': { fontSize: '1.1rem', fontWeight: 600 } }}
                                        />

                                        {/* Options */}
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            {ex.options.map((opt, optIndex) => (
                                                <Grid item xs={12} md={6} key={optIndex}>
                                                    <Paper elevation={0} sx={{
                                                        p: 1.5,
                                                        border: '2px solid',
                                                        borderColor: ex.correctAnswer === opt && opt !== '' ? 'success.main' : (exErrors.options && opt === '' ? 'error.light' : 'divider'),
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                        display: 'flex', alignItems: 'center', gap: 1,
                                                        position: 'relative'
                                                    }}>
                                                        <Radio 
                                                            checked={ex.correctAnswer === opt && opt !== ''} 
                                                            size="small"
                                                            onChange={() => handleExerciseChange(ex.id, 'correctAnswer', opt)}
                                                            disabled={opt === ''}
                                                            sx={{ color: exErrors.correctAnswer ? 'error.main' : undefined }}
                                                        />
                                                        <TextField 
                                                            fullWidth 
                                                            variant="standard" 
                                                            value={opt} 
                                                            onChange={(e) => handleOptionChange(ex.id, optIndex, e.target.value)}
                                                            placeholder={`Opción ${optIndex + 1}`}
                                                            disabled={ex.type === 'true_false'}
                                                            InputProps={{ disableUnderline: true }} 
                                                        />
                                                        {ex.type === 'multiple_choice' && ex.options.length > 2 && (
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleRemoveOption(ex.id, optIndex)}
                                                                sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                                                            >
                                                                <CloseIcon fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </Paper>
                                                </Grid>
                                            ))}
                                            
                                            {ex.type === 'multiple_choice' && ex.options.length < 4 && (
                                                <Grid item xs={12} md={6}>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        startIcon={<AddCircleIcon />}
                                                        onClick={() => handleAddOption(ex.id)}
                                                        sx={{ 
                                                            height: '100%', 
                                                            borderStyle: 'dashed',
                                                            color: 'text.secondary',
                                                            borderColor: 'divider',
                                                            '&:hover': {
                                                                borderColor: 'primary.main',
                                                                color: 'primary.main',
                                                                bgcolor: 'background.paper' 
                                                            }
                                                        }}
                                                    >
                                                        Añadir Opción
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>

                                        {/* Tip Field */}
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Pista o ayuda para el estudiante (opcional)..."
                                            value={ex.tip}
                                            onChange={(e) => handleExerciseChange(ex.id, 'tip', e.target.value)}
                                            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                            label="Pista"
                                        />
                                    </Paper>
                                )})}

                                <Box sx={{ mt: 4, mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={800} align="center" gutterBottom color="text.primary">
                                        ¿Qué tipo de ejercicio deseas agregar?
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                    <Paper
                                        elevation={0}
                                        onClick={() => handleAddExercise('multiple_choice')}
                                        sx={{
                                            flex: 1, // Forces equal width (50%)
                                            p: 2,
                                            cursor: 'pointer',
                                            border: '1px dashed',
                                            borderColor: 'secondary.main', 
                                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 8px ${alpha(theme.palette.secondary.main, 0.1)}`,
                                                borderColor: 'secondary.dark'
                                            },
                                            '&:active': { transform: 'translateY(-1px)' }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 40, height: 40,
                                            borderRadius: '50%',
                                            bgcolor: 'secondary.main',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <QuizIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800} color="secondary.dark" sx={{ fontSize: '0.95rem' }}>Opción Múltiple</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1, fontSize: '0.8rem' }}>
                                                Varias opciones de respuesta.
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Paper
                                        elevation={0}
                                        onClick={() => handleAddExercise('true_false')}
                                        sx={{
                                            flex: 1, // Forces equal width (50%)
                                            p: 2,
                                            cursor: 'pointer',
                                            border: '1px dashed',
                                            borderColor: 'text.primary',
                                            bgcolor: alpha(theme.palette.text.primary, 0.05),
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.text.primary, 0.1),
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 8px ${alpha(theme.palette.text.primary, 0.1)}`,
                                                borderColor: 'text.primary'
                                            },
                                            '&:active': { transform: 'translateY(-1px)' }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 40, height: 40,
                                            borderRadius: '50%',
                                            bgcolor: 'text.primary',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <CheckCircleIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.95rem' }}>Verdadero / Falso</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1, fontSize: '0.8rem' }}>
                                                Validación simple binaria.
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <EditorFooter
                actions={actions}
                savingStatus={null}
                statusColor={Object.keys(errors).length === 0 ? 'success.dark' : 'error.main'}
                StatusIcon={Object.keys(errors).length === 0 ? CheckCircleIcon : ErrorIcon}
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
                    <Button 
                        onClick={handleCloseDialog} 
                        disabled={createLoading || updateLoading}
                        sx={{ fontWeight: 'bold', color: 'text.secondary' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        disabled={createLoading || updateLoading}
                        variant="contained"
                        color={dialongContent.color || 'primary'}
                        startIcon={createLoading || updateLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ 
                            borderRadius: 2, 
                            fontWeight: 'bold', 
                            px: 3, 
                            boxShadow: 'none',
                            '&:disabled': {
                                bgcolor: 'action.disabledBackground',
                                color: 'action.disabled',
                            }
                        }}
                        autoFocus
                    >
                        {createLoading || updateLoading ? 'Procesando...' : (dialongContent.confirmText || 'Confirmar')}
                    </Button>
                </DialogActions>
            </Dialog>

            <FullPageLoader open={createLoading || updateLoading} message={isEditMode ? "Guardando cambios..." : "Creando lección..."} />

        </>
    );
};

export default AdminLessonEditor;
