import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAdminModeration } from '../../hooks/pages/useAdminModeration';

/**
 * Admin Moderation Dashboard
 * Allows admins to review and approve/reject contributions
 */
const AdminModeration = () => {
  const theme = useTheme();
  
  const {
    // State
    loading,
    selectedContributionId,
    searchQuery,
    selectedContribution,
    moderationStats,
    contributions,
    
    // Dialog State
    isOpen,
    dialongContent,
    actionCallback,

    // Setters
    setSelectedContributionId,
    setSearchQuery,

    // Handlers
    handleConfirmation,
    handleCloseDialog
  } = useAdminModeration();

  // Animation constants
  const fadeInUp = {
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    }
  };

  // Stats Component Enhanced with "Glass" feel
  const StatsCard = ({ title, value, icon, color, trend, delay }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.text.primary, 0.05),
        borderRadius: 4,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: delay,
        opacity: 0, // Initial state for animation
        ...fadeInUp,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
             transform: 'translateY(-8px)',
             boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)',
             borderColor: alpha(color, 0.3)
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
          {title}
        </Typography>
        <Box sx={{ 
            color: color, 
            p: 1.2, 
            borderRadius: 3, 
            bgcolor: alpha(color, 0.1),
            display: 'flex',
            boxShadow: `0 4px 8px ${alpha(color, 0.15)}`
        }}>
          {icon}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography variant="h3" fontWeight="900" color="text.primary" sx={{ letterSpacing: -1.5 }}>
          {value}
        </Typography>
        {trend && (
            <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: 'success.dark', 
                    fontWeight: 'bold',
                    height: 24,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.2)
                }} 
            />
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: { xs: 'auto', md: 'hidden' }, bgcolor: 'background.default' }}>
      
      {/* Scrollable Content Area */}
      <Box sx={{ flexGrow: 1, overflow: { xs: 'visible', md: 'hidden' }, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header & Stats Section */}
        <Box sx={{ p: 4, pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                <Box sx={{ animation: 'fadeInUp 0.5s ease-out', ...fadeInUp }}>
                    <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.03em', color: 'text.primary', fontSize: '2.5rem' }}>
                        Moderación de Contenido
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, lineHeight: 1.6 }}>
                        Revisa y gestiona las aportaciones de los estudiantes. Asegura la calidad del diccionario Shuar.
                    </Typography>
                </Box>
                <Button 
                    variant="outlined" 
                    startIcon={<HistoryIcon />}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 'bold', 
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        borderWidth: 2,
                        borderColor: alpha(theme.palette.secondary.main, 0.5),
                        color: 'secondary.main',
                        '&:hover': { 
                            borderWidth: 2, 
                            borderColor: 'secondary.main', 
                            bgcolor: alpha(theme.palette.secondary.main, 0.08),
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Historial
                </Button>
            </Box>

            {/* Stats Cards - Flex container to fill space */ }
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <StatsCard 
                        title="Pendientes" 
                        value={moderationStats.pending} 
                        icon={<PendingActionsIcon />} 
                        color={theme.palette.info?.main || '#0288d1'}
                        trend="+2 nuevas"
                        delay="0.1s"
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatsCard 
                        title="Aprobados Hoy" 
                        value={moderationStats.approvedToday} 
                        icon={<TaskAltIcon />} 
                        color={theme.palette.success.main}
                        trend="+12%"
                        delay="0.2s"
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatsCard 
                        title="Rechazados" 
                        value={moderationStats.rejected} 
                        icon={<CancelIcon />} 
                        color={theme.palette.error.main} 
                        delay="0.3s"
                    />
                </Box>
            </Box>

            {/* Filters */}
            {/* Filters & Search - Separated Layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
                {/* Search Bar - Takes available space */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 0.5,
                        pl: 2,
                        display: 'flex', 
                        alignItems: 'center', 
                        flexGrow: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                    }}
                >
                    <SearchIcon color="action" />
                    <TextField
                        placeholder="Buscar contribución..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: '0.95rem' }
                        }}
                        variant="standard"
                        sx={{ 
                            flexGrow: 1,
                            px: 1,
                            py: 0.5,
                        }}
                    />
                </Paper>

                {/* Filter Chips - Right aligned */}
                <Box sx={{ display: 'flex', gap: 1, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 1, md: 0 } }}>
                     <Chip 
                        label="Todo" 
                        clickable
                        sx={{ 
                            fontWeight: 'bold', 
                            bgcolor: 'primary.main', // Changed from secondary to match image description implies blue often
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                            height: 40,
                            borderRadius: 2,
                            px: 1
                        }} 
                        onClick={()=>{}} 
                    />
                     <Chip 
                        label="Palabras" 
                        clickable
                        variant="outlined" 
                        onClick={()=>{}} 
                         sx={{ 
                            bgcolor: 'background.paper', 
                            borderColor: 'divider', 
                            color: 'text.secondary',
                            fontWeight: 'medium',
                            '&:hover': { bgcolor: 'action.hover' },
                            height: 40,
                            borderRadius: 2,
                            px: 1
                        }} 
                    />
                     <Chip 
                        label="Historias" 
                        clickable
                        variant="outlined" 
                        onClick={()=>{}} 
                         sx={{ 
                            bgcolor: 'background.paper', 
                            borderColor: 'divider', 
                            color: 'text.secondary',
                            fontWeight: 'medium',
                            '&:hover': { bgcolor: 'action.hover' },
                            height: 40,
                            borderRadius: 2,
                            px: 1
                        }} 
                    />
                     <Chip 
                        label="Correcciones" 
                        clickable
                        variant="outlined" 
                        onClick={()=>{}} 
                         sx={{ 
                            bgcolor: 'background.paper', 
                            borderColor: 'divider', 
                            color: 'text.secondary',
                            fontWeight: 'medium',
                            '&:hover': { bgcolor: 'action.hover' },
                            height: 40,
                            borderRadius: 2,
                            px: 1
                        }} 
                    />
                </Box>
            </Box>
        </Box>

        {/* Split View Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, flexGrow: 1, overflow: { xs: 'visible', lg: 'hidden' }, px: { xs: 2, md: 4 }, pb: 4, gap: 3 }}>
            
            {/* List Panel */}
            <Box sx={{ flex: 1, overflowY: { xs: 'visible', lg: 'auto' }, pr: { xs: 0, lg: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {contributions.map((contribution, index) => (
                    <Paper
                        key={contribution.id}
                        elevation={selectedContributionId === contribution.id ? 4 : 0}
                        onClick={() => setSelectedContributionId(contribution.id)}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: selectedContributionId === contribution.id ? 'secondary.main' : 'transparent',
                            bgcolor: selectedContributionId === contribution.id ? 'background.paper' : alpha(theme.palette.background.paper, 0.6),
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: 'fadeInUp 0.5s ease-out forwards',
                            animationDelay: `${0.5 + (index * 0.1)}s`,
                            opacity: 0,
                            ...fadeInUp,
                            '&:hover': {
                                transform: 'translateY(-2px) translateX(4px)',
                                borderColor: alpha(theme.palette.secondary.main, 0.5),
                                bgcolor: 'background.paper',
                                boxShadow: theme.shadows[2]
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Avatar 
                                src={contribution.user.avatar} 
                                sx={{ 
                                    width: 48, 
                                    height: 48, 
                                    border: `2px solid ${theme.palette.background.paper}`, 
                                    boxShadow: theme.shadows[2] 
                                }} 
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                        {contribution.user.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                                        {contribution.user.timeAgo}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                        label={contribution.type} 
                                        size="small" 
                                        sx={{ 
                                            height: 20, 
                                            fontSize: '0.65rem', 
                                            fontWeight: '800', 
                                            textTransform: 'uppercase',
                                            borderRadius: 1,
                                            border: '1px solid transparent',
                                            bgcolor: 
                                                contribution.type === 'Palabra Sugerida' ? alpha(theme.palette.primary.main, 0.15) :
                                                contribution.type === 'Historia Corta' ? alpha(theme.palette.secondary.main, 0.15) :
                                                alpha(theme.palette.warning.main, 0.15),
                                            color: 'text.primary',
                                        }} 
                                    />
                                    <Typography variant="body2" fontWeight="500" color="text.secondary">
                                        {contribution.content.title}
                                    </Typography>
                                </Box>
                            </Box>
                            {selectedContributionId === contribution.id && (
                                <Box sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: 'secondary.main',
                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.secondary.main, 0.2)}`
                                }} />
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Detail Drawer / Panel */}
            {/* Detail Drawer / Panel */}
            <Paper
                elevation={6}
                sx={{
                    width: { xs: '100%', lg: 480 },
                    height: { xs: 'auto', lg: '100%' },
                    maxHeight: { xs: selectedContributionId ? '60vh' : 0, lg: '100%' },
                    transition: 'max-height 0.3s ease-out',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    bgcolor: 'background.paper',
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: '0.2s',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    ...fadeInUp
                }}
            >
                {/* Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha(theme.palette.background.default, 0.3) }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            Revisión
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                                ID: #{selectedContribution?.id}
                            </Typography>
                             {selectedContribution?.content?.category && (
                                <Chip 
                                    label={selectedContribution.content.category} 
                                    size="small" 
                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 'bold', bgcolor: alpha(theme.palette.text.primary, 0.05) }} 
                                />
                            )}
                        </Box>
                    </Box>
                    <IconButton 
                        size="small" 
                        onClick={() => setSelectedContributionId(null)}
                        sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'rotate(90deg)', bgcolor: 'action.hover' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                    {selectedContribution ? (
                        <>
                            {/* Comparison Cards */}
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={6}>
                                    <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: 3, border: '1px dashed', borderColor: alpha(theme.palette.primary.main, 0.3), height: '100%' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', display: 'block', mb: 1, opacity: 0.7 }}>
                                            {selectedContribution.content.typeLabel}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="900" color="primary.dark" sx={{ wordBreak: 'break-word', letterSpacing: -0.5 }}>
                                            {selectedContribution.content.shuar || selectedContribution.content.title}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={0} sx={{ p: 2.5, bgcolor: alpha(theme.palette.secondary.main, 0.08), borderRadius: 3, border: '1px dashed', borderColor: alpha(theme.palette.secondary.main, 0.3), height: '100%' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ textTransform: 'uppercase', display: 'block', mb: 1, opacity: 0.7 }}>
                                            {selectedContribution.content.translationLabel}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                                            {selectedContribution.content.spanish || selectedContribution.content.details || 'Ver detalles'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Image Visual Aid (Visibility) */}
                            {selectedContribution.content.image && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>image</span>
                                        Evidencia Visual
                                    </Typography>
                                    <Box 
                                        component="img" 
                                        src={selectedContribution.content.image} 
                                        alt="Referencia visual"
                                        sx={{ 
                                            width: '100%', 
                                            height: 220, 
                                            objectFit: 'cover', 
                                            borderRadius: 3, 
                                            boxShadow: theme.shadows[3],
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.02)' }
                                        }} 
                                    />
                                </Box>
                            )}

                            {/* Detailed Context */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                     <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
                                    Contexto / Uso
                                </Typography>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary', lineHeight: 1.6 }}>
                                        "{selectedContribution.content.context || selectedContribution.content.description || "Sin descripción adicional."}"
                                    </Typography>
                                </Paper>
                            </Box>

                            {/* Feedback Input */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: 'text.secondary' }}>
                                    Retroalimentación (Opcional)
                                </Typography>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="¿Por qué se aprueba o rechaza? Comentarios para el estudiante..."
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: 3, 
                                            bgcolor: alpha(theme.palette.background.default, 0.5),
                                            transition: 'all 0.2s',
                                            '&:hover fieldset': { borderColor: 'secondary.main' },
                                            '&.Mui-focused fieldset': { borderColor: 'secondary.main', borderWidth: 2 } 
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.5 }}>
                            <PendingActionsIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                            <Typography variant="body1" fontWeight="bold" color="text.disabled">Selecciona una contribución</Typography>
                        </Box>
                    )}
                </Box>

                {/* Actions (Affordance) */}
                <Box sx={{ p: 3, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!selectedContribution || loading}
                        onClick={() => handleConfirmation('approve')}
                        startIcon={loading ? null : <DoneAllIcon />}
                        sx={{ 
                            borderRadius: 3, 
                            fontWeight: 'bold', 
                            py: 1.5,
                            fontSize: '1rem',
                            bgcolor: 'success.main', // Explicit for primary action
                            color: 'white',
                            boxShadow: '0 8px 16px rgba(46, 125, 50, 0.24)',
                            transition: 'all 0.2s',
                            '&:hover': { 
                                bgcolor: 'success.dark', 
                                boxShadow: '0 12px 20px rgba(46, 125, 50, 0.32)',
                                transform: 'translateY(-2px)'
                            },
                            textTransform: 'none'
                        }}
                    >
                        {loading ? 'Procesando...' : 'Aprobar Contribución'}
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled={!selectedContribution || loading}
                            onClick={() => handleConfirmation('changes')}
                            startIcon={<EditNoteIcon />}
                            sx={{ 
                                borderRadius: 3, 
                                fontWeight: 'bold', 
                                textTransform: 'none', 
                                borderWidth: 2, 
                                borderColor: 'text.secondary',
                                color: 'text.primary',
                                '&:hover': { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'action.hover' } 
                            }}
                        >
                            Pedir Cambios
                        </Button>
                         <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            disabled={!selectedContribution || loading}
                            onClick={() => handleConfirmation('reject')}
                            startIcon={<DeleteIcon />}
                            sx={{ 
                                borderRadius: 3, 
                                fontWeight: 'bold', 
                                textTransform: 'none', 
                                borderWidth: 2, 
                                '&:hover': { borderWidth: 2, bgcolor: alpha(theme.palette.error.main, 0.08), transform: 'translateY(-1px)' } 
                            }}
                        >
                            Rechazar
                        </Button>
                    </Box>
                </Box>

            </Paper>
        </Box>



        {/* Constraints: Confirmation Dialog */}
        {/* Constraints: Confirmation Dialog */}
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
                    onClick={actionCallback} 
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
    </Box>
  );
};

export default AdminModeration;
