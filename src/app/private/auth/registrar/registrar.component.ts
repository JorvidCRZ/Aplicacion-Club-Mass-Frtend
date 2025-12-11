import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';
import { RegisterRequest } from '../../../core/model/auth/auth.models';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css'],
})
export class RegistrarComponent {
  userData: RegisterRequest = {
    nombre1: '',
    nombre2: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    username: '',
    contrasena: '',
    correo: '',
    rol: 'CLIENTE',
  };

  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  // Errores por campo
  errors: { [key: string]: string } = {};

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateForm(): boolean {
    this.errors = {};
    this.errorMessage = '';
    let isValid = true;

    // Validar nombre
    if (!this.userData.nombre1 || this.userData.nombre1.trim() === '') {
      this.errors['nombre1'] = 'El primer nombre es requerido';
      isValid = false;
    } else if (this.userData.nombre1.length < 2) {
      this.errors['nombre1'] = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validar apellido paterno
    if (!this.userData.apellidoPaterno || this.userData.apellidoPaterno.trim() === '') {
      this.errors['apellidoPaterno'] = 'El apellido paterno es requerido';
      isValid = false;
    }

    // Validar username
    if (!this.userData.username || this.userData.username.trim() === '') {
      this.errors['username'] = 'El usuario es requerido';
      isValid = false;
    } else if (this.userData.username.length < 4) {
      this.errors['username'] = 'El usuario debe tener al menos 4 caracteres';
      isValid = false;
    }

    // Validar correo
    if (!this.userData.correo || this.userData.correo.trim() === '') {
      this.errors['correo'] = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.userData.correo)) {
      this.errors['correo'] = 'Ingresa un correo electrónico válido';
      isValid = false;
    }

    // Validar contraseña
    if (!this.userData.contrasena || this.userData.contrasena.trim() === '') {
      this.errors['contrasena'] = 'La contraseña es requerida';
      isValid = false;
    } else if (this.userData.contrasena.length < 6) {
      this.errors['contrasena'] = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!this.confirmPassword || this.confirmPassword.trim() === '') {
      this.errors['confirmPassword'] = 'Confirma tu contraseña';
      isValid = false;
    } else if (this.userData.contrasena !== this.confirmPassword) {
      this.errors['confirmPassword'] = 'Las contraseñas no coinciden';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onRegister(): void {
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado exitosamente.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al registrar usuario. Intenta con otro nombre de usuario.';
      },
    });
  }
}