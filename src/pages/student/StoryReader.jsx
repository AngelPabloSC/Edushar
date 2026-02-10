import {
  Box,
  Container,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Paper,
  Divider,
  Fade,
  useTheme,
  alpha,
  Grid,
  Pagination,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VerifiedIcon from '@mui/icons-material/Verified';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useStoryDetail } from '../../hooks/pages/useStoryDetail';

/**
 * Página de lectura de cuentos bilingüe (Shuar-Español)
 * Incluye paginación y toggle de traducción
 */
const StoryReader = () => {
  const { storyId: paramStoryId, id: paramId } = useParams();
  const storyId = paramStoryId || paramId;
  const navigate = useNavigate();
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const { story, loading, error } = useStoryDetail(storyId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="error" size={60} thickness={4} />
          <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 'bold' }}>Cargando historia...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !story) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h5" color="error" gutterBottom fontWeight="bold">{error || 'Historia no encontrada'}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          No pudimos cargar la información de este relato.
        </Typography>
        <Button onClick={() => navigate('/estudiante/cuentos')} variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 'bold' }}>
          Volver a la Biblioteca
        </Button>
      </Box>
    );
  }

  const totalPages = story.pages.length;
  const currentPageData = story.pages[currentPage];
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: 'rgba(247, 232, 199, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/estudiante/cuentos')}
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: 'rgba(192, 86, 33, 0.08)',
                },
              }}
            >
              Volver a la Biblioteca
            </Button>

            <Typography
              variant="h6"
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: 'serif',
                fontWeight: 900,
                color: 'text.primary',
              }}
            >
              {story.title?.es}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Toggle removed from here as per user request */}
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Hero Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 320, lg: 400 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${story.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(247, 232, 199, 1) 0%, rgba(247, 232, 199, 0.2) 50%, transparent 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            px: 3,
            pb: 6,
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Chip
              icon={<AutoStoriesIcon />}
              label={story.category}
              size="small"
              sx={{
                bgcolor: 'rgba(192, 86, 33, 0.9)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                mb: 2,
                backdropFilter: 'blur(4px)',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'serif',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 900,
                color: 'text.primary',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {story.title?.shuar}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'serif',
                fontStyle: 'italic',
                color: 'text.secondary',
              }}
            >
              {story.title?.es}
            </Typography>
          </Container>
        </Box>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 6 } }}>
        {/* Introduction */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 10, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 4, bgcolor: 'error.main', mx: 'auto', mb: 4, borderRadius: 10, opacity: 0.6 }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'serif',
              fontStyle: 'italic',
              color: 'text.secondary',
              lineHeight: 1.8,
              mb: 3,
            }}
          >
            "{story.introduction}"
          </Typography>

          {/* Translation Toggle moved here */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showTranslation}
                  onChange={(e) => setShowTranslation(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Traducir
                </Typography>
              }
              sx={{
                bgcolor: 'rgba(192, 86, 33, 0.05)',
                px: 3,
                py: 1,
                borderRadius: 10,
                border: '1px solid',
                borderColor: 'rgba(192, 86, 33, 0.2)',
                m: 0,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(192, 86, 33, 0.1)',
                  borderColor: 'rgba(192, 86, 33, 0.4)',
                }
              }}
            />
          </Box>
        </Box>

        {/* Paragraphs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentPageData.paragraphs.map((paragraph, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                transition: 'all 0.3s',
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.4)',
                  borderColor: 'rgba(68, 42, 42, 0.05)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: { xs: 4, md: 8 },
                  alignItems: 'start',
                }}
              >
                {/* Shuar */}
                <Box sx={{ position: 'relative' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      left: -24,
                      top: 4,
                      fontWeight: 'bold',
                      color: 'error.main',
                      opacity: 0.4,
                      fontSize: '0.75rem',
                    }}
                  >
                    {(currentPage * 2) + index + 1}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'serif',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontWeight: 500,
                    }}
                  >
                    {paragraph.shuar}
                  </Typography>
                </Box>

                {/* Spanish */}
                {showTranslation && (
                  <Box
                    sx={{
                      pl: { xs: 3, md: 4 },
                      borderLeft: { xs: '2px solid', md: 'none' },
                      borderColor: { xs: 'rgba(192, 86, 33, 0.2)', md: 'transparent' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        lineHeight: 1.8,
                        color: 'text.secondary',
                      }}
                    >
                      {paragraph.spanish}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Mobile separator */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', height: 1, bgcolor: 'divider', my: 2 }} />
            </Paper>
          ))}
        </Box>

        {/* Pagination Controls */}
        <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
              },
              '&:disabled': {
                opacity: 0.3,
              },
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Página {currentPage + 1} de {totalPages}
          </Typography>

          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
              },
              '&:disabled': {
                opacity: 0.3,
              },
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>

        {/* Complete Button */}
        {currentPage === totalPages - 1 && (
          <Box sx={{ mt: 12, textAlign: 'center' }}>
            <Box sx={{ display: 'inline-block', p: 0.5, borderRadius: 3, bgcolor: 'rgba(0, 0, 0, 0.03)' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<VerifiedIcon />}
                sx={{
                  px: 6,
                  py: 2,
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  borderRadius: 2,
                  boxShadow: 6,
                  '&:hover': {
                    bgcolor: 'error.main',
                    boxShadow: 8,
                  },
                }}
              >
                Marcar como Leído
              </Button>
            </Box>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled', fontWeight: 500 }}>
              Has completado el {progress}% de esta historia
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StoryReader;
