import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Paper,
    Container,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import EditorHeader from '../../components/EditorHeader';
import EditorFooter from '../../components/EditorFooter';
import PageHeader from '../../components/PageHeader';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/useDialog';

// Mock data para simular edición
const mockTerms = [
    {
        id: 1,
        wordShuar: 'Nua',
        wordSpanish: 'Mujer',
        category: 'Sustantivo',
        exampleShuar: 'Ii nuari jutai.',
        exampleSpanish: 'Nuestra mujer es fuerte.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
];

const AdminDictionaryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    const [pendingAction, setPendingAction] = useState(null);
    const [formData, setFormData] = useState({
        wordShuar: '',
        wordSpanish: '',
        category: '',
        exampleShuar: '',
        exampleSpanish: '',
        image: null,
    });

    // Simular carga de datos en modo edición
    useEffect(() => {
        if (isEditMode) {
            const term = mockTerms.find(t => t.id === parseInt(id));
            if (term) {
                setFormData({
                    wordShuar: term.wordShuar || '',
                    wordSpanish: term.wordSpanish || '',
                    category: term.category || '',
                    exampleShuar: term.exampleShuar || '',
                    exampleSpanish: term.exampleSpanish || '',
                    image: term.image || null,
                });
            }
        }
    }, [id, isEditMode]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleBack = () => {
        navigate('/admin/diccionario');
    };

    const performSave = () => {
        handleSetDataSnackbar({ message: 'Término guardado como borrador', type: 'success' });
        handleCloseDialog();
    };

    const performPublish = () => {
        handleSetDataSnackbar({ message: 'Término publicado exitosamente', type: 'success' });
        navigate('/admin/diccionario');
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
        setDialongContent({
            title: "Guardar Borrador",
            message: "¿Deseas guardar el término como borrador?",
            confirmText: "Guardar",
            color: "primary"
        });
        handleOpenDialog();
    };

    const handlePublishClick = () => {
        setPendingAction('publish');
        setDialongContent({
            title: "Publicar Término",
            message: "¿Estás seguro de que deseas publicar este término? Será visible inmediatamente en el diccionario.",
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
                startIcon={<SaveIcon />}
                sx={{
                    borderRadius: 3, px: 4, py: 1, fontWeight: 700,
                    borderColor: 'text.primary', color: 'text.primary',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'transparent' }
                }}
            >
                Guardar Borrador
            </Button>
            <Button
                variant="contained"
                onClick={handlePublishClick}
                startIcon={<PublishIcon />}
                sx={{
                    borderRadius: 3, px: 5, py: 1, fontWeight: 800,
                    bgcolor: 'secondary.main', color: 'white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' }
                }}
            >
                Publicar Término
            </Button>
        </>
    );

    const breadcrumbs = [
        { label: 'Diccionario', onClick: handleBack },
        { label: isEditMode ? 'Editar Término' : 'Nuevo Término', onClick: null }
    ];

    return (
        <>
            <EditorHeader
                breadcrumbs={breadcrumbs}
                onBack={handleBack}
                lastSaved="Guardado automático activo"
                showLastSaved={true}
            />

            <Container maxWidth="md" sx={{ pt: 4, pb: 12, px: { xs: 3, sm: 4, md: 6 } }}>
                <PageHeader
                    title={isEditMode ? 'Editar Término del Diccionario' : 'Nuevo Término del Diccionario'}
                    subtitle="Complete la información del término en Shuar y su traducción al español."
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* Imagen de referencia */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block' }}>
                            Imagen de Referencia (Opcional)
                        </Typography>
                        <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', bgcolor: 'grey.100', cursor: 'pointer', mx: 'auto', '&:hover .overlay': { opacity: 1 } }}>
                            {formData.image ? (
                                <Box component="img" src={formData.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'text.disabled' }}>
                                    <ImageOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="body2">Sin imagen</Typography>
                                </Box>
                            )}
                            <Box className="overlay" sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CloudUploadIcon /> Cambiar Imagen
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic' }}>
                            Formato recomendado: 800x450px (JPG, PNG)
                        </Typography>
                    </Paper>

                    {/* Palabras */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Palabra en Shuar *
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.wordShuar}
                                    onChange={handleChange('wordShuar')}
                                    placeholder="Ej: Nua"
                                    sx={{ bgcolor: 'grey.50', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Traducción al Español *
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={formData.wordSpanish}
                                    onChange={handleChange('wordSpanish')}
                                    placeholder="Ej: Mujer"
                                    sx={{ bgcolor: 'grey.50', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Categoría Gramatical *
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={formData.category}
                                        onChange={handleChange('category')}
                                        displayEmpty
                                        sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                                    >
                                        <MenuItem value="" disabled>Seleccionar categoría</MenuItem>
                                        <MenuItem value="Sustantivo">Sustantivo</MenuItem>
                                        <MenuItem value="Verbo">Verbo</MenuItem>
                                        <MenuItem value="Adjetivo">Adjetivo</MenuItem>
                                        <MenuItem value="Adverbio">Adverbio</MenuItem>
                                        <MenuItem value="Expresión">Expresión</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Ejemplos de Uso */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <MenuBookIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" fontWeight={700} color="text.primary">
                                Ejemplos de Uso
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Ejemplo en Shuar
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    value={formData.exampleShuar}
                                    onChange={handleChange('exampleShuar')}
                                    placeholder="Escriba una oración de ejemplo en Shuar..."
                                    sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                                    Traducción del Ejemplo (Español)
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    value={formData.exampleSpanish}
                                    onChange={handleChange('exampleSpanish')}
                                    placeholder="Traducción de la oración al español..."
                                    sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                </Box>
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

export default AdminDictionaryEditor;
