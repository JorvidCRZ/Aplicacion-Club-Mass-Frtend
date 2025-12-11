import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRequest, UsuarioResponse, UsuarioEstadoResponse } from '../../model/roles/usuario.models';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // GET /api/usuarios - Obtener todos los usuarios
  getUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  // GET /api/usuarios/{id} - Obtener usuario por ID
  getUsuarioById(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  // POST /api/usuarios - Crear usuario
  createUsuario(usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, usuario);
  }

  // PUT /api/usuarios/{id} - Actualizar usuario
  updateUsuario(id: number, usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/${id}`, usuario);
  }

  // DELETE /api/usuarios/{id} - Eliminar usuario
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // PATCH /api/usuarios/{id}/estado - Cambiar estado del usuario
  updateEstado(id: number, estado: number): Observable<UsuarioEstadoResponse> {
    return this.http.patch<UsuarioEstadoResponse>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
