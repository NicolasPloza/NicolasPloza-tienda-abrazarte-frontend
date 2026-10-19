// src/pages/CatalogPage.tsx
import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import type { Producto } from '../types';
import { themeColors } from '../theme/colors';

interface Props {
  products: Producto[];
  selectedCategoriaId?: number;
  onSelectProduct: (id: number) => void;
  onScrollToProducts: () => void;
}

export const CatalogPage: React.FC<Props> = ({
  products,
  selectedCategoriaId,
  onSelectProduct,
  onScrollToProducts,
}) => {
  // Filtrado de productos por categoría
  const productosFiltrados = selectedCategoriaId
    ? products.filter((p) => p.categoriaId === selectedCategoriaId)
    : products;

  return (
    <div>
      {/* 1. Componente de Banner Independiente */}
      <HeroBanner onExplorarClick={onScrollToProducts} />

      {/* 2. Sección del Catálogo con Anclaje HTML para Scroll Suave */}
      <section id="catalogo-productos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="flex justify-between items-end mb-8 border-b pb-4" style={{ borderColor: themeColors.border }}>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: themeColors.secondary }}>
              {selectedCategoriaId === 1 ? 'Mates Artesanales' : selectedCategoriaId === 2 ? 'Cuadros de Colección' : 'Nuestra Colección'}
            </h2>
            <p className="text-xs mt-1 font-semibold text-stone-500">
              Mostrando {productosFiltrados.length} productos disponibles
            </p>
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>
    </div>
  );
};