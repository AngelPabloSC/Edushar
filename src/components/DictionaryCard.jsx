import { memo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Skeleton,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PropTypes from 'prop-types';

/**
 * Componente reutilizable para mostrar entradas del diccionario
 */
const DictionaryCard = ({ entry, loading = false }) => {
  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={{ xs: '100%', md: 192 }}
          height={{ xs: 192, md: '100%' }}
          sx={{ minHeight: { md: 240 } }}
          animation="wave"
        />
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ width: '60%' }}>
              <Skeleton variant="text" height={48} width="80%" sx={{ mb: 1 }} animation="wave" />
              <Skeleton variant="text" height={28} width="60%" animation="wave" />
            </Box>
            <Skeleton variant="rounded" width={80} height={24} animation="wave" />
          </Box>

          <Box
            sx={{
              mt: 3,
              pl: 2,
              borderLeft: '3px solid',
              borderColor: 'rgba(0,0,0,0.1)',
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              py: 2,
              pr: 2,
              borderRadius: 1,
            }}
          >
            <Skeleton variant="text" height={24} width="100%" sx={{ mb: 1.5 }} animation="wave" />
            <Skeleton variant="text" height={24} width="90%" animation="wave" />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Skeleton variant="rounded" width={100} height={32} animation="wave" />
            <Skeleton variant="rounded" width={90} height={32} animation="wave" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const handlePronounce = () => {
    if ('speechSynthesis' in window) {
      // Cancelar cualquier pronunciación anterior
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(entry.wordSpanish);
      
      // Intentar obtener las voces disponibles
      let voices = window.speechSynthesis.getVoices();
      
      // Función para seleccionar la mejor voz
      const selectVoice = () => {
        // Buscar voces en español
        const esVoices = voices.filter(voice => voice.lang.startsWith('es'));
        
        // Priorizar voces de alta calidad (Google, Microsoft, Paulina, Monica)
        let bestVoice = esVoices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Paulina') || 
          voice.name.includes('Monica') || 
          voice.name.includes('Jorge')
        );

        // Si no encuentra una específica, usar la primera en español disponible
        if (!bestVoice && esVoices.length > 0) {
          bestVoice = esVoices[0];
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
          utterance.lang = bestVoice.lang;
        } else {
             // Fallback
             utterance.lang = 'es-ES';
        }
        
        utterance.rate = 0.9; // Un poco más fluido
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      };

      // Si las voces ya están cargadas
      if (voices.length > 0) {
        selectVoice();
      } else {
        // En algunos navegadores (Chrome), las voces se cargan asincrónicamente
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          selectVoice();
          // Limpiar el evento para evitar fugas o múltiples llamadas
          window.speechSynthesis.onvoiceschanged = null;
        };
      }
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'all 0.3s',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', md: 192 },
          height: { xs: 192, md: 'auto' },
          objectFit: 'cover',
        }}
        image={entry.image}
        alt={entry.wordShuar}
      />
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: 'secondary.main',
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {entry.wordSpanish}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontStyle: 'italic',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              {entry.wordShuar}
            </Typography>
          </Box>
          <Chip
            label={entry.category}
            size="small"
            sx={{
              bgcolor: 'rgba(209, 154, 74, 0.15)',
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              border: '1px solid',
              borderColor: 'rgba(209, 154, 74, 0.3)',
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 3,
            pl: 2,
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
            bgcolor: 'rgba(209, 154, 74, 0.05)',
            py: 1.5,
            pr: 2,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 1.5,
              color: 'text.primary',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: '#D19A4A', fontWeight: 700 }}>Shuar:</strong> {entry.exampleShuar}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ fontWeight: 600 }}>Español:</strong> {entry.exampleSpanish}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            size="small"
            onClick={handlePronounce}
            startIcon={<VolumeUpIcon />}
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(209, 154, 74, 0.08)',
              },
            }}
          >
            Pronunciar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

DictionaryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.number,
    wordShuar: PropTypes.string,
    wordSpanish: PropTypes.string,
    category: PropTypes.string,
    exampleShuar: PropTypes.string,
    exampleSpanish: PropTypes.string,
    image: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

// Memoize component to prevent unnecessary re-renders
export default memo(DictionaryCard);
