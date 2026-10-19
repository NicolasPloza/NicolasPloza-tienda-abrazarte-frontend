// src/components/admin/ProductFormModal.tsx
import React, { useState, useEffect } from 'react';
import type { Producto } from '../../types';
import { themeColors } from '../../theme/colors';
import { ImageUploader } from './ImageUploader';
import type {FotoItem } from './ImageUploader';

export interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  permitePersonalizacion: boolean;
  fotos: { url: string; orden: number; esPrincipal: boolean }[];
}

interface Props {
  isOpen: boolean;
  productoEditar: Producto | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
}

export const ProductFormModal: React.FC<Props> = ({
  isOpen,
  productoEditar,
  onClose,
  onSave,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [permitePersonalizacion, setPermitePersonalizacion] = useState(false);
  const [fotosInput, setFotosInput] = useState<FotoItem[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Cargar datos al abrir o cambiar de producto a editar
  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setDescripcion(productoEditar.descripcion || '');
      setPrecio(Number(productoEditar.precio));
      setStock(productoEditar.stock);
      setCategoriaId(productoEditar.categoriaId);
      setPermitePersonalizacion(productoEditar.permitePersonalizacion);
      setFotosInput(
        productoEditar.fotos?.map((f) => ({ url: f.url, esPrincipal: f.esPrincipal })) || []
      );
    } else {
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      setCategoriaId(1);
      setPermitePersonalizacion(false);
      setFotosInput([]);
    }
  }, [productoEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const payload: ProductFormData = {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoriaId: Number(categoriaId),
      permitePersonalizacion,
      fotos: fotosInput.map((f, index) => ({
        url: f.url,
        orden: index,
        esPrincipal: f.esPrincipal,
      })),
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      // El manejo de error se realiza en el padre o mediante notificación
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* 1. ENCABEZADO FIJO */}
        <div className="p-5 border-b flex justify-between items-center bg-white shrink-0" style={{ borderColor: themeColors.border }}>
          <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: themeColors.secondary }}>
            {productoEditar ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-zinc-400 font-bold hover:text-zinc-800 text-xl px-2 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* 2. CUERPO DEL FORMULARIO CON SCROLL EXCLUSIVO */}
        <form id="productoModalForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1" style={{ color: themeColors.textMain }}>
              Nombre del Producto
            </label>
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
              <label className="block text-[11px] font-extrabold uppercase mb-1" style={{ color: themeColors.textMain }}>
                Precio (ARS)
              </label>
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
              <label className="block text-[11px] font-extrabold uppercase mb-1" style={{ color: themeColors.textMain }}>
                Stock Disponible
              </label>
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
            <label className="block text-[11px] font-extrabold uppercase mb-1" style={{ color: themeColors.textMain }}>
              Categoría
            </label>
            <select 
              value={categoriaId} 
              onChange={(e) => setCategoriaId(Number(e.target.value))} 
              className="w-full p-2.5 border rounded-lg text-xs font-semibold focus:outline-none cursor-pointer" 
              style={{ borderColor: themeColors.border }}
            >
              <option value={1}>Mates</option>
              <option value={2}>Cuadros</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1" style={{ color: themeColors.textMain }}>
              Descripción
            </label>
            <textarea 
              rows={2} 
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
              id="permitePersonalizacionModal"
              checked={permitePersonalizacion}
              onChange={(e) => setPermitePersonalizacion(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="permitePersonalizacionModal" className="text-xs font-semibold text-stone-700 cursor-pointer">
              Permite personalización artesanal grabada
            </label>
          </div>

          {/* Subida de Fotos en componente modular */}
          <ImageUploader fotos={fotosInput} onChange={setFotosInput} />
        </form>

        {/* 3. PIE FIJO FUERA DEL SCROLL */}
        <div className="p-4 border-t bg-white shrink-0 flex gap-3" style={{ borderColor: themeColors.border }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-3 rounded-lg border text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer" 
            style={{ borderColor: themeColors.border }}
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            form="productoModalForm"
            disabled={guardando} 
            className="flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-md border hover:opacity-90 cursor-pointer" 
            style={{ 
              backgroundColor: themeColors.primary, 
              color: themeColors.secondary,
              borderColor: themeColors.primaryHover 
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>

      </div>
    </div>
  );
};