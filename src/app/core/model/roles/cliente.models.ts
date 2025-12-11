// Request para crear o actualizar cliente
export interface ClienteRequest {
  idUsuario: number;
  telefono?: string;
  dni?: string;
  codigoMembresia?: string;
}

// Response de cliente
export interface ClienteResponse {
  idCliente: number;
  idUsuario: number;
  nombre1: string;
  apellidoPaterno: string;
  username: string;
  correo: string;
  telefono: string;
  dni: string;
  codigoMembresia: string;
  fechaRegistro: string; // ISO string
}
