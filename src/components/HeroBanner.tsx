// src/components/HeroBanner.tsx
import React from 'react';
import { themeColors } from '../theme/colors';

interface Props {
  onExplorarClick: () => void;
}

export const HeroBanner: React.FC<Props> = ({ onExplorarClick }) => {
  return (
    <div 
      className="relative w-full min-h-[60vh] md:min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        // Imagen de fondo con overlay oscuro para resaltar el texto
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&auto=format&fit=crop')`,
      }}
    >
      {/* Contenido Central del Banner */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
        <span 
          className="inline-block text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10 text-white border border-white/20"
        >
          Arte & Tradición Argentina
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md">
          Piezas Únicas Hechas a Mano
        </h1>

        <p className="text-sm md:text-lg text-stone-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
          Descubre nuestra colección exclusiva de mates trabajados artesanalmente y cuadros únicos para darle vida a tus espacios.
        </p>

        {/* Botón Acción Principal */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onExplorarClick}
            className="px-8 py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            style={{ 
              backgroundColor: themeColors.primary, 
              color: themeColors.primaryDark 
            }}
          >
            Explorar Colección ↓
          </button>
        </div>
      </div>
    </div>
  );
};