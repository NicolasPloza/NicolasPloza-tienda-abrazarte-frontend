// src/components/CartDrawer.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { themeColors } from '../theme/colors';

interface Props {
  onGoToCheckout: () => void;
}

export const CartDrawer: React.FC<Props> = ({ onGoToCheckout }) => {
  const { cart, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-md h-full flex flex-col justify-between p-6 shadow-xl animate-in slide-in-from-right duration-200"
        style={{ backgroundColor: themeColors.surface }}
      >
        <div>
          <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: themeColors.border }}>
            <h2 className="text-xl font-bold" style={{ color: themeColors.secondary }}>
              Tu Carrito
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-2xl font-bold text-zinc-500 hover:text-zinc-800">
              &times;
            </button>
          </div>

          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {!cart?.items || cart.items.length === 0 ? (
              <p className="text-center py-8" style={{ color: themeColors.textMuted }}>
                Tu carrito está vacío.
              </p>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-3 border-b" style={{ borderColor: themeColors.border }}>
                  <img
                    src={item.producto.fotos?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={item.producto.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm" style={{ color: themeColors.textMain }}>
                      {item.producto.nombre}
                    </h4>
                    <p className="text-xs" style={{ color: themeColors.textMuted }}>
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: themeColors.primary }}>
                      ${(Number(item.producto.precio) * item.cantidad).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cart?.items && cart.items.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: themeColors.border }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Total:</span>
              <span className="font-bold text-2xl" style={{ color: themeColors.primary }}>
                ${Number(cart.total).toLocaleString('es-AR')}
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onGoToCheckout();
              }}
              className="w-full py-3 rounded font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: themeColors.primary }}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};