import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const SidebarContext = createContext(undefined);

export const SidebarProvider = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const contextValue = useMemo(() => ({
    isMobileOpen,
    setIsMobileOpen,
    toggleMobile,
    closeMobile,
    openMobile
  }), [isMobileOpen, toggleMobile, closeMobile, openMobile]);

  return (
    <SidebarContext.Provider value={contextValue}>
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
