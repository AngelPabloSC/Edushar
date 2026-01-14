import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import TableMain from '../../components/TableMain';
import { useAdminDictionary } from '../../hooks/pages/useAdminDictionary';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/useDialog';

const AdminDictionary = () => {
    const navigate = useNavigate();
    const {
        entries,
        stats,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        deleteEntry,
    } = useAdminDictionary();

    const { handleSetDataSnackbar } = useSnackBarContext();
    const { isOpen: isDialogOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

    const [selectedEntry, setSelectedEntry] = useState(null);

    // Categorías con iconos y colores (Mapping + Visibility)
    const categoryConfig = {
        'Sustantivo': { color: '#1976d2', icon: <PersonIcon fontSize="small" />, bgColor: '#e3f2fd' },
        'Verbo': { color: '#d32f2f', icon: <DirectionsRunIcon fontSize="small" />, bgColor: '#ffebee' },
        'Adjetivo': { color: '#388e3c', icon: <StarIcon fontSize="small" />, bgColor: '#e8f5e9' },
        'Adverbio': { color: '#f57c00', icon: <SpeedIcon fontSize="small" />, bgColor: '#fff3e0' },
        'Expresión': { color: '#7b1fa2', icon: <ChatIcon fontSize="small" />, bgColor: '#f3e5f5' },
    };

    const categories = ['Todos', 'Sustantivo', 'Verbo', 'Adjetivo', 'Adverbio', 'Expresión'];
    const statuses = ['Todos', 'Publicado', 'Borrador'];

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
                customBodyRender: (value) => (
                    <Typography fontWeight={800} color="text.primary" sx={{ fontSize: '1.05rem' }}>
                        {value}
                    </Typography>
                ),
            },
        },
        {
            name: 'wordSpanish',
            label: 'Español',
            options: {
                customBodyRender: (value) => (
                    <Typography fontWeight={600}>
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
                            sx={{ 
                                bgcolor: config.bgColor || 'grey.100',
                                color: config.color || 'text.primary',
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                    color: config.color || 'text.primary'
                                }
                            }} 
                        />
                    );
                },
            },
        },
        {
            name: 'exampleShuar',
            label: 'Ejemplo',
            options: {
                customBodyRender: (value) => (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            fontStyle: 'italic',
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {value}
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
                        color={value === 'Publicado' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }} 
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
                    const entry = entries[tableMeta.rowIndex];
                    return (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver detalles" arrow>
                                <IconButton 
                                    size="small" 
                                    sx={{ 
                                        color: 'info.main',
                                        '&:hover': { 
                                            bgcolor: 'info.light',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar término" arrow>
                                <IconButton 
                                    size="small" 
                                    onClick={() => navigate(`/admin/diccionario/editar/${entry.id}`)}
                                    sx={{ 
                                        color: 'warning.main',
                                        '&:hover': { 
                                            bgcolor: 'warning.light',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar permanentemente" arrow>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleDeleteClick(entry)}
                                    sx={{ 
                                        color: 'error.main',
                                        '&:hover': { 
                                            bgcolor: 'error.light',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s'
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
        filterType: 'checkbox',
        selectableRows: 'none',
        responsive: 'standard',
        elevation: 0,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50],
        setRowProps: (row, dataIndex) => ({
            style: {
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            },
            onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            },
            onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            },
        }),
        textLabels: {
            body: {
                noMatch: "No se encontraron palabras",
                toolTip: "Ordenar",
            },
            pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver Columnas",
                filterTable: "Filtrar Tabla",
            },
            filter: {
                all: "Todos",
                title: "FILTROS",
                reset: "REINICIAR",
            },
        },
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={900} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        Gestión de Diccionario
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Administra las palabras y traducciones del diccionario Shuar-Español
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/diccionario/crear')}
                    sx={{
                        borderRadius: 3,
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

            {/* Stats Cards - Improved Visibility + Feedback */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
                <Paper elevation={0} sx={{ 
                    p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BookIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL PALABRAS</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={900} color="primary.main">{stats.total}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ 
                    p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>PUBLICADAS</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={900} color="success.main">{stats.published}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ 
                    p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DescriptionIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>BORRADORES</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={900} color="warning.main">{stats.draft}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ 
                    p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                    transition: 'all 0.3s',
                    '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ color: 'info.main', fontSize: 20 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>SUSTANTIVOS</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={900} color="info.main">{stats.byCategory.sustantivo}</Typography>
                </Paper>
            </Box>

            {/* Search & Filters */}
            <Paper elevation={0} sx={{
                p: 1.5, mb: 4, borderRadius: 4,
                border: '1px solid', borderColor: 'rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: { xs: 'column', md: 'row' },
                gap: 2, alignItems: 'center',
                bgcolor: 'background.paper'
            }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por palabra en Shuar o Español..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton 
                                    size="small" 
                                    onClick={() => setSearchTerm('')}
                                    sx={{ 
                                        '&:hover': { 
                                            bgcolor: 'error.light',
                                            color: 'error.main'
                                        }
                                    }}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'background.default',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
                            }
                        }
                    }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minWidth: { md: 'auto' } }}>
                    {categories.map((cat) => {
                        const config = categoryConfig[cat];
                        const isActive = categoryFilter === cat;
                        const isTodos = cat === 'Todos';
                        return (
                            <Chip
                                key={cat}
                                icon={config?.icon}
                                label={cat}
                                onClick={() => setCategoryFilter(cat)}
                                sx={{
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    bgcolor: isActive ? (isTodos ? 'text.primary' : (config?.bgColor || 'primary.light')) : 'grey.100',
                                    color: isActive ? (isTodos ? 'white' : (config?.color || 'primary.main')) : 'text.secondary',
                                    border: isActive ? `2px solid ${isTodos ? 'text.primary' : (config?.color || 'primary.main')}` : '2px solid transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    },
                                    '& .MuiChip-icon': {
                                        color: isActive ? (isTodos ? 'white' : (config?.color || 'primary.main')) : 'text.secondary'
                                    }
                                }}
                            />
                        );
                    })}
                </Box>
            </Paper>

            {/* Table */}
            <TableMain
                title="Palabras del Diccionario"
                data={entries}
                columns={columns}
                options={options}
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
