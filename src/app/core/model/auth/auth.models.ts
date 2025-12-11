export interface LoginRequest {
  username: string;
  contrasena: string;
}

export interface AuthResponse {
  idUsuario: number;
  username: string;
  correo: string;
  rol: 'ADMIN' | 'CAJERO' | 'CLIENTE';
}

export interface JwtResponse {
  token?: string;
  type?: string; 
  user: AuthResponse;
}

export interface RegisterRequest {
  nombre1: string;
  nombre2?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  username: string;
  contrasena: string;
  correo: string;
  rol?: 'CLIENTE';
}