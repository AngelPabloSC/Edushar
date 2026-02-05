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
  Skeleton,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ForestIcon from '@mui/icons-material/Forest';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PetsIcon from '@mui/icons-material/Pets';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DictionaryCard from '../../components/DictionaryCard';
import { usePublicDictionary } from '../../hooks/pages/usePublicDictionary';

/**
 * Página del Diccionario Bilingüe Shuar-Español
 * Permite buscar palabras con ejemplos de uso
 */
const StudentDictionary = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { entries, loading, stats } = usePublicDictionary();

  // Extract unique categories from entries
  const uniqueCategories = [...new Set(entries.map(entry => entry.category).filter(Boolean))];
  
  // Build categories array dynamically
  const categories = [
    { id: 'all', name: 'Todas las palabras', icon: <AutoAwesomeIcon /> },
    ...uniqueCategories.map(cat => ({
      id: cat,
      name: cat,
      icon: cat === 'Animales' ? <PetsIcon /> :
            cat === 'Naturaleza' ? <ForestIcon /> :
            cat === 'Familia' ? <Diversity3Icon /> :
            cat.includes('Verbo') || cat.includes('Acción') ? <HistoryEduIcon /> :
            cat.includes('Saludo') || cat.includes('Frase') ? <RecordVoiceOverIcon /> :
            <AutoAwesomeIcon />
    }))
  ];

  // Client-side filtering
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = (entry.wordShuar || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (entry.wordSpanish || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            (entry.category && entry.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });
  
  // Pagination
  const ITEMS_PER_PAGE = 9;
  const count = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
          Diccionario Shuar-Español
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
          Preservando la cultura a través del lenguaje. Explora miles de términos, escucha su pronunciación y aprende su uso en contexto.
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
                  color: 'secondary.main', // Changed to secondary
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
            
            {/* Stats Mini Widget */}
             <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    ESTADÍSTICAS
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="h5" color="text.primary" fontWeight="800">{stats.words || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Palabras</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="h5" color="text.primary" fontWeight="800">{stats.audioClips || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Audios</Typography>
                    </Grid>
                </Grid>
             </Box>
          </Paper>
        </Grid>

        {/* Grid de Palabras */}
        <Grid size={{ xs: 12, lg: 9 }}>
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Buscar palabras en Shuar o Español..."
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

          {/* Grid de Cards (List View) */}
          <Grid container spacing={3}>
            {loading ? (
                 // Loading Skeletons
                 Array.from(new Array(5)).map((_, index) => (
                  <Grid key={index} size={{ xs: 12 }}>
                     <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                       <Skeleton variant="rectangular" width="100%" height={200} sx={{ maxWidth: { md: 280 } }} />
                       <Box sx={{ p: 3, flex: 1 }}>
                         <Skeleton variant="text" height={40} width="60%" />
                         <Skeleton variant="text" height={24} width="40%" />
                         <Skeleton variant="rectangular" height={80} sx={{ mt: 2, borderRadius: 1 }} />
                       </Box>
                     </Paper>
                  </Grid>
                ))
            ) : filteredEntries.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                        <SearchOffIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                        <Typography variant="h5" color="text.secondary">
                            No se encontraron palabras
                        </Typography>
                         <Typography variant="body1" color="text.secondary">
                            Prueba con otro término de búsqueda.
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => navigate('/estudiante/contribuciones')}
                            sx={{ mt: 3, borderRadius: 50 }}
                        >
                            Contribuir Palabra
                        </Button>
                    </Box>
                </Grid>
            ) : (
                paginatedEntries.map((entry) => (
                <Grid key={entry.id} size={{ xs: 12 }}>
                    <DictionaryCard entry={entry} />
                </Grid>
                ))
            )}
          </Grid>

          {/* Paginación */}
          {!loading && filteredEntries.length > 0 && (
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                count={count}
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

export default StudentDictionary;
