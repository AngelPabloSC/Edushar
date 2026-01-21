import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useLoginContext } from '../hooks/context/LoginContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Componente para proteger rutas que requieren autenticación
 * Opcionalmente verifica el rol del usuario
 */
const ProtectRoute = ({ children, requiredRole }) => {
  const { user, isLoggedIn, loading } = useLoginContext();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole) {
    // Mapeo de roles del API a roles internos
    const roleMapping = {
      'admin': 'ADMIN',
      'student': 'ESTUDIANTE',
      'ADMIN': 'ADMIN',
      'ESTUDIANTE': 'ESTUDIANTE'
    };
    
    const userRole = user?.role || user?.rol;
    const mappedUserRole = roleMapping[userRole] || userRole;
    
    if (mappedUserRole !== requiredRole) {

      return <Navigate to="/" replace />;
    }
  }


  return <>{children}</>;
};

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf(['ADMIN', 'ESTUDIANTE']),
};

export default ProtectRoute;
