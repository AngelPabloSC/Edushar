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
    alpha,
    CircularProgress,
    Divider
} from '@mui/material';
import ReviewContributionDialog from '../../components/admin/ReviewContributionDialog';
import HistoryDialog from '../../components/admin/HistoryDialog';
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
        stats,
        // contributions,
        filteredContributions,
        filterType,
        history,
        historyDialogOpen,

        // Dialog State
        isOpen,
        dialongContent,
        actionCallback,

        // Setters
        setSelectedContributionId,
        setSearchQuery,
        setFilterType,
        setHistoryDialogOpen,

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
                            onClick={() => setHistoryDialogOpen(true)}
                        >
                            <span className="notranslate">Historial</span>
                        </Button>
                    </Box>

                    {/* Stats Cards - Flex container to fill space */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                        <Box sx={{ flex: 1 }}>
                            <StatsCard
                                title="Pendientes"
                                value={stats.pending.count}
                                icon={<PendingActionsIcon />}
                                color={theme.palette.info?.main || '#0288d1'}
                                trend={`+${stats.pending.new} nuevas`}
                                delay="0.1s"
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <StatsCard
                                title="Aprobados Hoy"
                                value={stats.approvedToday.count}
                                icon={<TaskAltIcon />}
                                color={theme.palette.success.main}
                                trend={`${stats.approvedToday.percentage > 0 ? '+' : ''}${stats.approvedToday.percentage}%`}
                                delay="0.2s"
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <StatsCard
                                title="Rechazados"
                                value={stats.rejected.count}
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
                                label="Todos"
                                clickable
                                sx={{
                                    fontWeight: 'bold',
                                    bgcolor: filterType === 'all' ? 'primary.main' : 'background.paper',
                                    color: filterType === 'all' ? 'white' : 'text.secondary',
                                    '&:hover': { bgcolor: filterType === 'all' ? 'primary.dark' : 'action.hover' },
                                    height: 40,
                                    borderRadius: 2,
                                    px: 1,
                                    border: filterType === 'all' ? 'none' : '1px solid',
                                    borderColor: 'divider',
                                }}
                                onClick={() => setFilterType('all')}
                            />
                            <Chip
                                label="Palabras"
                                clickable
                                variant={filterType === 'dictionary' ? "filled" : "outlined"}
                                onClick={() => setFilterType('dictionary')}
                                sx={{
                                    bgcolor: filterType === 'dictionary' ? 'primary.main' : 'background.paper',
                                    borderColor: 'divider',
                                    color: filterType === 'dictionary' ? 'white' : 'text.secondary',
                                    fontWeight: 'medium',
                                    '&:hover': { bgcolor: filterType === 'dictionary' ? 'primary.dark' : 'action.hover' },
                                    height: 40,
                                    borderRadius: 2,
                                    px: 1
                                }}
                            />
                            <Chip
                                label="Historias"
                                clickable
                                variant={filterType === 'story' ? "filled" : "outlined"}
                                onClick={() => setFilterType('story')}
                                sx={{
                                    bgcolor: filterType === 'story' ? 'primary.main' : 'background.paper',
                                    borderColor: 'divider',
                                    color: filterType === 'story' ? 'white' : 'text.secondary',
                                    fontWeight: 'medium',
                                    '&:hover': { bgcolor: filterType === 'story' ? 'primary.dark' : 'action.hover' },
                                    height: 40,
                                    borderRadius: 2,
                                    px: 1
                                }}
                            />

                        </Box>
                    </Box>
                </Box>

                {/* List Panel - Full Width */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 0.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredContributions.map((contribution, index) => (
                        <Paper
                            key={contribution.id}
                            elevation={0}
                            onClick={() => setSelectedContributionId(contribution.id)}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                animation: 'fadeInUp 0.5s ease-out forwards',
                                animationDelay: `${0.1 + (index * 0.05)}s`,
                                opacity: 0,
                                ...fadeInUp,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    borderColor: 'secondary.main',
                                    boxShadow: theme.shadows[2]
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar
                                    src={contribution.user.avatar}
                                    sx={{ width: 48, height: 48, border: `2px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[1] }}
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
                                            label={contribution.type === 'story' ? 'Cuento' : 'Diccionario'}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                borderRadius: 1,
                                                bgcolor: contribution.type === 'story' ? alpha(theme.palette.secondary.main, 0.15) : alpha(theme.palette.primary.main, 0.15),
                                                color: 'text.primary',
                                            }}
                                        />
                                        <Typography variant="body2" fontWeight="500" color="text.secondary">
                                            {contribution.type === 'story' ? contribution.data?.title_shuar : contribution.data?.wordShuar}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                                    Revisar
                                </Button>
                            </Box>
                        </Paper>
                    ))}
                </Box>

            </Box>

            {/* Review Modal */}
            <ReviewContributionDialog
                open={!!selectedContribution}
                contribution={selectedContribution}
                onClose={() => setSelectedContributionId(null)}
                onAction={handleConfirmation}
                loading={loading}
            />



            {/* Constraints: Confirmation Dialog - Vibrant Style */}
            <Dialog
                open={isOpen}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 2,
                        width: '100%',
                        maxWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: '900', textAlign: 'center', fontSize: '1.5rem' }}>
                    {dialongContent.title}
                </DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" textAlign="center" sx={{ fontSize: '1.1rem' }}>
                        {dialongContent.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            borderRadius: 3,
                            px: 3,
                            borderColor: 'divider',
                            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={actionCallback}
                        variant="contained"
                        color={dialongContent.color || 'primary'}
                        sx={{
                            borderRadius: 3,
                            fontWeight: 'bold',
                            px: 4,
                            boxShadow: 4,
                            color: 'white'
                        }}
                        autoFocus
                    >
                        {dialongContent.confirmText || 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <HistoryDialog
                open={historyDialogOpen}
                onClose={() => setHistoryDialogOpen(false)}
                history={history}
            />

        </Box>

    );
};

export default AdminModeration;
