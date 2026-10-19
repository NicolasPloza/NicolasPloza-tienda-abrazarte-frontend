// src/components/admin/ProductManager.tsx
import React, { useEffect, useState } from 'react';
import type { Producto } from '../../types';
import { api } from '../../services/api';
import { themeColors } from '../../theme/colors';
import type { ProductFormData } from './ProductFormModal';
import { ProductFormModal } from './ProductFormModal';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const abrirModalCrear = () => {
    setProductoEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setProductoEditar(prod);
    setModalAbierto(true);
  };

  const handleGuardarProducto = async (data: ProductFormData) => {
    try {
      if (productoEditar) {
        await api.put(`/products/${productoEditar.id}`, data);
      } else {
        await api.post('/products', data);
      }
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el producto.');
      throw err;
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este producto del catálogo?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold uppercase tracking-tight" style={{ color: themeColors.secondary }}>
          Catálogo de Productos
        </h2>
        <button
          onClick={abrirModalCrear}
          className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
          style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
        >
          + Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs">Cargando catálogo...</div>
        ) : (
        <div>
            {/* VISTA 1: Tarjetas para Celulares (Visible en móviles, oculta en md+) */}
            <div className="block md:hidden space-y-4">
            {products.map((prod) => (
                <div
                key={prod.id}
                className="p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-3"
                style={{ borderColor: themeColors.border }}
                >
                <div className="flex items-center gap-3">
                    <img
                    src={prod.fotos?.[0]?.url || 'https://via.placeholder.com/50'}
                    alt={prod.nombre}
                    className="w-14 h-14 object-cover rounded-lg border bg-stone-50"
                    />
                    <div>
                    <p className="font-bold text-sm text-stone-800">{prod.nombre}</p>
                    <p className="text-xs text-zinc-500 font-semibold">
                        Categoría: {prod.categoriaId === 1 ? 'Mates' : 'Cuadros'}
                    </p>
                    {prod.permitePersonalizacion && (
                        <span className="text-[9px] text-purple-700 font-bold uppercase">
                        Personalizable
                        </span>
                    )}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t pt-2" style={{ borderColor: themeColors.border }}>
                    <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Precio / Stock</span>
                    <span className="font-extrabold text-sm text-stone-900">
                        ${Number(prod.precio).toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs text-zinc-600 font-semibold ml-2">({prod.stock} u.)</span>
                    </div>

                    <div className="flex gap-2">
                    <button
                        onClick={() => abrirModalEditar(prod)}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-stone-100 text-stone-800 cursor-pointer"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleEliminar(prod.id)}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-red-50 text-red-600 cursor-pointer"
                    >
                        Eliminar
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* VISTA 2: Tabla tradicional para Computadoras/Tablets (Oculta en móviles, visible en md+) */}
            <div className="hidden md:block overflow-x-auto border rounded-xl bg-white shadow-sm" style={{ borderColor: themeColors.border }}>
            <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b uppercase text-zinc-500" style={{ borderColor: themeColors.border }}>
                <tr>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: themeColors.border }}>
                {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50">
                    <td className="p-4 flex items-center gap-3">
                        <img
                        src={prod.fotos?.[0]?.url || 'https://via.placeholder.com/50'}
                        alt={prod.nombre}
                        className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div>
                        <p className="font-bold text-stone-800">{prod.nombre}</p>
                        {prod.permitePersonalizacion && (
                            <span className="text-[9px] text-purple-700 font-semibold uppercase">
                            Personalizable
                            </span>
                        )}
                        </div>
                    </td>
                    <td className="p-4 font-semibold text-zinc-600">
                        {prod.categoriaId === 1 ? 'Mates' : 'Cuadros'}
                    </td>
                    <td className="p-4 font-extrabold text-stone-900">
                        ${Number(prod.precio).toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 font-bold text-zinc-700">{prod.stock} u.</td>
                    <td className="p-4 text-right space-x-2">
                        <button
                        onClick={() => abrirModalEditar(prod)}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-stone-100 text-stone-800 cursor-pointer"
                        >
                        Editar
                        </button>
                        <button
                        onClick={() => handleEliminar(prod.id)}
                        className="px-3 py-1.5 rounded text-xs font-bold bg-red-50 text-red-600 cursor-pointer"
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    )}

      {/* Modal Separada e Independiente */}
      <ProductFormModal
        isOpen={modalAbierto}
        productoEditar={productoEditar}
        onClose={() => setModalAbierto(false)}
        onSave={handleGuardarProducto}
      />
    </div>
  );
};