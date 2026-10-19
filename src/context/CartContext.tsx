// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type{ Carrito } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: Carrito | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (productoId: number, cantidad: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  resetCartSession: () => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Carrito | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Error al cargar carrito:', err);
    }
  };

  const addToCart = async (productoId: number, cantidad: number) => {
    try {
      await api.post('/cart/items', { productoId, cantidad });
      await fetchCart();
      setIsOpen(true); // Abrir el carrito desplegable automáticamente
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  // Eliminar un ítem individual del carrito
  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar el producto del carrito');
    }
  };

  // Reiniciar la sesión del carrito (se invoca al cerrar sesión)
  const resetCartSession = async () => {
    // Generar un nuevo ID de sesión de invitado
    const newSessionId = `guest-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
    localStorage.setItem('x-session-id', newSessionId);
    setCart(null);
    //await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = cart?.items.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  return (
        <CartContext.Provider
        value={{
            cart,
            isOpen,
            setIsOpen,
            fetchCart,
            addToCart,
            removeFromCart,
            resetCartSession,
            totalItems,
        }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};