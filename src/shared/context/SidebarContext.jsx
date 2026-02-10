import React, { createContext, useContext, useState, useEffect } from "react";

const SidebardContext = createContext();
export const useSidebarContext = () => useContext(SidebardContext);

export const SidebarProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("course");
  
  // Detectar si es móvil al cargar
  const isMobileDevice = () => {
    return window.innerWidth < 900; // md breakpoint de MUI
  };
  
  const [isOpen, setIsOpen] = useState(!isMobileDevice());

  // Actualizar el estado cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const isMobile = isMobileDevice();
      // Solo cerrar automáticamente en móviles, no abrir automáticamente en desktop
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleShowCourses = () => {
    setActiveSection("course");
    onShowCourses();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const values = {
    activeSection,
    handleShowCourses,
    isOpen,
    toggleSidebar,
    setActiveSection,
  };

  return (
    <SidebardContext.Provider value={values}>
      {children}
    </SidebardContext.Provider>
  );
};
