// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { themeColors } from '../theme/colors';

interface Props {
  onOrderCompleted: () => void;
}

export const CheckoutPage: React.FC<Props> = ({ onOrderCompleted }) => {
  const { cart, resetCartSession } = useCart();
  const [formData, setFormData] = useState({
    nombreCliente: '',
    emailCliente: '',
    telefono: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/orders/checkout', formData);
      if (res.data.success) {
        setOrderSuccess(res.data.data);
        await resetCartSession();
        //await fetchCart(); // Limpiar el carrito en el estado
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-xl border bg-white text-center shadow-sm" style={{ borderColor: themeColors.border }}>
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.secondary }}>
          ¡Gracias por tu compra!
        </h2>
        <p className="text-sm mb-4" style={{ color: themeColors.textMuted }}>
          Tu orden <strong>#{orderSuccess.orden.id}</strong> ha sido registrada con éxito. Te hemos enviado un correo de confirmación a <strong>{orderSuccess.orden.emailCliente}</strong>.
        </p>

        {orderSuccess.opcionRegistro && (
          <div className="p-4 rounded-lg bg-stone-50 border text-left my-6" style={{ borderColor: themeColors.border }}>
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Crea tu cuenta en un clic</p>
            <p className="text-xs text-stone-600 mb-3">{orderSuccess.opcionRegistro.mensaje}</p>
            <button
              onClick={() => alert('Próximamente: Crear contraseña.')}
              className="text-xs px-4 py-2 rounded text-white font-medium"
              style={{ backgroundColor: themeColors.primary }}
            >
              Crear contraseña para {orderSuccess.orden.emailCliente}
            </button>
          </div>
        )}

        <button
          onClick={onOrderCompleted}
          className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90 mt-2"
          style={{ backgroundColor: themeColors.primary }}
        >
          Volver a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: themeColors.secondary }}>
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Envío */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={formData.nombreCliente}
              onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              className="w-full p-2.5 border rounded text-sm focus:outline-none"
              style={{ borderColor: themeColors.border }}
              placeholder= "Nombre y apellido"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={formData.emailCliente}
              onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
              className="w-full p-2.5 border rounded text-sm focus:outline-none"
              style={{ borderColor: themeColors.border }}
              placeholder="mail@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Teléfono</label>
            <input
              type="text"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full p-2.5 border rounded text-sm focus:outline-none"
              style={{ borderColor: themeColors.border }}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Dirección de Entrega</label>
            <textarea
              required
              rows={3}
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full p-2.5 border rounded text-sm focus:outline-none"
              style={{ borderColor: themeColors.border }}
              placeholder="Direccion"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !cart?.items.length}
            className="w-full py-3 rounded-lg font-bold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: themeColors.primary }}
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>

        {/* Resumen del Carrito */}
        <div className="p-6 rounded-lg border bg-stone-50 h-fit" style={{ borderColor: themeColors.border }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: themeColors.secondary }}>Resumen del Pedido</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
            {cart?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.producto.nombre} x {item.cantidad}</span>
                <span className="font-semibold">${(Number(item.producto.precio) * item.cantidad).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg" style={{ borderColor: themeColors.border }}>
            <span>Total:</span>
            <span style={{ color: themeColors.primary }}>${Number(cart?.total || 0).toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};