// src/components/SessionExpiredModal.tsx
import React from 'react';
import { themeColors } from '../theme/colors';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
}

export const SessionExpiredModal: React.FC<Props> = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl text-center space-y-4 border" style={{ borderColor: themeColors.border }}>
        
        {/* Ícono Ilustrativo de Candado / Seguridad */}
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
          🔒
        </div>

        {/* Título y Mensaje */}
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: themeColors.secondary }}>
            Sesión Expirada
          </h3>
          <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed">
            Tu sesión ha finalizado por motivos de seguridad. Por favor, vuelve a ingresar con tus credenciales para continuar.
          </p>
        </div>

        {/* Botón de Acción Integrado en la Aplicación */}
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all duration-200 active:scale-95 shadow-md cursor-pointer hover:opacity-90"
          style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
        >
          Iniciar Sesión de Nuevo
        </button>
      </div>
    </div>
  );
};