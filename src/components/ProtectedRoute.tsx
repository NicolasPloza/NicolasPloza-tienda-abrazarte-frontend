// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';

interface Props {
  children: React.ReactNode;
  requiereAdmin?: boolean;
  onLoginSuccess: () => void;
}

export const ProtectedRoute: React.FC<Props> = ({ children, requiereAdmin = false, onLoginSuccess }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-12">Verificando sesión...</div>;
  }

  // 1. Si no hay usuario autenticado, mostrar la pantalla de Login
  if (!usuario) {
    return <LoginPage onSuccess={onLoginSuccess} />;
  }

  // 2. Si requiere ser Administrador y el rol no coincide
  if (requiereAdmin && usuario.rol !== 'ADMINISTRADOR') {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center border rounded-xl bg-white">
        <h2 className="text-xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
        <p className="text-sm text-zinc-600">
          Tu cuenta ({usuario.email}) no posee permisos de administrador para ver este panel.
        </p>
      </div>
    );
  }

  // 3. Si cumple con los requisitos, renderizar la pantalla protegida
  return <>{children}</>;
};