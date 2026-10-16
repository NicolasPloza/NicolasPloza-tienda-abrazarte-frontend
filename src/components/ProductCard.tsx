// src/components/ProductCard.tsx
import React from 'react';
import type { Producto } from '../types';
import { useCart } from '../context/CartContext';
import { themeColors } from '../theme/colors';

interface Props {
  product: Producto;
  onSelect: (id: number) => void;
}

// URLs de imágenes placeholder de alta calidad si el producto no tiene fotos en la base de datos
const PLACEHOLDER_MATES = 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800';
const PLACEHOLDER_CUADROS = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800';

export const ProductCard: React.FC<Props> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  // 1. Obtener la foto principal o asignar un placeholder adecuado según la categoría
  const fotoEncontrada = product.fotos?.find((f) => f.esPrincipal)?.url || product.fotos?.[0]?.url;
  
  const fotoFinal = fotoEncontrada || (
    product.categoriaId === 1 ? PLACEHOLDER_MATES : PLACEHOLDER_CUADROS
  );

  return (
    <div
      className="group relative rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg flex flex-col justify-between cursor-pointer"
      style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
      onClick={() => onSelect(product.id)}
    >
      <div>
        {/* Contenedor de Imagen con Efecto Hover */}
        <div className="h-72 w-full overflow-hidden bg-stone-100 relative">
          <img
            src={fotoFinal}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.permitePersonalizacion && (
            <span
              className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
            >
              Personalizable
            </span>
          )}
        </div>

        {/* Información del Producto */}
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: themeColors.textMuted }}>
            {product.categoria?.nombre || 'Artesanal'}
          </p>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:underline" style={{ color: themeColors.textMain }}>
            {product.nombre}
          </h3>
          <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: themeColors.textMuted }}>
            {product.descripcion || 'Pieza artesanal elaborada a mano con materiales seleccionados.'}
          </p>
        </div>
      </div>

      {/* Precio y Botón */}
      <div className="p-5 pt-0 flex items-center justify-between mt-2">
        <span className="font-extrabold text-xl" style={{ color: themeColors.secondary }}>
          ${Number(product.precio).toLocaleString('es-AR')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
          }}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-transform active:scale-95"
          style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
        >
          + Agregar
        </button>
      </div>
    </div>
  );
};