import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '@features/auth/context/LoginContext';
import { useSidebarContext } from '@shared/context/SidebarContext';

const Header2 = () => {
  const { toggleSidebar } = useSidebarContext();
  const { user, logout } = useLoginContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    // Navegar según el rol del usuario
    const profileRoute = user?.rol === 'ADMIN' ? '/admin/perfil' : '/estudiante/perfil';
    navigate(profileRoute);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Obtener la primera letra del nombre o email
  const getInitial = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Obtener nombre para mostrar
  const getDisplayName = () => {
    if (user?.nombre) {
      return user.nombre;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section: Menu + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ 
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 900,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            EduShuar
          </Typography>
        </Box>

        {/* Right Section: User Info + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            {getDisplayName()}
          </Typography>
          
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              p: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'transform 0.2s',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main',
                color: 'white',
                fontWeight: 'bold',
                width: 40,
                height: 40,
                fontSize: '1.125rem',
              }}
            >
              {getInitial()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': {
                    bgcolor: 'rgba(209, 154, 74, 0.08)',
                  },
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight="bold" color="text.primary">
                {getDisplayName()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfile}>
              <AccountCircleIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight="600">Mi Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight="600">Cerrar Sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header2;
