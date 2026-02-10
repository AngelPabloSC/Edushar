import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography, 
    Button, 
    Box, 
    Container,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme,
    alpha,
    Tab,
    Tabs,
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const StoryEditorDialog = ({ open, handleClose, story, onSave }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0); // 0: Shuar, 1: Español
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

    useEffect(() => {
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
        } else {
            // Reset
            setFormData({
                titleShuar: '',
                titleEs: '',
                category: 'Mito',
                author: 'Comunidad Shuar',
                difficulty: 'Básico',
                contentShuar: '',
                contentEs: '',
                cover: null
            });
        }
    }, [story, open]);

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog 
            fullScreen 
            open={open} 
            onClose={handleClose} 
            TransitionComponent={React.forwardRef(function Transition(props, ref) {
                return <React.Fragment>{props.children}</React.Fragment>;
            })}
        >
            {/* Header / Navbar */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" sx={{ color: 'text.secondary' }}>
                            <CloseIcon />
                        </IconButton>
                        <Box>
                            {/* Breadcrumbs simulation */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, display: { xs: 'none', md: 'flex'} }}>
                                <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main'} }}>Dashboard</Typography>
                                <ChevronRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main'} }}>Cuentos</Typography>
                                <ChevronRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.primary" fontWeight={600}>{story ? 'Editar Cuento' : 'Nuevo Cuento'}</Typography>
                            </Box>
                            <Typography sx={{ color: 'text.primary', fontWeight: 800, lineHeight: 1 }} variant="h6" component="div">
                                {story ? 'Editar Cuento' : 'Agregar Nuevo Cuento'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                         <Button 
                            sx={{ 
                                borderRadius: 3, 
                                fontWeight: 700, 
                                borderColor: 'text.primary', 
                                color: 'text.primary',
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2, bgcolor: 'text.primary', color: 'white' }
                            }}
                            variant="outlined"
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            autoFocus 
                            variant="contained" 
                            startIcon={<SaveIcon />}
                            onClick={() => onSave(formData)}
                            sx={{ 
                                borderRadius: 3, 
                                fontWeight: 700, 
                                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                                bgcolor: 'secondary.main', // Gold accent
                                '&:hover': { bgcolor: 'secondary.dark', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }
                            }}
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Content */}
            <Box sx={{ bgcolor: alpha(theme.palette.secondary.light, 0.05), minHeight: '100vh', py: 5 }}>
                <Container maxWidth="xl">
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
                                            InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem', lineHeight: 1.6 } }}
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
                                            InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem', lineHeight: 1.6 } }}
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
            </Box>
        </Dialog>
    );
};

export default StoryEditorDialog;
