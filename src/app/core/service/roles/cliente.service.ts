import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteRequest, ClienteResponse } from '../../model/roles/cliente.models';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/api/clientes`;

  constructor(private http: HttpClient) {}

  // GET /api/clientes - Obtener todos los clientes
  getClientes(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.apiUrl);
  }

  // GET /api/clientes/{id} - Obtener cliente por ID
  getClienteById(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`);
  }

  // GET /api/clientes/buscar?dni=xxxx - Buscar cliente por DNI
  buscarPorDni(dni: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/buscar`, { params: { dni } });
  }

  // GET /api/clientes/buscar?codigo=xxxx - Buscar cliente por código de membresía
  buscarPorCodigo(codigo: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/buscar`, { params: { codigo } });
  }

  // POST /api/clientes - Crear cliente
  createCliente(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente);
  }

  // PUT /api/clientes/{id} - Actualizar cliente
  updateCliente(id: number, cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, cliente);
  }

  // DELETE /api/clientes/{id} - Eliminar cliente
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
