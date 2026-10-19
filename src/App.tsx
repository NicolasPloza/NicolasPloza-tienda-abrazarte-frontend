// src/App.tsx
import React, { useState, useEffect } from 'react';

// Tipos de datos e Integración con API
import type { Producto } from './types';
import { api } from './services/api';

// Contextos de Estado Global
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Componentes de Interfaz
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas de la Aplicación
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

// Configuración de Paleta de Colores
import { themeColors } from './theme/colors';

/**
 * Componente interno que maneja la lógica de navegación y renderizado de vistas
 */
export const AppContent: React.FC = () => {
  // Estado para la vista activa ('catalog' | 'detail' | 'checkout' | 'login' | 'admin')
  const [currentView, setCurrentView] = useState<string>('catalog');
  
  // Estado para la lista global de productos obtenidos desde la API
  const [products, setProducts] = useState<Producto[]>([]);
  
  // Estado para filtros de categoría y selección de productos
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  /**
   * Carga inicial de productos desde la API REST
   */
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error al descargar catálogo de productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Función encargada de realizar el desplazamiento suave hacia la grilla de productos
   */
  const handleScrollToProducts = () => {
    setTimeout(() => {
      const seccionProductos = document.getElementById('catalogo-productos');
      if (seccionProductos) {
        seccionProductos.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  /**
   * Manejador para abrir la pantalla de detalle de un producto
   */
  const handleSelectProduct = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('detail');
  };

  /**
   * Función que selecciona la categoría y desplaza suavemente la pantalla hacia el catálogo
   */
  const handleCategorySelect = (categoriaId?: number) => {
    setSelectedCategoriaId(categoriaId);
    setSelectedProductId(null);
    setCurrentView('catalog');
    handleScrollToProducts();
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-fuchsia-200"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Barra de Navegación Superior Responsiva */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedProductId(null);
        }}
        onCategorySelect={handleCategorySelect}
      />

      {/* Contenido Principal Dinámico */}
      <main className="flex-1">
        {/* 1. Vista de Catálogo Principal con Props Completas */}
        {currentView === 'catalog' && (
          <CatalogPage
            products={products}
            selectedCategoriaId={selectedCategoriaId}
            onSelectProduct={handleSelectProduct}
            onScrollToProducts={handleScrollToProducts}
          />
        )}

        {/* 2. Vista de Detalle del Producto */}
        {currentView === 'detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => setCurrentView('catalog')}
          />
        )}

        {/* 3. Vista de Checkout Guest */}
        {currentView === 'checkout' && (
          <CheckoutPage onOrderCompleted={() => {
            fetchProducts(); // Refresca stock tras la compra
            setCurrentView('catalog');
          }} />
        )}

        {/* 4. Vista de Iniciar Sesión */}
        {currentView === 'login' && (
          <LoginPage onSuccess={() => setCurrentView('catalog')} />
        )}

        {/* 5. Vista de Administración Protegida por Rol */}
        {currentView === 'admin' && (
          <ProtectedRoute requiereAdmin={true} onLoginSuccess={() => setCurrentView('admin')}>
            <AdminPage />
          </ProtectedRoute>
        )}
      </main>

      {/* Carrito Lateral Desplegable */}
      <CartDrawer onGoToCheckout={() => setCurrentView('checkout')} />

      {/* Pie de Página Estilo Minimalista */}
      <footer 
        className="border-t py-8 text-center text-xs font-medium tracking-wider uppercase"
        style={{ borderColor: themeColors.border, color: themeColors.textMuted }}
      >
        © {new Date().getFullYear()} Tienda Artesanal de Mates & Cuadros. Todos los derechos reservados.
      </footer>
    </div>
  );
};

/**
 * Componente Principal que envuelve la App con los Proveedores de Estado (Providers)
 */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}