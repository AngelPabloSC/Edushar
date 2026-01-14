import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  Stack,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Componente de tarjeta de progreso mejorado
 * Sigue principios de Don Norman: visibilidad, feedback, y mapping
 * Optimizado para performance - usa símbolos Unicode en lugar de iconos MUI
 */
const ProgressCard = ({ 
  moduleName, 
  percentage, 
  completedLessons, 
  totalLessons,
  streak = 0,
  showDetails = true 
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(209, 154, 74, 0.08) 0%, rgba(255, 255, 255, 1) 100%)',
        border: '2px solid',
        borderColor: 'secondary.main',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Badge de porcentaje prominente */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <Tooltip title="Tu progreso en este módulo" arrow placement="left">
          
        </Tooltip>
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/* Título y nivel */}
        <Box sx={{ mb: 3, pr: 10 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'secondary.main', 
              fontWeight: 700,
              letterSpacing: 1.5,
              fontSize: '0.875rem',
            }}
          >
            PROGRESO ACTUAL
          </Typography>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontWeight: 800,
              mt: 0.5,
              mb: 1,
            }}
          >
            {moduleName}
          </Typography>
        </Box>

        {/* Barra de progreso mejorada */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body1" fontWeight="600" color="text.secondary">
              Completado del Módulo
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="secondary.main">
              {percentage}%
            </Typography>
          </Box>
          
          <Tooltip 
            title={`${completedLessons} de ${totalLessons} lecciones completadas`}
            arrow
            placement="top"
          >
            <LinearProgress 
              variant="determinate" 
              value={percentage}
              sx={{
                height: 16,
                borderRadius: 10,
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 10,
                  bgcolor: 'secondary.main',
                  boxShadow: '0 2px 8px rgba(209, 154, 74, 0.3)',
                },
              }}
            />
          </Tooltip>
        </Box>

        {/* Estadísticas adicionales */}
        {showDetails && (
          <Stack 
            direction="row" 
            spacing={3}
            sx={{
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Lecciones completadas */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                LECCIONES
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {completedLessons}/{totalLessons}
              </Typography>
            </Box>

            {/* Racha de días */}
            {streak > 0 && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  RACHA
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="h6" fontWeight="bold">
                    🏆 {streak} días
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Lecciones restantes */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                RESTANTES
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="secondary.main">
                {totalLessons - completedLessons}
              </Typography>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

ProgressCard.propTypes = {
  moduleName: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  completedLessons: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  streak: PropTypes.number,
  showDetails: PropTypes.bool,
};

export default ProgressCard;
