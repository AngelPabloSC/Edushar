import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import PropTypes from 'prop-types';

/**
 * Componente de tarjeta de acción reutilizable mejorado
 * Sigue principios de Don Norman: affordances, feedback, y constraints
 */
const ActionCard = ({ 
  title, 
  description, 
  highlight,
  icon: IconComponent, 
  color, 
  bgColor, 
  buttonText,
  onClick,
  disabled = false,
  badge = null,
  recommended = false,
}) => {
  return (
    <Card
      elevation={disabled ? 1 : 2}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 3,
        overflow: 'visible',
        border: '2px solid',
        borderColor: recommended ? color : 'rgba(0,0,0,0.08)',
        position: 'relative',
        boxShadow: disabled 
          ? '0 2px 8px rgba(0,0,0,0.08)' 
          : '0 4px 16px rgba(0,0,0,0.12)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.6 : 1,
        '&:hover': disabled ? {} : {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
          borderColor: color,
        },
      }}
    >
      {/* Badge recomendado */}
      {recommended && (
        <Chip
          label="Recomendado"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            right: 16,
            bgcolor: color,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 2,
            boxShadow: 2,
          }}
        />
      )}

      {/* Badge personalizado */}
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            left: 16,
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 2,
            boxShadow: 2,
          }}
        />
      )}

      <CardActionArea
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        sx={{ 
          height: '100%', 
          alignItems: 'stretch',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <CardContent 
          sx={{ 
            bgcolor: '#F3E6C7', 
            p: 3, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Icono de bloqueado */}
          {disabled && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          )}

          {/* Icono y Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Tooltip title={disabled ? "Contenido bloqueado" : title} arrow>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: bgColor,
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: 2,
                  transition: 'transform 0.2s',
                  '&:hover': disabled ? {} : {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}
              >
                <IconComponent sx={{ fontSize: 28, color: color }} />
              </Box>
            </Tooltip>

            <Typography 
              variant="h6"
              fontWeight={900} 
              sx={{ 
                lineHeight: 1.2,
                fontSize: '1.125rem',
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Descripción */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(0,0,0,0.72)',
              lineHeight: 1.6,
              mb: 3,
              flexGrow: 1,
            }}
          >
            {description}
            {highlight && (
              <Typography 
                component="span" 
                sx={{ 
                  color: color, 
                  fontWeight: 700,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {highlight}
              </Typography>
            )}
          </Typography>

          {/* Botón de acción mejorado */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: disabled ? 'text.disabled' : color,
              fontWeight: 'bold',
              fontSize: '0.9375rem',
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: disabled ? 'rgba(0,0,0,0.05)' : `${color}15`,
              border: '2px solid',
              borderColor: disabled ? 'transparent' : color,
              transition: 'all 0.3s',
              alignSelf: 'flex-start',
              '&:hover': disabled ? {} : {
                bgcolor: color,
                color: 'white',
                transform: 'translateX(4px)',
                '& .arrow-icon': {
                  transform: 'translateX(4px)',
                },
              },
            }}
          >
            {buttonText}
            <ArrowForwardIcon 
              className="arrow-icon"
              fontSize="small" 
              sx={{ 
                transition: 'transform 0.3s',
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  highlight: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.string,
  recommended: PropTypes.bool,
};

export default ActionCard;

