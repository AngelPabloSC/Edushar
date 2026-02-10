import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header2 from '@shared/components/layout/Header2';
import Menu from '@shared/components/layout/Menu';
import { helpPermission } from '@shared/utils/permissionHelper';
import { useSidebarContext } from '@shared/context/SidebarContext';

/**
 * Layout privado con sidebar para usuarios autenticados
 * Muestra menú dinámico según el rol del usuario
 */
const PrivateLayout = () => {
  const { isOpen } = useSidebarContext();
  const { filterRouter } = helpPermission();
  const { menuItems } = filterRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ height: '100dvh', position: 'relative' }}>
      <Box sx={{ overflow: 'hidden' }}>
        <Header2 />
      </Box>
      <Menu menuItems={menuItems} />
      <Box
        sx={{
          height: '100%',
          transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // En móviles no hay padding porque el drawer es temporal
          paddingLeft: isMobile ? 0 : (isOpen ? '260px' : '80px'),
          paddingTop: '64px', // Height of AppBar
          marginLeft: 2,
          marginRight: 2,
          marginTop: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PrivateLayout;
