// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { themeColors } from '../theme/colors';

interface Props {
  currentView: string;
  setCurrentView: (view: string) => void;
  onCategorySelect: (categoriaId?: number) => void;
}

export const Navbar: React.FC<Props> = ({ currentView, setCurrentView, onCategorySelect }) => {
  const { totalItems, setIsOpen, resetCartSession } = useCart();
  const { usuario, logout } = useAuth();

  // Estado para controlar la apertura y cierre del menú desplegable en celulares
  const [menuAbierto, setMenuAbierto] = useState(false);

  // El botón de administración SOLO es visible si el usuario tiene rol ADMINISTRADOR
  const esAdmin = usuario?.rol === 'ADMINISTRADOR';

  /**
   * Función auxiliar para cambiar de vista, seleccionar categoría y cerrar el menú móvil
   */
  const handleNavegar = (vista: string, categoriaId?: number) => {
    if (vista === 'admin') {
        // Si la vista es la pantalla de administración, cambiamos la vista directamente
        setCurrentView('admin');
    } else {
        // Si es el catálogo o login, actualizamos la categoría y la vista
        onCategorySelect(categoriaId);
        setCurrentView(vista);
    }
    
    // Cerramos el menú desplegable en dispositivos móviles
    setMenuAbierto(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-white/90" style={{ borderColor: themeColors.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. LOGO MINIMALISTA DE LA MARCA */}
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => handleNavegar('catalog', undefined)}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0"
              style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
            >
              M
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-widest uppercase block leading-none" style={{ color: themeColors.secondary }}>
                ABRAZARTE
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase block mt-1" style={{ color: themeColors.textMuted }}>
                Mates & Cuadros
              </span>
            </div>
          </div>

          {/* 2. MENÚ PRINCIPAL PARA COMPUTADORAS (Visible únicamente en escritorios md+) */}
          <nav className="hidden md:flex space-x-8">
            <button
              type="button"
              onClick={() => handleNavegar('catalog', undefined)}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70 cursor-pointer"
              style={{ color: currentView === 'catalog' ? themeColors.secondary : themeColors.textMuted }}
            >
              Colección Completa
            </button>
            <button
              type="button"
              onClick={() => handleNavegar('catalog', 1)}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70 cursor-pointer"
              style={{ color: themeColors.textMuted }}
            >
              Mates
            </button>
            <button
              type="button"
              onClick={() => handleNavegar('catalog', 2)}
              className="text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-70 cursor-pointer"
              style={{ color: themeColors.textMuted }}
            >
              Cuadros
            </button>
          </nav>

          {/* 3. ACCIONES PRINCIPALES (Carrito, Admin y Menú Hamburguesa) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Botón de Panel Admin (Escritorio) */}
            {esAdmin && (
              <button
                type="button"
                onClick={() => handleNavegar('admin')}
                className="hidden md:block text-xs font-extrabold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all shadow-sm cursor-pointer hover:opacity-90"
                style={{ backgroundColor: themeColors.secondary, color: '#ffffff' }}
              >
                Panel Admin
              </button>
            )}

            {/* Opciones de Cuenta (Escritorio) */}
            <div className="hidden md:flex items-center gap-3 border-l pl-4" style={{ borderColor: themeColors.border }}>
              {usuario ? (
                <>
                  <span className="text-xs font-medium text-zinc-700">
                    {usuario.nombre}
                  </span>
                  <button
                    type="button"
                    onClick={async () => { 
                      logout(); 
                      await resetCartSession();
                      handleNavegar('catalog'); 
                    }}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavegar('login')}
                  className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:opacity-80 cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>

            {/* Ícono de Carrito (Siempre visible en todas las pantallas) */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full transition-colors hover:bg-stone-100 cursor-pointer"
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

            {/* BOTÓN HAMBURGUESA PARA MOVILES (Visible únicamente en dispositivos móviles) */}
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2.5 rounded-lg text-zinc-700 hover:bg-stone-100 cursor-pointer focus:outline-none"
              aria-label="Abrir menú"
            >
              {menuAbierto ? (
                // Ícono de Cruz (✕) cuando el menú está abierto
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Ícono de Hamburguesa (☰) cuando el menú está cerrado
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL (Desplegable para Celulares) */}
      {menuAbierto && (
        <div className="md:hidden border-t bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg" style={{ borderColor: themeColors.border }}>
          
          {/* Categorías */}
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Categorías</span>
            <button
              type="button"
              onClick={() => handleNavegar('catalog', undefined)}
              className="text-left py-2 px-3 rounded-lg text-xs font-bold uppercase text-zinc-800 hover:bg-stone-50 cursor-pointer"
            >
              Colección Completa
            </button>
            <button
              type="button"
              onClick={() => handleNavegar('catalog', 1)}
              className="text-left py-2 px-3 rounded-lg text-xs font-bold uppercase text-zinc-800 hover:bg-stone-50 cursor-pointer"
            >
              Mates
            </button>
            <button
              type="button"
              onClick={() => handleNavegar('catalog', 2)}
              className="text-left py-2 px-3 rounded-lg text-xs font-bold uppercase text-zinc-800 hover:bg-stone-50 cursor-pointer"
            >
              Cuadros
            </button>
          </div>

          <div className="border-t pt-3 space-y-3" style={{ borderColor: themeColors.border }}>
            {/* Botón Admin en Celular */}
            {esAdmin && (
              <button
                type="button"
                onClick={() => handleNavegar('admin')}
                className="w-full text-center py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider text-white shadow-sm cursor-pointer"
                style={{ backgroundColor: themeColors.secondary }}
              >
                Panel de Administración
              </button>
            )}

            {/* Usuario y Sesión en Celular */}
            {usuario ? (
              <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                <span className="text-xs font-semibold text-zinc-700">
                  Hola, <strong>{usuario.nombre}</strong>
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    logout();
                    await resetCartSession();
                    handleNavegar('catalog');
                  }}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavegar('login')}
                className="w-full text-center py-2.5 rounded-lg border text-xs font-bold uppercase text-zinc-800 hover:bg-stone-50 cursor-pointer"
                style={{ borderColor: themeColors.border }}
              >
                Iniciar Sesión
              </button>
            )}
          </div>

        </div>
      )}
    </header>
  );
};