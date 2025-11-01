/**
 * Auth Context
 * Manages authentication state and user data
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { user, token } = response.data.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    return response;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { user, token } = response.data.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    return response;
  };

  const googleLogin = async (googleToken) => {
    const response = await authAPI.googleAuth(googleToken);
    const { user, token } = response.data.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
