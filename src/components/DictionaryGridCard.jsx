import { memo, useState } from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    Chip, 
    Paper, 
    useTheme, 
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useShuarTTS } from '../hooks/pages/useShuarTTS';

const DictionaryGridCard = ({ entry, onClick }) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const { play: playShuarAudio, isPlaying, isLoading: isAudioLoading } = useShuarTTS();

    // Safety check
    if (!entry) {
        return null;
    }

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        
        // Use Shuar TTS API
        if (entry.wordShuar) {
            playShuarAudio(entry.wordShuar);
        }
    };

    const handleOpenDialog = (e) => {
        e.stopPropagation();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Handle examples - could be array or string
    const examples = Array.isArray(entry?.examples) 
        ? entry.examples 
        : entry?.example 
            ? [entry.example] 
            : [];

    return (
        <>
            <Paper
                elevation={0}
                onClick={onClick ? () => onClick(entry) : undefined}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: onClick ? 'pointer' : 'default',
                    '&:hover': {
                        transform: onClick ? 'translateY(-4px)' : 'none',
                        boxShadow: onClick ? '0 12px 24px -4px rgba(0,0,0,0.08)' : 'none',
                        borderColor: onClick ? 'secondary.main' : 'divider'
                    }
                }}
            >
                {/* Header - Image or Gradient Background */}
                <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '16/9',
                    maxHeight: '225px',
                    overflow: 'hidden',
                    bgcolor: 'grey.200'
                }}>
                    {entry?.image ? (
                        <>
                            {/* Image Display */}
                            <Box
                                component="img"
                                src={entry.image}
                                alt={entry?.imageDescription || entry?.wordShuar || 'Dictionary entry'}
                                loading="lazy"
                                onError={(e) => { 
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            {/* Fallback gradient with word */}
                            <Box sx={{
                                display: 'none',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                p: 3
                            }}>
                                <Typography
                                    variant="h4"
                                    fontWeight={900}
                                    sx={{
                                        color: 'white',
                                        textAlign: 'center',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {entry?.wordShuar || 'Sin palabra'}
                                </Typography>
                            </Box>
                            {/* Overlay with Shuar word */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.8)} 0%, transparent 100%)`,
                                p: 2
                            }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={900}
                                    sx={{
                                        color: 'white',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    {entry?.wordShuar || 'Sin palabra'}
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        /* No image - show gradient with word */
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            p: 3
                        }}>
                            <Typography
                                variant="h4"
                                fontWeight={900}
                                sx={{
                                    color: 'white',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    mb: 1
                                }}
                            >
                                {entry?.wordShuar || 'Sin palabra'}
                            </Typography>
                            
                            {/* Audio Button */}
                            <IconButton
                                onClick={handlePlayAudio}
                                disabled={isAudioLoading}
                                sx={{
                                    bgcolor: alpha(theme.palette.common.white, 0.2),
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.common.white, 0.3),
                                    }
                                }}
                            >
                                {isAudioLoading || isPlaying ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <VolumeUpIcon />}
                            </IconButton>
                        </Box>
                    )}

                    {/* Category Badge */}
                    <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                        {entry?.category && (
                            <Chip
                                label={entry.category}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                                    color: 'white',
                                    border: 'none',
                                    backdropFilter: 'blur(4px)'
                                }}
                            />
                        )}
                    </Box>

                    {/* Audio Button for images */}
                    {entry?.image && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <IconButton
                                onClick={handlePlayAudio}
                                disabled={isAudioLoading}
                                sx={{
                                    bgcolor: alpha(theme.palette.common.white, 0.9),
                                    color: 'secondary.main',
                                    boxShadow: 2,
                                    '&:hover': {
                                        bgcolor: 'white',
                                    }
                                }}
                            >
                                {isAudioLoading || isPlaying ? <CircularProgress size={24} color="secondary" /> : <VolumeUpIcon />}
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flex: 1 }}>
                            {/* Spanish Translation */}
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    lineHeight: 1.2,
                                    mb: 0.5,
                                    fontSize: '1.1rem',
                                    color: 'text.primary'
                                }}
                            >
                                {entry?.wordSpanish || 'Sin traducción'}
                            </Typography>
                            
                            {/* Language Label */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.success.main,
                                    fontWeight: 500,
                                    fontStyle: 'italic',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Shuar / Español
                            </Typography>
                        </Box>
                        <IconButton 
                            size="small" 
                            onClick={handleOpenDialog}
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'secondary.main',
                                    bgcolor: alpha(theme.palette.secondary.main, 0.08)
                                }
                            }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* First Example Preview */}
                    {examples.length > 0 && (
                        <Box 
                            sx={{ 
                                mt: 2, 
                                pt: 2, 
                                borderTop: '1px solid', 
                                borderColor: alpha(theme.palette.divider, 0.5) 
                            }}
                        >
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                fontWeight={600}
                                sx={{ display: 'block', mb: 0.5 }}
                            >
                                EJEMPLO:
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontStyle: 'italic',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {examples[0]}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Detail Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 2
                }}>
                    <Typography variant="h5" fontWeight={800}>
                        Detalles de la Palabra
                    </Typography>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                
                <Divider />
                
                <DialogContent sx={{ pt: 3 }}>
                    {/* Image */}
                    {entry?.image && (
                        <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                            <Box
                                component="img"
                                src={entry.image}
                                alt={entry?.imageDescription || entry?.wordShuar}
                                sx={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            {entry?.imageDescription && (
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
                                >
                                    {entry.imageDescription}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Words */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                    Shuar
                                </Typography>
                                <Typography variant="h4" fontWeight={900} color="secondary.main">
                                    {entry?.wordShuar || 'Sin palabra'}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={handlePlayAudio}
                                disabled={isAudioLoading}
                                color="secondary"
                                sx={{
                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                                    }
                                }}
                            >
                                {isAudioLoading || isPlaying ? <CircularProgress size={24} color="secondary" /> : <VolumeUpIcon />}
                            </IconButton>
                        </Box>
                        
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                Español
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {entry?.wordSpanish || 'Sin traducción'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Category */}
                    {entry?.category && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                Categoría
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Chip 
                                    label={entry.category}
                                    color="primary"
                                    sx={{ fontWeight: 700 }}
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Examples */}
                    {examples.length > 0 && (
                        <Box>
                            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
                                Ejemplos de Uso ({examples.length})
                            </Typography>
                            <List sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2, p: 1 }}>
                                {examples.map((example, index) => (
                                    <ListItem 
                                        key={index}
                                        sx={{
                                            borderRadius: 1,
                                            mb: index < examples.length - 1 ? 1 : 0,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <ListItemText
                                            primary={example}
                                            primaryTypographyProps={{
                                                fontStyle: 'italic',
                                                color: 'text.primary'
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleCloseDialog} 
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Memoize component to prevent unnecessary re-renders
export default memo(DictionaryGridCard);
