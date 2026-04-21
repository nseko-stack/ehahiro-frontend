import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { initSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
    setLoading(false);
  }, []);

  const login = async (phone) => {
    const { data } = await api.post('/auth/login', { phone });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
    // Initialize WebSocket connection
    initSocket(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
    // Initialize WebSocket connection
    initSocket(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.Authorization;
    setUser(null);
    // Disconnect WebSocket
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};