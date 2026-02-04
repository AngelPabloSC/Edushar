import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Avatar,
    Grid,
    Paper,
    Chip,
    Divider,
    TextField,
    useTheme,
    alpha,
    CircularProgress,
    Stack,
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import GrassIcon from '@mui/icons-material/Grass'; // For Shuar
import PublicIcon from '@mui/icons-material/Public'; // For Spanish
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'; // For Examples
import ImageIcon from '@mui/icons-material/Image'; // For Image reference

const ReviewContributionDialog = ({ open, contribution, onClose, onAction, loading }) => {
    const theme = useTheme();

    if (!contribution) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: '#FFFFFF',
                }
            }}
        >
            {/* Vibrant Gradient Header */}
            {/* Vibrant Gradient Header */}
            <DialogTitle
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #CF974F 0%, #B8803B 100%)', // Golden/Brown from avatar
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative Sparkles */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 1 }}>
                    <AutoAwesomeIcon sx={{ color: '#FFD700', fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="900" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        Revisión: {contribution.type === 'story' ? 'Cuento' : 'Palabra'}
                    </Typography>
                </Box>

                <IconButton
                    onClick={onClose}
                    size="small"
                    aria-label="Cerrar revisión"
                    sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                    }}
                >
                    <Tooltip title="Cerrar (Esc)">
                        <CloseIcon />
                    </Tooltip>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, bgcolor: '#FFFFFF' }}>
                <Box sx={{
                    mt: 2,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    '@keyframes fadeInUp': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                }}>
                    {/* User Info Card - Soft Peach Accent */}
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 3,
                            p: 3,
                            bgcolor: '#FFF0E5', // Very light peach
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Orange Accent Bar */}
                        <Box sx={{
                            position: 'absolute',
                            left: 0,
                            top: '15%',
                            bottom: '15%',
                            width: 4,
                            bgcolor: '#FF6B35',
                            borderRadius: '0 4px 4px 0'
                        }} />

                        <Avatar
                            src={contribution.user.avatar}
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: '#FF9F1C', // Bright orange
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(255, 159, 28, 0.3)'
                            }}
                        >
                            {contribution.user.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2D3436', lineHeight: 1.2 }}>
                                {contribution.user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#636E72', fontWeight: 500 }}>
                                Contribuidor Solicitante • {contribution.user.timeAgo}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Content Based on Type */}
                    {contribution.type === 'dictionary' && (
                        <Stack spacing={3}>
                            {/* Shuar Card - Peach/Orange Theme */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    bgcolor: '#FFF3E0', // Light Orange Background
                                    position: 'relative',
                                    border: '1px solid',
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'default',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                {/* Glowing Orb Effect */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: -20,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(255, 122, 69, 0.2) 0%, rgba(255, 122, 69, 0) 70%)',
                                    filter: 'blur(10px)'
                                }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Tooltip title="Palabra en Shuar">
                                        <Chip
                                            icon={<GrassIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                                            label="SHUAR"
                                            sx={{
                                                bgcolor: '#FF6B35',
                                                color: 'white',
                                                fontWeight: '900',
                                                borderRadius: 2,
                                                height: 32,
                                                px: 1,
                                                '& .MuiChip-label': { px: 1 }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>

                                <Typography variant="h2" sx={{
                                    fontFamily: 'serif',
                                    fontWeight: '800',
                                    color: '#2D3436',
                                    fontSize: '3rem',
                                    mb: 2
                                }}>
                                    {contribution.data.wordShuar}
                                </Typography>

                                <Chip
                                    label={contribution.data.category.toLowerCase()}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#FF6B35',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        height: 32
                                    }}
                                />
                            </Paper>

                            {/* Spanish Card - Light Blue Theme */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    bgcolor: '#E3F2FD', // Light Blue Background
                                    position: 'relative',
                                    border: '1px solid',
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'default',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                {/* Glowing Orb Effect */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: -20,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(2, 119, 189, 0.2) 0%, rgba(2, 119, 189, 0) 70%)',
                                    filter: 'blur(10px)'
                                }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Tooltip title="Traducción al Español">
                                        <Chip
                                            icon={<PublicIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                                            label="ESPAÑOL"
                                            sx={{
                                                bgcolor: '#0277BD',
                                                color: 'white',
                                                fontWeight: '900',
                                                borderRadius: 2,
                                                height: 32,
                                                px: 1,
                                                '& .MuiChip-label': { px: 1 }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>

                                <Typography variant="h2" sx={{
                                    fontFamily: 'serif',
                                    fontWeight: '800',
                                    color: '#2D3436',
                                    fontSize: '3rem',
                                }}>
                                    {contribution.data.wordSpanish}
                                </Typography>
                            </Paper>

                            {/* Examples Section */}
                            {(contribution.data.examples || contribution.data.image) && (
                                <Box sx={{ mt: 2 }}>
                                    {contribution.data.examples && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1.5, display: 'block', mb: 1 }}>
                                                EJEMPLOS DE USO
                                            </Typography>
                                            {contribution.data.examples.map((ex, i) => (
                                                <Paper key={i} elevation={0} sx={{ p: 2, mb: 1, bgcolor: '#F8F9FA', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF6B35', mt: 1.2 }} />
                                                        <Typography variant="body1" color="text.primary" fontWeight="500">
                                                            {ex}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Box>
                                    )}

                                    {contribution.data.image && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 4,
                                                border: '2px dashed',
                                                borderColor: 'divider',
                                                bgcolor: '#F8F9FA',
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <img
                                                src={contribution.data.image}
                                                alt="Reference"
                                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, mixBlendMode: 'multiply' }}
                                            />
                                        </Paper>
                                    )}
                                </Box>
                            )}
                        </Stack>
                    )}

                    {contribution.type === 'story' && (
                        /* Keep minimal changes for story, just container adjustments */
                        <Stack spacing={3}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#FFF8E1', border: '1px solid', borderColor: '#FFE0B2' }}>
                                <Typography variant="h5" fontWeight="900" color="#E65100" gutterBottom>
                                    {contribution.data.title_shuar}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" fontStyle="italic">
                                    {contribution.data.title_español}
                                </Typography>
                            </Paper>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.8, color: '#444' }}>
                                {contribution.data.contentShuar}
                            </Typography>
                        </Stack>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#FFFFFF', borderTop: '1px solid', borderColor: '#F0F0F0', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<RemoveCircleOutlineIcon />}
                    onClick={() => onAction('reject')}
                    disabled={loading}
                    sx={{
                        color: '#FF4757',
                        borderColor: '#FF4757',
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        fontWeight: 'bold',
                        borderWidth: 1.5,
                        '&:hover': { borderWidth: 1.5, bgcolor: alpha('#FF4757', 0.05), borderColor: '#FF4757' }
                    }}
                >
                    RECHAZAR
                </Button>

                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                    onClick={() => onAction('approve')}
                    disabled={loading}
                    sx={{
                        bgcolor: '#00C896', // Vibrant Green
                        color: 'white',
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px rgba(0, 200, 150, 0.4)',
                        '&:hover': { bgcolor: '#00B88A', boxShadow: '0 6px 20px rgba(0, 200, 150, 0.6)' }
                    }}
                >
                    APROBAR
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default ReviewContributionDialog;
