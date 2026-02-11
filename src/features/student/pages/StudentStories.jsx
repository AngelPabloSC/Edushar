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
  Skeleton
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ForestIcon from '@mui/icons-material/Forest';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StoryCard from '@shared/components/cards/StoryCard';
import { usePublicStories } from '@features/student/hooks/usePublicStories';

/**
 * Página de Biblioteca de Cuentos Shuar
 * Muestra cuentos y leyendas con filtros por categoría
 */
const StudentStories = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const {
    stories,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories
  } = usePublicStories();

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Todos los relatos': return <AutoAwesomeIcon />;
      case 'Mito': return <HistoryEduIcon />;
      case 'Leyenda': return <ForestIcon />;
      case 'Naturaleza': return <ForestIcon />;
      case 'Tradición': return <Diversity3Icon />;
      default: return <AutoAwesomeIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
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
              borderRadius: 3,
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
                {categories.map((catName) => (
                  <Button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    startIcon={getCategoryIcon(catName)}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: selectedCategory === catName ? 'secondary.main' : 'transparent',
                      color: selectedCategory === catName ? 'white' : 'text.primary',
                      fontWeight: selectedCategory === catName ? 'bold' : 'medium',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: selectedCategory === catName ? 'secondary.dark' : 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s',
                      '& .MuiButton-startIcon': {
                        color: selectedCategory === catName ? 'white' : 'text.secondary',
                      },
                    }}
                  >
                    {catName}
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
              // Loading Skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton variant="text" height={32} width="80%" />
                      <Skeleton variant="text" height={20} width="60%" />
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : stories.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                  <Typography variant="h5" color="text.secondary">
                    No se encontraron historias
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Intenta cambiar los filtros o la búsqueda
                  </Typography>
                </Box>
              </Grid>
            ) : (
              stories.map((story) => (
                <Grid key={story.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <StoryCard
                    story={story}
                    onClick={() => navigate(`/estudiante/cuentos/${story.id}`)}
                  />
                </Grid>
              ))
            )}
          </Grid>

          {/* Paginación */}
          {!loading && stories.length > 0 && (
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(stories.length / 9)} // Client-side pagination logic since hook returns all
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


export default StudentStories;
