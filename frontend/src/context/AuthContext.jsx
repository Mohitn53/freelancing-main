/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { profileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('dropcode_token'));

  const handleLogin = useCallback((newToken, userData) => {
    localStorage.setItem('dropcode_token', newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('dropcode_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const res = await profileApi.get();
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err.message);
          // logout only if token is expired/invalid (401)
          if (err.message.includes('401') || err.message.toLowerCase().includes('token')) {
             handleLogout();
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token, handleLogout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
