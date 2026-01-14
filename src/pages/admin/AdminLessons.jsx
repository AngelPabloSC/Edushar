import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TableMain from '../../components/TableMain';
import { useAdminLessons } from '../../hooks/pages/useAdminLessons';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import { useDialong } from '../../hooks/useDialog';

const iconMap = {
  menu_book: <MenuBookIcon />,
  calculate: <CalculateIcon />,
  family_history: <FamilyRestroomIcon />,
  restaurant: <RestaurantIcon />,
};

const AdminLessons = () => {
  const theme = useTheme();
  
  const {
      activeTab,
      handleTabChange,
      searchQuery,
      setSearchQuery,
      stats,
      data
  } = useAdminLessons();

  const { handleSetDataSnackbar } = useSnackBarContext();
  const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();

  const handleConfirmDelete = () => {
      // Mock delete logic
      handleSetDataSnackbar({ message: 'Lección eliminada correctamente', type: 'success' });
      handleCloseDialog();
      // In a real app, you'd trigger a data refresh here
  };

  const handleDeleteClick = (rowId) => {
      setDialongContent({
          title: "Eliminar Lección",
          message: "¿Estás seguro de que deseas eliminar esta lección? Esta acción no se puede deshacer.",
          confirmText: "Eliminar",
          color: "error"
      });
      handleOpenDialog();
  };

    // Custom Columns Definition for TableMain
  const columns = [

    {
      name: "order",
      label: "Orden",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
            <Typography variant="body2" fontWeight={600} color="text.secondary" align="center">
                {String(value).padStart(2, '0')}
            </Typography>
        )
      }
    },
    {
      name: "title",
      label: "Título de la Lección",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta) => {
            const rowId = tableMeta.rowIndex;
            const iconKey = data[rowId]?.icon || 'menu_book'; 
            
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
                        {iconMap[iconKey]}
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                            {value}
                        </Typography>
                        {/* Adding visible 'type' or metadata helps visibility principle by providing context */}
                        <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block' }}>
                            {data[rowId]?.type || 'Lección Estándar'}
                        </Typography>
                    </Box>
                </Box>
            );
        }
      }
    },
