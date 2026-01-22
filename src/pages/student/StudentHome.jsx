import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/context/LoginContext';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
import ActionCard from '../../components/ActionCard';
import ProgressCard from '../../components/ProgressCard';

/**
 * Dashboard principal del estudiante - Página de inicio mejorada
 * Sigue principios de Don Norman: visibilidad, affordances, feedback, mapping, constraints, y consistencia
 */
const StudentHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Datos de ejemplo - En producción vendrían de una API o contexto
  const currentProgress = {
    moduleName: 'Nivel 1: Fundamentos',
    lessonName: 'La Familia',
    lessonId: 1, // ID de la lección en progreso
    percentage: 60,
    totalLessons: 8,
    completedLessons: 2,
    streak: 5, // Racha de días consecutivos
  };

  // Verificar si hay una lección en progreso
  const hasLessonInProgress = currentProgress.lessonId !== null;

  const handleContinueLearning = () => {
    // Navegar a la última lección en progreso
    navigate(`/leccion/${currentProgress.lessonId}`);
  };

  // Construir las action cards dinámicamente
  const actionCards = [];

  // Solo mostrar "Continuar Lección" si hay una lección en progreso
  if (hasLessonInProgress) {
    actionCards.push({
      id: 1,
      title: 'Continuar Lección',
      description: 'Resume donde lo dejaste: ',
      highlight: `"${currentProgress.lessonName}"`,
      icon: AutoStoriesIcon,
      color: 'secondary.main', // Usar color del tema
      bgColor: 'rgba(209, 154, 74, 0.1)',
      action: handleContinueLearning,
      buttonText: 'Ir a la lección',
      recommended: true, // Marcar como recomendado
      disabled: false,
    });
  } else {
    // Si no hay lección en progreso, mostrar "Ir a Lecciones" como primera opción
    actionCards.push({
      id: 1,
      title: 'Explorar Lecciones',
      description: 'Comienza tu camino de aprendizaje con nuestras lecciones interactivas.',
      icon: SchoolIcon,
      color: 'secondary.main',
      bgColor: 'rgba(209, 154, 74, 0.1)',
      action: () => navigate('/estudiante/lecciones'),
      buttonText: 'Ver lecciones',
      recommended: true,
      disabled: false,
    });
  }

  // Agregar las demás cards
  actionCards.push(
    {
      id: 2,
      title: 'Explorar Diccionario',
      description: 'Busca más de 5,000 palabras y frases Shuar con contexto cultural.',
      icon: MenuBookIcon,
      color: '#D84315',
      bgColor: 'rgba(216, 67, 21, 0.1)',
      action: () => navigate('/estudiante/diccionario'),
      buttonText: 'Buscar palabras',
      disabled: false,
    },
    {
      id: 3,
      title: 'Leer un Cuento',
      description: 'Descubre mitos ancestrales y narrativas contemporáneas Shuar.',
      icon: HistoryEduIcon,
      color: '#5D4037',
      bgColor: 'rgba(93, 64, 55, 0.1)',
      action: () => navigate('/estudiante/cuentos'),
      buttonText: 'Ver biblioteca',
      disabled: false,
    }
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      {/* Saludo personalizado - Optimizado para LCP */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            fontSize: { xs: '2rem', md: '2.75rem' },
            color: 'secondary.main', // Color directo en lugar de gradiente para mejor LCP
            // Opcional: descomentar para gradiente (reduce performance)
            // background: 'linear-gradient(135deg, #D19A4A 0%, #E0B76A 100%)',
            // backgroundClip: 'text',
            // WebkitBackgroundClip: 'text',
            //WebkitTextFillColor: 'transparent',
          }}
        >
          !Turasha, {user?.nombre || 'Estudiante'}!
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1.125rem', md: '1.5rem' },
          }}
        >
          Tu camino para preservar la cultura Shuar continúa hoy.
        </Typography>
      </Box>

      {/* Tarjeta de Progreso Mejorada - Solo si hay progreso */}
      {hasLessonInProgress && (
        <Box sx={{ mb: 5 }}>
          <ProgressCard
            moduleName={currentProgress.moduleName}
            percentage={currentProgress.percentage}
            completedLessons={currentProgress.completedLessons}
            totalLessons={currentProgress.totalLessons}
            streak={currentProgress.streak}
            showDetails={true}
          />
        </Box>
      )}

      {/* Divider con texto */}
      <Divider sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: '0.875rem',
          }}
        >
          {hasLessonInProgress ? 'Continúa Tu Aprendizaje' : 'Comienza Tu Aprendizaje'}
        </Typography>
      </Divider>

      {/* Grid de Acciones Rápidas */}
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        justifyContent="center"
        alignItems="stretch"
      >
        {actionCards.map((card) => (
          <Grid
            key={card.id}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{ display: 'flex' }}
          >
            <Box sx={{ width: '100%' }}>
              <ActionCard
                title={card.title}
                description={card.description}
                highlight={card.highlight}
                icon={card.icon}
                color={card.color}
                bgColor={card.bgColor}
                buttonText={card.buttonText}
                onClick={card.action}
                disabled={card.disabled}
                recommended={card.recommended}
                badge={card.badge}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Sección de ayuda/tips - Solo si hay racha */}
      {currentProgress.streak > 0 && (
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 3,
            bgcolor: 'rgba(209, 154, 74, 0.05)',
            border: '1px solid',
            borderColor: 'rgba(209, 154, 74, 0.2)',
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            💡 <strong>Consejo:</strong> Mantén tu racha de aprendizaje completando al menos una lección por día.
            ¡Ya llevas {currentProgress.streak} días consecutivos!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default StudentHome;
