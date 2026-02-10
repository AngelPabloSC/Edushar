import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Container,
    FormControl,
    useTheme,
    alpha,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import PublishIcon from '@mui/icons-material/Publish';

import { useSidebarContext } from '@shared/context/SidebarContext';
import { useSnackBarContext } from '@shared/context/SnackbarContext';
import { useDialog } from '../../../shared/hooks/useDialog';
import EditorHeader from '@shared/components/editors/EditorHeader';
import EditorFooter from '@shared/components/editors/EditorFooter';
import PageHeader from '@shared/components/layout/PageHeader';
import { useCrudAdminStory } from '@features/admin/hooks/useCrudAdminStory';

const AdminStoryEditor = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const { isOpen: isSidebarOpen } = useSidebarContext();
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialogContent, handleOpenDialog, handleCloseDialog, setDialogContent } = useDialog();
    const isMobile = useTheme().breakpoints.down('md');

    // Hook for CRUD operations
    const { createStory, updateStory, fetchStoryById, createLoading, updateLoading, fetchLoading } = useCrudAdminStory();

    const [activeTab, setActiveTab] = useState(0); // 0: Shuar, 1: Español
    const [pendingAction, setPendingAction] = useState(null);
    const [formData, setFormData] = useState({
        titleShuar: '',
        titleEs: '',
        category: 'Mito',
        author: 'Comunidad Shuar',
        difficulty: 'Básico',
        contentShuar: '',
        contentEs: '',
        cover: null
    });

    // Fetch data if in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            const loadStory = async () => {
                const story = await fetchStoryById(id);
                if (story) {
                    setFormData({
                        titleShuar: story.title_shuar || '',
                        titleEs: story.title_español || '',
                        category: story.category || 'Mito',
                        author: story.author || '',
                        difficulty: 'Básico',
                        contentShuar: story.contentShuar || '',
                        contentEs: story.contentSpanish || '',
                        cover: story.coverImage || null
                    });
                }
            };
            loadStory();
        }
    }, [id, isEditMode, fetchStoryById]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    // Handle image upload and convert to base64
    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, cover: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleBack = () => {
        navigate('/admin/cuentos');
    };

    const performSave = async () => {
        try {
            if (isEditMode) {
                const result = await updateStory(id, formData);
                if (result.success) {
                    handleSetDataSnackbar({ message: 'Borrador guardado exitosamente', type: 'success' });
                } else {
                    handleSetDataSnackbar({ message: result.error || 'Error al guardar', type: 'error' });
                }
            } else {
                const result = await createStory(formData);
                if (result.success) {
                    handleSetDataSnackbar({ message: 'Borrador guardado exitosamente', type: 'success' });
                } else {
                    handleSetDataSnackbar({ message: result.error || 'Error al guardar', type: 'error' });
                }
            }
        } catch (error) {
            handleSetDataSnackbar({ message: 'Error al guardar el borrador', type: 'error' });
        }
        handleCloseDialog();
    };

    const performPublish = async () => {
        try {
            if (isEditMode) {
                const result = await updateStory(id, formData);
                if (result.success) {
                    handleSetDataSnackbar({ message: 'Cuento publicado correctamente', type: 'success' });
                    navigate('/admin/cuentos');
                } else {
                    handleSetDataSnackbar({ message: result.error || 'Error al publicar', type: 'error' });
                }
            } else {
                const result = await createStory(formData);
                if (result.success) {
                    handleSetDataSnackbar({ message: 'Cuento publicado correctamente', type: 'success' });
                    navigate('/admin/cuentos');
                } else {
                    handleSetDataSnackbar({ message: result.error || 'Error al publicar', type: 'error' });
                }
            }
        } catch (error) {
            handleSetDataSnackbar({ message: 'Error al publicar el cuento', type: 'error' });
        }
        handleCloseDialog();
    };

    const handleConfirmAction = () => {
        if (pendingAction === 'save_draft') {
            performSave();
        } else if (pendingAction === 'publish') {
            performPublish();
        }
    };

    const handleSaveClick = () => {
        setPendingAction('save_draft');
        setDialogContent({
            title: "Guardar Borrador",
            message: "¿Deseas guardar el progreso actual como borrador?",
            confirmText: "Guardar",
            color: "primary"
        });
        handleOpenDialog();
    };

    const handlePublishClick = () => {
        setPendingAction('publish');
        setDialogContent({
            title: "Publicar Cuento",
            message: "¿Estás seguro de que deseas publicar este cuento? Será visible inmediatamente.",
            confirmText: "Publicar Ahora",
            color: "success"
        });
        handleOpenDialog();
    };

    const actions = (
        <>
            <Button
                variant="outlined"
                onClick={handleSaveClick}
                disabled={createLoading || updateLoading}
                startIcon={createLoading || updateLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                sx={{
                    borderRadius: 3, px: 4, py: 1, fontWeight: 700,
                    borderColor: 'text.primary', color: 'text.primary',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'transparent' },
                    '&:disabled': {
                        borderColor: 'action.disabledBackground',
                        color: 'action.disabled',
                    }
                }}
            >
                {createLoading || updateLoading ? 'Guardando...' : 'Guardar Borrador'}
            </Button>
            <Button
                variant="contained"
                onClick={handlePublishClick}
                disabled={createLoading || updateLoading}
                startIcon={createLoading || updateLoading ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
                sx={{
                    borderRadius: 3, px: 5, py: 1, fontWeight: 800,
                    bgcolor: 'secondary.main', color: 'white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' },
                    '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                    }
                }}
            >
                {createLoading || updateLoading ? 'Publicando...' : 'Publicar Cuento'}
            </Button>
        </>
    );

    const breadcrumbs = [
        { label: 'Cuentos', onClick: handleBack },
        { label: isEditMode ? 'Editar Cuento' : 'Nuevo Cuento', onClick: null }
    ];

    return (
        <>
            <EditorHeader
                breadcrumbs={breadcrumbs}
                onBack={handleBack}
                lastSaved="Guardado automático activo"
                showLastSaved={true}
            />

            <Container maxWidth="xl" sx={{ pt: 4, pb: 12, px: { xs: 3, sm: 4, md: 6 } }}>
                <PageHeader
                    title={isEditMode ? 'Editar Cuento' : 'Crear Nuevo Cuento'}
                    subtitle="Complete la información del cuento bilingüe y administre su contenido."
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '4fr 8fr' }, gap: 5 }}>

                    {/* LEFT COLUMN: Metadata */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                        {/* Cover Image Card */}
                        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Portada del Cuento
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <input
                                    accept="image/*"
                                    id="cover-image-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="cover-image-upload">
                                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', bgcolor: 'grey.100', cursor: 'pointer', group: 'true', '&:hover .overlay': { opacity: 1 } }}>
                                        {formData.cover ? (
                                            <Box component="img" src={formData.cover} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'text.disabled' }}>
                                                <ImageOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
                                            </Box>
                                        )}
                                        {/* Overlay */}
                                        <Box className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CloudUploadIcon /> Cambiar
                                            </Typography>
                                        </Box>
                                    </Box>
                                </label>
                                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic' }}>
                                    Formato recomendado: 1200x675px (JPG, PNG)
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Info Fields Card */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Shuar Title */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Título en Shuar
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.titleShuar}
                                    onChange={handleChange('titleShuar')}
                                    placeholder="Ej: Nunkui..."
                                    sx={{ bgcolor: 'grey.50', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            {/* Spanish Title */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Título en Español
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.titleEs}
                                    onChange={handleChange('titleEs')}
                                    placeholder="Ej: Nunkui y la abundancia..."
                                    sx={{ bgcolor: 'grey.50', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            {/* Author */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Autor / Recopilador
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.author}
                                    onChange={handleChange('author')}
                                    placeholder="Nombre del autor"
                                    sx={{ bgcolor: 'grey.50', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>

                            {/* Category */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Categoría
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={formData.category}
                                        onChange={handleChange('category')}
                                        sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                                    >
                                        <MenuItem value="Mito">Mito</MenuItem>
                                        <MenuItem value="Leyenda">Leyenda</MenuItem>
                                        <MenuItem value="Naturaleza">Naturaleza</MenuItem>
                                        <MenuItem value="Tradición">Tradición</MenuItem>
                                        <MenuItem value="Fábula">Fábula</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Paper>
                    </Box>

                    {/* RIGHT COLUMN: Editor */}
                    <Box>
                        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                            {/* Language Tabs */}
                            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    sx={{
                                        '& .MuiTab-root': {
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            minWidth: 120,
                                            py: 2
                                        }
                                    }}
                                >
                                    <Tab label="Shuar" />
                                    <Tab label="Español" />
                                </Tabs>
                            </Box>

                            {/* Rich Text Toolbar (Visual Only) */}
                            <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <Tooltip title="Bold"><IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Italic"><IconButton size="small"><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Underline"><IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton></Tooltip>
                                <Box sx={{ width: '1px', height: 20, bgcolor: 'divider', mx: 1 }} />
                                <Tooltip title="List"><IconButton size="small"><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Numbered List"><IconButton size="small"><FormatListNumberedIcon fontSize="small" /></IconButton></Tooltip>
                                <Box sx={{ width: '1px', height: 20, bgcolor: 'divider', mx: 1 }} />
                                <Tooltip title="Quote"><IconButton size="small"><FormatQuoteIcon fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Link"><IconButton size="small"><InsertLinkIcon fontSize="small" /></IconButton></Tooltip>
                            </Box>

                            {/* Content Area */}
                            <Box sx={{ flex: 1, p: 4, bgcolor: 'white' }}>
                                {activeTab === 0 && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        variant="standard"
                                        placeholder="Empieza a escribir el cuento en Shuar..."
                                        InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', lineHeight: 1.6, fontFamily: 'serif' } }} // Slightly serif for story feel? Or keep sans
                                        minRows={20}
                                        value={formData.contentShuar}
                                        onChange={handleChange('contentShuar')}
                                    />
                                )}
                                {activeTab === 1 && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        variant="standard"
                                        placeholder="Escribe la traducción en Español..."
                                        InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', lineHeight: 1.6 } }}
                                        minRows={20}
                                        value={formData.contentEs}
                                        onChange={handleChange('contentEs')}
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Box>

                </Box>
            </Container>

            <EditorFooter
                actions={actions}
                savingStatus="Borrador guardado automáticamente"
            />


            {/* Confirmation Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        {dialogContent.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        disabled={createLoading || updateLoading}
                        variant="contained"
                        color={dialogContent.color || 'primary'}
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
                        {createLoading || updateLoading ? 'Procesando...' : (dialogContent.confirmText || 'Confirmar')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminStoryEditor;
