import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Tooltip, useScrollTrigger, useTheme, alpha, Menu, MenuItem, Divider } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/context/LoginContext';
import { useState } from 'react';

/**
 * Layout para estudiantes - Header Only (Sin Sidebar)
 * Diseño basado en "EduShar Lab"
 */
const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/estudiante/perfil');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getInitial = () => {
    if (user?.nombre) return user.nombre.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Fijo */}
      <AppBar 
        position="fixed" 
        elevation={trigger ? 4 : 0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: trigger ? 'transparent' : 'divider',
          color: 'text.primary',
          transition: 'all 0.3s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
            
            {/* Left: Home Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Ir al Inicio">
                    <IconButton 
                        onClick={() => navigate('/estudiante/inicio')}
                        sx={{ 
                            bgcolor: alpha(theme.palette.text.secondary, 0.05),
                            '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.1) }
                        }}
                    >
                        <HomeIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Center: Title (Hidden on small screens) */}
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', lineHeight: 1, mb: 0.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    EduShar Lab
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                    {(() => {
                        const path = location.pathname;
                        if (path.includes('/inicio')) return 'Inicio';
                        if (path.includes('/lecciones')) return 'Lecciones';
                        if (path.includes('/cuentos')) return 'Cuentos y Mitos';
                        if (path.includes('/diccionario')) return 'Diccionario';
                        if (path.includes('/contribuciones')) return 'Contribuciones';
                        if (path.includes('/perfil')) return 'Mi Perfil';
                        return 'Estudiante';
                    })()}
                </Typography>
            </Box>

    
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
                
                
                
           
                <Tooltip title="Cuenta">
                    <IconButton
                        onClick={handleMenuOpen}
                        size="small"
                        sx={{ ml: 0.5 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar 
                            sx={{ 
                                bgcolor: 'secondary.main', 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: 2,
                                width: 36, height: 36,
                                fontSize: '0.875rem',
                                '&:hover': { transform: 'scale(1.05)' },
                                transition: 'transform 0.2s'
                            }}
                        >
                            {getInitial()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                elevation: 4,
                sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 1,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                    '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        borderRadius: 0.5,
                        mx: 1,
                        mb: 0.5,
                        '&:hover': {
                            bgcolor: 'rgba(209, 154, 74, 0.08)',
                        },
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
                    <LogoutIcon sx={{ mr: 1.5, color: 'error.main' }} />
                    <Typography variant="body2" fontWeight="600" color="error.main">Cerrar Sesión</Typography>
                </MenuItem>
            </Menu>

        </Toolbar>
      </AppBar>

      {/* Content Padding for Fixed Header */}
      <Toolbar sx={{ py: 1 }} /> 

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>



    </Box>
  );
};

export default StudentLayout;
