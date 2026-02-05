import React from 'react';
import { Box, Typography, Button, Paper, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const DashboardCard = ({ 
  subtitle, 
  title, 
  description, 
  buttonText = "Empezar", 
  onClick, 
  image, 
  color = "primary", // "primary" or "secondary"
  delay = 0,
  progress = null // { completed, total, percentage }
}) => {
  const theme = useTheme();
  
  // Determine colors based on prop
  const mainColor = color === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main;
  const bgColor = color === 'secondary' 
    ? alpha(theme.palette.secondary.main, 0.08) 
    : alpha(theme.palette.primary.main, 0.08);
  const shadowColor = color === 'secondary' 
    ? alpha(theme.palette.secondary.main, 0.2) 
    : alpha(theme.palette.primary.main, 0.2);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        bgcolor: bgColor,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'space-between',
        gap: 4,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px -8px ${shadowColor}`,
          borderColor: alpha(mainColor, 0.2),
          '& .card-image-bg': {
            transform: 'scale(1.1)',
          },
          '& .card-image': {
            transform: 'rotate(0deg) scale(1.05)',
          },
          '& .arrow-icon': {
            transform: 'translateX(4px)',
          }
        },
        animation: `fadeInUp 0.6s ease-out ${delay}s backwards`
      }}
      onClick={onClick}
    >
      <Box sx={{ flex: 1, zIndex: 10, width: '100%' }}>
        {subtitle && (
          <Typography 
            variant="overline" 
            sx={{ 
              color: mainColor, 
              fontWeight: 800, 
              letterSpacing: '0.1em', 
              mb: 1.5,
              display: 'block',
              fontSize: '0.7rem'
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 900, 
            mb: 2,
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            color: 'text.primary',
            lineHeight: 1.1
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            mb: 3, 
            fontSize: '1.125rem',
            lineHeight: 1.6,
            maxWidth: '480px'
          }}
        >
          {description}
        </Typography>

        {progress && (
            <Box sx={{ mb: 4, maxWidth: '480px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Has completado {progress.completed} de {progress.total} lecciones
                    </Typography>
                    <Typography variant="caption" sx={{ color: mainColor, fontWeight: 800 }}>
                        {progress.percentage}%
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 6, bgcolor: alpha(mainColor, 0.1), borderRadius: 10 }}>
                    <Box 
                        sx={{ 
                            width: `${progress.percentage}%`, 
                            height: '100%', 
                            bgcolor: mainColor, 
                            borderRadius: 10,
                            transition: 'width 1s ease-out'
                        }} 
                    />
                </Box>
            </Box>
        )}
        
        <Button
          variant={color === 'secondary' ? 'outlined' : 'contained'}
          color={color}
          disableElevation
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 50,
            fontWeight: 700,
            fontSize: '1rem',
            borderWidth: color === 'secondary' ? 2 : 0,
            '&:hover': {
              borderWidth: color === 'secondary' ? 2 : 0,
            }
          }}
        >
          {buttonText}
          <span className="material-symbols-outlined arrow-icon" style={{ marginLeft: '8px', fontSize: '1.2rem', transition: 'transform 0.3s' }}>
            arrow_forward
          </span>
        </Button>
      </Box>

      {/* Image Section */}
      <Box 
        sx={{ 
          width: { xs: 200, md: 240 }, 
          height: { xs: 200, md: 240 }, 
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Glow Effect */}
        <Box 
          className="card-image-bg"
          sx={{ 
            position: 'absolute', 
            inset: 0, 
            bgcolor: 'background.paper',
            opacity: 0.6,
            borderRadius: '50%', 
            filter: 'blur(40px)', 
            transition: 'transform 0.5s ease'
          }} 
        />
        
        {/* Image */}
        <Box 
          component="img"
          className="card-image"
          alt={title} 
          src={image} 
          sx={{
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            borderRadius: 4, 
            boxShadow: `0 20px 40px -12px ${alpha(theme.palette.text.primary, 0.2)}`,
            transform: `rotate(${Math.random() > 0.5 ? 3 : -3}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 10
          }}
        />
      </Box>
    </Paper>
  );
};

export default DashboardCard;
