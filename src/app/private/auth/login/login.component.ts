import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';
import { LoginRequest } from '../../../core/model/auth/auth.models';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, FooterComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    contrasena: '',
  };

  showPassword = false;
  errorMessage = '';
  usernameError = '';
  passwordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  validateForm(): boolean {
    this.usernameError = '';
    this.passwordError = '';
    this.errorMessage = '';
    let isValid = true;

    if (!this.credentials.username || this.credentials.username.trim() === '') {
      this.usernameError = 'El usuario es requerido';
      isValid = false;
    }

    if (!this.credentials.contrasena || this.credentials.contrasena.trim() === '') {
      this.passwordError = 'La contraseña es requerida';
      isValid = false;
    }

    return isValid;
  }

  onLogin(): void {
    if (!this.validateForm()) {
      return;
    }

    this.authService.login(this.credentials).subscribe(
      (response) => {
        this.authService.saveUser(response);
        if (response.rol.toUpperCase() === 'CLIENTE') {
          this.router.navigate(['/dashboard/cliente/puntos']);
        } else {
          this.router.navigate([`/dashboard/${response.rol.toLowerCase()}`]);
        }
      },
      () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }
}
