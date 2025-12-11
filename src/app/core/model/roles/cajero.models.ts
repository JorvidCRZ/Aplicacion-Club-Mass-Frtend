// Request para crear cajero
export interface CajeroRequest {
  idUsuario: number;
  estado?: number;
}

// Response de cajero
export interface CajeroResponse {
  idCajero: number;
  idUsuario: number;
  nombre1: string;
  apellidoPaterno: string;
  username: string;
  correo: string;
  estado: string;
  fechaRegistro: string; // ISO string
}
