import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoginContext as useAuth } from '@features/auth/context/LoginContext';
import { useStudentLessons } from '../hooks/useStudentLessons.js';
import DashboardCard from '@shared/components/cards/DashboardCard';
import { useUserProfile } from '@features/auth/hooks/useUserProfile';

/**
 * Dashboard principal del estudiante - Página de inicio mejorada
 * Diseño "Hub" con layout dividido: Sticky Sidebar + Scrollable Cards
 * Full Screen Mode (Sin PrivateLayout)
 */
const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: profileUser } = useUserProfile();
  const { globalStats } = useStudentLessons();

  // Safe access to stats
  const completedCount = globalStats?.completed || 0;
  const totalLessons = globalStats?.total || 0;

  // Datos para las tarjetas de navegación
  const dashboardItems = [
    {
      id: 'lecciones',
      subtitle: globalStats?.levelLabel || 'Nivel 1 • Fundamentos',
      title: 'Lecciones Shuar',
      description: 'Descubre vocabulario, frases y gramática esencial a través de lecciones interactivas.',
      image: 'https://res.cloudinary.com/dbxjfufqv/image/upload/v1770758465/Gemini_Generated_Image_tb14eetb14eetb14_jeleah.png',
      color: 'primary',
      onClick: () => navigate('/estudiante/lecciones'),
      buttonText: 'Empezar'
    },
    {
      id: 'stories',
      subtitle: 'Cultura • Narrativa',
      title: 'Cuentos y Mitos',
      description: 'Sumérgete en la cosmovisión Shuar a través de historias tradicionales animadas.',
      image: 'https://res.cloudinary.com/dbxjfufqv/image/upload/v1770758464/unnamed_mp5fkp.jpg',
      color: 'secondary',
      onClick: () => navigate('/estudiante/cuentos'),
      buttonText: 'Leer ahora'
    },
    {
      id: 'translator',
      subtitle: 'Herramienta • Traducción',
      title: 'Traductor Shuar',
      description: 'Traduce frases y textos del español al Shuar con justificación lingüística.',
      image: 'https://res.cloudinary.com/dbxjfufqv/image/upload/v1770758465/Gemini_Generated_Image_fr77f6fr77f6fr77_qhdusr.png',
      color: 'primary',
      onClick: () => navigate('/estudiante/traductor'),
      buttonText: 'Traducir'
    },
    {
      id: 'dictionary',
      subtitle: 'Vocabulario • Consulta',
      title: 'Diccionario',
      description: 'Explora más de 5,000 términos con ejemplos de uso y pronunciación.',
      image: 'https://res.cloudinary.com/dbxjfufqv/image/upload/v1770758465/Gemini_Generated_Image_o7ok5oo7ok5oo7ok_cugl1j.png',
      color: 'secondary',
      onClick: () => navigate('/estudiante/diccionario'),
      buttonText: 'Buscar'
    },
    {
      id: 'contributions',
      subtitle: 'Comunidad • Colaboración',
      title: 'Contribuciones',
      description: 'Ayuda a expandir el conocimiento compartiendo nuevas palabras o historias.',
      image: 'https://res.cloudinary.com/dbxjfufqv/image/upload/v1770758465/Gemini_Generated_Image_2tb9xw2tb9xw2tb9_ozbsbl.png',
      color: 'primary',
      onClick: () => navigate('/estudiante/contribuciones'),
      buttonText: 'Colaborar'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, position: 'relative' }}>

      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 8 }, pt: { xs: 4, lg: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 6, lg: 12 } }}>

          {/* Left Column - Sticky Info */}
          <Box
            sx={{
              width: { xs: '100%', lg: '40%', xl: '35%' },
              position: { lg: 'sticky' },
              top: { lg: 120 },
              height: { lg: 'calc(100vh - 200px)' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', lg: 'flex-start' },
              textAlign: { xs: 'center', lg: 'left' }
            }}
          >
            <Box sx={{ mb: 2, display: 'inline-block' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '4.5rem', color: '#1A3C34' }}>language</span>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '4rem', xl: '5rem' },
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'text.primary',
                mb: 3
              }}
            >
              EduShuar<br />
              <Box component="span" sx={{ color: 'secondary.main' }}>Dashboard</Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                mb: 4,
                maxWidth: 400,
                lineHeight: 1.6
              }}
            >
              Bienvenido de nuevo, <strong>{profileUser?.firstName || 'Estudiante'}</strong>. Continúa tu aprendizaje hoy.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.paper', py: 1, px: 2, borderRadius: 10, boxShadow: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)' }} />
              <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                {completedCount} de {totalLessons} lecciones completadas
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Scrolling Cards */}
          <Box sx={{ width: { xs: '100%', lg: '60%', xl: '65%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 5 } }}>
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={item.id}
                  {...item}
                  delay={index * 0.15}
                />
              ))}
            </Box>
          </Box>

        </Box>
      </Container>

      {/* Background Ambient Blurs */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, bgcolor: 'primary.light', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1 }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', width: 600, height: 600, bgcolor: 'secondary.light', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.1 }} />
      </Box>
    </Box>
  );
};

export default StudentHome;
