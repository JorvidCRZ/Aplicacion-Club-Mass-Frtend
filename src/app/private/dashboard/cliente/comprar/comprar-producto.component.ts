import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprar-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comprar-producto.component.html',
  styleUrls: ['./comprar-producto.component.css'],
})
export class ComprarProductoComponent {
  productos = [
    { id: 1, nombre: 'Coca-Cola 500ml', categoria: 'Bebidas', precio: 4, puntos: 4 },
    { id: 2, nombre: 'Leche Gloria 1L', categoria: 'Lácteos', precio: 6, puntos: 6 },
    { id: 3, nombre: 'Pan Francés (6u)', categoria: 'Panadería', precio: 3, puntos: 3 },
    { id: 4, nombre: 'Galletas Oreo', categoria: 'Confitería', precio: 5, puntos: 5 },
    { id: 5, nombre: 'Arroz Costeño 1kg', categoria: 'Abarrotes', precio: 7, puntos: 7 },
    { id: 6, nombre: 'Agua San Luis 625ml', categoria: 'Bebidas', precio: 2, puntos: 2 },
    { id: 7, nombre: 'Yogurt Laive 1L', categoria: 'Lácteos', precio: 8, puntos: 8 },
    { id: 8, nombre: 'Chocolate Sublime', categoria: 'Confitería', precio: 4, puntos: 4 },
    { id: 9, nombre: 'Panetón DOnofrio', categoria: 'Panadería', precio: 18, puntos: 18 },
    { id: 10, nombre: 'Aceite Primor 1L', categoria: 'Abarrotes', precio: 10, puntos: 10 },
  ];
  carrito: any[] = [];
  total: number = 0;
  puntosAcumulados: number = 0;
  user: any;

  constructor(private router: Router) {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  agregarAlCarrito(producto: any) {
    this.carrito.push(producto);
    this.total += producto.precio;
    this.puntosAcumulados += producto.puntos;
  }

  comprar() {
    if (!this.user) {
      alert('No se encontró el usuario.');
      return;
    }
    // Actualizar puntos en localStorage
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    let clientes = clientesData ? JSON.parse(clientesData) : [];
    let cliente = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    if (cliente) {
      cliente.puntos = (cliente.puntos || 0) + this.puntosAcumulados;
    } else {
      // Si no existe, crear el registro
      cliente = {
        dni: this.user.dni,
        codigo: this.user.codigo,
        puntos: this.puntosAcumulados
      };
      clientes.push(cliente);
    }
    localStorage.setItem('clubmass_clientes_puntos', JSON.stringify(clientes));
    alert(`¡Compra realizada! Has acumulado ${this.puntosAcumulados} puntos.`);
    this.carrito = [];
    this.total = 0;
    this.puntosAcumulados = 0;
  }

  volverAlDashboard() {
    this.router.navigate(['/dashboard/cliente']);
  }
}
