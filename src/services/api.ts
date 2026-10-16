// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Obtener o generar un ID de sesión único para el carrito invitado
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('x-session-id');
  if (!sessionId) {
    sessionId = `guest-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
    localStorage.setItem('x-session-id', sessionId);
  }
  return sessionId;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para inyectar headers en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-session-id'] = getOrCreateSessionId();
  return config;
});