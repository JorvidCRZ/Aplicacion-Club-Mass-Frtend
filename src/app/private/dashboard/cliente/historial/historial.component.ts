import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent {
  historial: any[] = [];
  user: any;

  constructor() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const encontrado = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    if (encontrado && encontrado.historial) {
      // Normalizar los canjes para que tengan campo 'detalle' y filtrar solo los últimos 20 movimientos
      this.historial = encontrado.historial.map((item: any) => {
        if (item.tipo === 'canje') {
          return {
            ...item,
            detalle: item.premio ? `Canje: ${item.premio}` : 'Canje de premio',
            puntos: -Math.abs(item.puntos),
          };
        } else if (item.tipo === 'compra') {
          return {
            ...item,
            detalle: item.detalle || `Compra S/${item.monto || ''}`,
            puntos: Math.abs(item.puntos),
          };
        }
        return item;
      }).filter((item: any) => item.fecha && item.fecha > '2025-01-01').slice(-20).reverse();
    } else {
      this.historial = [];
    }
  }

  getTipoClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'compra':
        return 'badge-compra';
      case 'canje':
        return 'badge-canje';
      case 'bono':
        return 'badge-bono';
      default:
        return '';
    }
  }
}
