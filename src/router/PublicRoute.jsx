import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useLoginContext } from '../hooks/context/LoginContext';
import { helpPermission } from '../helpers/permissionHelper';

/**
 * Componente para rutas públicas (landing, login, etc.)
 * Redirige usuarios autenticados a su dashboard
 */
const PublicRoute = ({ children }) => {
  const { user, isLoggedIn } = useLoginContext();
  const { filterRouter } = helpPermission();

  // Si el usuario está autenticado, redirigir a su dashboard
  if (isLoggedIn && user) {
    // Mapeo de roles del API a roles internos
    const roleMapping = {
      'admin': 'ADMIN',
      'student': 'ESTUDIANTE',
      'ADMIN': 'ADMIN',
      'ESTUDIANTE': 'ESTUDIANTE'
    };

    const userRole = user?.role || user?.rol;
    const mappedRole = roleMapping[userRole] || userRole;
    
    // Obtener la primera ruta permitida según el rol
    const { routes } = filterRouter(mappedRole);
    
    if (routes && routes.length > 0) {
      return <Navigate to={routes[0]} replace />;
    }
  }

  // Usuario no autenticado, permitir acceso a ruta pública
  return <>{children}</>;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
