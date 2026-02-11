import { Box, Container, Typography, Link, IconButton, Divider } from '@mui/material';
import Nature from '@mui/icons-material/Nature';
import Language from '@mui/icons-material/Language';
import Email from '@mui/icons-material/Email';
import Share from '@mui/icons-material/Share';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Nature sx={{ fontSize: 40, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                EduShuar
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Ecuador
              </Typography>
            </Box>
          </Box>

          {/* Links */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: 3, md: 5 },
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link href="#" underline="hover" color="text.secondary" sx={{ '&:hover': { color: 'secondary.main' } }}>
              Sobre nosotros
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ '&:hover': { color: 'secondary.main' } }}>
              Contacto
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ '&:hover': { color: 'secondary.main' } }}>
              Privacidad
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ '&:hover': { color: 'secondary.main' } }}>
              Recursos
            </Link>
          </Box>

          {/* Social Icons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              aria-label="Visitar nuestro sitio web"
              sx={{
                bgcolor: 'secondary.light',
                color: 'secondary.main',
                '&:hover': { 
                  bgcolor: 'secondary.main',
                  color: 'white',
                }
              }}
            >
              <Language />
            </IconButton>
            <IconButton
              aria-label="Enviarnos un correo electrónico"
              sx={{
                bgcolor: 'secondary.light',
                color: 'secondary.main',
                '&:hover': { 
                  bgcolor: 'secondary.main',
                  color: 'white',
                }
              }}
            >
              <Email />
            </IconButton>
            <IconButton
              aria-label="Compartir EduShuar"
              sx={{
                bgcolor: 'secondary.light',
                color: 'secondary.main',
                '&:hover': { 
                  bgcolor: 'secondary.main',
                  color: 'white',
                }
              }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
        >
          © 2024 EduShar. Preservando la lengua y cultura Shuar para las futuras generaciones.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
