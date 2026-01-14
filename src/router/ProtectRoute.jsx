import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Componente para proteger rutas que requieren autenticación
 * Opcionalmente verifica el rol del usuario
 */
const ProtectRoute = ({ children, requiredRole }) => {
  const { user, isLoggedIn, loading } = useAuth();

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
  if (requiredRole && user?.rol !== requiredRole) {
    // Redirigir a la página principal si no tiene el rol correcto
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y con rol correcto (si se requiere)
  return <>{children}</>;
};

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf(['ADMIN', 'ESTUDIANTE']),
};

export default ProtectRoute;
