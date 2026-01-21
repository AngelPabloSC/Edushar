import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Chip, Tooltip, TextField, InputAdornment, LinearProgress, Paper, Button, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { lessonsData } from '../../data/lessonsData';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useState, useEffect } from 'react';

/**
 * Dashboard del estudiante - Muestra todas las lecciones disponibles
 * Sigue principios de Don Norman y design_guide.md
 */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLessonClick = (lessonId, isLocked) => {
    if (!isLocked) {
      navigate(`/leccion/${lessonId}`);
    }
  };

  // Calcular progreso global
  const completedLessons = lessonsData.filter(l => l.completed).length;
  const totalLessons = lessonsData.length;
  const globalProgress = Math.round((completedLessons / totalLessons) * 100);

  // Filtrar lecciones por búsqueda
  const filteredLessons = lessonsData.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrupar lecciones filtradas por nivel
  const lessonsByLevel = filteredLessons.reduce((acc, lesson) => {
    const level = lesson.levelName;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(lesson);
    return acc;
  }, {});

  // Función para determinar el estado de la lección
  const getLessonStatus = (lesson) => {
    if (lesson.completed) return 'completed';
    if (lesson.inProgress) return 'in-progress';
    if (lesson.locked) return 'locked';
    return 'available';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: 720, width: '100%' }}>
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
              Mis Lecciones
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 400,
              }}
            >
              Continúa tu camino de aprendizaje del idioma Shuar. ¡Estás progresando muy bien!
            </Typography>
          </Box>

          {/* Barra de Búsqueda */}
          <Box sx={{ minWidth: { xs: '100%', md: 300 } }}>
            <TextField
              fullWidth
              placeholder="Buscar lecciones..."
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
                  transition: 'all 0.3s',
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
        </Box>

        {/* Widget de Progreso Global */}
        {loading ? (
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} animation="wave" />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Nivel 1: Principiante
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Has completado {completedLessons} de {totalLessons} lecciones
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" color="secondary.main">
                {globalProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={globalProgress}
              sx={{
                height: 12,
                borderRadius: 10,
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 10,
                  bgcolor: 'secondary.main',
                },
              }}
            />
          </Paper>
        )}
      </Box>

      {/* Mensaje si no hay resultados */}
      {!loading && Object.keys(lessonsByLevel).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No se encontraron lecciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Intenta con otros términos de búsqueda
          </Typography>
        </Box>
      )}

      {/* Lecciones por Nivel Skeleton Loading */}
      {loading && (
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Skeleton variant="rounded" width={40} height={40} animation="wave" />
            <Skeleton variant="text" width={300} height={40} animation="wave" />
          </Box>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[1, 2, 3].map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Skeleton variant="rectangular" height={192} animation="wave" />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" height={32} width="80%" sx={{ mb: 2 }} animation="wave" />
                    <Skeleton variant="text" height={20} width="100%" animation="wave" />
                    <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3 }} animation="wave" />
                    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} animation="wave" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Lecciones por Nivel Data */}
      {!loading && Object.entries(lessonsByLevel).map(([levelName, lessons]) => (
        <Box key={levelName} sx={{ mb: 8 }}>
          {/* Título del Nivel */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box
              sx={{
                bgcolor: 'rgba(209, 154, 74, 0.2)',
                p: 1,
                borderRadius: 2,
                color: 'secondary.main',
                display: 'flex',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {levelName.includes('1') ? '1' : '2'}
              </Typography>
            </Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
              }}
            >
              {levelName}
            </Typography>
          </Box>

          {/* Grid de Lecciones */}
          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            justifyContent="flex-start"
            alignItems="stretch"
          >
            {lessons.map((lesson) => {
              const status = getLessonStatus(lesson);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in-progress';

              return (
                <Grid
                  key={lesson.id}
                  size={{ xs: 12, sm: 6, md: 4 }}
                  sx={{ display: 'flex' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: isInProgress ? 'secondary.main' : isLocked ? 'divider' : 'rgba(209, 154, 74, 0.2)',
                      opacity: isLocked ? 0.7 : 1,
                      boxShadow: isInProgress ? 4 : isLocked ? 1 : 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: isLocked ? 'none' : 'translateY(-8px)',
                        boxShadow: isInProgress ? 6 : isLocked ? 1 : 4,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleLessonClick(lesson.id, isLocked)}
                      disabled={isLocked}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {/* Imagen con overlay */}
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="192"
                          image={lesson.image}
                          alt={lesson.title}
                          sx={{
                            objectFit: 'cover',
                            filter: isLocked ? 'grayscale(100%)' : 'none',
                            opacity: isLocked ? 0.6 : 1,
                            transition: 'transform 0.5s ease',
                            '.MuiCardActionArea-root:hover &': {
                              transform: isLocked ? 'none' : 'scale(1.08)',
                            },
                          }}
                        />

                        {/* Badge de Estado */}
                        {isCompleted && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Completado"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              bgcolor: 'rgba(255, 255, 255, 0.95)',
                              color: 'success.main',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              boxShadow: 2,
                              '& .MuiChip-icon': {
                                color: 'success.main',
                              },
                            }}
                          />
                        )}

                        {isInProgress && (
                          <>
                            <Chip
                              icon={<PlayCircleIcon />}
                              label="En Curso"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: 'secondary.main',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                boxShadow: 3,
                              }}
                            />
                            {/* Mini progress bar en la imagen */}
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  bgcolor: 'secondary.main',
                                  width: `${lesson.progress || 60}%`,
                                }}
                              />
                            </Box>
                          </>
                        )}

                        {isLocked && (
                          <Tooltip title="Completa las lecciones anteriores para desbloquear" arrow>
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                                backdropFilter: 'blur(2px)',
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                                  borderRadius: '50%',
                                  p: 2,
                                  display: 'flex',
                                  boxShadow: 4,
                                }}
                              >
                                <LockIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                              </Box>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Contenido de la Card */}
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                            color: isLocked ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {lesson.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            flexGrow: 1,
                            mb: isInProgress ? 2 : 3,
                            opacity: isLocked ? 0.7 : 1,
                          }}
                        >
                          {lesson.description}
                        </Typography>

                        {/* Barra de progreso para lecciones en curso */}
                        {isInProgress && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" fontWeight="600">
                                Progreso
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight="600">
                                {lesson.progress || 60}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={lesson.progress || 60}
                              sx={{
                                height: 8,
                                borderRadius: 10,
                                bgcolor: 'rgba(0, 0, 0, 0.05)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 10,
                                  bgcolor: 'secondary.main',
                                },
                              }}
                            />
                          </Box>
                        )}

                        {/* Botón de acción */}
                        {isCompleted && (
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                              py: 1.5,
                              borderWidth: 2,
                              borderColor: 'secondary.main',
                              color: 'secondary.main',
                              fontWeight: 'bold',
                              '&:hover': {
                                borderWidth: 2,
                                bgcolor: 'secondary.main',
                                color: 'white',
                              },
                            }}
                          >
                            Repasar
                          </Button>
                        )}

                        {isInProgress && (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{
                              py: 1.5,
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontWeight: 'bold',
                              boxShadow: 3,
                              '&:hover': {
                                bgcolor: 'secondary.dark',
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                              },
                            }}
                          >
                            Continuar
                          </Button>
                        )}

                        {isLocked && (
                          <Button
                            variant="contained"
                            fullWidth
                            disabled
                            sx={{
                              py: 1.5,
                              bgcolor: 'rgba(0, 0, 0, 0.08)',
                              color: 'text.disabled',
                              fontWeight: 'bold',
                            }}
                          >
                            Bloqueado
                          </Button>
                        )}

                        {!isLocked && !isCompleted && !isInProgress && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'secondary.main',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                            }}
                          >
                            Comenzar lección →
                          </Box>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default StudentDashboard;
