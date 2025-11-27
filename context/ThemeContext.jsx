// context/ThemeContext.jsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [particlesTheme, setParticlesTheme] = useState('default');
  const [mounted, setMounted] = useState(false);

  // Load saved themes from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedParticlesTheme = localStorage.getItem('particlesTheme') || 'default';
    
    setTheme(savedTheme);
    setParticlesTheme(savedParticlesTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  // Update theme when it changes
  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  // Update particles theme
  const changeParticlesTheme = useCallback((newParticlesTheme) => {
    setParticlesTheme(newParticlesTheme);
    localStorage.setItem('particlesTheme', newParticlesTheme);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      particlesTheme,
      changeParticlesTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};