import { Box, Typography, Button, Container } from '@mui/material';
import { useLogin } from '../../../features/auth/hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLoginContext } from '../../../features/auth/context/LoginContext';

const Landing = () => {
  const { handleGoogleSignIn } = useLogin();
  const navigate = useNavigate();
  const { user, isLoggedIn, loading } = useLoginContext();

  useEffect(() => {
    if (!loading && isLoggedIn && user) {
      const roleMapping = {
        'admin': '/admin/dashboard',
        'student': '/estudiante/inicio',
        'ADMIN': '/admin/dashboard',
        'ESTUDIANTE': '/estudiante/inicio'
      };

      const userRole = user?.role || user?.rol;
      const dashboardPath = roleMapping[userRole];

      console.log('🔒 Landing - User is authenticated, redirecting to:', dashboardPath);

      if (dashboardPath) {
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [loading, isLoggedIn, user, navigate]);

  // Don't render landing page content while checking auth or if user is authenticated
  if (loading || isLoggedIn) {
    return null;
  }


  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'primary.main',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Google Sans, sans-serif',
        overflowX: 'hidden',
        '&::selection': {
          bgcolor: 'secondary.main',
          color: 'primary.main'
        }
      }}
    >
      {/* Navbar */}
      <Box
        component="nav"
        sx={{
          width: '100%',
          px: 3,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 50,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.875rem', fontWeight: 500, color: 'primary.main', opacity: 0.8 }}>
          <Box
            component="button"
            onClick={() => navigate('/login')}
            sx={{
              p: 1,
              borderRadius: '50%',
              '&:hover': { color: 'error.main', bgcolor: 'rgba(26,60,52,0.05)' },
              transition: 'all 0.3s',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>info</span>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          px: 2,
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto',
          overflow: 'hidden'
        }}
      >
        {/* Toucan Sticker */}
        <Box
          className="animate-float"
          sx={{
            position: 'absolute',
            top: 40,
            left: { xs: '5%', md: '8%' },
            width: { xs: 128, md: 176 },
            height: { xs: 128, md: 176 },
            zIndex: 10,
            display: { xs: 'none', sm: 'block' },
            '--tw-rotate': '-12deg',
            transform: 'rotate(-12deg)'
          }}
        >
          <Box
            className="gloss-effect"
            sx={{
              width: '130%',
              height: '130%',
              bgcolor: 'white',
              p: 0.5,
              borderRadius: '2.5rem',
              boxShadow: '0 25px 40px -10px rgba(26, 60, 52, 0.2), 0 10px 10px -5px rgba(26, 60, 52, 0.1)', // Sticker shadow
              transition: 'transform 0.5s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Box
              component="img"
              alt="3D high-gloss sticker of a tropical toucan"
              src="/assets/sticker1.webp"
              fetchPriority="high"
              loading="eager"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2.2rem' }}
            />
          </Box>
        </Box>

        {/* Crown Sticker */}
        <Box
          className="animate-float-delayed"
          sx={{
            position: 'absolute',
            top: '18%',
            right: { xs: '8%', md: '8%' },
            width: { xs: 144, md: 192 },
            height: { xs: 144, md: 192 },
            zIndex: 20,
            '--tw-rotate': '15deg',
            transform: 'rotate(15deg)'
          }}
        >
          <Box
            className="gloss-effect"
            sx={{
              width: '130%',
              height: '130%',
              bgcolor: 'white',
              p: 0.5,
              borderRadius: '9999px',
              boxShadow: '0 25px 40px -10px rgba(26, 60, 52, 0.2), 0 10px 10px -5px rgba(26, 60, 52, 0.1)',
              transition: 'transform 0.5s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Box
              component="img"
              alt="3D high-gloss sticker of a traditional Tawasa feather crown"
              src="/assets/sticker3.webp"
              fetchPriority="high"
              loading="eager"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }}
            />
          </Box>
        </Box>

        {/* Basket Sticker */}
        <Box
          className="animate-float-slow"
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: { xs: '8%', md: '12%' },
            width: { xs: 128, md: 160 },
            height: { xs: 128, md: 160 },
            zIndex: 10,
            display: { xs: 'none', sm: 'block' },
            '--tw-rotate': '-6deg',
            transform: 'rotate(-6deg)'
          }}
        >
          <Box
            className="gloss-effect"
            sx={{
              width: '130%',
              height: '130%',
              bgcolor: 'white',
              p: 0.5,
              borderRadius: '2rem',
              boxShadow: '0 25px 40px -10px rgba(26, 60, 52, 0.2), 0 10px 10px -5px rgba(26, 60, 52, 0.1)',
              transition: 'transform 0.5s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Box
              component="img"
              alt="3D high-gloss sticker of a woven Maki basket"
              src="/assets/sticker2.webp"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.7rem' }}
            />
          </Box>
        </Box>

        {/* Vessel Sticker */}
        <Box
          className="animate-float"
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: { xs: '5%', md: '15%' },
            width: { xs: 112, md: 160 },
            height: { xs: 112, md: 160 },
            zIndex: 10,
            display: { xs: 'none', sm: 'block' },
            '--tw-rotate': '10deg',
            transform: 'rotate(10deg)'
          }}
        >
          <Box
            className="gloss-effect"
            sx={{
              width: '130%',
              height: '130%',
              bgcolor: 'white',
              p: 0.5,
              borderRadius: '2.5rem',
              boxShadow: '0 25px 40px -10px rgba(26, 60, 52, 0.2), 0 10px 10px -5px rgba(26, 60, 52, 0.1)',
              transition: 'transform 0.5s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <Box
              component="img"
              alt="3D high-gloss sticker of a small Chicha vessel"
              src="/assets/persona_shuar_con_loro.webp"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2.2rem' }}
            />
          </Box>
        </Box>

        {/* Centered Content */}
        <Box sx={{ position: 'relative', zIndex: 30, textAlign: 'center', maxWidth: '1024px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              fontSize: { xs: '13vw', md: '8.5rem' },
              lineHeight: 0.85,
              letterSpacing: '-0.05em',
              color: 'primary.main',
              mb: { xs: 4, md: 6 },
              userSelect: 'none',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
            }}
          >
            <Box component="span" display="block">Pequeñas</Box>
            <Box component="span" display="block">Lecciones</Box>
            <Box component="span" display="block" sx={{ color: 'error.main', mixBlendMode: 'multiply', position: 'relative' }}>
              de Shuar
            </Box>
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontFamily: 'Google Sans, sans-serif',
              color: 'primary.main',
              opacity: 0.8,
              fontWeight: 500,
              maxWidth: '42rem',
              mx: 'auto',
              mb: { xs: 6, md: 8 },
              lineHeight: 1.625,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Una serie de pequeñas lecciones
            <Box component="br" sx={{ display: { xs: 'none', md: 'block' } }} />
            Descubre el idioma Shuar y conecta con su cultura.
          </Typography>

          <Button
            onClick={handleGoogleSignIn}
            disableRipple
            sx={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 6,
              py: 2.5,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 700,
              color: 'background.default',
              bgcolor: 'primary.main',
              borderRadius: '1rem',
              transition: 'all 0.15s ease-out',
              transform: 'translateY(0)',
              borderBottom: '6px solid',
              borderColor: 'primary.dark',
              boxShadow: '0 10px 20px -5px rgba(26, 60, 52, 0.25)', // button-3d shadow
              '&:hover': {
                filter: 'brightness(1.1)',
                transform: 'translateY(-4px)',
                borderBottomWidth: '8px',
                '& .arrow-icon': {
                  transform: 'rotate(12deg)'
                }
              },
              '&:active': {
                borderBottomWidth: '0px',
                transform: 'translateY(6px)',
                boxShadow: 'none'
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: '0 0 0 4px rgba(243, 156, 18, 0.5)' // ring-shuar-turmeric/50
              },
              textTransform: 'none'
            }}
          >
            <Box component="span" sx={{ position: 'relative', zIndex: 10 }}>Empezar a aprender</Box>
            <span
              className="material-symbols-outlined arrow-icon"
              style={{ marginLeft: '0.5rem', position: 'relative', zIndex: 10, transition: 'transform 0.3s' }}
            >
              arrow_forward
            </span>
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 40, width: '100%' }}></Box>
    </Box>
  );
};

export default Landing;