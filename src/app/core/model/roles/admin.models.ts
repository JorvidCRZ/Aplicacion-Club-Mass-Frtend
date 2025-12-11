// Request para crear o actualizar administrador
export interface AdminRequest {
  idUsuario: number;
  estado?: string; // "1" = activo, "0" = inactivo
}

// Response de administrador
export interface AdminResponse {
  idAdmin: number;
  idUsuario: number;
  nombre1: string;
  apellidoPaterno: string;
  username: string;
  correo: string;
  estado: string;
  fechaRegistro: string; // ISO string
}
