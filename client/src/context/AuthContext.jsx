import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMeApi, loginApi, registerApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('medibook_token'));
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('medibook_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function validateToken() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await getMeApi();
        if (!cancelled) {
          setUser(response.data.user || response.data);
        }
      } catch (err) {
        if (!cancelled) {
          clearAuth();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    validateToken();
    return () => {
      cancelled = true;
    };
  }, [token, clearAuth]);

  const login = useCallback(async (email, password) => {
    const response = await loginApi({ email, password });
    const data = response.data;
    const newToken = data.token;
    const loggedInUser = data.user;
    localStorage.setItem('medibook_token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (formData) => {
    const response = await registerApi(formData);
    const data = response.data;
    const newToken = data.token;
    const registeredUser = data.user;
    localStorage.setItem('medibook_token', newToken);
    setToken(newToken);
    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
