import { Box, Container, Typography, TextField, InputAdornment, Grid, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../../components/LessonCard';
import { getLessonsByLevel } from '../../data/lessonsData';

const Lessons = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const lessonsByLevel = getLessonsByLevel();

  const handleLessonClick = (lessonId) => {
    navigate('/login');
  };

  const levelIcons = {
    1: Filter1Icon,
    2: Filter2Icon,
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'rgba(209, 154, 74, 0.05)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 256,
            height: 256,
            bgcolor: 'rgba(209, 154, 74, 0.05)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            transform: 'translate(50%, -50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 384,
            height: 384,
            bgcolor: 'rgba(209, 154, 74, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            transform: 'translate(-25%, 50%)',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 900,
              color: 'text.primary',
              mb: 3,
              letterSpacing: '-0.02em',
            }}
          >
            Explora nuestro programa de estudios
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              mb: 4,
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Descubre la riqueza del idioma Shuar a través de un currículo diseñado para guiarte desde las bases hasta la fluidez, preservando la cultura y la tradición ancestral.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 3, sm: 4, md: 6 } }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
          <TextField
            fullWidth
            placeholder="Buscar en el catálogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: 600,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'secondary.main',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'secondary.main',
                  },
                },
              },
            }}
          />
        </Box>

        {/* Lessons by Level */}
        {lessonsByLevel.map((levelData) => {
          const LevelIcon = levelIcons[levelData.level] || Filter1Icon;

          return (
            <Box key={levelData.level} sx={{ mb: 10 }}>
              {/* Level Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(209, 154, 74, 0.2)',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LevelIcon sx={{ fontSize: 28, color: 'secondary.main' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2rem' },
                    }}
                  >
                    Nivel {levelData.level}: {levelData.levelName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {levelData.level === 1
                      ? 'Introducción al vocabulario y estructuras básicas.'
                      : 'Expandiendo el vocabulario y frases cotidianas.'}
                  </Typography>
                </Box>
              </Box>

              {/* Lessons Grid */}
              <Grid
                container
                spacing={{ xs: 3, md: 4 }}
                justifyContent="center"
                alignItems="stretch"
              >
                {levelData.lessons.map((lesson) => (
                  <Grid
                    key={lesson.id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                    sx={{ display: 'flex' }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <LessonCard
                        title={lesson.title}
                        description={lesson.description}
                        image={lesson.image}
                        onClick={() => handleLessonClick(lesson.id)}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Container>
    </Box>
  );
};

export default Lessons;
