import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const Colors = {
    light: {
        dark: false,
        background: '#F5F5F5',
        card: '#FFFFFF',
        text: '#333333',
        subText: '#666666',
        border: '#E0E0E0',
        primary: '#4A6572',
        danger: '#D32F2F',
        tabBar: '#FFFFFF',
    },
    dark: {
        dark: true,
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        subText: '#AAAAAA',
        border: '#333333',
        primary: '#4A6572', 
        danger: '#EF5350',
        tabBar: '#121212',
    }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const theme = user?.dark_mode_enabled ? Colors.dark : Colors.light;

  return (
    <AuthContext.Provider value={{ user, login, logout, theme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);