// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import type { Producto } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { themeColors } from '../theme/colors';

interface Props {
  productId: number;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<Props> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Producto | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${productId}`);
        if (res.data.success) {
          const prod: Producto = res.data.data;
          setProduct(prod);

          // Ordenar fotos por la propiedad 'orden'
          const fotosOrdenadas = prod.fotos ? [...prod.fotos].sort((a, b) => a.orden - b.orden) : [];
          const fotoPrincipal = fotosOrdenadas.find((f) => f.esPrincipal)?.url || fotosOrdenadas[0]?.url || 'https://via.placeholder.com/500';
          setSelectedImage(fotoPrincipal);
        }
      } catch (err) {
        console.error('Error al cargar detalle del producto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: themeColors.primary }}></div>
      </div>
    );
  }

  const fotosOrdenadas = product.fotos ? [...product.fotos].sort((a, b) => a.orden - b.orden) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="mb-6 text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: themeColors.primary }}>
        &larr; Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Galería de Imágenes */}
        <div>
          <div className="h-96 w-full rounded-lg overflow-hidden border bg-stone-100 mb-4" style={{ borderColor: themeColors.border }}>
            <img src={selectedImage} alt={product.nombre} className="w-full h-full object-contain" />
          </div>

          {fotosOrdenadas.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {fotosOrdenadas.map((foto) => (
                <button
                  key={foto.id}
                  onClick={() => setSelectedImage(foto.url)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === foto.url ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ borderColor: selectedImage === foto.url ? themeColors.primary : themeColors.border }}
                >
                  <img src={foto.url} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-200" style={{ color: themeColors.textMuted }}>
              {product.categoria?.nombre}
            </span>
            <h1 className="text-3xl font-bold mt-3" style={{ color: themeColors.secondary }}>
              {product.nombre}
            </h1>
            <p className="text-2xl font-bold mt-2" style={{ color: themeColors.primary }}>
              ${Number(product.precio).toLocaleString('es-AR')}
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2" style={{ color: themeColors.textMain }}>Descripción:</h3>
              <p className="text-sm leading-relaxed" style={{ color: themeColors.textMuted }}>
                {product.descripcion || 'Sin descripción disponible.'}
              </p>
            </div>

            {product.permitePersonalizacion && (
              <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
                ✨ Este producto incluye personalización artesanal grabada a mano.
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border rounded" style={{ borderColor: themeColors.border }}>
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-3 py-1 font-bold text-stone-600 hover:bg-stone-100">-</button>
                <span className="px-4 text-sm font-semibold">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)} className="px-3 py-1 font-bold text-stone-600 hover:bg-stone-100">+</button>
              </div>
              <span className="text-xs text-zinc-500">Stock disponible: {product.stock} u.</span>
            </div>

            <button
              onClick={() => addToCart(product.id, cantidad)}
              className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: themeColors.primary }}
            >
              Agregar al Carrito
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};