import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PropTypes from 'prop-types';

/**
 * Componente reutilizable para mostrar entradas del diccionario
 */
const DictionaryCard = ({ entry }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'all 0.3s',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', md: 192 },
          height: { xs: 192, md: 'auto' },
          objectFit: 'cover',
        }}
        image={entry.image}
        alt={entry.wordShuar}
      />
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: 'secondary.main',
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              {entry.wordShuar}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontStyle: 'italic',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              {entry.wordSpanish}
            </Typography>
          </Box>
          <Chip
            label={entry.category}
            size="small"
            sx={{
              bgcolor: 'rgba(209, 154, 74, 0.15)',
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              border: '1px solid',
              borderColor: 'rgba(209, 154, 74, 0.3)',
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 3,
            pl: 2,
            borderLeft: '3px solid',
            borderColor: 'secondary.main',
            bgcolor: 'rgba(209, 154, 74, 0.05)',
            py: 1.5,
            pr: 2,
            borderRadius: 1,
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 1.5,
              color: 'text.primary',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: '#D19A4A', fontWeight: 700 }}>Shuar:</strong> {entry.exampleShuar}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ fontWeight: 600 }}>Español:</strong> {entry.exampleSpanish}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            size="small"
            startIcon={<VolumeUpIcon />}
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(209, 154, 74, 0.08)',
              },
            }}
          >
            Pronunciar
          </Button>
          <Button
            size="small"
            startIcon={<BookmarkBorderIcon />}
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(209, 154, 74, 0.08)',
              },
            }}
          >
            Guardar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

DictionaryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.number.isRequired,
    wordShuar: PropTypes.string.isRequired,
    wordSpanish: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    exampleShuar: PropTypes.string.isRequired,
    exampleSpanish: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default DictionaryCard;
