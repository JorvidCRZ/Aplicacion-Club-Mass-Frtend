export interface Producto {
  idProducto?: number;
  nombre: string;
  precio: number;
  stock: number;
  estado: number;
  imagenUrl?: string;
  descripcion?: string;
}
