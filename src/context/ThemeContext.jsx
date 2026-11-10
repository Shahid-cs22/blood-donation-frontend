import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Enforce permanent classic white theme
  const theme = 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      localStorage.removeItem('theme');
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const toggleTheme = () => {
    // Permanent classic white theme - no-op for backward compatibility
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
