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
    Chip,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate, Link
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

import { useAdminStories } from '@features/admin/hooks/useAdminStories';
import { useDialog } from '../../../shared/hooks/useDialog';
import { useSnackBarContext } from '@shared/context/SnackbarContext';
import StoryCard from '@shared/components/cards/StoryCard';

const AdminStories = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        data,
        activeTab,
        handleTabChange,
        searchQuery,
        setSearchQuery,
        handleDelete,
        loading,
        handleReloadStories,
        uniqueCategories
    } = useAdminStories();

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen, dialogContent, handleOpenDialog, handleCloseDialog, setDialogContent } = useDialog();

    // Delete State
    const [deleteId, setDeleteId] = useState(null);

    const handleEditClick = (story) => {
        navigate(`/admin/cuentos/editar/${story.id}`);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setDialogContent({
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
        <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#3E2723', letterSpacing: '-0.02em', fontSize: '2.5rem' }}>
                        Gestión de Cuentos
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: '1rem', lineHeight: 1.5 }}>
                        Administra el repositorio bilingüe de la comunidad Shuar. Crea y edita mitos, leyendas y fábulas.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Refresh Button Grouped */}
                    <Tooltip title="Recargar datos">
                        <IconButton
                            onClick={handleReloadStories}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'divider',
                                width: 44,
                                height: 44,
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'action.hover', color: 'text.primary' }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>

                    <Button
                        component={Link}
                        to="/admin/cuentos/crear"
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            height: 44,
                            px: 3,
                            bgcolor: '#3E2723', // Dark brown
                            color: 'white',
                            '&:hover': { bgcolor: '#2D1E1B' }
                        }}
                    >
                        Agregar cuento
                    </Button>
                </Box>
            </Box>

            {/* Filters - Pill Style */}
            <Box sx={{ mb: 4, display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                {['Todos', ...uniqueCategories].map((tab) => {
                    // Capitalize first letter for display if needed, but if data is already normalized, just display
                    // Let's assume data might be lowercase 'mito', display as 'Mito'
                    const displayLabel = tab.charAt(0).toUpperCase() + tab.slice(1);
                    
                    const isActive = activeTab === tab || (activeTab === 'Todos' && tab === 'Todos');
                    // wait, activeTab is state. If I click 'Mito', activeTab='Mito'. 
                    
                    return (
                        <Button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            variant={activeTab === tab ? "contained" : "outlined"}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: activeTab === tab ? 700 : 600,
                                px: 3,
                                py: 0.8,
                                minWidth: 'auto',
                                bgcolor: activeTab === tab ? '#3E2723' : 'white',
                                color: activeTab === tab ? 'white' : 'text.secondary',
                                border: activeTab === tab ? 'none' : '1px solid',
                                borderColor: 'divider',
                                boxShadow: activeTab === tab ? '0 4px 12px rgba(62, 39, 35, 0.2)' : 'none',
                                '&:hover': {
                                    bgcolor: activeTab === tab ? '#2D1E1B' : '#FAFAFA',
                                    borderColor: 'text.primary',
                                    color: activeTab === tab ? 'white' : 'text.primary'
                                }
                            }}
                        >
                            {displayLabel}
                        </Button>
                    );
                })}
            </Box>

            {/* Search Bar - Clean White */}
            <Paper elevation={0} sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', md: 450 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                mb: 5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
                <IconButton sx={{ p: '10px', color: 'text.secondary' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <TextField
                    fullWidth
                    placeholder="Buscar cuentos..."
                    variant="standard"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '0.95rem' }
                    }}
                />
            </Paper>


            {/* Content Grid - Custom Cards */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: '#3E2723' }} />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {data.map((story) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={story.id} sx={{ display: 'flex' }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        bgcolor: 'white',
                                        transition: 'all 0.2s',
                                        border: '1px solid',
                                        borderColor: 'transparent',
                                        height: '100%', // Enforce full height
                                        display: 'flex', // Flex layout
                                        flexDirection: 'column', // Column direction
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                                            borderColor: 'divider'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 220, // Fixed height strictly enforced
                                        bgcolor: '#EAEAEA', // Placeholder Gray
                                        overflow: 'hidden',
                                        flexShrink: 0 // Prevent shrinking
                                    }}>
                                        <Box
                                            component="img"
                                            src={story.cover}
                                            alt={story.title?.es}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: story.cover ? 'block' : 'none'
                                            }}
                                        />

                                        {/* Status Badges Overlay */}
                                        <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1, zIndex: 1 }}>
                                            <Chip
                                                label={story.category.toUpperCase()}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    bgcolor: '#D7CCC8', // Light Brown
                                                    color: '#5D4037', // Dark Brown Text
                                                    borderRadius: 1
                                                }}
                                            />
                                            <Chip
                                                label="PUBLICADO"
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    bgcolor: '#2ECC71', // Bright Green
                                                    color: 'white',
                                                    borderRadius: 1
                                                }}
                                            />
                                        </Box>

                                        {/* Options Menu Button (Mock) */}
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: 'white',
                                                width: 32,
                                                height: 32,
                                                '&:hover': { bgcolor: '#F5F5F5' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                                                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                                                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                                            </Box>
                                        </IconButton>
                                    </Box>

                                    {/* Card Content */}
                                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.5, color: '#2D3436' }}>
                                            {story.title?.es || 'Título en español'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#00B894', fontWeight: 600, fontStyle: 'italic', mb: 2 }}>
                                            Shuar / Español
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <Box sx={{ color: '#E67E22', display: 'flex' }}>
                                                {/* Simple Person Icon */}
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                {story.author || 'Nombre del autor'}
                                            </Typography>
                                        </Box>

                                        {/* Card Actions - Pushed to Bottom */}
                                        <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleEditClick(story)}
                                                startIcon={<Box component="span" sx={{ fontSize: 16 }}>✎</Box>}
                                                sx={{
                                                    bgcolor: '#3E2723',
                                                    color: 'white',
                                                    boxShadow: 'none',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    borderRadius: 2,
                                                    py: 1,
                                                    '&:hover': { bgcolor: '#2D1E1B', boxShadow: 'none' }
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleDeleteClick(story.id)}
                                                startIcon={<Box component="span" sx={{ fontSize: 16 }}>🗑️</Box>}
                                                sx={{
                                                    bgcolor: '#F5F5F5',
                                                    color: 'text.secondary',
                                                    boxShadow: 'none',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    borderRadius: 2,
                                                    py: 1,
                                                    '&:hover': { bgcolor: '#EEEEEE', boxShadow: 'none' }
                                                }}
                                            >
                                                Borrar
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {data.length === 0 && (
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Typography color="text.secondary" fontWeight={500}>
                                No se encontraron cuentos con estos criterios.
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isOpen}
                onClose={handleCloseDialog}
                PaperProps={{ sx: { borderRadius: 3, p: 2, maxWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: '900', textAlign: 'center' }}>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" textAlign="center">
                        {dialogContent.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2, fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color={dialogContent.color || 'error'}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, boxShadow: 'none' }}
                        autoFocus
                    >
                        {dialogContent.confirmText || 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};


export default AdminStories;
