// src/components/CartDrawer.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { themeColors } from '../theme/colors';

interface Props {
  onGoToCheckout: () => void;
}

export const CartDrawer: React.FC<Props> = ({ onGoToCheckout }) => {
  const { cart, isOpen, setIsOpen, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-md h-full flex flex-col justify-between p-6 shadow-xl animate-in slide-in-from-right duration-200"
        style={{ backgroundColor: themeColors.surface }}
      >
        <div>
          {/* Encabezado del Carrito */}
          <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: themeColors.border }}>
            <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: themeColors.secondary }}>
              Tu Carrito
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-zinc-500 hover:text-zinc-800 cursor-pointer px-2"
            >
              &times;
            </button>
          </div>

          {/* Lista de Ítems */}
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {!cart?.items || cart.items.length === 0 ? (
              <p className="text-center py-8 text-xs font-medium" style={{ color: themeColors.textMuted }}>
                Tu carrito está vacío.
              </p>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-3 border-b relative group"
                  style={{ borderColor: themeColors.border }}
                >
                  <img
                    src={item.producto.fotos?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={item.producto.nombre}
                    className="w-16 h-16 object-cover rounded-lg border bg-stone-50"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-xs line-clamp-1" style={{ color: themeColors.textMain }}>
                      {item.producto.nombre}
                    </h4>
                    <p className="text-[11px] mt-0.5" style={{ color: themeColors.textMuted }}>
                      Cantidad: <strong>{item.cantidad}</strong>
                    </p>
                    <p className="text-xs font-bold mt-1" style={{ color: themeColors.secondary }}>
                      ${(Number(item.producto.precio) * item.cantidad).toLocaleString('es-AR')}
                    </p>
                  </div>

                  {/* Botón para Eliminar el Ítem del Carrito */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs p-1 cursor-pointer transition-colors"
                    title="Eliminar del carrito"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resumen y Botón de Checkout */}
        {cart?.items && cart.items.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: themeColors.border }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm">Total:</span>
              <span className="font-extrabold text-xl" style={{ color: themeColors.secondary }}>
                ${Number(cart.total).toLocaleString('es-AR')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onGoToCheckout();
              }}
              className="w-full py-3.5 rounded-lg font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-md"
              style={{ backgroundColor: themeColors.primary, color: themeColors.background }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};