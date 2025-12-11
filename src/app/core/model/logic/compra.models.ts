import { DetalleCompra } from './detalle-compra.models';

export interface Compra {
  idCompra?: number;
  fechaCompra?: string;
  montoTotal: number;
  metodoPago: string;
  puntosGenerados?: number;
  idCliente: number;
  idCajero: number;
  detalles: DetalleCompra[];
}
