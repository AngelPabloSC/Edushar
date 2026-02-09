import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useLoginContext } from '../hooks/context/LoginContext';
import { helpPermission } from '../helpers/permissionHelper';

const PublicRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useLoginContext();

  // Wait for auth state to load before deciding what to render
  if (loading) {
    return null; // or return a loading spinner
  }

  if (isLoggedIn && user) {
    const roleMapping = {
      'admin': '/admin/dashboard',
      'student': '/estudiante/inicio',
      'ADMIN': '/admin/dashboard',
      'ESTUDIANTE': '/estudiante/inicio'
    };

    const userRole = user?.role || user?.rol;
    const dashboardPath = roleMapping[userRole];
    
    if (dashboardPath) {
      return <Navigate to={dashboardPath} replace />;
    }
  }

  return <>{children}</>;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
