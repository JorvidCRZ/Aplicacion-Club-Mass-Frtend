import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-canjear-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './canjear.component.html',
  styleUrls: ['./canjear.component.css'],
})
export class CanjearComponent {
  codigoCliente = '';
  cliente: any = null;
  premios: any[] = [];
  premioSeleccionado: any = null;
  mensaje: string = '';
  historialCanjes: any[] = [];

  constructor() {
    this.cargarPremios();
  }

  cargarPremios() {
    const data = localStorage.getItem('clubmass_premios');
    this.premios = data ? JSON.parse(data) : [
      { id: 1, nombre: 'Descuento 10%', puntos: 500, imagen: '' },
      { id: 2, nombre: 'Producto Gratis', puntos: 1000, imagen: '' },
      { id: 3, nombre: 'Gift Card S/50', puntos: 2500, imagen: '' },
    ];
  }

  buscarCliente(): void {
    if (!this.codigoCliente) return;
    // Buscar cliente y su historial de canjes en localStorage
    const clientesData = localStorage.getItem('clubmass_clientes_canje');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    let encontrado = clientes.find((c: any) => c.codigo === this.codigoCliente);
    if (encontrado) {
      this.cliente = { ...encontrado };
      this.historialCanjes = encontrado.historialCanjes || [];
    } else {
      // Demo
      this.cliente = {
        nombre: 'Juan Pérez',
        codigo: this.codigoCliente,
        puntos: 2500
      };
      this.historialCanjes = [];
      clientes.push({ ...this.cliente, historialCanjes: this.historialCanjes });
      localStorage.setItem('clubmass_clientes_canje', JSON.stringify(clientes));
    }
  }

  seleccionarPremio(premio: any): void {
    if (this.cliente && this.cliente.puntos >= premio.puntos) {
      this.premioSeleccionado = premio;
    }
  }

  confirmarCanje(): void {
    if (!this.premioSeleccionado || !this.cliente) return;
    // Descontar puntos y registrar canje
    const clientesData = localStorage.getItem('clubmass_clientes_canje');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const idx = clientes.findIndex((c: any) => c.codigo === this.cliente.codigo);
    if (idx > -1) {
      clientes[idx].puntos -= this.premioSeleccionado.puntos;
      if (!clientes[idx].historialCanjes) clientes[idx].historialCanjes = [];
      clientes[idx].historialCanjes.unshift({
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
        premio: this.premioSeleccionado.nombre,
        puntos: this.premioSeleccionado.puntos
      });
      localStorage.setItem('clubmass_clientes_canje', JSON.stringify(clientes));
      this.cliente = { ...clientes[idx] };
      this.historialCanjes = clientes[idx].historialCanjes;
      this.mensaje = 'Canje exitoso';
      setTimeout(() => (this.mensaje = ''), 2000);
    }
    this.premioSeleccionado = null;
  }
}
