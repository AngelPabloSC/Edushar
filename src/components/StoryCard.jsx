import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * Componente reutilizable para mostrar cards de cuentos
 */
const StoryCard = ({ story }) => {
  const navigate = useNavigate();

  const getCategoryColor = (category) => {
    const colors = {
      'Mito': 'error',
      'Leyenda': 'warning',
      'Vida': 'info',
    };
    return colors[category] || 'default';
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 1,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardActionArea 
          onClick={() => navigate(`/cuento/${story.id}`)}
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
        {/* Imagen */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="192"
            image={story.image}
            alt={story.titleSpanish}
            sx={{
              objectFit: 'cover',
            }}
          />
          {/* Gradiente overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            }}
          />
          {/* Badges */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: 'flex',
              gap: 1,
            }}
          >
            <Chip
              label={story.category}
              size="small"
              color={getCategoryColor(story.category)}
              sx={{
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 20,
              }}
            />
          </Box>
        </Box>

        {/* Contenido */}
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'error.main',
              fontStyle: 'italic',
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {story.titleShuar}
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.3,
            }}
          >
            {story.titleSpanish}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {story.description}
          </Typography>

          {/* Footer */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
              fullWidth
              sx={{
                color: 'secondary.main',
                fontWeight: 'bold',
                py: 1,
                justifyContent: 'center',
                textTransform: 'none',
                fontSize: '0.875rem',
                '& .MuiButton-endIcon': {
                  transition: 'transform 0.2s',
                },
                '&:hover': {
                  bgcolor: 'rgba(209, 154, 74, 0.08)',
                },
                '&:hover .MuiButton-endIcon': {
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Leer ahora →
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

StoryCard.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titleShuar: PropTypes.string.isRequired,
    titleSpanish: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default StoryCard;
