import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useUserProfile } from '../../hooks/useUserProfile';
import { studentProfileData } from '../../data/profileData';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CheckIcon from '@mui/icons-material/Check';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';

/**
 * Página de Perfil del Estudiante
 * Muestra estadísticas, medallas y actividad reciente
 */
const StudentProfile = () => {
  const { user: apiUser, loading, error } = useUserProfile();
  const { stats, medals, activities } = studentProfileData;

  // Format user data from API
  const user = apiUser ? {
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    avatar: apiUser.photoProfile,
    email: apiUser.email,
    level: 'Nivel Intermedio', // This could come from stats later
    streak: 7, // This could come from stats later
  } : null;

  const getMedalIcon = (type) => {
    switch (type) {
      case 'military': return <MilitaryTechIcon />;
      case 'story': return <AutoStoriesIcon />;
      case 'trophy': return <EmojiEventsIcon />;
      case 'brain': return <PsychologyIcon />;
      case 'group': return <Diversity3Icon />;
      default: return <EmojiEventsIcon />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson': return <CheckIcon sx={{ fontSize: 16 }} />;
      case 'story': return <MenuBookIcon sx={{ fontSize: 16 }} />;
      case 'medal': return <StarIcon sx={{ fontSize: 16 }} />;
      case 'quiz': return <CheckIcon sx={{ fontSize: 16 }} />;
      default: return <CheckIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'lesson': return 'primary.main';
      case 'story': return 'info.main';
      case 'medal': return 'warning.main';
      case 'quiz': return 'primary.main';
      default: return 'primary.main';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} sx={{ color: 'secondary.main' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Profile Content - Only show when user data is loaded */}
      {!loading && user && (
        <>
          {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 128,
                height: 128,
                border: '4px solid',
                borderColor: 'rgba(209, 154, 74, 0.2)',
                boxShadow: 3,
              }}
            />
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                {user.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Aprendiz de Shuar • {user.level}
              </Typography>
              <Chip
                icon={<LocalFireDepartmentIcon />}
                label={`Racha de ${user.streak} días`}
                size="medium"
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(255, 152, 0, 0.15)',
                  color: 'warning.main',
                  fontWeight: 'bold',
                  border: '2px solid',
                  borderColor: 'rgba(255, 152, 0, 0.3)',
                  fontSize: '0.875rem',
                  px: 1,
                  '& .MuiChip-icon': {
                    color: 'warning.main',
                  },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              sx={{
                flex: { xs: 1, md: 'none' },
                fontWeight: 'bold',
                borderWidth: 2,
                borderColor: 'secondary.main',
                color: 'secondary.main',
                py: 1.5,
                px: 3,
                fontSize: '0.95rem',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'secondary.dark',
                  bgcolor: 'rgba(209, 154, 74, 0.08)',
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s',
              }}
            >
              Editar Perfil
            </Button>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              sx={{
                flex: { xs: 1, md: 'none' },
                bgcolor: 'secondary.main',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                px: 3,
                fontSize: '0.95rem',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'secondary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.2s',
              }}
            >
              Compartir
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Left Column: Stats & Medals */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Estadísticas */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                Estadísticas
              </Typography>
              <Button
                size="small"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(209, 154, 74, 0.08)',
                    textDecoration: 'underline',
                  },
                }}
              >
                Ver detalles →
              </Button>
            </Box>
            <Grid container spacing={3}>
              {/* Lecciones */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', width: 96, height: 96 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '8px solid',
                        borderColor: 'rgba(0, 0, 0, 0.05)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '8px solid',
                        borderColor: 'secondary.main',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        transform: 'rotate(216deg)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {stats.lessonsProgress}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      Lecciones
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.lessonsCompleted} / {stats.totalLessons}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                      <Typography variant="body2" color="secondary.main" fontWeight="600">
                        +2 esta semana
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Palabras */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', width: 96, height: 96 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '8px solid',
                        borderColor: 'rgba(0, 0, 0, 0.05)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '8px solid',
                        borderColor: 'secondary.main',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                        transform: 'rotate(270deg)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {stats.wordsLearned}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      Palabras
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      Aprendidas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                      <Typography variant="body2" color="secondary.main" fontWeight="600">
                        +15% vs mes anterior
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Medallas */}
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, px: 1 }}>
              Mis Medallas
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-around' }}>
                {medals.map((medal) => (
                  <Box
                    key={medal.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      opacity: medal.earned ? 1 : 0.4,
                      cursor: 'help',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: medal.earned ? 'scale(1.1)' : 'none',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: medal.earned
                          ? medal.color === 'warning'
                            ? 'rgba(255, 193, 7, 0.15)'
                            : medal.color === 'info'
                              ? 'rgba(33, 150, 243, 0.15)'
                              : 'rgba(76, 175, 80, 0.15)'
                          : 'rgba(0, 0, 0, 0.05)',
                        border: '2px solid',
                        borderColor: medal.earned
                          ? medal.color === 'warning'
                            ? 'warning.main'
                            : medal.color === 'info'
                              ? 'info.main'
                              : 'success.main'
                          : 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: medal.earned
                          ? medal.color === 'warning'
                            ? 'warning.main'
                            : medal.color === 'info'
                              ? 'info.main'
                              : 'success.main'
                          : 'text.disabled',
                      }}
                    >
                      {getMedalIcon(medal.iconType)}
                    </Box>
                    <Typography variant="caption" fontWeight="bold" textAlign="center" sx={{ maxWidth: 80 }}>
                      {medal.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Column: Activity Timeline */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, px: 1 }}>
            Actividad Reciente
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {/* Timeline line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 15,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  bgcolor: 'divider',
                }}
              />

              {/* Activities */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {activities.map((activity) => (
                  <Box key={activity.id} sx={{ position: 'relative', pl: 5 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: getActivityColor(activity.type),
                        border: '4px solid',
                        borderColor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        zIndex: 1,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        {activity.time}
                      </Typography>
                      {activity.exp && (
                        <Chip
                          label={`+${activity.exp} EXP`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(209, 154, 74, 0.1)',
                            color: 'secondary.main',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      )}
                      {activity.score && (
                        <Typography variant="caption" fontWeight="600">
                          Puntaje: {activity.score}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                fullWidth
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Ver todo el historial
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
        </>
      )}
    </Container>
  );
};

export default StudentProfile;
