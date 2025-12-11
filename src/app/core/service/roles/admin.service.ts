import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminRequest, AdminResponse } from '../../model/roles/admin.models';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // GET /api/admin - Obtener todos los administradores
  getAdmins(): Observable<AdminResponse[]> {
    return this.http.get<AdminResponse[]>(this.apiUrl);
  }

  // GET /api/admin/{id} - Obtener administrador por ID
  getAdminById(id: number): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/${id}`);
  }

  // POST /api/admin - Crear administrador
  createAdmin(admin: AdminRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.apiUrl, admin);
  }

  // PUT /api/admin/{id} - Actualizar administrador
  updateAdmin(id: number, admin: AdminRequest): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.apiUrl}/${id}`, admin);
  }

  // DELETE /api/admin/{id} - Eliminar administrador
  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
