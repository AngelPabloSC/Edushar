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
import EditorHeader from '../../components/EditorHeader';
import EditorFooter from '../../components/EditorFooter';
import PageHeader from '../../components/PageHeader';

const AdminLessonEditor = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { isOpen } = useSidebarContext(); // Sidebar Context
    const { handleSetDataSnackbar } = useSnackBarContext(); // Snackbar Context
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong(); // Dialog Hook
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [pendingAction, setPendingAction] = useState(null);

    const performSaveDraft = () => {
        handleSetDataSnackbar({ message: 'Borrador guardado exitosamente', type: 'success' });
        handleCloseDialog();
    };

    const performPublish = () => {
        // Logic to publish lesson would go here
        handleSetDataSnackbar({ message: 'Lección publicada correctamente', type: 'success' });
        handleCloseDialog();
        navigate('/admin/lecciones'); // Navigate back after success
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
        level: 'A1 - Principiante',
        prerequisite: 'Ninguno',
        content: '',
        exercises: [
             { id: 1, type: 'multiple_choice', question: "¿Cómo se dice 'Pájaro' en Shuar?", options: ['Chikirpu', 'Ikiama', 'Yawa', 'Aujuju'], correct: 0 },
             { id: 2, type: 'fill_in_blanks', content: "El animal más veloz es el [Yawá-pish].", question: "" }
        ]
    });

    const handleBack = () => {
        navigate('/admin/lecciones');
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

            <Container maxWidth="lg" sx={{ pt: 4, pb: 12 }}>
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
                                            onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Nivel</Typography>
                                        <Select
                                            fullWidth
                                            value={lessonData.level}
                                            onChange={(e) => setLessonData({...lessonData, level: e.target.value})}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="A1 - Principiante">Principiante</MenuItem>
                                            <MenuItem value="A2 - Elemental">Intermedio</MenuItem>
                                            <MenuItem value="B1 - Intermedio">Avanzado</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Prerrequisito</Typography>
                                        <Select
                                            fullWidth
                                            value={lessonData.prerequisite}
                                            onChange={(e) => setLessonData({...lessonData, prerequisite: e.target.value})}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="Ninguno">Ninguno</MenuItem>
                                            <MenuItem value="Gramática I">Gramática Básica I</MenuItem>
                                            <MenuItem value="Intro Shuar">Introducción al Shuar</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* CONF: Lesson Content Card */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.paper, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ArticleIcon color="primary" /> Contenido de la Lección
                                </Typography>
                                <Button startIcon={<ImageIcon />} size="small" sx={{ fontWeight: 700, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}>
                                    Subir Imagen
                                </Button>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {/* Fake Toolbar matching HTML */}
                                <Box sx={{ 
                                    display: 'flex', flexWrap: 'wrap', gap: 0.5, 
                                    p: 1, 
                                    border: '1px solid', borderColor: 'divider', 
                                    borderBottom: 0,
                                    borderTopLeftRadius: 8, borderTopRightRadius: 8,
                                    bgcolor: 'action.hover'
                                }}>
                                    <IconButton size="small"><FormatBoldIcon /></IconButton>
                                    <IconButton size="small"><FormatItalicIcon /></IconButton>
                                    <IconButton size="small"><FormatUnderlinedIcon /></IconButton>
                                    <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 0.5, alignSelf: 'center' }} />
                                    <IconButton size="small"><FormatListBulletedIcon /></IconButton>
                                    <IconButton size="small"><FormatListNumberedIcon /></IconButton>
                                    <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 0.5, alignSelf: 'center' }} />
                                    <IconButton size="small"><InsertLinkIcon /></IconButton>
                                    <IconButton size="small"><TranslateIcon /></IconButton>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={12}
                                    placeholder="Escriba aquí el cuerpo de la lección, incluya vocabulario y contextos culturales..."
                                    value={lessonData.content}
                                    onChange={(e) => setLessonData({...lessonData, content: e.target.value})}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 2 
                                        } 
                                    }}
                                />
                                
                                <Box sx={{ mt: 3, border: '2px dashed', borderColor: 'divider', borderRadius: 3, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
                                        <CloudUploadIcon fontSize="large" />
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={700}>Arrastra una imagen o haz clic para subir</Typography>
                                    <Typography variant="caption" color="text.secondary">PNG, JPG hasta 5MB</Typography>
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
                                
                                {lessonData.exercises.map((ex, index) => (
                                    <Paper key={ex.id} elevation={0} sx={{ 
                                        p: 3, 
                                        border: '1px solid', borderColor: 'divider', 
                                        borderRadius: 3, 
                                        bgcolor: alpha(theme.palette.background.default, 0.3), 
                                        position: 'relative' 
                                    }}>
                                        <IconButton size="small" sx={{ position: 'absolute', top: 12, right: 12, color: 'error.main', bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }}>
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
                                                {ex.type === 'multiple_choice' ? 'Opción Múltiple' : 'Completar Espacios'}
                                            </Typography>
                                        </Box>

                                        {ex.type === 'multiple_choice' ? (
                                            <>
                                                <TextField 
                                                    fullWidth 
                                                    variant="standard" 
                                                    placeholder="¿Cómo se dice 'Pájaro' en Shuar?" 
                                                    value={ex.question} 
                                                    sx={{ mb: 2, '& .MuiInput-input': { fontSize: '1.1rem', fontWeight: 600 } }} 
                                                />
                                                <Grid container spacing={2}>
                                                    {ex.options.map((opt, optIndex) => (
                                                        <Grid item xs={12} key={optIndex}>
                                                            <Paper elevation={0} sx={{ 
                                                                p: 1.5, 
                                                                border: '1px solid', borderColor: 'divider', 
                                                                borderRadius: 2, 
                                                                bgcolor: 'background.paper',
                                                                display: 'flex', alignItems: 'center', gap: 1 
                                                            }}>
                                                                <Radio checked={ex.correct === optIndex} size="small" />
                                                                <TextField fullWidth variant="standard" value={opt} InputProps={{ disableUnderline: true }} />
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                    Use corchetes [ ] para definir la palabra correcta, ej: El [sol] sale.
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    value={ex.content}
                                                    placeholder="El animal más veloz es el [Yawá-pish]."
                                                    sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                                />
                                            </>
                                        )}
                                    </Paper>
                                ))}

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button variant="outlined" startIcon={<AddCircleIcon />} sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}>
                                        Añadir Opción Múltiple
                                    </Button>
                                    <Button variant="outlined" startIcon={<FormatUnderlinedIcon />} sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700, borderColor: 'primary.main', color: 'primary.main' }}>
                                        Añadir Espacio en Blanco
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
