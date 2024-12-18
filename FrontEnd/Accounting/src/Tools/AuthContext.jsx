// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin, logout as apiLogout } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data')));

  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      if (response.access) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
