import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { themeColors } from '../theme/colors';

interface Props {
  currentView: string;  
  setCurrentView: (view: string) => void;
  onCategorySelect: (categoriaId?: number) => void;
}

export const Navbar: React.FC<Props> = ({ currentView, setCurrentView, onCategorySelect }) => {
  const { totalItems, setIsOpen } = useCart();
  const { usuario, logout } = useAuth();

  // El botón de administración SOLO es visible si el usuario tiene rol ADMINISTRADOR
  const esAdmin = usuario?.rol === 'ADMINISTRADOR';

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-white/90" style={{ borderColor: themeColors.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Estilo Minimalista */}
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => { setCurrentView('catalog'); onCategorySelect(undefined); }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-sm"
              style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
            >
              M
            </div>
            <div>
              <span className="text-xl font-black tracking-widest uppercase block leading-none" style={{ color: themeColors.secondary }}>
                ABRAZARTE
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase block mt-1" style={{ color: themeColors.textMuted }}>
                Mates & Cuadros
              </span>
            </div>
          </div>

          {/* Menú Principal de Navegación */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => { setCurrentView('catalog'); onCategorySelect(undefined); }}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70"
              style={{ color: currentView === 'catalog' ? themeColors.secondary : themeColors.textMuted }}
            >
              Colección Completa
            </button>
            <button
              onClick={() => { setCurrentView('catalog'); onCategorySelect(1); }}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70"
              style={{ color: themeColors.textMuted }}
            >
              Mates
            </button>
            <button
              onClick={() => { setCurrentView('catalog'); onCategorySelect(2); }}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70"
              style={{ color: themeColors.textMuted }}
            >
              Cuadros
            </button>
          </nav>

          {/* Acciones y Carrito */}
          <div className="flex items-center space-x-4">
            
            {/* Botón de Panel Admin (Solo visible para Administradores autenticados) */}
            {esAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className="text-xs font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all shadow-sm"
                style={{ backgroundColor: themeColors.secondary, color: '#ffffff' }}
              >
                Panel Admin
              </button>
            )}

            {/* Opciones de Cuenta */}
            {usuario ? (
              <div className="flex items-center gap-3 border-l pl-4" style={{ borderColor: themeColors.border }}>
                <span className="text-xs font-medium text-zinc-700 hidden sm:inline">
                  {usuario.nombre}
                </span>
                <button
                  onClick={() => { logout(); setCurrentView('catalog'); }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="text-xs font-bold uppercase tracking-wider text-zinc-600 border-l pl-4 hover:opacity-80"
                style={{ borderColor: themeColors.border }}
              >
                Iniciar Sesión
              </button>
            )}

            {/* Ícono de Carrito */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full transition-colors hover:bg-stone-100"
              title="Ver Carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={themeColors.secondary}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-sm"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};