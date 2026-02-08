import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useLoginContext } from '../hooks/context/LoginContext';
import { helpPermission } from '../helpers/permissionHelper';

const PublicRoute = ({ children }) => {
  const { user, isLoggedIn } = useLoginContext();
  const { filterRouter } = helpPermission();

  if (isLoggedIn && user) {

    const roleMapping = {
      'admin': 'ADMIN',
      'student': 'ESTUDIANTE',
      'ADMIN': 'ADMIN',
      'ESTUDIANTE': 'ESTUDIANTE'
    };

    const userRole = user?.role || user?.rol;
    const mappedRole = roleMapping[userRole] || userRole;
    
    const { routes } = filterRouter(mappedRole);
    
    if (routes && routes.length > 0) {
      return <Navigate to={routes[0]} replace />;
    }
  }


  return <>{children}</>;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
