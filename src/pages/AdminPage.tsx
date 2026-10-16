// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import type { Orden, EstadoOrden, Producto, FotoProducto } from '../types';
import { api } from '../services/api';
import { themeColors } from '../theme/colors';

export const AdminPage: React.FC = () => {
  // Estado de pestañas activas en el panel admin
  const [tabActiva, setTabActiva] = useState<'ordenes' | 'productos'>('ordenes');

  // --- ESTADOS DE ÓRDENES ---
  const [orders, setOrders] = useState<Orden[]>([]);
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState(true);

  // --- ESTADOS DE PRODUCTOS ---
  const [products, setProducts] = useState<Producto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  // Campos del formulario de producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [permitePersonalizacion, setPermitePersonalizacion] = useState(false);
  const [fotosInput, setFotosInput] = useState<{ url: string; esPrincipal: boolean }[]>([
    { url: '', esPrincipal: true },
  ]);
  const [guardando, setGuardando] = useState(false);

  // Cargar Órdenes
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const url = filterEstado ? `/orders/admin/all?estado=${filterEstado}` : '/orders/admin/all';
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Cargar Productos
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (tabActiva === 'ordenes') fetchOrders();
    if (tabActiva === 'productos') fetchProducts();
  }, [tabActiva, filterEstado]);

  // Cambiar estado de una orden
  const handleStatusChange = async (ordenId: number, newStatus: EstadoOrden) => {
    try {
      await api.patch(`/orders/admin/${ordenId}/status`, { estado: newStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado.');
    }
  };

  // Abrir modal para Crear o Editar Producto
  const abrirModalFormulario = (prod?: Producto) => {
    if (prod) {
      setProductoEditar(prod);
      setNombre(prod.nombre);
      setDescripcion(prod.descripcion || '');
      setPrecio(Number(prod.precio));
      setStock(prod.stock);
      setCategoriaId(prod.categoriaId);
      setPermitePersonalizacion(prod.permitePersonalizacion);

      if (prod.fotos && prod.fotos.length > 0) {
        const fotosMapeadas = prod.fotos.map((f) => ({
          url: f.url,
          esPrincipal: f.esPrincipal,
        }));
        setFotosInput(fotosMapeadas);
      } else {
        setFotosInput([{ url: '', esPrincipal: true }]);
      }
    } else {
      setProductoEditar(null);
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setCategoriaId(1);
      setPermitePersonalizacion(false);
      setFotosInput([{ url: '', esPrincipal: true }]);
    }
    setModalAbierto(true);
  };

  // Guardar Producto (Crear o Editar)
  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const fotosFiltradas = fotosInput
      .filter((f) => f.url.trim() !== '')
      .map((f, index) => ({
        url: f.url,
        orden: index,
        esPrincipal: f.esPrincipal,
      }));

    const payload = {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoriaId: Number(categoriaId),
      permitePersonalizacion,
      fotos: fotosFiltradas,
    };

    try {
      if (productoEditar) {
        await api.put(`/products/${productoEditar.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setModalAbierto(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar Producto
  const handleEliminarProducto = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el producto.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Selector de Pestañas (Órdenes vs Productos) */}
      <div className="flex border-b mb-8" style={{ borderColor: themeColors.border }}>
        <button
          onClick={() => setTabActiva('ordenes')}
          className="pb-3 px-6 font-black text-xs uppercase tracking-wider border-b-2 transition-colors"
          style={{
            borderColor: tabActiva === 'ordenes' ? themeColors.primaryDark : 'transparent',
            color: tabActiva === 'ordenes' ? themeColors.secondary : themeColors.textMuted,
          }}
        >
          Gestión de Órdenes
        </button>
        <button
          onClick={() => setTabActiva('productos')}
          className="pb-3 px-6 font-black text-xs uppercase tracking-wider border-b-2 transition-colors"
          style={{
            borderColor: tabActiva === 'productos' ? themeColors.primaryDark : 'transparent',
            color: tabActiva === 'productos' ? themeColors.secondary : themeColors.textMuted,
          }}
        >
          Gestión de Productos
        </button>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: GESTIÓN DE ÓRDENES                              */}
      {/* ========================================================= */}
      {tabActiva === 'ordenes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-tight" style={{ color: themeColors.secondary }}>
              Listado de Órdenes
            </h2>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="p-2 border rounded-lg text-xs font-bold focus:outline-none"
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

          {loadingOrders ? (
            <div className="text-center py-12">Cargando órdenes...</div>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-zinc-500 text-sm">No hay órdenes registradas.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((orden) => (
                <div key={orden.id} className="p-5 rounded-xl border bg-white flex flex-col md:flex-row justify-between gap-4 shadow-sm" style={{ borderColor: themeColors.border }}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg">Orden #{orden.id}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded text-white bg-zinc-800">
                        {orden.estado}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mb-1">
                      Cliente: <strong>{orden.nombreCliente}</strong> ({orden.emailCliente}) | Tel: {orden.telefono}
                    </p>
                    <p className="text-xs text-zinc-500">Dirección: {orden.direccion}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <span className="font-extrabold text-xl" style={{ color: themeColors.secondary }}>
                      ${Number(orden.total).toLocaleString('es-AR')}
                    </span>

                    <select
                      value={orden.estado}
                      onChange={(e) => handleStatusChange(orden.id, e.target.value as EstadoOrden)}
                      className="mt-2 p-1.5 border rounded-md text-xs font-bold focus:outline-none"
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
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: CRUD DE PRODUCTOS                              */}
      {/* ========================================================= */}
      {tabActiva === 'productos' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-tight" style={{ color: themeColors.secondary }}>
              Catálogo de Productos
            </h2>
            <button
              onClick={() => abrirModalFormulario()}
              className="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-transform active:scale-95 shadow-sm"
              style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
            >
              + Nuevo Producto
            </button>
          </div>

          {loadingProducts ? (
            <div className="text-center py-12">Cargando catálogo...</div>
          ) : (
            <div className="overflow-x-auto border rounded-xl bg-white shadow-sm" style={{ borderColor: themeColors.border }}>
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
                            <span className="text-[9px] text-purple-700 font-semibold uppercase">Personalizable</span>
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
                          onClick={() => abrirModalFormulario(prod)}
                          className="px-3 py-1.5 rounded text-xs font-bold bg-stone-100 text-stone-800 hover:bg-stone-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(prod.id)}
                          className="px-3 py-1.5 rounded text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MODAL DE CREACIÓN / EDICIÓN */}
          {modalAbierto && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl my-8">
                <div className="flex justify-between items-center mb-4 border-b pb-3" style={{ borderColor: themeColors.border }}>
                  <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: themeColors.secondary }}>
                    {productoEditar ? 'Editar Producto' : 'Crear Nuevo Producto'}
                  </h3>
                  <button onClick={() => setModalAbierto(false)} className="text-zinc-400 font-bold hover:text-zinc-800 text-xl">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleGuardarProducto} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase mb-1">Nombre del Producto</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-xs focus:outline-none"
                      style={{ borderColor: themeColors.border }}
                      placeholder="Ej. Mate Imperial de Calabaza"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase mb-1">Precio (ARS)</label>
                      <input
                        type="number"
                        required
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value ? Number(e.target.value) : '')}
                        className="w-full p-2.5 border rounded-lg text-xs focus:outline-none"
                        style={{ borderColor: themeColors.border }}
                        placeholder="35000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase mb-1">Stock Disponible</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
                        className="w-full p-2.5 border rounded-lg text-xs focus:outline-none"
                        style={{ borderColor: themeColors.border }}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase mb-1">Categoría</label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(Number(e.target.value))}
                      className="w-full p-2.5 border rounded-lg text-xs font-semibold focus:outline-none"
                      style={{ borderColor: themeColors.border }}
                    >
                      <option value={1}>Mates</option>
                      <option value={2}>Cuadros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase mb-1">Descripción</label>
                    <textarea
                      rows={3}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full p-2.5 border rounded-lg text-xs focus:outline-none"
                      style={{ borderColor: themeColors.border }}
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="permitePersonalizacion"
                      checked={permitePersonalizacion}
                      onChange={(e) => setPermitePersonalizacion(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <label htmlFor="permitePersonalizacion" className="text-xs font-semibold text-stone-700">
                      Permite personalización artesanal grabada
                    </label>
                  </div>

                  {/* SECCIÓN DE FOTOS */}
                  <div className="border-t pt-3" style={{ borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[11px] font-extrabold uppercase">URLs de Fotos</label>
                      <button
                        type="button"
                        onClick={() => setFotosInput([...fotosInput, { url: '', esPrincipal: false }])}
                        className="text-[10px] font-bold text-purple-700 hover:underline"
                      >
                        + Agregar otra foto
                      </button>
                    </div>

                    {fotosInput.map((foto, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={foto.url}
                          onChange={(e) => {
                            const nuevasFotos = [...fotosInput];
                            nuevasFotos[index].url = e.target.value;
                            setFotosInput(nuevasFotos);
                          }}
                          className="flex-1 p-2 border rounded text-xs focus:outline-none"
                          style={{ borderColor: themeColors.border }}
                          placeholder="https://midominio.com/foto.jpg"
                        />
                        <label className="flex items-center gap-1 text-[10px] font-bold text-stone-600 whitespace-nowrap">
                          <input
                            type="radio"
                            name="fotoPrincipal"
                            checked={foto.esPrincipal}
                            onChange={() => {
                              const nuevasFotos = fotosInput.map((f, i) => ({
                                ...f,
                                esPrincipal: i === index,
                              }));
                              setFotosInput(nuevasFotos);
                            }}
                          />
                          Principal
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setModalAbierto(false)}
                      className="flex-1 py-2.5 rounded-lg border text-xs font-bold text-stone-600 hover:bg-stone-100"
                      style={{ borderColor: themeColors.border }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={guardando}
                      className="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-white disabled:opacity-50"
                      style={{ backgroundColor: themeColors.primaryDark }}
                    >
                      {guardando ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};