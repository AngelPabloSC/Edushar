import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Chip, 
  Tooltip, 
  TextField, 
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
  Skeleton,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudentLessons } from '../../hooks/pages/useStudentLessons';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useMemo } from 'react';
import LoadingLesson from '../../components/LoadingLesson';

/**
 * Dashboard del estudiante - EduShar Lab
 * Diseño mejorado con filtrado avanzado y estética "Lab"
 */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Custom hook data
  const { 
    lessonsByLevel, // Object: { 'Nivel 1...': [lessons], ... }
    loading, 
    searchQuery, 
    setSearchQuery 
  } = useStudentLessons();

  // Local state for UI filters & Loading Screen
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loadingCustom, setLoadingCustom] = useState(false);

  // Allow access to ALL lessons (unlocked)
  const handleLessonClick = (lessonId) => {
    // Simulating loading screen before navigation (optional, or just for search?)
    // User requested: "when the user searches the story... this new page loads"
    // So we apply it on search action mainly.
    // For navigation, let's keep it direct for now unless requested.
    navigate(`/leccion/${lessonId}`);
  };

  const getLessonStatus = (lesson) => lesson.status;

  // Filter logic: Filter the lessonsByLevel object based on selectedLevel
  const filteredLessonsByLevel = useMemo(() => {
    if (selectedLevel === 'all') return lessonsByLevel;

    const filtered = {};
    Object.entries(lessonsByLevel).forEach(([key, lessons]) => {
      const lowerKey = key.toLowerCase();
      if (selectedLevel === 'principiante' && (lowerKey.includes('nivel 1') || lowerKey.includes('principiante'))) {
        filtered[key] = lessons;
      } else if (selectedLevel === 'intermedio' && (lowerKey.includes('nivel 2') || lowerKey.includes('intermedio'))) {
        filtered[key] = lessons;
      } else if (selectedLevel === 'avanzado' && (lowerKey.includes('nivel 3') || lowerKey.includes('avanzado'))) {
        filtered[key] = lessons;
      }
    });
    return filtered;

  }, [lessonsByLevel, selectedLevel]);

  // Tags for quick search
  const tags = [
    { label: '🌿 Naturaleza', value: 'naturaleza' },
    { label: '🏹 Caza', value: 'caza' },
    { label: '🧶 Artesanía', value: 'artesanía' },
    { label: '🏠 Hogar', value: 'hogar' }
  ];

  const handleTagClick = (val) => {
    setSearchQuery(val);
    handleSearchAction(); // Trigger loading on tag click too
  };

  const handleSearchAction = () => {
     setLoadingCustom(true);
  };

  if (loadingCustom) {
      return (
        <LoadingLesson 
            onCancel={() => setLoadingCustom(false)} 
            query={searchQuery}
            setQuery={setSearchQuery}
            lessonsByLevel={lessonsByLevel}
        />
      );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        mb: 8, 
        pt: 4 
      }}>
        {/* Floating Image */}
        <Box sx={{ position: 'relative', width: 220, height: 220, mb: 4, '&:hover .main-img': { transform: 'scale(1.1)' } }}>
            <Box sx={{ 
                position: 'absolute', inset: 0, 
                bgcolor: alpha(theme.palette.primary.main, 0.2), 
                filter: 'blur(40px)', borderRadius: '50%', transform: 'scale(1.2)' 
            }} />
            <Box 
                component="img" 
                className="main-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAClquaYuHeJ2AgLFuWkxjioewQw0sDZlfNwKEuPCxsHoSgH_JpeIiQmiC63pncP9O4DBMjzuks41-HaGYXlfdmsXyKg5amlFFImvm5jRZfU805KYx3KmzJtmGR_rl7IPVXi0AYt0NABpARa2r6PU6CRrRyFII4aDNk052aM74Clet_eVGL9HRSY0cTFqNW9lbD0srj1VnXWcYftn8mwlIpJBX9vGD51mnfT0PBU3oA64-Y_TLzLloMYsrwja4OyPkPoFepfsRGTvn-"
                alt="EduShar Lab Icon"
                sx={{ 
                    position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain', 
                    borderRadius: 8, transition: 'transform 0.5s ease', dropShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
            />
             <Box sx={{ 
                position: 'absolute', top: -10, right: -10, zIndex: 2, 
                bgcolor: 'background.paper', p: 1, borderRadius: 3, boxShadow: 3,
                border: '1px solid', borderColor: 'divider',
                animation: 'float 3s ease-in-out infinite'
            }}>
                <AutoAwesomeIcon color="primary" />
            </Box>
        </Box>

        <Typography variant="h1" sx={{ 
            fontSize: { xs: '3rem', md: '4.5rem' }, 
            fontWeight: 900, 
            mb: 3, 
            letterSpacing: '-0.03em',
            background: `linear-gradient(45deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}>
            EduShar Lab
        </Typography>

        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 600, mb: 6, lineHeight: 1.6 }}>
            Aprende Shuar de forma inteligente. Descubre vocabulario, frases y sugerencias culturales personalizadas para cada ocasión.
        </Typography>


        {/* --- FILTERS CONTAINER --- */}
        <Box sx={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Grid for Inputs */}
            <Grid container spacing={3}>
                {/* Level Select */}
                <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
                     <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.1em', pl: 2, display: 'block', mb: 1 }}>
                        Elige tu nivel
                     </Typography>
                     <FormControl fullWidth variant="filled" hiddenLabel>
                        <Select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            displayEmpty
                            IconComponent={ExpandMoreIcon}
                            sx={{
                                borderRadius: 50,
                                bgcolor: 'background.paper', // Using paper instead of slate-100 logic for theme adaptability
                                '& .MuiSelect-select': { py: 2, px: 3, borderRadius: 50, '&:focus': { borderRadius: 50 } },
                                '&:before, &:after': { display: 'none' }, // Remove underlines
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8) }
                            }}
                            MenuProps={{
                                PaperProps: { sx: { borderRadius: 3, mt: 1, boxShadow: 4 } }
                            }}
                        >
                            <MenuItem value="all">Todos los niveles</MenuItem>
                            <MenuItem value="principiante">Principiante (Yamaram)</MenuItem>
                            <MenuItem value="intermedio">Intermedio (Nankaram)</MenuItem>
                            <MenuItem value="avanzado">Avanzado (Untsurí)</MenuItem>
                        </Select>
                     </FormControl>
                </Grid>

                {/* Search Input */}
                <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.1em', pl: 2, display: 'block', mb: 1 }}>
                        ¿Qué quieres aprender?
                     </Typography>
                    <TextField
                        fullWidth
                        placeholder="p. ej. Naturaleza, Caza..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                bgcolor: 'background.paper',
                                borderRadius: 50,
                                py: 1, px: 3,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
                                '&.Mui-focused': { boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` }
                            }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {tags.map((tag) => (
                    <Chip
                        key={tag.value}
                        label={tag.label}
                        onClick={() => handleTagClick(tag.value)}
                        variant="outlined"
                        sx={{
                            borderRadius: 50,
                            borderColor: 'divider',
                            color: 'text.secondary',
                            fontWeight: 600,
                            bgcolor: 'background.paper',
                            '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                bgcolor: 'white'
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Action Button */}
            <Box sx={{ pt: 2 }}>
                 <Button
                    onClick={handleSearchAction}
                    variant="contained"
                    size="large"
                    sx={{
                        borderRadius: 50,
                        px: 6, py: 1.5,
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        boxShadow: `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.3)}`,
                        textTransform: 'none',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
                        }
                    }}
                 >
                    Buscar Lección 
                    <AutoAwesomeIcon sx={{ ml: 1.5, fontSize: 20 }} />
                 </Button>
            </Box>

        </Box>
      </Box> {/* End Hero */}


      {/* Results Section Removed as per request - Interaction is now Search-Only */}
    </Container>
  );
};

export default StudentDashboard;
