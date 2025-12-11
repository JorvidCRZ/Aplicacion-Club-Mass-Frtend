import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../model/logic/producto.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = '/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  cambiarEstado(id: number, estado: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  actualizarStock(id: number, stock: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/stock`, { stock });
  }
}
