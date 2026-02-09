import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    IconButton,
    useTheme,
    alpha,
    TextField,
    MenuItem,
    Select,
    Tooltip,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Skeleton,
    Divider,
    List,
    ListItem,
    ListItemText,
    Grid,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QuizIcon from '@mui/icons-material/Quiz';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import TableMain from '../../components/TableMain';
import { useAdminLessons } from '../../hooks/pages/useAdminLessons';
import { Link } from 'react-router-dom';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/ui/useDialog';
import { useCrudAdminLesson } from '../../hooks/api/useCrudAdminLesson';

const AdminLessons = () => {
    const theme = useTheme();

    const { searchQuery, setSearchQuery } = useAdminLessons();

    // Fetch real lessons from API with optimized state
    const {
        lessonData,
        lessons,
        loading,
        deleteLoading,
        deleteLesson,
        handleReloadLessons
    } = useCrudAdminLesson();

    const { code, message } = lessonData;

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    // State to track which lesson is being deleted
    const [lessonToDelete, setLessonToDelete] = useState(null);

    // State for filters
    const [levelFilter, setLevelFilter] = useState('');

    // State for lesson details dialog
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // State for client-side pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(() => {
        try {
            const saved = localStorage.getItem('adminLessons_rowsPerPage');
            return saved ? parseInt(saved, 10) : 5;
        } catch {
            return 5;
        }
    });

    useEffect(() => {
        localStorage.setItem('adminLessons_rowsPerPage', rowsPerPage.toString());
    }, [rowsPerPage]);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [searchQuery, levelFilter]);

    const handleConfirmDelete = async () => {
        if (!lessonToDelete) return;

        const result = await deleteLesson(lessonToDelete);

        if (result.success) {
            handleSetDataSnackbar({ message: result.message || 'Lección eliminada correctamente', type: 'success' });
        } else {
            handleSetDataSnackbar({ message: result.error || 'Error al eliminar la lección', type: 'error' });
        }

        handleCloseDialog();
        setLessonToDelete(null);
    };

    const handleDeleteClick = (lessonId) => {
        setLessonToDelete(lessonId);
        setDialongContent({
            title: "Eliminar Lección",
            message: "¿Estás seguro de que deseas eliminar esta lección? Esta acción no se puede deshacer.",
            confirmText: "Eliminar",
            color: "error"
        });
        handleOpenDialog();
    };

    const handleViewDetails = (lesson) => {
        setSelectedLesson(lesson);
        setDetailsDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsDialogOpen(false);
        setSelectedLesson(null);
    };

    // Extract unique levels from lessons
    const availableLevels = useMemo(() => {
        if (!lessons?.length) return [];
        const levels = [...new Set(lessons.map(lesson => lesson.level).filter(Boolean))];
        return levels.sort(); // Sort alphabetically
    }, [lessons]);

    // Filter lessons based on search query and level
    const normalizedQuery = (searchQuery ?? '').trim().toLowerCase();
    const filteredLessons = useMemo(() => {
        if (!lessons?.length) return [];
        return lessons.filter((lesson) => {
            const matchesSearch =
                !normalizedQuery ||
                lesson.title?.toLowerCase().includes(normalizedQuery) ||
                lesson.description?.toLowerCase().includes(normalizedQuery);

            const matchesLevel = !levelFilter || lesson.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [lessons, normalizedQuery, levelFilter]);

    // Calculate paginated lessons
    const paginatedLessons = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredLessons.slice(startIndex, endIndex);
    }, [filteredLessons, page, rowsPerPage]);

    // Custom Columns Definition for TableMain
    const columns = [

        {
            name: "id",
            label: "ID",
            options: {
                filter: false,
                sort: false,
                display: false,
            }
        },
        {
            name: "title",
            label: "Título de la Lección",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { transform: 'scale(1.1) rotate(-5deg)' }
                            }}>
                                <MenuBookIcon />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                    {value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block' }}>
                                    {paginatedLessons[tableMeta.rowIndex]?.exercises?.length || 0} ejercicios
                                </Typography>
                            </Box>
                        </Box>
                    );
                }
            }
        },
        {
            name: "description",
            label: "Descripción",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => (
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {value || 'Sin descripción'}
                    </Typography>
                )
            }
        },
        {
            name: "level",
            label: "Nivel",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    const getColors = (level) => {
                        if (level === 'Básico') return { bg: '#E3F2FD', color: '#1976D2', border: '#BBDEFB' }; // Blue
                        if (level === 'Intermedio') return { bg: '#FFF8E1', color: '#F57C00', border: '#FFE0B2' }; // Orange/Yellow
                        if (level === 'Avanzado') return { bg: '#E8F5E9', color: '#2E7D32', border: '#C8E6C9' }; // Green
                        return { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' };
                    };
                    const colors = getColors(value);
                    return (
                        <Chip
                            label={value}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                bgcolor: colors.bg,
                                color: colors.color,
                                border: '1px solid',
                                borderColor: colors.border,
                                borderRadius: 2,
                                minWidth: 80
                            }}
                        />
                    );
                }
            }
        },
        {
            name: "duration",
            label: "Duración",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => (
                    <Typography variant="body2" color="text.secondary">
                        {value} min
                    </Typography>
                )
            }
        },
        {
            name: "totalPoints",
            label: "Puntos",
            options: {
                filter: false,
                sort: true,
                customBodyRender: (value) => (
                    <Chip
                        label={value}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: 'warning.dark'
                        }}
                    />
                )
            }
        },

        {
            name: "actions",
            label: "Acciones",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta) => (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Ver detalles" arrow TransitionComponent={Fade}>
                            <IconButton
                                size="small"
                                onClick={() => handleViewDetails(paginatedLessons[tableMeta.rowIndex])}
                                sx={{
                                    width: 32, height: 32,
                                    bgcolor: '#F5F5F5',
                                    color: '#757575',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#E0E0E0', color: '#424242' }
                                }}>
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar lección" arrow TransitionComponent={Fade}>
                            <IconButton
                                size="small"
                                component={Link}
                                to={`/admin/lecciones/editar/${paginatedLessons[tableMeta.rowIndex]?.id}`}
                                sx={{
                                    width: 32, height: 32,
                                    bgcolor: '#F5F5F5',
                                    color: '#757575',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#E0E0E0', color: '#424242' }
                                }}
                            >
                                <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow TransitionComponent={Fade}>
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(paginatedLessons[tableMeta.rowIndex]?.id)}
                                sx={{
                                    width: 32, height: 32,
                                    bgcolor: '#F5F5F5',
                                    color: '#757575',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#FFEBEE', color: '#D32F2F' }
                                }}>
                                <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: 'background.default', minHeight: '100vh', transition: 'all 0.3s' }}>

            {/* Breadcrumbs - High Contrast */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: 'text.primary',
                                textDecoration: 'underline',
                                fontWeight: 700
                            }
                        }}
                    >
                        Admin
                    </Typography>
                </Link>
                <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                    Lecciones
                </Typography>
            </Box>

            {/* Header & Stats Section */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#2D3436', letterSpacing: '-0.03em', fontSize: '2.5rem' }}>
                    Gestión de Lecciones
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: '1.05rem', mb: 4 }}>
                    Organice las lecciones disponibles para los estudiantes. Agregue nuevo contenido o actualice el existente.
                </Typography>

                {/* Stats Cards - Moved to Top */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Card 1: Total */}
                    <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#FFFFFF', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35' }}>
                                <MenuBookIcon />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>LECCIONES TOTALES</Typography>
                            <Typography variant="h3" fontWeight={900} sx={{ color: '#2D3436' }}>{filteredLessons.length}</Typography>
                        </Box>
                    </Paper>
                    {/* Card 2: Published */}
                    <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#FFFFFF', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#009688' }}>
                                <CheckCircleIcon />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>PUBLICADAS</Typography>
                            <Typography variant="h3" fontWeight={900} sx={{ color: '#2D3436' }}>
                                {lessons?.filter(l => l.is_active || l.status === 'published').length || 0}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Toolbar: Search and Actions */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
                {/* Search Bar - Clean & Wide */}
                <Paper elevation={0} sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: { xs: '100%', md: 400 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <IconButton sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <TextField
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar por título de lección, temas..."
                        variant="standard"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                    />
                </Paper>

                {/* Right Side: Filters & Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', md: 'flex-end' } }}>
                    {/* Level Filter - Dynamic */}
                    <Select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            bgcolor: 'white',
                            height: 48,
                            fontWeight: 600,
                            minWidth: 160,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' }
                        }}
                    >
                        <MenuItem value="">Todos los niveles</MenuItem>
                        {availableLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </Select>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Refresh Button - Circular & Next to New */}
                        <Tooltip title="Recargar datos">
                            <IconButton
                                onClick={handleReloadLessons}
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

                        {/* New Lesson Button */}
                        <Button
                            component={Link}
                            to="/admin/lecciones/crear"
                            variant="contained"
                            startIcon={<AddCircleIcon />}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 800,
                                height: 44,
                                px: 3,
                                bgcolor: '#3E2723', // Dark Brown from screenshot
                                color: 'white',
                                '&:hover': { bgcolor: '#2D1E1B' }
                            }}
                        >
                            Nueva Lección
                        </Button>
                    </Box>
                </Box>
            </Box>


            {/* Loading State */}
            {loading && (
                <Skeleton width="100%" height={400} variant="rounded" sx={{ borderRadius: 4 }} />
            )}

            {!loading && code !== 'COD_OK' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {message || 'Error al cargar las lecciones'}
                </Alert>
            )}

            {/* Data Table */}
            {!loading && code === 'COD_OK' && (
                <Box sx={{
                    '& .MuiPaper-root': { boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider', borderRadius: '16px 16px 0 0', borderBottom: 'none', overflow: 'hidden' },
                    '& .MuiTableCell-head': { bgcolor: alpha(theme.palette.background.paper, 0.5), fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: '0.05em' },
                    '& .MuiTableRow-root': { transition: 'bgcolor 0.2s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }
                }}>
                    <TableMain
                        title=""
                        data={paginatedLessons}
                        columns={columns}
                        options={{
                            elevation: 0,
                            selectableRows: 'none',
                            search: false,
                            filter: false,
                            viewColumns: false,
                            print: false,
                            download: false,
                            pagination: false,
                        }}
                    />
                </Box>
            )}

            {/* Pagination - Custom Client Side */}
            {!loading && code === 'COD_OK' && (() => {
                const totalItems = filteredLessons.length;
                const totalPages = Math.ceil(totalItems / rowsPerPage);
                const hasItems = totalItems > 0;
                const startItem = hasItems ? page * rowsPerPage + 1 : 0;
                const endItem = hasItems ? Math.min((page + 1) * rowsPerPage, totalItems) : 0;

                return (
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', flexWrap: 'wrap', gap: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Mostrando <Box component="span" fontWeight="bold" color="text.primary">{startItem} - {endItem}</Box> de <Box component="span" fontWeight="bold" color="text.primary">{totalItems}</Box> lecciones
                            </Typography>
                        </Box>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    size="small"
                                    disabled={page === 0}
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    sx={{ border: '1px solid', borderColor: 'divider' }}
                                >
                                    <ChevronRightIcon sx={{ transform: 'rotate(180deg)', fontSize: 20 }} />
                                </IconButton>

                                {/* Generate page buttons dynamically */}
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum; // 0-indexed for logic, but we display +1
                                    const currentPage = page; // 0-indexed

                                    if (totalPages <= 5) {
                                        pageNum = i;
                                    } else if (currentPage <= 2) {
                                        pageNum = i;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "contained" : "text"}
                                            size="small"
                                            onClick={() => setPage(pageNum)}
                                            sx={{
                                                minWidth: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                px: 0,
                                                bgcolor: currentPage === pageNum ? 'primary.main' : 'transparent',
                                                color: currentPage === pageNum ? 'white' : 'text.secondary',
                                                fontWeight: 'bold',
                                                boxShadow: currentPage === pageNum ? theme.shadows[4] : 'none',
                                                '&:hover': {
                                                    bgcolor: currentPage === pageNum ? 'primary.dark' : 'action.hover'
                                                }
                                            }}
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    );
                                })}

                                <IconButton
                                    size="small"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    sx={{ border: '1px solid', borderColor: 'divider' }}
                                >
                                    <ChevronRightIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        )}
                    </Paper>
                );
            })()}






            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isOpen}
                onClose={deleteLoading ? undefined : handleCloseDialog}
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
                        disabled={deleteLoading}
                        sx={{ fontWeight: 'bold', color: 'text.secondary' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color={dialongContent.color || 'error'}
                        disabled={deleteLoading}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, boxShadow: 'none' }}
                        autoFocus
                    >
                        {deleteLoading ? 'Eliminando...' : (dialongContent.confirmText || 'Eliminar')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Lesson Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, maxHeight: '90vh' } }}
            >
                <DialogTitle sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MenuBookIcon />
                        </Box>
                        <Typography variant="h6" fontWeight={800}>
                            Detalles de la Lección
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseDetails} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedLesson && (
                        <Box>
                            {/* Basic Information */}
                            <Box sx={{ mb: 3 }}>
                                {selectedLesson.image && (
                                    <Box sx={{
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        mb: 3,
                                        boxShadow: 2
                                    }}>
                                        <img
                                            src={selectedLesson.image}
                                            alt={selectedLesson.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )}

                                <Typography variant="h5" fontWeight={800} gutterBottom color="text.primary">
                                    {selectedLesson.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {selectedLesson.description}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Metadata Grid */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6} sm={3}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                                            Nivel
                                        </Typography>
                                        <Chip
                                            label={selectedLesson.level}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                                            Duración
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800}>
                                            {selectedLesson.duration} min
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                                            Puntos
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="warning.dark">
                                            {selectedLesson.totalPoints}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                                            Ejercicios
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="success.dark">
                                            {selectedLesson.exercises?.length || 0}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Content Section */}
                            {selectedLesson.content && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LibraryBooksIcon color="primary" />
                                        Contenido
                                    </Typography>

                                    {selectedLesson.content.intro && (
                                        <Paper elevation={0} sx={{
                                            p: 3,
                                            mb: 3,
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <InfoIcon fontSize="small" color="primary" />
                                                Introducción
                                            </Typography>
                                            <Typography variant="body2" color="text.primary" sx={{
                                                whiteSpace: 'pre-line',
                                                lineHeight: 1.6,
                                                bgcolor: 'background.default',
                                                p: 2,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}>
                                                {selectedLesson.content.intro}
                                            </Typography>
                                        </Paper>
                                    )}

                                    {selectedLesson.content.videoUrl && (
                                        <Paper elevation={0} sx={{
                                            p: 3,
                                            mb: 3,
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <VideoLibraryIcon fontSize="small" color="primary" />
                                                Video URL
                                            </Typography>
                                            <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', bgcolor: 'background.default', p: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                                {selectedLesson.content.videoUrl}
                                            </Typography>
                                        </Paper>
                                    )}

                                    {selectedLesson.content.text && (
                                        <Paper elevation={0} sx={{
                                            p: 3,
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <ArticleIcon fontSize="small" color="primary" />
                                                Contenido Principal
                                            </Typography>
                                            <Typography variant="body2" color="text.primary" sx={{
                                                whiteSpace: 'pre-line',
                                                lineHeight: 1.8,
                                                bgcolor: 'background.default',
                                                p: 2,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}>
                                                {selectedLesson.content.text}
                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            {/* Exercises Section */}
                            {selectedLesson.exercises && selectedLesson.exercises.length > 0 && (
                                <Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <QuizIcon color="primary" />
                                        Ejercicios ({selectedLesson.exercises.length})
                                    </Typography>

                                    {selectedLesson.exercises.map((exercise, index) => (
                                        <Paper
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                mb: 2,
                                                bgcolor: 'background.default',
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                                <Chip
                                                    label={`#${index + 1}`}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700,
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        minWidth: 40
                                                    }}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    <Chip
                                                        label={
                                                            exercise.type === 'multiple_choice' ? 'Opción Múltiple' :
                                                                exercise.type === 'true_false' ? 'Verdadero/Falso' :
                                                                    'Pregunta'
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mb: 1, fontWeight: 600 }}
                                                    />
                                                    <Typography variant="body1" fontWeight={700} color="text.primary" gutterBottom>
                                                        {exercise.question}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {exercise.options && exercise.options.length > 0 && (
                                                <Box sx={{ ml: 6, mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                                                        Opciones:
                                                    </Typography>
                                                    <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                        {exercise.options.map((option, optIndex) => (
                                                            <ListItem
                                                                key={optIndex}
                                                                sx={{
                                                                    bgcolor: exercise.correctAnswer === option
                                                                        ? alpha(theme.palette.success.main, 0.1)
                                                                        : 'transparent',
                                                                    borderRadius: 1,
                                                                    mb: 0.5
                                                                }}
                                                            >
                                                                <ListItemText
                                                                    primary={option}
                                                                    primaryTypographyProps={{
                                                                        variant: 'body2',
                                                                        fontWeight: exercise.correctAnswer === option ? 700 : 400,
                                                                        color: exercise.correctAnswer === option ? 'success.dark' : 'text.primary'
                                                                    }}
                                                                />
                                                                {exercise.correctAnswer === option && (
                                                                    <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', ml: 1 }} />
                                                                )}
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}

                                            {exercise.tip && (
                                                <Box sx={{ ml: 6, p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, borderLeft: '3px solid', borderColor: 'info.main' }}>
                                                    <Typography variant="caption" color="info.dark" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                                                        💡 Pista:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {exercise.tip}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', gap: 2 }}>
                    <Button
                        onClick={handleCloseDetails}
                        variant="outlined"
                        size="large"
                        color="inherit"
                        sx={{
                            fontWeight: 800,
                            borderRadius: 2,
                            borderWidth: 2,
                            borderColor: 'text.secondary',
                            color: 'text.secondary',
                            px: 3,
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: 'text.primary',
                                color: 'text.primary',
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        Cerrar
                    </Button>
                    <Button
                        component={Link}
                        to={`/admin/lecciones/editar/${selectedLesson?.id}`}
                        variant="contained"
                        size="large"
                        startIcon={<EditIcon />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            px: 4,
                            py: 1,
                            boxShadow: 4,
                            bgcolor: 'text.primary', // Dark brown background
                            color: 'white',          // White text
                            '&:hover': {
                                bgcolor: 'text.secondary',
                                boxShadow: 6,
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s'
                        }}
                    >
                        Editar Lección
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AdminLessons;
