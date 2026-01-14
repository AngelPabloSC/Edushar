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
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ForestIcon from '@mui/icons-material/Forest';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StoryCard from '../../components/StoryCard';

/**
 * Página de Biblioteca de Cuentos Shuar
 * Muestra cuentos y leyendas con filtros por categoría
 */
const StudentStories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Datos de ejemplo de cuentos
  const stories = [
    {
      id: 1,
      titleShuar: 'Etsa tura Yawá',
      titleSpanish: 'Etsa y el Jaguar',
      description: 'Descubre cómo el valiente joven Etsa utilizó su astucia para restaurar el equilibrio y devolver las aves a la selva.',
      category: 'Mito',
      duration: '5 min',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
    },
    {
      id: 2,
      titleShuar: 'Nunkui tura Nunka',
      titleSpanish: 'Nunkui y la Tierra',
      description: 'La historia de cómo la deidad Nunkui otorgó a las mujeres Shuar el conocimiento para cultivar la abundancia en sus huertos.',
      category: 'Leyenda',
      duration: '8 min',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    },
    {
      id: 3,
      titleShuar: 'Ji tura Unuimiar',
      titleSpanish: 'El Origen del Fuego',
      description: 'Un relato milenario sobre el astuto Taki y cómo el fuego fue traído para calentar los hogares de la comunidad.',
      category: 'Mito',
      duration: '6 min',
      image: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=400',
    },
    {
      id: 4,
      titleShuar: 'Entsa Wakani',
      titleSpanish: 'El Espíritu del Río',
      description: 'Los secretos que guardan las profundas aguas de la Amazonía y los seres místicos que protegen los recursos fluviales.',
      category: 'Leyenda',
      duration: '10 min',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
    },
    {
      id: 5,
      titleShuar: 'Shuar Nekas Tarimiat',
      titleSpanish: 'Vida en la Comunidad',
      description: 'Una mirada a las costumbres diarias, el valor de la familia y el respeto a los ancianos en el mundo Shuar.',
      category: 'Vida',
      duration: '4 min',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    },
    {
      id: 6,
      titleShuar: 'Ikiam Chicham',
      titleSpanish: 'La Voz de la Selva',
      description: 'Escucha los mensajes que los árboles y animales susurran a aquellos que saben escuchar con el corazón.',
      category: 'Leyenda',
      duration: '7 min',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    },
  ];

  const categories = [
    { id: 'all', name: 'Todos los relatos', icon: <AutoAwesomeIcon /> },
    { id: 'mitos', name: 'Mitos Ancestrales', icon: <HistoryEduIcon /> },
    { id: 'leyendas', name: 'Leyendas de la Selva', icon: <ForestIcon /> },
    { id: 'vida', name: 'Vida Cotidiana', icon: <Diversity3Icon /> },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            {stories.map((story) => (
              <Grid key={story.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <StoryCard story={story} />
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentStories;
