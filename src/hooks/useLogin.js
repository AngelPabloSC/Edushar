import React from 'react'
import { useFetchDataPromise } from './useFetchDataPromise'
import { useDialong } from './useDialog'
import { useLoginContext } from './context/LoginContext'
export const useLogin = (data) => {
    const { getFechData } = useFetchDataPromise()
    const {
        isOpen,
        dialongContent,
        handleOpenDialog,
        handleCloseDialog,
        setDialongContent,
    } = useDialong();
    const { login } = useLoginContext();
    const handleLogin = async (data) => {
        try {
            const response = await getFechData({
                endPoint: 'api/login',
                method: "POST",
                additionalData: data,
            })

            // Si el código es COD_OK, el login fue exitoso
            if (response.code === "COD_OK") {
                // Llamar a la función login del contexto con los datos del usuario
                login(response.data);
            } else {
                // Si hay un error, mostrar el diálogo
                const { message } = response
                handleOpenDialog()
                setDialongContent({
                    title: "Error",
                    message: message || "Error al iniciar sesión"
                })
            }
        }
        catch (error) {
            console.error("Error en login:", error)
            handleOpenDialog()
            setDialongContent({
                title: "Error",
                message: "Error al momento de enviar los datos"
            })
        }
    }
    return {
        handleLogin,
        isOpen,
        dialongContent,
        handleOpenDialog,
        handleCloseDialog,
    }
}
