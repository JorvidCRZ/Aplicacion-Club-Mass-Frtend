import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';
import { AuthService } from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-mis-puntos',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './mis-puntos.component.html',
  styleUrls: ['./mis-puntos.component.css'],
})
export class MisPuntosComponent {
  user: any;
  puntos = 0;
  puntosProximosVencer = 0;
  fechaVencimiento = '';

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    this.cargarPuntos();
  }

  cargarPuntos() {
    if (!this.user) return;
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const encontrado = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    if (encontrado) {
      this.puntos = encontrado.puntos;
      // Demo: puntos por vencer y fecha
      this.puntosProximosVencer = Math.floor(this.puntos * 0.2);
      this.fechaVencimiento = '30/06/2024';
    } else {
      this.puntos = 0;
      this.puntosProximosVencer = 0;
      this.fechaVencimiento = '';
    }
  }
}
