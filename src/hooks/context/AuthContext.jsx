import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { helpPermission } from '../../helpers/permissionHelper';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { filterRouter } = helpPermission();

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    const { user: userData, accessToken } = data;
    const { rol, id, nombre, apellido, email } = userData;

    const newUser = {
      id,
      nombre,
      apellido,
      email,
      rol,
    };

    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('iduser', id);

    // Actualizar estado
    setUser(newUser);
    setToken(accessToken);

    // Navegar a la primera ruta del rol
    const { routes } = filterRouter(rol);
    if (routes && routes.length > 0) {
      navigate(routes[0]);
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('iduser');

    // Limpiar estado
    setUser(null);
    setToken(null);

    // Redirigir a home
    navigate('/');
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user && !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
