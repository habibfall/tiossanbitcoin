import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to check if it's nighttime (between 6 PM and 6 AM)
  const isNighttime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  // Effect to initialize theme based on time of day
  useEffect(() => {
    setIsDarkMode(isNighttime());
    
    // Update theme every minute
    const interval = setInterval(() => {
      setIsDarkMode(isNighttime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 