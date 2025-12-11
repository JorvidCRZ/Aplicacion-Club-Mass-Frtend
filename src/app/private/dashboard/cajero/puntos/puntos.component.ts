import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-consultar-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './puntos.component.html',
  styleUrls: ['./puntos.component.css'],
})
export class ConsultarPuntosComponent {
  dniCliente = '';
  cliente: any = null;
  historial: any[] = [];
  mensaje: string = '';

  buscarCliente(): void {
    if (!this.dniCliente) return;
    // Buscar cliente y su historial en localStorage
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const encontrado = clientes.find((c: any) => c.dni === this.dniCliente);
    if (encontrado) {
      this.cliente = { ...encontrado };
      this.historial = encontrado.historial || [];
    } else {
      // Si no existe, crear uno demo
      this.cliente = {
        nombre: 'Juan Pérez',
        dni: this.dniCliente,
        puntos: 2500
      };
      this.historial = [
        { fecha: '2024-04-10', tipo: 'Compra', puntos: 150, detalle: 'Compra S/15.00' },
        { fecha: '2024-04-03', tipo: 'Compra', puntos: 200, detalle: 'Compra S/20.00' },
        { fecha: '2024-03-20', tipo: 'Deducción', puntos: -500, detalle: 'Canje de premio' },
        { fecha: '2024-03-15', tipo: 'Compra', puntos: 350, detalle: 'Compra S/35.00' },
      ];
      clientes.push({ ...this.cliente, historial: this.historial });
      localStorage.setItem('clubmass_clientes_puntos', JSON.stringify(clientes));
    }
  }

  limpiarHistorial() {
    if (!this.cliente) return;
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const idx = clientes.findIndex((c: any) => c.dni === this.cliente.dni);
    if (idx > -1) {
      clientes[idx].historial = [];
      localStorage.setItem('clubmass_clientes_puntos', JSON.stringify(clientes));
      this.historial = [];
      this.mensaje = 'Historial limpiado';
      setTimeout(() => (this.mensaje = ''), 2000);
    }
  }
}
