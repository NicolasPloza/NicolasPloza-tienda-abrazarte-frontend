// src/pages/CatalogPage.tsx
import React, { useEffect, useState } from 'react';
import type { Producto } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { themeColors } from '../theme/colors';

interface Props {
  selectedCategoriaId?: number;
  onSelectProduct: (id: number) => void;
}

// Imagen Hero de fondo artesanal de alta resolución
const HERO_BANNER_IMAGE = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=1600';

export const CatalogPage: React.FC<Props> = ({ selectedCategoriaId, onSelectProduct }) => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = selectedCategoriaId ? `/products?categoriaId=${selectedCategoriaId}` : '/products';
        const res = await api.get(url);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoriaId]);

  return (
    <div>
      {/* Banner Hero Estilo Shopify Trade */}
      <div className="relative bg-zinc-900 text-white overflow-hidden py-24 px-6 sm:px-12 mb-12 flex items-center justify-center min-h-[380px]">
        {/* Imagen de Fondo con Capa Oscura */}
        <img
          src={HERO_BANNER_IMAGE}
          alt="Mates y Arte Artesanal"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-3xl text-center">
          <span
            className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
            style={{ backgroundColor: themeColors.primary, color: themeColors.primaryDark }}
          >
            Colección 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase leading-tight mb-4">
            Arte & Tradición Hecha a Mano
          </h1>
          <p className="text-sm sm:text-base text-zinc-200 font-light max-w-xl mx-auto leading-relaxed">
            Mates imperiales de calabaza seleccionada y cuadros únicos elaborados por artesanos locales.
          </p>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: themeColors.border }}>
          <h2 className="text-xl font-extrabold uppercase tracking-wider" style={{ color: themeColors.secondary }}>
            {selectedCategoriaId === 1 ? 'Mates Artesanales' : selectedCategoriaId === 2 ? 'Cuadros de Autor' : 'Catálogo General'}
          </h2>
          <span className="text-xs font-medium text-zinc-500">{products.length} productos</span>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeColors.primary }}></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-zinc-500 text-sm">No hay productos disponibles en esta sección.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};