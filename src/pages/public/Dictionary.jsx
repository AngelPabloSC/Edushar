import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Grid,
  Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DictionaryCard from '../../components/DictionaryCard';

import { dictionaryEntries, dictionaryStats } from '../../data/dictionaryData';

/**
 * Página Pública del Diccionario Bilingüe Shuar-Español
 * Permite buscar palabras con ejemplos de uso
 */
const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stats = dictionaryStats;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
          Diccionario Shuar-Español
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 400,
          }}
        >
          Preservando la cultura a través del lenguaje, una palabra a la vez.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar una palabra (ej: Nua, Ii, Kichwa)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  },
                }}
              >
                Buscar
              </Button>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 2,
              pr: 1,
              '&:hover': {
                boxShadow: 3,
              },
              '&.Mui-focused': {
                boxShadow: 4,
                '& fieldset': {
                  borderColor: 'secondary.main',
                  borderWidth: 2,
                },
              },
            },
          }}
        />
      </Box>

      {/* Dictionary Results */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
        {loading
          ? [1, 2, 3].map((n) => <DictionaryCard key={n} loading={true} />)
          : dictionaryEntries
            .filter(entry =>
              entry.wordShuar.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.wordSpanish.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((entry) => (
              <DictionaryCard key={entry.id} entry={entry} />
            ))
        }
      </Box>

      {/* Empty State / Suggestion */}
      {!loading && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            mt: 4,
            textAlign: 'center',
            bgcolor: 'rgba(209, 154, 74, 0.08)',
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'rgba(209, 154, 74, 0.3)',
          }}
        >
          <SearchOffIcon sx={{ fontSize: 64, color: 'rgba(209, 154, 74, 0.5)', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
            ¿No encuentras lo que buscas?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3, fontSize: '1rem' }}>
            Nuestra comunidad está expandiendo constantemente el diccionario. Si falta una palabra, ¡háznoslo saber!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/login')} // Redirigir a login si es público
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                bgcolor: 'secondary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            Inicia sesión para contribuir
          </Button>
        </Paper>
      )}

      {/* Footer Stats */}
      <Box
        sx={{
          mt: 6,
          pt: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: 2,
            fontSize: '0.75rem',
            mb: 2,
            display: 'block',
          }}
        >
          Base de Datos del Diccionario
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          <Grid size={{ xs: 4, md: 'auto' }}>
            <Typography variant="h3" fontWeight="900" color="secondary.main">
              {loading ? <Skeleton width={100} /> : stats.words}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.7, fontSize: '0.7rem', fontWeight: 600 }}>
              Palabras
            </Typography>
          </Grid>
          <Grid size={{ xs: 4, md: 'auto' }}>
            <Typography variant="h3" fontWeight="900" color="secondary.main">
              {loading ? <Skeleton width={80} /> : stats.audioClips}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.7, fontSize: '0.7rem', fontWeight: 600 }}>
              Audios
            </Typography>
          </Grid>
          <Grid size={{ xs: 4, md: 'auto' }}>
            <Typography variant="h3" fontWeight="900" color="secondary.main">
              {loading ? <Skeleton width={60} /> : stats.contributors}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.7, fontSize: '0.7rem', fontWeight: 600 }}>
              Contribuidores
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dictionary;
