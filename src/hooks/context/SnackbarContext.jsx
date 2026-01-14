import { useSnackbar } from "notistack";
import { createContext, useContext } from "react";

const SnackbarContext = createContext({});
export const useSnackBarContext = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar(); // Usamos el hook directamente de notistack

  const handleSetDataSnackbar = ({ message, type = "success" }) => {

    enqueueSnackbar(message, { variant: type });
  };

  const values = {
    handleSetDataSnackbar,
  };

  return (
    <SnackbarContext.Provider value={values}>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;