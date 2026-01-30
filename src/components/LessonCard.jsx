import { memo } from 'react';
import { Card, CardMedia, CardContent, CardActionArea, Typography, Button, Skeleton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

const LessonCard = ({ title, description, image, onClick, loading = false }) => {
  if (loading) {
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
        }}
      >
        <Skeleton variant="rectangular" height={224} animation="wave" />
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          <Skeleton variant="text" height={32} width="80%" sx={{ mb: 2 }} animation="wave" />
          <Skeleton variant="text" height={20} width="100%" animation="wave" />
          <Skeleton variant="text" height={20} width="100%" animation="wave" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3 }} animation="wave" />
          <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} animation="wave" />
        </CardContent>
      </Card>
    );
  }

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

          {/* Button - Rendered as div to avoid button nesting error */}
          <Button
            component="div"
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
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

// Memoize component to prevent unnecessary re-renders
export default memo(LessonCard);
