import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FooterComponent, HeaderComponent],
  templateUrl: './cajero-dashboard.html',
  styleUrls: ['./cajero-dashboard.css'],
})
export class CajeroDashboardComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
