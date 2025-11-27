// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Création du contexte
const AuthContext = createContext(null);

// 2. Le Provider (qui va envelopper l'app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = pas connecté

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Un Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);