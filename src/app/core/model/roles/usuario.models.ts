// Interfaz para el rol
export interface RolRequest {
  id?: number;
  nombreRol: string;
}

// Request para crear o actualizar usuario
export interface UsuarioRequest {
  nombre1: string;
  nombre2?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  username: string;
  contrasena?: string;
  correo: string;
  rol?: RolRequest;
  estado?: number; // 1 = activo, 0 = inactivo
}

// Response de usuario
export interface UsuarioResponse {
  idUsuario: number;
  nombre1: string;
  nombre2?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  username: string;
  correo: string;
  rol?: string;
  estado?: string; // "1" o "0"
  nombreRol?: string;
}

// Response para cambio de estado
export interface UsuarioEstadoResponse {
  idUsuario: number;
  estado: string;
}
