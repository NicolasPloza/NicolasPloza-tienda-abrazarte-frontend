// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  registrar: (nombre: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restaurar usuario desde localStorage si existe token guardado
    const savedUser = localStorage.getItem('usuario');
    if (token && savedUser) {
      try {
        setUsuario(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: nuevoToken, usuario: datosUsuario } = res.data.data;
      
      console.log(datosUsuario.rol);
      
      // Asignar rol por defecto para la demo si la API no lo envía aún
      const usuarioConRol: Usuario = {
        ...datosUsuario,
        rol: datosUsuario.rol,
      };

      

      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioConRol));
      
      setToken(nuevoToken);
      setUsuario(usuarioConRol);
    }
  };

  /**
   * Registra un nuevo usuario en la API y guarda la sesión automáticamente
   */
  const registrar = async (nombre: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { nombre, email, password });
    if (res.data.success) {
      const { token: nuevoToken, usuario: datosUsuario } = res.data.data;

      const usuarioNuevo: Usuario = {
        ...datosUsuario,
        rol: 'CLIENTE',
      };

      localStorage.setItem('token', nuevoToken);
      localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));

      setToken(nuevoToken);
      setUsuario(usuarioNuevo);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, registrar, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};