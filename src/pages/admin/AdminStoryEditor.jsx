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
    DialogActions
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

import { useSidebarContext } from '../../hooks/context/sidebardContext';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/useDialog';
import EditorHeader from '../../components/EditorHeader';
import EditorFooter from '../../components/EditorFooter';
import PageHeader from '../../components/PageHeader';

// Mock data to simulate fetching an existing story
const mockStories = [
    {
        id: 1,
        title: { shuar: "Nunkui y la abundancia", es: "Nunkui y la abundancia" },
        category: "Mito",
        author: "Shuar Community",
        status: "Publicado",
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_nSmxciuv3UgGKXptWVLyy5P8kf913fivx4_sn4EhyW7get1YB3STQmrUHfeWvStIMIlEXCDyMJH_qlgQ582G46HuXrxgkRtyMBUs-lmGiXRfTmEiq2hPW0kl-mZOKVuGdC2jkk7fBzDPGZJh8KJIWdHX1Ut6BdNp1sf7uFVFHx2dCAK2gq_hfhksrBp3dCI1llEL_YcXfiN5alsifMruHD6lHiW3dAYW_8zbgP6sAiV1v5-o-l1xibrmryWp4EpzQxWKEd9m_WM",
        content: { shuar: "Shuar content placeholder...", es: "Spanish content placeholder..." }
    }
];

const AdminStoryEditor = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const { isOpen: isSidebarOpen } = useSidebarContext();
    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();
    const isMobile = useTheme().breakpoints.down('md');

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

    // Simulate fetching data
    useEffect(() => {
        if (isEditMode) {
            const story = mockStories.find(s => s.id === parseInt(id));
            if (story) {
                setFormData({
                    titleShuar: story.title?.shuar || '',
                    titleEs: story.title?.es || '',
                    category: story.category || 'Mito',
                    author: story.author || '',
                    difficulty: 'Básico',
                    contentShuar: story.content?.shuar || '',
                    contentEs: story.content?.es || '',
                    cover: story.cover
                });
            }
        }
    }, [id, isEditMode]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleBack = () => {
        navigate('/admin/cuentos');
    };

    const performSave = () => {
        handleSetDataSnackbar({ message: 'Borrador guardado exitosamente', type: 'success' });
        handleCloseDialog();
    };

    const performPublish = () => {
        handleSetDataSnackbar({ message: 'Cuento publicado correctamente', type: 'success' });
        navigate('/admin/cuentos');
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
            message: "¿Deseas guardar el progreso actual como borrador?",
            confirmText: "Guardar",
            color: "primary"
        });
        handleOpenDialog();
    };

    const handlePublishClick = () => {
        setPendingAction('publish');
        setDialongContent({
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
                Publicar Cuento
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
                                        <MenuItem value="Fábula">Fábula</MenuItem>
                                        <MenuItem value="Naturaleza">Naturaleza</MenuItem>
                                        <MenuItem value="Tradición">Tradición</MenuItem>
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

export default AdminStoryEditor;
