import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../model/logic/compra.models';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = '/api/compras';

  constructor(private http: HttpClient) {}

  crearCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  getCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  getComprasPorCliente(idCliente: number): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }
}
