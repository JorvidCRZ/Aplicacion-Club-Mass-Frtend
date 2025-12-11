import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (!allowedRoles.includes(user.rol)) {
      // Redirigir al dashboard correcto según el rol
      router.navigate([`/dashboard/${user.rol.toLowerCase()}`]);
      return false;
    }

    return true;
  };
};

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  // Si ya está logueado, redirigir al dashboard
  if (user) {
    router.navigate([`/dashboard/${user.rol.toLowerCase()}`]);
    return false;
  }

  return true;
};
