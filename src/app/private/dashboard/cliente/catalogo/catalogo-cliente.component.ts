import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-catalogo-cliente',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './catalogo-cliente.component.html',
  styleUrls: ['./catalogo-cliente.component.css'],
})
export class CatalogoClienteComponent {
  misPuntos = 0;
  premios: any[] = [];
  user: any;

  constructor(private authService: AuthService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cargarPuntos();
    this.cargarPremios();
  }

  cargarPremios() {
    const data = localStorage.getItem('clubmass_premios');
    this.premios = data ? JSON.parse(data) : [];
  }

  cargarPuntos() {
    if (!this.user) return;
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    const clientes = clientesData ? JSON.parse(clientesData) : [];
    const encontrado = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    this.misPuntos = encontrado ? encontrado.puntos || 0 : 0;
  }

  puedeCanjear(puntos: number): boolean {
    return this.misPuntos >= puntos;
  }

  canjearPremio(premio: any) {
    if (!this.puedeCanjear(premio.puntos)) return;
    const clientesData = localStorage.getItem('clubmass_clientes_puntos');
    let clientes = clientesData ? JSON.parse(clientesData) : [];
    let cliente = clientes.find((c: any) => c.dni === this.user.dni || c.codigo === this.user.codigo);
    if (cliente) {
      cliente.puntos = (cliente.puntos || 0) - premio.puntos;
      // Guardar historial de canje
      if (!cliente.historial) cliente.historial = [];
      cliente.historial.push({
        tipo: 'canje',
        premio: premio.nombre,
        puntos: premio.puntos,
        fecha: new Date().toISOString()
      });
    }
    localStorage.setItem('clubmass_clientes_puntos', JSON.stringify(clientes));
    this.cargarPuntos();
    alert(`¡Canje realizado! Has canjeado ${premio.puntos} puntos por: ${premio.nombre}`);
  }
}
