// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import { themeColors } from '../theme/colors';
import { OrderManager } from '../components/admin/OrderManager';
import { ProductManager } from '../components/admin/ProductManager';

export const AdminPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<'ordenes' | 'productos'>('ordenes');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Selector de Pestañas */}
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

      {/* Renderizado condicional de los componentes modulares */}
      {tabActiva === 'ordenes' && <OrderManager />}
      {tabActiva === 'productos' && <ProductManager />}
    </div>
  );
};