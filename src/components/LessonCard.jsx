import { Card, CardMedia, CardContent, CardActionArea, Typography, Button, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

const LessonCard = ({ title, description, image, onClick }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {/* Image */}
        <CardMedia
          component="img"
          image={image}
          alt={title}
          loading="lazy"
          sx={{
            height: 224,
            objectFit: 'cover',
            transition: 'transform 0.7s ease',
            '.MuiCardActionArea-root:hover &': {
              transform: 'scale(1.1)',
            },
          }}
        />

        {/* Content */}
        <CardContent
          sx={{
            p: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              flexGrow: 1,
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>

          {/* Button */}
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<VisibilityIcon />}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderWidth: 1,
              '&:hover': {
                borderWidth: 1,
                bgcolor: 'rgba(209, 154, 74, 0.04)',
              },
            }}
          >
            Ver Detalles
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

LessonCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default LessonCard;
