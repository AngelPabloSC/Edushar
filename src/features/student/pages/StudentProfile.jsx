import { useState } from 'react';
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
import { useUserProfile } from '../../../features/auth/hooks/useUserProfile.js';
import { useStudentLessons } from '../../../features/student/hooks/useStudentLessons.js'; // Import hook
import SettingsIcon from '@mui/icons-material/Settings';
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
import EditProfileDialog from '../../../shared/components/dialogs/EditProfileDialog';

const StudentProfile = () => {
  const { user: apiUser, loading: loadingUser, error: errorUser, updateUser } = useUserProfile();
  const { globalStats, recentActivity, loading: loadingLessons } = useStudentLessons();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loading = loadingUser || loadingLessons;
  const error = errorUser;

  // Format user data from API
  const user = apiUser ? {
    ...apiUser, // Keep all original data for editing
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    avatar: apiUser.photoProfile,
    email: apiUser.email,
    level: globalStats.levelLabel || 'Nivel Intermedio', // Use calculated level
    streak: globalStats.streak || 0, // Real streak
  } : null;

  // Real stats
  const completed = globalStats.completed || 0;
  const total = globalStats.total || 0;
  // Calculate percentage locally to ensure it matches the 1/15 (e.g., 7%) visualization perfectly
  // Using Math.floor because 1/15 is 6.66% -> 6% might be safer, but Math.round -> 7% is more accurate mathematically.
  // Sticking to Math.round for standard behavior.
  const calculatedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = {
    lessonsCompleted: completed,
    totalLessons: total,
    lessonsProgress: calculatedPercentage,
  };

  const activities = recentActivity; // Use real recent activity

  const handleUpdateProfile = async (data) => {
    const result = await updateUser(data);
    if (result.success) {
      setIsEditDialogOpen(false);
    }
    return result; // Pass result back to dialog for error handling
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
          <CircularProgress size={60} sx={{ color: '#935106' }} />
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
                    borderColor: 'rgba(147, 81, 6, 0.2)', // Darker orange alpha
                    boxShadow: 3,
                    bgcolor: '#935106', // Fallback color
                    color: 'white'
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
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
                      color: '#935106',
                      fontWeight: 'bold',
                      border: '2px solid',
                      borderColor: 'rgba(255, 152, 0, 0.3)',
                      fontSize: '0.875rem',
                      px: 1,
                      '& .MuiChip-icon': {
                        color: '#935106',
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => setIsEditDialogOpen(true)}
                  sx={{
                    flex: { xs: 1, md: 'none' },
                    fontWeight: 'bold',
                    borderWidth: 2,
                    borderColor: '#935106',
                    color: '#935106',
                    py: 1.5,
                    px: 3,
                    fontSize: '0.95rem',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#7a4205',
                      bgcolor: 'rgba(147, 81, 6, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Editar Perfil
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
                </Box>
                <Grid container spacing={3}>
                  {/* Lecciones */}
                  <Grid size={{ xs: 12 }}>
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
                          borderColor: '#935106',
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
                            borderColor: '#935106',
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
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
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
                    {activities.length > 0 ? (
                      activities.map((activity) => (
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
                                  bgcolor: 'rgba(147, 81, 6, 0.1)',
                                  color: '#935106',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            )}
                            {activity.score && (
                              <Typography variant="caption" fontWeight="600" sx={{ ml: 1 }}>
                                Puntaje: {activity.score}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                        Aún no tienes actividad reciente. ¡Comienza una lección!
                      </Typography>
                    )}
                  </Box>

                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
      {/* Edit Profile Dialog */}
      {user && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          user={user}
          onUpdate={handleUpdateProfile}
        />
      )}
    </Container>
  );
};

export default StudentProfile;