// ... (omitting level and status for brevity if unchanged, but will include to keep block clean if needed)
    {
      name: "level",
      label: "Nivel",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
            <Chip 
                label={value} 
                size="small"
                variant="outlined"
                sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    borderColor: 'divider',
                    bgcolor: 'transparent'
                }} 
            />
        )
      }
    },
    {
      name: "status",
      label: "Estado",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
            <Chip 
                label={value} 
                size="small" 
                sx={{ 
                    fontWeight: 700, 
                    borderRadius: 2,
                    px: 1.5,
                    height: 28,
                    bgcolor: value === 'Publicada' ? alpha(theme.palette.success.main, 0.1) : 
                             value === 'Borrador' ? alpha(theme.palette.warning.main, 0.1) : theme.palette.action.selected,
                    color: value === 'Publicada' ? 'success.dark' : 
                           value === 'Borrador' ? 'warning.dark' : 'text.secondary',
                    border: '1px solid',
                    borderColor: value === 'Publicada' ? alpha(theme.palette.success.main, 0.2) : 
                                 value === 'Borrador' ? alpha(theme.palette.warning.main, 0.2) : 'transparent'
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
                        <IconButton size="small" sx={{ 
                            color: 'text.secondary', 
                            transition: 'all 0.2s',
                            '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1), transform: 'translateY(-2px)' } 
                        }}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar lección" arrow TransitionComponent={Fade}>
                        <IconButton 
                            size="small" 
                            component={Link}
                            to={`/admin/lecciones/editar/${data[tableMeta.rowIndex]?.id || tableMeta.rowIndex}`}
                            sx={{ 
                                color: 'text.secondary', 
                                transition: 'all 0.2s',
                                '&:hover': { color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.1), transform: 'translateY(-2px)' } 
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar" arrow TransitionComponent={Fade}>
                        <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(data[tableMeta.rowIndex]?.id)}
                            sx={{ 
                            color: 'text.secondary', 
                            transition: 'all 0.2s',
                            '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1), transform: 'translateY(-2px)' } 
                        }}>
                            <DeleteIcon fontSize="small" />
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
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
            Admin
        </Typography>
        <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.primary" fontWeight={700}>
            Lecciones
        </Typography>
      </Box>

      {/* Header - More distinctive */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-start' }, justifyContent: 'space-between', gap: 2, mb: 6 }}>
        <Box>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: '#111827', letterSpacing: '-0.03em' }}>
                Gestión de Lecciones
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.6 }}>
                Organiza las lecciones disponibles para los estudiantes. Añade nuevo contenido o actualiza el existente.
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Cambiar el orden">
                <Button 
                    variant="outlined" 
                    startIcon={<SwapVertIcon />}
                    sx={{ 
                        borderRadius: 3, 
                        textTransform: 'none', 
                        fontWeight: 700, 
                        py: 1.25, px: 3,
                        borderColor: 'divider',
                        color: 'text.primary',
                        bgcolor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'divider' }
                    }}
                >
                    Reordenar
                </Button>
            </Tooltip>
            {/* Keeping the New Lesson button implementation from previous step, assuming it is good now */}


            <Button 
                component={Link}
                to="/admin/lecciones/crear"
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
                Nueva Lección
            </Button>
        </Box>
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
                placeholder="Buscar por título de lección, temas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: '1rem', fontWeight: 500 }
                }}
            />
         </Box>
         <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, p: 0.5 }}>
             <Select 
                defaultValue="" 
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
                <MenuItem value="">Todos los Niveles</MenuItem>
                <MenuItem value="a1">A1 - Principiante</MenuItem>
                <MenuItem value="a2">A2 - Elemental</MenuItem>
                <MenuItem value="b1">B1 - Intermedio</MenuItem>
             </Select>
             <Tooltip title="Filtros avanzados">
                <IconButton sx={{ 
                    borderRadius: 3, width: 44, height: 44,
                    border: '1px solid', borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'text.primary', color: 'white' }
                }}>
                    <FilterListIcon />
                </IconButton>
             </Tooltip>
         </Box>
      </Paper>

      {/* Tabs - Glassmorphism Style */}
      <Box sx={{ mb: 4 }}>
         <Box sx={{ 
             display: 'inline-flex', 
             p: 0.75, 
             bgcolor: 'rgba(255,255,255,0.5)', 
             borderRadius: 4, 
             gap: 1,
             border: '1px solid',
             borderColor: 'rgba(0,0,0,0.05)',
             backdropFilter: 'blur(4px)'
        }}>
            {['Todas', 'Borradores', 'Publicada', 'Archivada'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <Box 
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        sx={{ 
                            py: 1.25, px: 3.5,
                            borderRadius: 3,
                            cursor: 'pointer',
                            // High contrast fix
                            color: isActive ? 'white' : 'text.secondary',
                            bgcolor: isActive ? 'text.primary' : 'transparent',
                            fontWeight: isActive ? 700 : 600,
                            boxShadow: isActive ? '0 4px 12px rgba(68, 42, 42, 0.3)' : 'none',
                            transform: isActive ? 'scale(1.02)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                                color: isActive ? 'white' : 'text.primary',
                                bgcolor: isActive ? 'text.secondary' : 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        {tab}
                    </Box>
                );
            })}
         </Box>
      </Box>

      {/* Data Table */}
      <Box sx={{ 
          '& .MuiPaper-root': { boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid', borderColor: 'divider', borderRadius: 4, overflow: 'hidden' },
          '& .MuiTableCell-head': { bgcolor: alpha(theme.palette.background.paper, 0.5), fontWeight: 800, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: '0.05em' },
          '& .MuiTableRow-root': { transition: 'bgcolor 0.2s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }
      }}>
        <TableMain 
            title="" 
            data={data} 
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

      {/* Pagination (Visual Match) */}
      <Paper elevation={0} sx={{ mt: -2, p: 2, border: '1px solid', borderColor: 'divider', borderTop: 'none', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
             Mostrando <Box component="span" fontWeight="bold" color="text.primary">1 - 4</Box> de <Box component="span" fontWeight="bold" color="text.primary">{stats.total}</Box> lecciones
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" disabled sx={{ border: '1px solid', borderColor: 'divider' }}><ChevronRightIcon sx={{ transform: 'rotate(180deg)', fontSize: 16 }} /></IconButton>
              <Button variant="contained" size="small" sx={{ minWidth: 32, px: 0, bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', boxShadow: theme.shadows[2] }}>1</Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0, color: 'text.secondary', fontWeight: 'bold' }}>2</Button>
              <Button variant="text" size="small" sx={{ minWidth: 32, px: 0, color: 'text.secondary', fontWeight: 'bold' }}>3</Button>
              <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}><ChevronRightIcon sx={{ fontSize: 16 }} /></IconButton>
          </Box>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 4 }}>
          {/* Card 1 */}
          <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.dark' }}>
                  <LibraryBooksIcon fontSize="large" />
              </Box>
              <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lecciones</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.total}</Typography>
              </Box>
          </Paper>
          {/* Card 2 */}
          <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.main' }}>
                  <CheckCircleIcon fontSize="large" />
              </Box>
              <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Publicadas</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.published}</Typography>
              </Box>
          </Paper>
          {/* Card 3 */}
          <Paper elevation={0} sx={{ flex: 1, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' } }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: theme.palette.action.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                  <PendingIcon fontSize="large" />
              </Box>
              <Box>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>En Revisión</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{stats.review}</Typography>
              </Box>
          </Paper>
      </Box>



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

export default AdminLessons;
