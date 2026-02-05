import { Box, Typography, Button, keyframes, alpha, Skeleton, useTheme, IconButton, Container, Grid, TextField } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import SpaIcon from '@mui/icons-material/Spa';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseSlow = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingLesson = ({ onCancel, query, setQuery, lessonsByLevel }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuery, setTempQuery] = useState(query);

  useEffect(() => {
    // Reset loading whenever query changes effectively or on mount
    setLoading(true);
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setQuery(tempQuery); // Update parent state
    setIsEditing(false);
    handleRefresh(); // Re-trigger loading
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/leccion/${lessonId}`);
  };

  // RENDER LOADING STATE
  if (loading) {
     return (
        <Box sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}>
          
          <Box sx={{ position: 'relative', overflow: 'hidden', zIndex: -1 }}>
              {/* Background effects can be kept or simplified */}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, px: 3 }}>
            
            <Box sx={{ position: 'relative', mb: 6, animation: `${float} 4s ease-in-out infinite` }}>
                <Box sx={{ 
                    width: 160, height: 160, 
                    background: 'linear-gradient(135deg, #FF9800 0%, #D84315 100%)', 
                    borderRadius: '50%', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '8px solid', borderColor: 'background.paper',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <SpaIcon sx={{ fontSize: 80, color: 'white', opacity: 0.9 }} />
                    <Box sx={{ 
                        position: 'absolute', inset: 0, opacity: 0.2, 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', 
                        backgroundSize: '10px 10px' 
                    }} />
                </Box>
                <Box sx={{ position: 'absolute', top: -10, right: -10, width: 24, height: 24, bgcolor: 'primary.main', borderRadius: '50%', animation: 'bounce 2s infinite' }} />
                <Box sx={{ position: 'absolute', bottom: -5, left: -20, width: 16, height: 16, bgcolor: 'secondary.main', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            </Box>
    
            <Typography variant="h2" sx={{ 
                fontWeight: 800, mb: 2, 
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shimmer} 4s linear infinite`
            }}>
                Buscando tu lección...
            </Typography>
    
            <Typography variant="h6" color="text.secondary" sx={{ mb: 8, maxWidth: 500 }}>
                Espere mientras buscamos material didáctico basado en tus intereses.
            </Typography>
    
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'action.hover', px: 3, py: 1.5, borderRadius: 50 }}>
                    <AutoAwesomeIcon color="primary" sx={{ animation: 'spin 3s linear infinite' }} />
                    <Typography variant="subtitle2" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Estado</Typography>
                    <Box sx={{ width: 60, height: 6, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', inset: 0, width: '50%', bgcolor: 'primary.main', animation: `${shimmer} 2s infinite linear` }} />
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', animation: `${pulseSlow} 2s infinite` }}>
                    "{query ? `Preparando vocabulario sobre ${query}...` : 'Organizando ejercicios interactivos...'}"
                </Typography>
            </Box>
    
          </Box>
    
          <Box sx={{ mt: 8 }}>
             <Button onClick={onCancel} variant="text" color="inherit" startIcon={<CloseIcon />} sx={{ borderRadius: 50, px: 3, fontWeight: 600 }}>
                Cancelar Búsqueda
             </Button>
          </Box>
        </Box>
     );
  }

  // RENDER RESULT STATE (Tiny Lesson View)
  return (
    <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        color: 'text.primary',
    }}>
        {/* Nav Header REMOVED - Using Main Layout Header */}

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
             {/* Header Title & Edit */}
             <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 4, mb: 8 }}>
                 
                 {isEditing ? (
                     <Box component="form" onSubmit={handleEditSubmit} sx={{ flexGrow: 1, maxWidth: 600 }}>
                         <TextField 
                            autoFocus
                            fullWidth
                            value={tempQuery}
                            onChange={(e) => setTempQuery(e.target.value)}
                            placeholder="¿Qué quieres aprender?"
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { 
                                    fontSize: { xs: '3rem', md: '5rem' }, 
                                    fontWeight: 800, 
                                    lineHeight: 1,
                                    letterSpacing: '-0.02em',
                                    color: 'text.primary'
                                }
                            }}
                         />
                         <Typography variant="caption" color="text.secondary">Presiona Enter para buscar nuevamente</Typography>
                     </Box>
                 ) : (
                    <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box component="span" sx={{ color: 'primary.main' }}>Shuar para</Box>
                        <Box component="span" sx={{ color: 'text.primary' }}>{query || 'naturaleza'}</Box>
                    </Typography>
                 )}

                 <Box sx={{ display: 'flex', gap: 1.5 }}>
                     <IconButton 
                        onClick={() => { setIsEditing(!isEditing); setTempQuery(query); }}
                        sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark', boxShadow: 3 } }}
                    >
                         <EditIcon />
                     </IconButton>
                     <IconButton 
                        onClick={handleRefresh}
                        sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark', boxShadow: 3 } }}
                    >
                         <RefreshIcon />
                     </IconButton>
                     <IconButton onClick={onCancel} sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark', boxShadow: 3 } }}>
                         <CloseIcon />
                     </IconButton>
                 </Box>
             </Box>

             {/* Tabs like buttons - acting as category filters visually for now, but content is driven by search */}
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, overflowX: 'auto', pb: 1 }}>
                 {/* Reusing these as visual indicators or we can map levels here? Let's use them as types of content */}
                 <Button startIcon={<EventNoteIcon />} variant="contained" sx={{ borderRadius: 50, px: 3, py: 1.5, fontWeight: 600, boxShadow: 0, '&:hover': { boxShadow: 0 }, whiteSpace: 'nowrap' }}>
                    Lecciones
                 </Button>
                 <Button startIcon={<ChatBubbleOutlineIcon />} color="inherit" sx={{ borderRadius: 50, px: 3, py: 1.5, color: 'text.secondary', fontWeight: 600, bgcolor: 'action.hover', whiteSpace: 'nowrap' }}>
                    Frases
                 </Button>
                 <Button startIcon={<MenuBookIcon />} color="inherit" sx={{ borderRadius: 50, px: 3, py: 1.5, color: 'text.secondary', fontWeight: 600, bgcolor: 'action.hover', whiteSpace: 'nowrap' }}>
                    Sugerencias
                 </Button>
             </Box>

            {/* Subheader */}
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                 <EventNoteIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                 <Typography variant="h4" fontWeight="600">Lecciones Disponibles</Typography>
             </Box>

             {/* Dynamic Lesson Grid - Rendering lessonsByLevel */}
             {Object.entries(lessonsByLevel || {}).map(([levelName, lessons]) => (
                 <Box key={levelName} sx={{ mb: 6 }}>
                     <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                         {levelName}
                     </Typography>
                     
                     <Grid container spacing={3}>
                        {lessons.map((lesson) => (
                            <Grid item xs={12} md={6} key={lesson.id}>
                                <Box 
                                    onClick={() => handleLessonClick(lesson.id)}
                                    sx={{ 
                                        p: 3, borderRadius: 6, 
                                        bgcolor: alpha(theme.palette.primary.main, 0.03), 
                                        border: '1px solid', borderColor: 'divider',
                                        display: 'flex', gap: 3,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            boxShadow: 4, 
                                            transform: 'translateY(-4px)',
                                            borderColor: 'primary.main',
                                            bgcolor: 'background.paper'
                                        }
                                    }}
                                >
                                    {/* Image thumbnail like Spotify/Card */}
                                    <Box sx={{ width: 100, height: 100, flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
                                        <Box component="img" src={lesson.image} alt={lesson.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2 }}>{lesson.title}</Typography>
                                            <IconButton size="small" sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                                <PlayCircleIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {lesson.description}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08), px: 1, py: 0.5, borderRadius: 1 }}>
                                                {lesson.score || 10} XP
                                            </Typography>
                                            {lesson.status === 'completed' && <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                     </Grid>
                 </Box>
             ))}

             {(!lessonsByLevel || Object.keys(lessonsByLevel).length === 0) && (
                 <Box sx={{ textAlign: 'center', py: 8 }}>
                     <Typography variant="h6" color="text.secondary">No se encontraron lecciones.</Typography>
                 </Box>
             )}

        </Container>

    </Box>
  );
};

export default LoadingLesson;
