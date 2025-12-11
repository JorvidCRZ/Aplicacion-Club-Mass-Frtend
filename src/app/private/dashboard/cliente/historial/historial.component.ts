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
    // Simular usuario logueado (en real usar AuthService)
    this.user = JSON.parse(localStorage.getItem('clubmass_user') || '{}');
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const encontrado = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    if (encontrado && encontrado.historial) {
      this.historial = encontrado.historial;
    } else {
      this.historial = [];
    }
  }

  getTipoClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'compra': return 'badge-compra';
      case 'canje': return 'badge-canje';
      case 'bono': return 'badge-bono';
      default: return '';
    }
  }
}
