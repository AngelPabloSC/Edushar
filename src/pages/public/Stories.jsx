import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ForestIcon from '@mui/icons-material/Forest';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StoryCard from '../../components/StoryCard';
import { useCrudAdminStory } from '../../hooks/api/useCrudAdminStory';

/**
 * Página Pública de Biblioteca de Cuentos Shuar
 * Muestra cuentos y leyendas con filtros por categoría
 */
const Stories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  // Fetch stories from API
  const { stories: apiStories, loading } = useCrudAdminStory();

  // Transform API data to component format
  const transformedStories = useMemo(() => {
    return apiStories.map(story => ({
      id: story.id,
      title: {
        shuar: story.title_shuar || '',
        es: story.title_español || ''
      },
      category: story.category || 'Mito',
      author: story.author || 'Desconocido',
      status: 'Publicado',
      cover: story.coverImage || ''
    }));
  }, [apiStories]);

  const categories = [
    { id: 'all', name: 'Todos los relatos', icon: <AutoAwesomeIcon /> },
    { id: 'Mito', name: 'Mitos Ancestrales', icon: <HistoryEduIcon /> },
    { id: 'Leyenda', name: 'Leyendas de la Selva', icon: <ForestIcon /> },
    { id: 'Naturaleza', name: 'Naturaleza', icon: <ForestIcon /> },
    { id: 'Tradición', name: 'Tradición', icon: <Diversity3Icon /> },
    { id: 'Fábula', name: 'Fábulas', icon: <Diversity3Icon /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '2.75rem' },
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          Cuentos y Leyendas Shuar
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 800,
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 400,
          }}
        >
          Sumérgete en la sabiduría ancestral de la selva amazónica. Explora relatos transmitidos por generaciones, presentados en Shuar y Español.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar de Filtros */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
              position: 'sticky',
              top: 24,
            }}
          >
            {/* Categorías */}
            <Box>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 'bold',
                  color: 'error.main',
                  letterSpacing: 1.5,
                  fontSize: '0.75rem',
                  display: 'block',
                  mb: 2,
                }}
              >
                CATEGORÍAS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    startIcon={cat.icon}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: selectedCategory === cat.id ? 'secondary.main' : 'transparent',
                      color: selectedCategory === cat.id ? 'white' : 'text.primary',
                      fontWeight: selectedCategory === cat.id ? 'bold' : 'medium',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: selectedCategory === cat.id ? 'secondary.dark' : 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s',
                      '& .MuiButton-startIcon': {
                        color: selectedCategory === cat.id ? 'white' : 'text.secondary',
                      },
                    }}
                  >
                    {cat.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Grid de Cuentos */}
        <Grid size={{ xs: 12, lg: 9 }}>
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Buscar historias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 2,
                  },
                  '&.Mui-focused': {
                    boxShadow: 3,
                    '& fieldset': {
                      borderColor: 'secondary.main',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Grid de Cards */}
          <Grid container spacing={3}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 10 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : (
              transformedStories
                .filter(story => selectedCategory === 'all' || story.category === selectedCategory)
                .filter(story =>
                  story.title?.shuar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  story.title?.es?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((story) => (
                  <Grid key={story.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <StoryCard
                      story={story}
                      onClick={() => navigate('/login')}
                    />
                  </Grid>
                ))
            )}
          </Grid>

          {/* Paginación */}
          {!loading && (
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={8}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="secondary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stories;
