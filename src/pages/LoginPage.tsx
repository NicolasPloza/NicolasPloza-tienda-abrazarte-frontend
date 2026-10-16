// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { themeColors } from '../theme/colors';

interface Props {
  onSuccess: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccess }) => {
  const { login, registrar } = useAuth();
  
  // Estado para alternar entre 'login' y 'registro'
  const [modo, setModo] = useState<'login' | 'registro'>('login');

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (modo === 'login') {
        await login(email, password);
      } else {
        await registrar(nombre, email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Ocurrió un error al procesar la solicitud. Intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="max-w-md mx-auto my-12 p-8 rounded-2xl border shadow-sm transition-all"
      style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
    >
      {/* Pestañas para cambiar entre Login y Registro */}
      <div className="flex border-b mb-6" style={{ borderColor: themeColors.border }}>
        <button
          type="button"
          onClick={() => { setModo('login'); setError(''); }}
          className="flex-1 pb-3 font-extrabold text-xs uppercase tracking-wider transition-colors border-b-2"
          style={{
            borderColor: modo === 'login' ? themeColors.primaryDark : 'transparent',
            color: modo === 'login' ? themeColors.secondary : themeColors.textMuted,
          }}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setModo('registro'); setError(''); }}
          className="flex-1 pb-3 font-extrabold text-xs uppercase tracking-wider transition-colors border-b-2"
          style={{
            borderColor: modo === 'registro' ? themeColors.primaryDark : 'transparent',
            color: modo === 'registro' ? themeColors.secondary : themeColors.textMuted,
          }}
        >
          Crear Cuenta
        </button>
      </div>

      <h2 className="text-xl font-black text-center mb-1 uppercase tracking-tight" style={{ color: themeColors.secondary }}>
        {modo === 'login' ? 'Bienvenido de Nuevo' : 'Crear Cuenta Nueva'}
      </h2>
      <p className="text-xs text-center mb-6" style={{ color: themeColors.textMuted }}>
        {modo === 'login'
          ? 'Ingresa tus credenciales para acceder a tu historial'
          : 'Registrate para guardar tus direcciones y seguir tus pedidos'}
      </p>

      {/* Alerta de Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Campo Nombre (Solo visible en Registro) */}
        {modo === 'registro' && (
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider mb-1" style={{ color: themeColors.textMain }}>
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm focus:outline-none transition-colors"
              style={{ borderColor: themeColors.border }}
              placeholder="Ej. María González"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider mb-1" style={{ color: themeColors.textMain }}>
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm focus:outline-none transition-colors"
            style={{ borderColor: themeColors.border }}
            placeholder="maria@example.com"
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider mb-1" style={{ color: themeColors.textMain }}>
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm focus:outline-none transition-colors"
            style={{ borderColor: themeColors.border }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-lg font-black uppercase text-xs tracking-widest transition-transform active:scale-95 disabled:opacity-50 mt-4 shadow-sm"
          style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
        >
          {loading
            ? 'Procesando...'
            : modo === 'login'
            ? 'Ingresar'
            : 'Registrarme'}
        </button>
      </form>
    </div>
  );
};