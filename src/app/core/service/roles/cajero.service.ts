import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CajeroRequest, CajeroResponse } from '../../model/roles/cajero.models';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class CajeroService {
  private apiUrl = `${environment.apiUrl}/api/cajeros`;

  constructor(private http: HttpClient) {}

  // GET /api/cajeros - Obtener todos los cajeros
  getCajeros(): Observable<CajeroResponse[]> {
    return this.http.get<CajeroResponse[]>(this.apiUrl);
  }

  // POST /api/cajeros - Crear cajero
  createCajero(cajero: CajeroRequest): Observable<CajeroResponse> {
    return this.http.post<CajeroResponse>(this.apiUrl, cajero);
  }

  // PATCH /api/cajeros/{id}/estado - Cambiar estado del cajero
  updateEstado(id: number, estado: string): Observable<CajeroResponse> {
    return this.http.patch<CajeroResponse>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
