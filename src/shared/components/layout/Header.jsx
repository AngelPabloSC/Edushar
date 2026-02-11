import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import Nature from '@mui/icons-material/Nature';
import { useNavigate, useLocation } from 'react-router-dom';

const navMenu = [
  { label: 'Inicio', path: '/' },
  { label: 'Lecciones', path: '/lecciones' },
  { label: 'Cuentos', path: '/cuentos' },
  { label: 'Diccionario', path: '/diccionario' },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'rgba(209, 154, 74, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Button
            onClick={() => navigate('/')}
            aria-label="Ir a la página principal de EduShuar"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              textTransform: 'none',
              color: 'inherit',
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            <Nature sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography 
              variant="h6" 
              component="span" 
              fontWeight="bold"
              sx={{ color: 'text.primary' }}
            >
              EduShuar
            </Typography>
          </Button>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navMenu.map((item) => (
              <Button 
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={`Ir a ${item.label}`}
                sx={{
                  color: location.pathname === item.path ? 'secondary.main' : 'text.primary',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  position: 'relative',
                  '&:hover': { 
                    color: 'secondary.main',
                    bgcolor: 'transparent',
                  },
                  '&::after': location.pathname === item.path ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: 2,
                    bgcolor: 'secondary.main',
                    borderRadius: 1,
                  } : {},
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Login Button */}
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/login')}
            aria-label="Iniciar sesión en EduShuar"
            sx={{
              fontWeight: 600,
              px: 3,
            }}
          >
            Iniciar Sesión
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
