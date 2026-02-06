import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(undefined);

export const SidebarProvider = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const openMobile = () => {
    setIsMobileOpen(true);
  };

  return (
    <SidebarContext.Provider value={{
      isMobileOpen,
      setIsMobileOpen,
      toggleMobile,
      closeMobile,
      openMobile
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
