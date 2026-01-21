import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { helpPermission } from "../../helpers/permissionHelper";

const LoginContext = createContext();

export const useLoginContext = () => useContext(LoginContext);

// Alias para compatibilidad con código existente
export const useAuth = useLoginContext;

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { filterRouter } = helpPermission();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    
    const { user: userData, token: accessToken } = data;
    const { 
      id, 
      authId,
      email, 
      firstName, 
      lastName, 
      photoProfile,
      birthdate,
      role, 
      status,
      createdAt
    } = userData;

    const newUser = {
      id,
      authId,
      email,
      firstName,
      lastName,
      photoProfile,
      birthdate,
      role,
      status,
      createdAt
    };

    // Guardamos el usuario y el token en localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("iduser", id);

    // Actualizamos el estado con el nuevo usuario y token
    setUser(newUser);
    setToken(accessToken);

    // Filtrar las rutas según el rol del usuario
    const { routes } = filterRouter(role);
    if (routes && routes.length > 0) {
      navigate(routes[0]); // Redirigir a la primera ruta según el rol
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("iduser");

    // Limpiar los estados
    setUser(null);
    setToken(null);

    // Redirigir a la página de inicio
    navigate("/");
  };

  const values = {
    user,
    token,
    isLoggedIn: !!user && !!token,
    loading,
    login,
    logout,
  };

  return (
    <LoginContext.Provider value={values}>{children}</LoginContext.Provider>
  );
};

// Export del provider con alias para compatibilidad
export const AuthProvider = LoginProvider;