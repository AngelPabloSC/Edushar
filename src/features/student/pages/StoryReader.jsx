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
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VerifiedIcon from '@mui/icons-material/Verified';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useStoryReader } from '../hooks/useStoryReader';


const StoryReader = () => {
  const {
    story,
    loading,
    error,
    showTranslation,
    setShowTranslation,
    currentPage,
    totalPages,
    progress,
    handleNextPage,
    handlePrevPage,
    navigate,
    currentPageData
  } = useStoryReader();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  if (error || !story) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 4, justifyContent: 'center' }}>
          {error || 'Cuento no encontrado'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/estudiante/cuentos')}>
          Volver a la Biblioteca
        </Button>
      </Container>
    );
  }

  if (!currentPageData) return null;

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
              {story.titleSpanish}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  border: '1px solid',
                  borderColor: 'divider',
                  m: 0,
                }}
              />
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
            backgroundImage: `url(${story.image})`,
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
              {story.titleShuar}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'serif',
                fontStyle: 'italic',
                color: 'text.secondary',
              }}
            >
              {story.titleSpanish}
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
            }}
          >
            "{story.introduction}"
          </Typography>
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
