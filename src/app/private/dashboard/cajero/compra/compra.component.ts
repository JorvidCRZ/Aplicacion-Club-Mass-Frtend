import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-registrar-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent {
  codigoCliente = '';
  montoTotal = 0;
  metodoPago = 'Efectivo';
  metodosPago = ['Efectivo', 'Tarjeta', 'Yape', 'Plin'];
  puntosGenerados = 0;
  clienteEncontrado: any = null;
  compras: any[] = [];
  mensaje: string = '';

  constructor() {
    this.cargarCompras();
  }

  cargarCompras() {
    const data = localStorage.getItem('clubmass_compras');
    this.compras = data ? JSON.parse(data) : [];
  }

  guardarCompras() {
    localStorage.setItem('clubmass_compras', JSON.stringify(this.compras));
  }

  buscarCliente(): void {
    // Simular búsqueda
    if (this.codigoCliente) {
      this.clienteEncontrado = {
        nombre: 'Juan Pérez',
        codigo: this.codigoCliente,
        puntosActuales: 2500
      };
    }
  }

  calcularPuntos(): void {
    // 10 puntos por cada S/1
    this.puntosGenerados = Math.floor(this.montoTotal * 10);
  }

  registrarCompra(): void {
    if (!this.clienteEncontrado || this.montoTotal <= 0) return;
    const compra = {
      id: this.compras.length ? Math.max(...this.compras.map(c => c.id)) + 1 : 1,
      cliente: this.clienteEncontrado.nombre,
      codigoCliente: this.clienteEncontrado.codigo,
      monto: this.montoTotal,
      metodoPago: this.metodoPago,
      puntos: this.puntosGenerados,
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    this.compras.unshift(compra);
    this.guardarCompras();
    this.mensaje = 'Compra registrada correctamente';
    setTimeout(() => (this.mensaje = ''), 2000);
    // Reset
    this.codigoCliente = '';
    this.montoTotal = 0;
    this.puntosGenerados = 0;
    this.clienteEncontrado = null;
  }

  eliminarCompra(id: number) {
    this.compras = this.compras.filter(c => c.id !== id);
    this.guardarCompras();
  }
}
