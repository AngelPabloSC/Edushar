import { useState } from 'react';
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
    Fade,
    useTheme,
    alpha,
    InputAdornment,
    Container,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate, Link
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

import { useAdminStories } from '../../hooks/pages/useAdminStories';
import { useDialong } from '../../hooks/useDialog';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import StoryCard from '../../components/StoryCard';

const AdminStories = () => {
    const theme = useTheme();
    const navigate = useNavigate(); // Hook for navigation
    const { 
        data, 
        activeTab, 
        handleTabChange, 
        searchQuery, 
        setSearchQuery,
        handleDelete 
    } = useAdminStories();

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();
    
    // Delete State
    const [deleteId, setDeleteId] = useState(null);

    const handleEditClick = (story) => {
        navigate(`/admin/cuentos/editar/${story.id}`);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setDialongContent({
            title: "Eliminar Cuento",
            message: "¿Estás seguro de que deseas eliminar este cuento bilingüe? Esta acción no se puede deshacer.",
            confirmText: "Eliminar",
            color: "error"
        });
        handleOpenDialog();
    };

    const handleConfirmDelete = () => {
        handleDelete(deleteId);
        handleSetDataSnackbar({ message: 'Cuento eliminado correctamente', type: 'success' });
        handleCloseDialog();
    };

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: 'background.default', minHeight: '100vh' }}>
             {/* Breadcrumbs - High Contrast */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                    Admin
                </Typography>
                <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                    Gestión de Cuentos
                </Typography>
            </Box>

            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', gap: 2, mb: 6 }}>
                <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#111827', letterSpacing: '-0.03em' }}>
                        Gestión de Cuentos
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Administra el repositorio bilingüe de la comunidad Shuar. Crea y edita mitos, leyendas y fábulas.
                    </Typography>
                </Box>
                <Button 
                    component={Link}
                    to="/admin/cuentos/crear"
                    variant="contained" 
                    startIcon={<AddCircleIcon />}
                    sx={{ 
                        borderRadius: 3, 
                        textTransform: 'none', 
                        fontWeight: 800, 
                        py: 1.5, px: 3,
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                        bgcolor: 'text.primary', // Dark brown from theme
                        color: 'background.paper', // White
                        '&:hover': { 
                            bgcolor: 'text.secondary', 
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.15)' 
                        }
                    }}
                >
                    Agregar Cuento
                </Button>
            </Box>

             {/* Filters & Tabs - Enhanced with Don Norman's Principles */}
             <Box sx={{ mb: 6, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pb: 0 }}>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', flexWrap: 'wrap' }}>
                    {['Todos', 'Mito', 'Leyenda', 'Naturaleza', 'Tradición', 'Fábula'].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                             <Chip
                                key={tab}
                                label={tab}
                                onClick={() => handleTabChange(tab)}
                                sx={{ 
                                    height: 36,
                                    px: 1,
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 800 : 600,
                                    bgcolor: isActive ? 'text.primary' : 'transparent',
                                    color: isActive ? 'background.paper' : 'text.secondary',
                                    border: '2px solid',
                                    borderColor: isActive ? 'text.primary' : 'divider',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    // Affordances - looks clickable
                                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                    // Feedback - hover effects
                                    '&:hover': { 
                                        bgcolor: isActive ? 'text.secondary' : alpha(theme.palette.text.primary, 0.08),
                                        borderColor: 'text.primary',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                    },
                                    // Feedback - active state
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                                    }
                                }}
                            />
                        );
                    })}
                </Box>
                {/* Visibility & Affordances - Clear filter button with tooltip */}
                <Tooltip 
                    title="Opciones de filtrado avanzado" 
                    arrow 
                    placement="left"
                    TransitionComponent={Fade}
                >
                    <IconButton 
                        sx={{ 
                            display: { xs: 'none', md: 'flex' }, 
                            mb: 0.5,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: 'text.primary',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            // Feedback - hover effects
                            '&:hover': { 
                                bgcolor: 'text.primary',
                                color: 'background.paper',
                                borderColor: 'text.primary',
                                transform: 'rotate(180deg)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        }}
                        aria-label="Filtros avanzados"
                    >
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
             </Box>

             {/* Search Bar */}
             <Paper elevation={0} sx={{ p: 0.5, mb: 4, display: 'flex', alignItems: 'center', width: { xs: '100%', md: 400 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <InputAdornment position="start" sx={{ pl: 2, mr: 1 }}>
                    <SearchIcon color="action" />
                </InputAdornment>
                <TextField 
                    fullWidth
                    placeholder="Buscar cuentos..."
                    variant="standard"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
             </Paper>


            {/* Content Grid */}
            <Grid container spacing={3}>
                {data.map((story) => (
                    <Grid item xs={12} sm={6} lg={4} xl={3} key={story.id}>
                        <StoryCard 
                            story={story} 
                            onEdit={handleEditClick} 
                            onDelete={handleDeleteClick} 
                        />
                    </Grid>
                ))}
            </Grid>
            
            {data.length === 0 && (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                     <PendingIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                     <Typography color="text.secondary" fontWeight={500}>
                         No se encontraron cuentos con estos criterios.
                     </Typography>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={isOpen} 
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
                        onClick={handleConfirmDelete} 
                        variant="contained" 
                        color={dialongContent.color || 'error'}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, boxShadow: 'none' }}
                        autoFocus
                    >
                        {dialongContent.confirmText || 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};


export default AdminStories;
