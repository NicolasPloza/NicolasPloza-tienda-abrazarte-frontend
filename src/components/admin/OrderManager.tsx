// src/components/admin/OrderManager.tsx
import React, { useEffect, useState } from 'react';
import type { Orden, EstadoOrden } from '../../types';
import { api } from '../../services/api';
import { themeColors } from '../../theme/colors';

export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Orden[]>([]);
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filterEstado ? `/orders/admin/all?estado=${filterEstado}` : '/orders/admin/all';
      const res = await api.get(url);
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      // Si la petición falla (por ejemplo con 401), vaciamos las órdenes del estado
      setOrders([]);
      console.error('Error al cargar órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterEstado]);

  const handleStatusChange = async (ordenId: number, newStatus: EstadoOrden) => {
    try {
      await api.patch(`/orders/admin/${ordenId}/status`, { estado: newStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight" style={{ color: themeColors.secondary }}>
            Listado de Órdenes
        </h2>

        <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full sm:w-auto p-2 border rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
            style={{ borderColor: themeColors.border }}
        >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE_PAGO">PENDIENTE_PAGO</option>
            <option value="PAGADO">PAGADO</option>
            <option value="ENVIADO">ENVIADO</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
        </select>
        </div>

        {/* Tarjetas de Órdenes Responsivas */}
        <div className="space-y-4">
        {orders.map((orden) => (
            <div
            key={orden.id}
            className="p-4 sm:p-5 rounded-xl border bg-white flex flex-col sm:flex-row justify-between gap-4 shadow-sm"
            style={{ borderColor: themeColors.border }}
            >
            <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-base sm:text-lg">Orden #{orden.id}</span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded text-white bg-zinc-800">
                    {orden.estado}
                </span>
                </div>
                <p className="text-xs text-zinc-600">
                Cliente: <strong>{orden.nombreCliente}</strong> ({orden.emailCliente})
                </p>
                <p className="text-xs text-zinc-500">Teléfono: {orden.telefono}</p>
                <p className="text-xs text-zinc-500">Dirección: {orden.direccion}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0" style={{ borderColor: themeColors.border }}>
                <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block sm:text-right">Total</span>
                <span className="font-extrabold text-lg sm:text-xl" style={{ color: themeColors.secondary }}>
                    ${Number(orden.total).toLocaleString('es-AR')}
                </span>
                </div>

                <select
                value={orden.estado}
                onChange={(e) => handleStatusChange(orden.id, e.target.value as EstadoOrden)}
                className="mt-2 w-full sm:w-auto p-2 border rounded-md text-xs font-bold focus:outline-none cursor-pointer bg-stone-50"
                style={{ borderColor: themeColors.border }}
                >
                <option value="PENDIENTE_PAGO">PENDIENTE_PAGO</option>
                <option value="PAGADO">PAGADO</option>
                <option value="ENVIADO">ENVIADO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="CANCELADO">CANCELADO</option>
                </select>
            </div>
            </div>
            ))}
    </div>
    </div>
  );
};