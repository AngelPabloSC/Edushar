import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,
    Select,
    MenuItem,
    Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';
import SpeedIcon from '@mui/icons-material/Speed';
import ChatIcon from '@mui/icons-material/Chat';
import ClearIcon from '@mui/icons-material/Clear';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import Fade from '@mui/material/Fade';


import TableMain from '../../components/TableMain';
import { useAdminDictionary } from '../../hooks/pages/useAdminDictionary';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/ui/useDialog';

const AdminDictionary = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {
        entries,
        stats,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        deleteEntry,
        refetch
    } = useAdminDictionary();

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const handleViewClick = (entry) => {
        setSelectedEntry(entry);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedEntry(null);
    };
    
    // Pagination State (Persisted)
    const [page, setPage] = useState(() => {
        const savedPage = sessionStorage.getItem('adminDictionaryPage');
        return savedPage ? Number(savedPage) : 0;
    });
    const [rowsPerPage, setRowsPerPage] = useState(() => {
        const savedRows = sessionStorage.getItem('adminDictionaryRowsPerPage');
        return savedRows ? Number(savedRows) : 10;
    });

    const isFirstRun = useRef(true);

    // Reset page when filters change
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        setPage(0);
    }, [searchTerm, categoryFilter]);

    // Save pagination state
    useEffect(() => {
        sessionStorage.setItem('adminDictionaryPage', page);
    }, [page]);

    useEffect(() => {
        sessionStorage.setItem('adminDictionaryRowsPerPage', rowsPerPage);
    }, [rowsPerPage]);

    // Categorías con iconos y colores (Mapping + Visibility)
    const categoryConfig = {
        'Sustantivo': { color: '#1976d2', icon: <PersonIcon fontSize="small" />, bgColor: '#e3f2fd' },
        'Verbo': { color: '#d32f2f', icon: <DirectionsRunIcon fontSize="small" />, bgColor: '#ffebee' },
        'Adjetivo': { color: '#388e3c', icon: <StarIcon fontSize="small" />, bgColor: '#e8f5e9' },
        'Adverbio': { color: '#f57c00', icon: <SpeedIcon fontSize="small" />, bgColor: '#fff3e0' },
        'Expresión': { color: '#7b1fa2', icon: <ChatIcon fontSize="small" />, bgColor: '#f3e5f5' },
    };

    const categories = ['Todos', 'Sustantivo', 'Verbo', 'Adjetivo', 'Adverbio', 'Expresión'];
    
    // Paginated Data
    const paginatedEntries = entries.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Manejar eliminación
    const handleDeleteClick = (entry) => {
        setSelectedEntry(entry);
        setDialongContent({
            title: "Eliminar Palabra",
            message: `¿Estás seguro de que deseas eliminar la palabra "${entry.wordShuar}" (${entry.wordSpanish})?`,
            confirmText: "Eliminar",
            color: "error"
        });
        handleOpenDialog();
    };

    const handleConfirmDelete = () => {
        if (selectedEntry) {
            deleteEntry(selectedEntry.id);
            handleSetDataSnackbar({ 
                message: `Palabra "${selectedEntry.wordShuar}" eliminada exitosamente`, 
                type: 'success' 
            });
            handleCloseDialog();
            setSelectedEntry(null);
        }
    };

    // Columnas de la tabla
    const columns = [
        {
            name: 'wordShuar',
            label: 'Palabra Shuar',
            options: {
                customBodyRender: (value, tableMeta) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box sx={{ 
                             width: 40, 
                             height: 40, 
                             borderRadius: 2.5, 
                             background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`, 
                             color: 'primary.main',
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}>
                             <BookIcon fontSize="small" />
                        </Box>
                        <Box>
                             <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                 {value}
                             </Typography>
                             <Typography variant="caption" color="text.secondary">
                                 {entries[tableMeta.rowIndex]?.category || 'General'}
                             </Typography>
                        </Box>
                    </Box>
                ),
            },
        },
        {
            name: 'wordSpanish',
            label: 'Traducción',
            options: {
                customBodyRender: (value) => (
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                        {value}
                    </Typography>
                ),
            },
        },
        {
            name: 'category',
            label: 'Categoría',
            options: {
                customBodyRender: (value) => {
                    const config = categoryConfig[value] || {};
                    return (
                        <Chip 
                            icon={config.icon}
                            label={value} 
                            size="small"
                            variant="outlined" 
                            sx={{ 
                                bgcolor: 'transparent',
                                color: 'text.secondary',
                                fontWeight: 600,
                                borderColor: 'divider',
                                '& .MuiChip-icon': {
                                    color: config.color || 'text.secondary'
                                }
                            }} 
                        />
                    );
                },
            },
        },
        {
            name: 'exampleShuar',
            label: 'Ejemplo de Uso',
            options: {
                customBodyRender: (value) => (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            fontStyle: 'italic',
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        "{value || 'Sin ejemplo'}"
                    </Typography>
                ),
            },
        },
        {
            name: 'status',
            label: 'Estado',
            options: {
                customBodyRender: (value) => (
                    <Chip 
                        label={value} 
                        size="small" 
                        sx={{ 
                            fontWeight: 700,
                            bgcolor: value === 'Publicado' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                            color: value === 'Publicado' ? 'success.dark' : 'warning.dark'
                         }} 
                    />
                ),
            },
        },
        {
            name: 'actions',
            label: 'Acciones',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const entry = paginatedEntries[tableMeta.rowIndex];
                     // Verify entry exists to avoid crashes on pagination edge cases if data changes
                    if (!entry) return null;

                    return (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="Ver Detalles" arrow TransitionComponent={Fade}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleViewClick(entry)}
                                    sx={{ 
                                        color: 'text.secondary',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            color: 'primary.main',
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            transform: 'translateY(-2px)'
                                        },
                                    }}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar" arrow TransitionComponent={Fade}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => navigate(`/admin/diccionario/editar/${entry.id}`)}
                                    sx={{ 
                                        color: 'text.secondary',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            color: 'info.main',
                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                            transform: 'translateY(-2px)'
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar" arrow TransitionComponent={Fade}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteClick(entry)}
                                    sx={{ 
                                        color: 'text.secondary',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            color: 'error.main',
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            transform: 'translateY(-2px)'
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                },
            },
        },
    ];

    const options = {
        elevation: 0,
        selectableRows: 'none',
        search: false, 
        filter: false, 
        viewColumns: false,
        print: false,
        download: false,
        pagination: false,
    };

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: 'background.default', minHeight: '100vh', transition: 'all 0.3s' }}>
             {/* Breadcrumbs */}
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        fontWeight={600} 
                        sx={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.2s',
                            '&:hover': { color: 'text.primary', textDecoration: 'underline' } 
                        }}
                    >
                        Admin
                    </Typography>
                </Link>
                <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.primary" fontWeight={700}>
                    Diccionario
                </Typography>
            </Box>

            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', gap: 2, mb: 6 }}>
                <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#111827', letterSpacing: '-0.03em' }}>
                        Gestión de Diccionario
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Administra el vocabulario, categorías gramaticales y traducciones del sistema.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Recargar datos">
                        <IconButton
                            onClick={refetch}
                            sx={{ 
                                borderRadius: 3,
                                width: 44,
                                height: 44,
                                border: '1px solid',
                                borderColor: 'divider',
                                color: 'text.secondary',
                                bgcolor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                '&:hover': { 
                                    bgcolor: 'text.primary', 
                                    color: 'white',
                                    borderColor: 'text.primary',
                                    transform: 'rotate(180deg)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={() => navigate('/admin/diccionario/crear')}
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 800,
                            py: 1.5, px: 3,
                            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            '&:hover': {
                                bgcolor: 'text.secondary',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                            }
                        }}
                    >
                        Nueva Palabra
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.dark' }}>
                        <BookIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.total}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.dark' }}>
                        <DirectionsRunIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verbos</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.byCategory?.verbo || 0}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.warning.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'warning.dark' }}>
                        <StarIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Adjetivos</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.byCategory?.adjetivo || 0}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.info.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'info.dark' }}>
                        <PersonIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sustantivos</Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.byCategory?.sustantivo || 0}</Typography>
                    </Box>
                </Paper>
            </Box>

             {/* Custom Search & Filter Toolbar */}
             <Paper elevation={0} sx={{ 
                p: 1.5, mb: 4, borderRadius: 4, 
                border: '1px solid', borderColor: 'rgba(0,0,0,0.05)', 
                display: 'flex', flexDirection: { xs: 'column', md: 'row' }, 
                gap: 2, alignItems: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)'
                }}>
                <Box sx={{ position: 'relative', flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', px: 2 }}>
                    <SearchIcon color="action" sx={{ mr: 2 }} />
                    <TextField 
                        fullWidth
                        placeholder="Buscar palabra..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: '1rem', fontWeight: 500 },
                             endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}><ClearIcon fontSize="small"/></IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, p: 0.5 }}>
                     <Select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        displayEmpty
                        variant="standard"
                        disableUnderline
                        sx={{ 
                            bgcolor: 'transparent', 
                            borderRadius: 3, 
                            px: 3, py: 1.5, 
                            minWidth: 180,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider',
                            '& .MuiSelect-select': { py: 0 },
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                        }}
                    >
                         {categories.map((cat) => (
                             <MenuItem key={cat} value={cat}>
                                 {cat === 'Todos' ? 'Todas las Categorías' : cat}
                             </MenuItem>
                         ))}
                     </Select>
                </Box>
            </Paper>

            {/* Loading State */}
            {loading && (
                <Skeleton width="100%" height={400} variant="rounded" sx={{ borderRadius: 4 }} />
            )}

            {/* Table */}
            {!loading && (
                <>
                    <Box sx={{ 
                        '& .MuiPaper-root': { boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider', borderRadius: '16px 16px 0 0', borderBottom: 'none', overflow: 'hidden' },
                        '& .MuiTableCell-head': { bgcolor: alpha(theme.palette.background.paper, 0.5), fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: '0.05em' },
                        '& .MuiTableRow-root': { transition: 'bgcolor 0.2s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }
                    }}>
                        <TableMain
                            title=""
                            data={paginatedEntries}
                            columns={columns}
                            options={options}
                        />
                    </Box>

             {/* Pagination Client Side */}
             {(() => {
                const totalItems = entries.length;
                const totalPages = Math.ceil(totalItems / rowsPerPage);
                const startItem = page * rowsPerPage + 1;
                const endItem = Math.min((page + 1) * rowsPerPage, totalItems);
                
                if (totalItems === 0) return null;

                return (
                <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', flexWrap: 'wrap', gap: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Mostrando <Box component="span" fontWeight="bold" color="text.primary">{startItem} - {endItem}</Box> de <Box component="span" fontWeight="bold" color="text.primary">{totalItems}</Box> palabras
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, borderLeft: '1px solid', borderColor: 'divider', pl: 2 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Filas:
                            </Typography>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                    setPage(0);
                                }}
                                variant="standard"
                                disableUnderline
                                sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 700,
                                    '& .MuiSelect-select': { py: 0, pr: '24px !important' } 
                                }}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                    
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
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum; 
                        const currentPage = page;
                        
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
                </>
            )}


            {/* View Detail Dialog */}
             <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
            >
                {selectedEntry && (
                    <>
                        <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedEntry.image ? (
                                <Box component="img" src={selectedEntry.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.disabled' }}>
                                    <BookIcon sx={{ fontSize: 64, mb: 1, opacity: 0.2 }} />
                                    <Typography variant="caption" fontWeight={700}>Sin imagen</Typography>
                                </Box>
                            )}
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)' }} />
                            <IconButton 
                                onClick={handleCloseViewDialog}
                                sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
                            >
                                <ClearIcon />
                            </IconButton>
                            <Box sx={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                                <Chip 
                                    label={selectedEntry.category} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.9)', 
                                        color: 'text.primary', 
                                        fontWeight: 800, 
                                        mb: 1,
                                        backdropFilter: 'blur(4px)'
                                    }} 
                                />
                                <Typography variant="h4" fontWeight={900} color="white" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                    {selectedEntry.wordShuar}
                                </Typography>
                                 <Typography variant="h6" color="rgba(255,255,255,0.9)" fontWeight={500} sx={{ fontStyle: 'italic', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                    {selectedEntry.wordSpanish}
                                </Typography>
                            </Box>
                        </Box>
                        <DialogContent sx={{ p: 4 }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                                    Ejemplo de Uso
                                </Typography>
                                <Box sx={{ mt: 2, p: 3, bgcolor: 'rgba(209, 154, 74, 0.08)', borderRadius: 3, borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                                     <Typography variant="body1" fontWeight={600} color="text.primary" gutterBottom sx={{ fontStyle: 'italic' }}>
                                        "{selectedEntry.exampleShuar || 'Sin ejemplo'}"
                                    </Typography>
                                    {selectedEntry.exampleSpanish && (
                                         <Typography variant="body2" color="text.secondary">
                                            {selectedEntry.exampleSpanish}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<EditIcon />}
                                    onClick={() => {
                                        handleCloseViewDialog();
                                        navigate(`/admin/diccionario/editar/${selectedEntry.id}`);
                                    }}
                                    sx={{ fontWeight: 700, borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                                >
                                    Editar
                                </Button>
                             </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>

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
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color={dialongContent.color || 'primary'}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, boxShadow: 'none' }}
                        autoFocus
                    >
                        {dialongContent.confirmText || 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDictionary;
