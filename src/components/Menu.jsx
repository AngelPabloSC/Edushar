import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebarContext } from '../hooks/context/sidebardContext';
import PropTypes from 'prop-types';

// Mapeo de nombres de iconos a componentes de Material UI
const iconMap = {
  home: HomeIcon,
  school: SchoolIcon,
  translate: TranslateIcon,
  auto_stories: AutoStoriesIcon,
  trending_up: TrendingUpIcon,
  dashboard: DashboardIcon,
  menu_book: MenuBookIcon,
  group: GroupIcon,
  send: SendIcon,
};

const Menu = ({ menuItems }) => {
  const { isOpen, toggleSidebar } = useSidebarContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (route) => {
    navigate(route);
    // Cerrar el sidebar en móviles después de navegar
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 1, px: 1.5 }}>
      <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.route || 
                         location.pathname.startsWith(item.route + '/');
          
          // Obtener el componente de icono del mapeo
          const IconComponent = iconMap[item.icon] || HomeIcon;
          
          const menuButton = (
            <ListItem 
              key={item.id} 
              disablePadding 
              sx={{ 
                display: 'block',
                mb: 0.5,
              }}
            >
              <ListItemButton
                onClick={() => handleNavigation(item.route)}
                sx={{
                  minHeight: 56,
                  justifyContent: isOpen ? 'initial' : 'center',
                  px: 2.5,
                  py: 1.5,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: isActive ? 'rgba(209, 154, 74, 0.12)' : 'transparent',
                  color: isActive ? '#D19A4A' : 'text.primary',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: isActive ? '70%' : 0,
                    backgroundColor: '#D19A4A',
                    borderRadius: '0 4px 4px 0',
                    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'rgba(209, 154, 74, 0.18)' 
                      : 'rgba(209, 154, 74, 0.08)',
                    transform: 'translateX(4px)',
                    '&::before': {
                      height: '50%',
                    },
                  },
                  '&:active': {
                    transform: 'translateX(2px) scale(0.98)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 2.5 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? '#D19A4A' : 'text.secondary',
                    transition: 'all 0.2s',
                  }}
                >
                  <IconComponent sx={{ fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {item.name}
                    </Typography>
                  }
                  sx={{ 
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.2s',
                    m: 0,
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );

          // Mostrar tooltip solo cuando el sidebar está colapsado y NO es móvil
          if (!isOpen && !isMobile) {
            return (
              <Tooltip 
                key={item.id}
                title={item.name} 
                placement="right"
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ],
                  },
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(0, 0, 0, 0.87)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                    },
                  },
                }}
              >
                {menuButton}
              </Tooltip>
            );
          }

          return menuButton;
        })}
      </List>
    </Box>
  );

  // En móviles, usar drawer temporal
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en móviles
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            top: '56px', // Posicionar debajo del header
            height: 'calc(100% - 55px)',
            borderRight: 'none',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // En desktop, usar drawer permanente
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? 260 : 80,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width: isOpen ? 260 : 80,
          boxSizing: 'border-box',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginTop: '64px',
          borderRight: 'none',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04)',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

Menu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Menu;
