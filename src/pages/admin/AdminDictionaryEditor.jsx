import React, { useState, useEffect, useRef } from 'react';
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
    CircularProgress,
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
import { useDialong } from '../../hooks/ui/useDialog';
import { useFetchDataPromise } from '../../hooks/api/useFetchDataPromise';



const AdminDictionaryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();
    const { getFechData } = useFetchDataPromise();
    
    const fileInputRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const isSavingRef = useRef(false);

    const [pendingAction, setPendingAction] = useState(null);
    const [formData, setFormData] = useState({
        wordShuar: '',
        wordSpanish: '',
        category: '',
        exampleShuar: '',
        exampleSpanish: '',
        image: null,
    });

    // Cargar datos en modo edición
    useEffect(() => {
        if (isEditMode) {
             const fetchEntry = async () => {
                try {
                    const response = await getFechData({
                        endPoint: 'api/dictionary/get',
                        method: 'POST',
                        additionalData: { id } 
                    });

                    if (response.code === 'COD_OK') {
                        const data = response.data;
                        // Some endpoints might wrap the term details in a 'word' object, others might return it flat.
                        // Check for 'wordShuar' at root, if not found or empty, try data.word
                        const term = (data.wordShuar) ? data : (data.word || data);
                        
                        if (term) {
                            setFormData({
                                wordShuar: term.wordShuar || '',
                                wordSpanish: term.wordSpanish || '',
                                category: term.category || '',
                                exampleShuar: Array.isArray(term.examples) ? term.examples[0] : (term.examples || ''),
                                exampleSpanish: term.exampleSpanish || '', 
                                image: term.image || null,
                            });
                        } else {
                            handleSetDataSnackbar({ message: 'Término no encontrado', type: 'error' });
                            navigate('/admin/diccionario');
                        }
                    } else {
                         handleSetDataSnackbar({ message: 'Error al cargar los datos', type: 'error' });
                    }
                } catch (error) {
                    console.error("Error fetching entry", error);
                    handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
                }
             };
             fetchEntry();
        }
    }, [id, isEditMode, getFechData, handleSetDataSnackbar, navigate]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleBack = () => {
        navigate('/admin/diccionario');
    };


    // Image Upload Handling
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            console.log("File selected:", file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                // Use functional update to ensure fresh state
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow re-selecting the same file if needed
        event.target.value = '';
    };

    const performSave = async () => {
        // Prevenir múltiples envíos
        if (isSavingRef.current) {
            console.warn('⚠️ Guardado ya en proceso, ignorando clic duplicado');
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);

        const payload = {
            wordShuar: formData.wordShuar,
            wordSpanish: formData.wordSpanish,
            category: formData.category,
            examples: [formData.exampleShuar], 
            image: formData.image,
            imageDescription: formData.wordSpanish 
        };

        const endpoint = isEditMode ? 'api/dictionary/update' : 'api/dictionary/create';
        // Use ID as is, without parsing integer
        const finalPayload = isEditMode ? { id: id, ...payload } : payload;

        try {
            const response = await getFechData({
                endPoint: endpoint,
                method: 'POST',
                additionalData: finalPayload
            });

            if (response.code === 'COD_OK') {
                handleSetDataSnackbar({ 
                    message: isEditMode ? 'Término actualizado exitosamente' : 'Término creado exitosamente', 
                    type: 'success' 
                });
                navigate('/admin/diccionario');
            } else {
                 handleSetDataSnackbar({ message: response.message || 'Error al guardar', type: 'error' });
            }
        } catch (error) {
             handleSetDataSnackbar({ message: 'Error de conexión', type: 'error' });
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
        
        handleCloseDialog();
    };

    const handlePublishClick = () => {
        setPendingAction('publish');
        setDialongContent({
            title: isEditMode ? "Actualizar Palabra" : "Guardar Palabra",
            message: isEditMode ? "¿Estás seguro de que deseas actualizar esta palabra?" : "¿Estás seguro de que deseas guardar esta palabra en el diccionario?",
            confirmText: isEditMode ? "Actualizar" : "Guardar",
            color: "success"
        });
        handleOpenDialog();
    };

    const handleConfirmAction = () => {
         // Since we only have one main action now (Create/Save), we route to performSave directly
         // Previously we had draft vs publish logic. Now simplify to just Save.
         performSave();
    };

    const performPublish = () => {
        // Re-use logic for now, publish might be same as save but with status field if API supported it
        // The Create API provided uses standard creation. Status might not be controllable on creation.
        performSave();
    };

    // Action Buttons
    const actions = (
        <>
            <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                    borderRadius: 3, px: 2, py: 1, fontWeight: 700,
                    borderColor: 'text.primary', color: 'text.primary',
                    borderWidth: 2, mr: 2,
                    '&:hover': { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'transparent' }
                }}
            >
                Subir Imagen
                <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    ref={fileInputRef}
                />
            </Button>

            <Button
                variant="contained"
                onClick={handlePublishClick}
                disabled={!formData.wordShuar || !formData.wordSpanish || !formData.category || isSaving}
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
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
                {isSaving ? 'Guardando...' : 'Guardar Palabra'}
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
                        <Box
                          onClick={() => fileInputRef.current?.click()}
                          sx={{ position: 'relative', width: '100%', maxWidth: 400, aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', bgcolor: 'grey.100', cursor: 'pointer', mx: 'auto', '&:hover .overlay': { opacity: 1 } }}
                         >
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
                                        <MenuItem value="Animales">Animales</MenuItem>
                                        <MenuItem value="Plantas">Plantas</MenuItem>
                                        <MenuItem value="Naturaleza">Naturaleza</MenuItem>
                                        <MenuItem value="Otro">Otro</MenuItem>
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
                        disabled={isSaving}
                        variant="contained"
                        color={dialongContent.color || 'primary'}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
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
                        {isSaving ? 'Guardando...' : (dialongContent.confirmText || 'Confirmar')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminDictionaryEditor;
