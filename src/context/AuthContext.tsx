// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import { api } from '../services/api';
import { SessionExpiredModal } from '../components/SessionExpiredModal';

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

  // Estado para controlar la visibilidad del modal web de sesión expirada
  const [sessionExpired, setSessionExpired] = useState(false);

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
      setSessionExpired(false);
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

  useEffect(() => {
    const handleSesionExpirada = () => {
      logout();
      setSessionExpired(true); // Muestra el modal nativo de React en lugar del alert de la ventana
    };

    window.addEventListener('sesion-expirada', handleSesionExpirada);

    return () => {
      window.removeEventListener('sesion-expirada', handleSesionExpirada);
    };
  }, []);

  const handleModalConfirm = () => {
    setSessionExpired(false);
    // Redirige al login usando el evento global de recarga o navegación
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, registrar, loading }}>
      {children}
      <SessionExpiredModal
        isOpen={sessionExpired}
        onConfirm={handleModalConfirm}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};