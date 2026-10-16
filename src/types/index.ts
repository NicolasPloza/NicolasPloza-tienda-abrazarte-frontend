// src/types/index.ts

export interface FotoProducto {
  id: number;
  url: string;
  orden: number;
  esPrincipal: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  permitePersonalizacion: boolean;
  categoriaId: number;
  categoria?: Categoria;
  fotos?: FotoProducto[];
}

export interface ItemCarrito {
  id: number;
  productoId: number;
  cantidad: number;
  producto: Producto;
}

export interface Carrito {
  id: number;
  sessionId?: string;
  usuarioId?: number;
  items: ItemCarrito[];
  total: number;
}

export type EstadoOrden = 'PENDIENTE_PAGO' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export interface ItemOrden {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto: Producto;
}

export interface Orden {
  id: number;
  nombreCliente: string;
  emailCliente: string;
  telefono: string;
  direccion: string;
  total: number;
  estado: EstadoOrden;
  usuarioId?: number;
  items: ItemOrden[];
  createdAt: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: 'CLIENTE' | 'ADMINISTRADOR';
}