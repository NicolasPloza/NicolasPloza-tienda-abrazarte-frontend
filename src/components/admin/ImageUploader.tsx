// src/components/admin/ImageUploader.tsx
import React, { useState } from 'react';
import { api } from '../../services/api';
import { themeColors } from '../../theme/colors';

export interface FotoItem {
  url: string;
  esPrincipal: boolean;
}

interface Props {
  fotos: FotoItem[];
  onChange: (nuevasFotos: FotoItem[]) => void;
}

export const ImageUploader: React.FC<Props> = ({ fotos, onChange }) => {
  const [cargandoImagenes, setCargandoImagenes] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /**
   * Procesa los archivos arrastrados o seleccionados y los sube a Cloudinary
   */
  const procesarYSubirArchivos = async (files: FileList | File[]) => {
    const listaArchivos = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (listaArchivos.length === 0) {
      alert('Por favor, selecciona o arrastra archivos de imagen válidos.');
      return;
    }

    setCargandoImagenes(true);

    try {
      const peticionesSubida = listaArchivos.map(async (file) => {
        const formData = new FormData();
        formData.append('imagen', file);

        const res = await api.post('/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data.success ? res.data.data.url : null;
      });

      const urlsObtenidas = (await Promise.all(peticionesSubida)).filter((url) => url !== null);

      const fotosValidas = fotos.filter((f) => f.url.trim() !== '');
      const nuevasEntradas = urlsObtenidas.map((url) => ({
        url,
        esPrincipal: false,
      }));

      const listaCombinada = [...fotosValidas, ...nuevasEntradas];

      if (listaCombinada.length > 0 && !listaCombinada.some((f) => f.esPrincipal)) {
        listaCombinada[0].esPrincipal = true;
      }

      onChange(listaCombinada);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al subir una o más imágenes a Cloudinary.');
    } finally {
      setCargandoImagenes(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      procesarYSubirArchivos(e.dataTransfer.files);
    }
  };

  return (
    <div className="border-t pt-4" style={{ borderColor: themeColors.border }}>
      <label className="block text-[11px] font-extrabold uppercase text-stone-800 mb-2">
        Fotos del Producto (Arrastra o Selecciona Múltiples)
      </label>

      {/* Zona Drag & Drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors relative mb-4 ${
          dragOver ? 'border-purple-500 bg-purple-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          disabled={cargandoImagenes}
          onChange={(e) => e.target.files && procesarYSubirArchivos(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {cargandoImagenes ? (
          <p className="text-xs font-bold text-purple-700 animate-pulse">
            Subiendo imágenes a Cloudinary...
          </p>
        ) : (
          <div>
            <p className="text-xs font-bold text-stone-700">Arrastra y suelta tus fotos aquí</p>
            <p className="text-[10px] text-stone-500 mt-1">o haz clic para seleccionar varias imágenes</p>
          </div>
        )}
      </div>

      {/* Lista de Fotos Subidas */}
      {fotos.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {fotos.map((foto, index) => (
            <div key={index} className="flex items-center justify-between p-2.5 border rounded-lg bg-white" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={foto.url || 'https://via.placeholder.com/40'} alt="Miniatura" className="w-10 h-10 object-cover rounded-md border" />
                <span className="text-[11px] text-stone-600 truncate max-w-[200px]">{foto.url}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="fotoPrincipalGroup"
                    checked={foto.esPrincipal}
                    onChange={() => {
                      const nuevas = fotos.map((f, i) => ({ ...f, esPrincipal: i === index }));
                      onChange(nuevas);
                    }}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  Principal
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const nuevas = fotos.filter((_, i) => i !== index);
                    if (foto.esPrincipal && nuevas.length > 0) nuevas[0].esPrincipal = true;
                    onChange(nuevas);
                  }}
                  className="text-red-500 font-bold hover:text-red-700 text-xs px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};