import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './cliente-dashboard.html',
  styleUrls: ['./cliente-dashboard.css'],
})
export class ClienteDashboardComponent {
  user: any;
  dashboardCards = [
    {
      title: 'Comprar Productos',
      description: 'Compra productos y acumula puntos',
      icon: 'cart',
      route: '/dashboard/cliente/comprar',
      color: '#007bff',
    },
    {
      title: 'Mis Puntos',
      description: 'Consulta tus puntos acumulados',
      icon: 'info',
      route: '/dashboard/cliente/puntos',
      color: '#ffc107',
    },
    {
      title: 'Historial',
      description: 'Revisa tu historial de movimientos',
      icon: 'history',
      route: '/dashboard/cliente/historial',
      color: '#17a2b8',
    },
    {
      title: 'Catálogo de Premios',
      description: 'Descubre los premios disponibles',
      icon: 'gift',
      route: '/dashboard/cliente/catalogo',
      color: '#28a745',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
