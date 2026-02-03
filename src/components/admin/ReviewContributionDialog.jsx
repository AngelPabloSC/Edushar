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
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ReviewContributionDialog = ({ open, contribution, onClose, onAction, loading }) => {
  const theme = useTheme();

  if (!contribution) return null;

  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg" // Increased width for better side-by-side view
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
        {/* Header */}
        <DialogTitle sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <Box>
                <Typography variant="h5" fontWeight="900">
                        Revisión: {contribution.type === 'story' ? 'Cuento' : 'Palabra'}
                </Typography>
            </Box>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, bgcolor: 'background.default' }}>
            {/* User Info Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Avatar src={contribution.user.avatar} sx={{ width: 56, height: 56 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{contribution.user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Contribuidor Solicitante • {contribution.user.timeAgo}</Typography>
                    </Box>
                </Box>

            {/* Content Based on Type */}
            {contribution.type === 'dictionary' && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ display: 'block', mb: 1 }}>SHUAR</Typography>
                            <Typography variant="h4" fontWeight="900" gutterBottom>{contribution.data.wordShuar}</Typography>
                            <Chip label={contribution.data.category} size="small" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 1 }}>ESPAÑOL</Typography>
                            <Typography variant="h5" fontWeight="bold" color="text.secondary">{contribution.data.wordSpanish}</Typography>
                        </Paper>
                    </Grid>
                    
                    {/* Examples */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Ejemplos de Uso</Typography>
                        {contribution.data.examples?.map((ex, i) => (
                            <Paper key={i} elevation={0} sx={{ p: 2, mb: 1, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderLeft: '3px solid', borderColor: 'secondary.main' }}>
                                <Typography variant="body1">{ex}</Typography>
                            </Paper>
                        )) || <Typography color="text.secondary" fontStyle="italic">Sin ejemplos proporcionados</Typography>}
                    </Grid>

                    {/* Image */}
                    {contribution.data.image && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Imagen de Referencia</Typography>
                            <Box 
                                component="img" 
                                src={contribution.data.image} 
                                sx={{ 
                                    width: '100%', 
                                    maxHeight: 300, 
                                    objectFit: 'contain', 
                                    borderRadius: 2,
                                    bgcolor: 'black' 
                                }} 
                            />
                        </Grid>
                    )}
                </Grid>
            )}

            {contribution.type === 'story' && (
                <Stack spacing={3}>
                    {/* Metadata & Header (Stacked) */}
                     <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4} md={3}>
                                <Box 
                                    sx={{ 
                                        width: '100%',
                                        aspectRatio: '4/3',
                                        bgcolor: 'grey.100', 
                                        borderRadius: 2, 
                                        overflow: 'hidden',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {contribution.data.coverImage ? (
                                        <img src={contribution.data.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Sin Portada</Typography>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8} md={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Chip label={contribution.data.category} size="small" sx={{ alignSelf: 'flex-start', mb: 2 }} />
                                
                                <Typography variant="h5" fontWeight="900" color="secondary.main" gutterBottom>
                                    {contribution.data.title_shuar}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" fontStyle="italic" sx={{ mb: 2, lineHeight: 1.3 }}>
                                    {contribution.data.title_español}
                                </Typography>
                                
                                <Divider sx={{ my: 1, width: '100px' }} />
                                
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                    <strong>Autor:</strong> {contribution.data.author}
                                </Typography>
                            </Grid>
                        </Grid>
                     </Paper>

                    {/* Story Content (Stacked Shuar then Spanish) */}
                    <Box>
                        <Typography variant="h6" fontWeight="900" sx={{ mb: 2, ml: 1 }}>
                            Contenido de la Historia
                        </Typography>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 0 }}>
                                <Grid container>
                                    {/* Shuar Text */}
                                    <Grid item xs={12} sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="overline" color="secondary.main" fontWeight="bold" display="block" mb={2} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), width: 'fit-content', px: 1, borderRadius: 1 }}>
                                            SHUAR
                                        </Typography>
                                        <Typography paragraph sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                            {contribution.data.contentShuar}
                                        </Typography>
                                    </Grid>

                                    {/* Spanish Text */}
                                    <Grid item xs={12} sx={{ p: 4, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
                                         <Typography variant="overline" color="text.secondary" fontWeight="bold" display="block" mb={2} sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1), width: 'fit-content', px: 1, borderRadius: 1 }}>
                                            ESPAÑOL
                                        </Typography>
                                        <Typography paragraph color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                            {contribution.data.contentSpanish}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Box>
                </Stack>
            )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
                size="large" 
                variant="outlined" 
                color="error" 
                startIcon={<CancelIcon />}
                onClick={() => onAction('reject')}
                disabled={loading}
                sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
                Rechazar
            </Button>
            
            <Button 
                size="large" 
                variant="contained" 
                color="success" 
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TaskAltIcon />}
                onClick={() => onAction('approve')}
                disabled={loading}
                sx={{ px: 4, fontWeight: 'bold', color: 'white', boxShadow: 3 }}
            >
                Aprobar Contribución
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default ReviewContributionDialog;
