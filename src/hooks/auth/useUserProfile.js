import { useState, useEffect } from 'react';
import { useFetchDataPromise } from '../api/useFetchDataPromise';

/**
 * Custom hook to fetch user profile data from the API
 * @returns {Object} { user, loading, error, refetch }
 */
export const useUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getFechData } = useFetchDataPromise();

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get user ID from localStorage
            const userToken = localStorage.getItem("user");
            const tokenData = JSON.parse(userToken || "{}");
            const userId = tokenData.uid || tokenData.id;

            if (!userId) {
                throw new Error("No se encontró el ID del usuario en localStorage");
            }

            // Fetch user data from API
            const response = await getFechData({
                endPoint: 'api/users/get',
                method: 'POST',
                additionalData: { id: userId }
            });

            if (response.code === 'COD_OK' && response.data?.user) {
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Error al obtener los datos del usuario');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching user profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userData) => {
        try {
            setLoading(true);

            const response = await getFechData({
                endPoint: 'api/users/update',
                method: 'POST',
                additionalData: userData
            });

            if (response.code === 'COD_OK') {
                // Refresh user data
                await fetchUserProfile();
                return { success: true, message: response.message || 'Perfil actualizado correctamente' };
            } else {
                return { success: false, message: response.message || 'Error al actualizar el perfil' };
            }
        } catch (err) {
            return { success: false, message: err.message || 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return {
        user,
        loading,
        error,
        refetch: fetchUserProfile,
        updateUser
    };
};
