import { Box, Typography, Button, IconButton, Chip, Paper, useTheme, alpha } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';

const StoryCard = ({ story, onEdit, onDelete, onClick }) => {
    const theme = useTheme();

    // Safety check
    if (!story) {
        return null;
    }


    return (
        <Paper
            elevation={0}
            onClick={onClick ? () => onClick(story) : undefined}
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
                    borderColor: onClick ? 'primary.main' : 'divider'
                }
            }}
        >
            {/* Cover Image & Badges */}
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                <Box
                    component="img"
                    src={story?.cover || 'https://via.placeholder.com/400x225'}
                    alt={story?.title?.es || 'Story cover'}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                    <Chip
                        label={story?.category || 'General'}
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
                    <Chip
                        label={story?.status || 'Borrador'}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            bgcolor: story?.status === 'Publicado' ? alpha(theme.palette.info.main, 0.9) : alpha(theme.palette.grey[500], 0.9),
                            color: 'white',
                            border: 'none',
                            backdropFilter: 'blur(4px)'
                        }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
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
                            {story?.title?.es || 'Sin título'}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.success.main, // Using green for Shuar context
                                fontWeight: 500,
                                fontStyle: 'italic',
                                fontSize: '0.85rem'
                            }}
                        >
                            Shuar / Español
                        </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: 'text.disabled' }}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Author Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {story?.author || 'Anónimo'}
                    </Typography>
                </Box>

                {/* Actions */}
                {(onEdit || onDelete) && (
                    <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                        {onEdit && (
                            <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={() => onEdit(story)}
                                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: 'text.primary', // Dark brown background
                                    color: 'background.paper', // White text
                                    boxShadow: 'none',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: 'text.secondary',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Editar
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={() => onDelete(story.id)}
                                startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' }
                                }}
                            >
                                Borrar
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default StoryCard;
