import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/context/LoginContext';
import { useStudentLessons } from '../../hooks/pages/useStudentLessons';
import DashboardCard from '../../components/DashboardCard';

/**
 * Dashboard principal del estudiante - Página de inicio mejorada
 * Diseño "Hub" con layout dividido: Sticky Sidebar + Scrollable Cards
 * Full Screen Mode (Sin PrivateLayout)
 */
const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnJTDrkt500fndZP9vKtTNr1zSwj-2GerGg4bqdQdx0WZCMLwaoM6VhZgS7G_z4Nle8OkYoQBPDJ-SD-KRUcJHbuc_eYvds4JxTGRBxE6sFBwtZbnjmgh5UOKQOsIrjHIzpBfogBkKNq5WH6u_PLjaMWVGlGk4nERhUvlWUjIonuReGcRD9PTTar9vorEPtZCCwuV-BZyxlFhLRvuwxeedfzAVQBO8WTjLIKdOg6A2o51ad73hgndpGFQwYrtho6RSEUNjHnB8bs1r',
      color: 'primary',
      onClick: () => navigate('/estudiante/lecciones'),
      buttonText: 'Empezar'
    },
    {
      id: 'stories',
      subtitle: 'Cultura • Narrativa',
      title: 'Cuentos y Mitos',
      description: 'Sumérgete en la cosmovisión Shuar a través de historias tradicionales animadas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-2SgvvJMUxaWi64AgnZ52AMSrBoWNY5HJekhl3I5HpZAdV4Im6rLnddmQkWxP-RuX44U8Q_meiy3a436vNJ5gI6iDpnYIDPHcRu0OE9YOLqRozskc8wsGlaFCA_46Ub7WBKe5er7juJNpv1a59onOBYfIfVnF5nqb5jvVnCsl5pyNonNRtQBJ7lNcPmOxbcEt64vvDiwrufijMLFqYFauWjFYRLVZKAuMY-zyAWLSmCZKromOhQ7Qi3_uOHA1Pba2_SzTjON7VVO0',
      color: 'secondary',
      onClick: () => navigate('/estudiante/cuentos'),
      buttonText: 'Leer ahora'
    },
    {
      id: 'dictionary',
      subtitle: 'Vocabulario • Consulta',
      title: 'Diccionario',
      description: 'Explora más de 5,000 términos con ejemplos de uso y pronunciación.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhmlOon5LaA0nr9rlhgvEp7mZsaQiqfO2wyKGV8VlP2lfNsaeNNd0vE0d1DPM4pJQ79GaG1PEKL7pxuPPEbtMqnkuMRwAXLHsUyES40j5tthdd8eQamrJUMby0jmuy-an1R6ll99fF91tEPanjGNPsY5-5OCS_V4GPV6RnL-MYmRTlfo8ddgh4ivADkO8pUQCvYQ8dkZ7nZFer-5N5tzbActkW0QG6bYCpX6ktPUciiLCixpJzAsIECAXPHT8Cs7V0XbbQ_F1zT8yY',
      color: 'primary',
      onClick: () => navigate('/estudiante/diccionario'),
      buttonText: 'Buscar'
    },
    {
      id: 'contributions',
      subtitle: 'Comunidad • Colaboración',
      title: 'Contribuciones',
      description: 'Ayuda a expandir el conocimiento compartiendo nuevas palabras o historias.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvyybVkV1n8WSPH4_vgGMcwOi1dqGWNfAk7VD_fW2TeW5wskU0qBThQWD3rGKO9xS7Z2_PpZkcsNA8usSY7xDo3oUl7xIPARjZLwCEq2ZH1qwsrNxiUQ_D4Ur7QDBc1HWF_nPS5_IlXh-43aUpno6WnKfvq9dpiQ6-G6cbISSvbq6ipPAc2pEQ2DXXdWMT-5RLzibf2PHjJ7metQhxBkl-wW-LYoR0iSkUYwESUjBmx-M2L5pJ0gneWsBnBcS8RNlte02_MgnsNOBn',
      color: 'secondary',
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
                        EduShar<br/>
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
                        Bienvenido de nuevo, <strong>{user?.nombre || 'Estudiante'}</strong>. Continúa tu aprendizaje hoy.
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
