import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ForestIcon from '@mui/icons-material/Forest';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ParkIcon from '@mui/icons-material/Park';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Illustration Section */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            aspectRatio: '16/9',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(209, 154, 74, 0.1) 0%, rgba(226, 114, 91, 0.1) 100%)',
            mb: 6,
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          {/* Radial gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.2,
              background: 'radial-gradient(circle at center, #D19A4A 0%, transparent 70%)',
            }}
          />

          {/* Main Icon */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: '50%',
                boxShadow: 4,
                border: '4px solid',
                borderColor: 'rgba(209, 154, 74, 0.2)',
              }}
            >
              <ForestIcon
                sx={{
                  fontSize: { xs: 80, md: 120 },
                  color: 'secondary.main',
                }}
              />
            </Box>
          </Box>

          {/* Floating decorative icons */}
          <LocalFloristIcon
            sx={{
              position: 'absolute',
              top: { xs: 20, md: 40 },
              left: { xs: 20, md: 40 },
              fontSize: { xs: 30, md: 40 },
              color: 'secondary.main',
              opacity: 0.4,
            }}
          />
          <ParkIcon
            sx={{
              position: 'absolute',
              bottom: { xs: 20, md: 40 },
              left: { xs: 20, md: 40 },
              fontSize: { xs: 30, md: 40 },
              color: 'secondary.main',
              opacity: 0.3,
            }}
          />
          <LocalFloristIcon
            sx={{
              position: 'absolute',
              top: { xs: 30, md: 60 },
              right: { xs: 30, md: 60 },
              fontSize: { xs: 25, md: 35 },
              color: 'secondary.main',
              opacity: 0.2,
            }}
          />
        </Box>

        {/* Error Badge */}
        <Box
          sx={{
            display: 'inline-block',
            px: 3,
            py: 1,
            borderRadius: 10,
            bgcolor: 'rgba(209, 154, 74, 0.1)',
            border: '1px solid',
            borderColor: 'rgba(209, 154, 74, 0.2)',
            mb: 3,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'secondary.main',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              letterSpacing: 1,
            }}
          >
            ERROR 404
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            color: 'text.primary',
            mb: 2,
            px: 2,
          }}
        >
          ¡Uy! Parece que te has perdido en la selva
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontWeight: 600,
            color: 'text.secondary',
            mb: 2,
            px: 2,
          }}
        >
          Página no encontrada
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: 'text.secondary',
            maxWidth: 600,
            lineHeight: 1.7,
            mb: 6,
            px: 2,
          }}
        >
          No te preocupes, incluso los mejores rastreadores se desvían a veces.
          Nuestra red de caminos en la Amazonía es vasta, pero podemos guiarte de vuelta al claro del bosque.
        </Typography>

        {/* Action Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: '100%', maxWidth: 500, mb: 6 }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            aria-label="Volver a la página principal"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: 4,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            Volver al Inicio
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<MenuBookIcon />}
            onClick={() => navigate('/lecciones')}
            aria-label="Ir a lecciones"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Ir a Lecciones
          </Button>
        </Stack>

        {/* Footer Help Text */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          ¿Crees que esto es un error?{' '}
          <Typography
            component="a"
            href="mailto:contacto@edushar.com"
            sx={{
              color: 'secondary.main',
              textDecoration: 'underline',
              fontWeight: 600,
              '&:hover': {
                color: 'secondary.dark',
              },
            }}
          >
            Informa a la comunidad
          </Typography>
        </Typography>
      </Container>

      {/* Decorative Bottom Section */}
      <Box
        sx={{
          height: 100,
          background: 'linear-gradient(to top, rgba(209, 154, 74, 0.05) 0%, transparent 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            opacity: 0.1,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <LocalFloristIcon key={i} sx={{ fontSize: 80, color: 'secondary.main' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
