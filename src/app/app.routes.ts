import { Routes } from '@angular/router';
import { authGuard, roleGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () =>
            import('./private/auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'registrar',
        canActivate: [loginGuard],
        loadComponent: () =>
            import('./private/auth/registrar/registrar.component').then((m) => m.RegistrarComponent),
    },
    // ADMIN Routes
    {
        path: 'dashboard/admin',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    },
    {
        path: 'dashboard/admin/usuarios',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
    },
    {
        path: 'dashboard/admin/reportes',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/reportes/reportes.component').then((m) => m.ReportesComponent),
    },
    {
        path: 'dashboard/admin/campanas',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/campanas/campanas.component').then((m) => m.CampanasComponent),
    },
    {
        path: 'dashboard/admin/catalogo',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/catalogo/catalogo.component').then((m) => m.CatalogoAdminComponent),
    },
    {
        path: 'dashboard/admin/configuracion',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadComponent: () =>
            import('./private/dashboard/admin/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
    },
    // CAJERO Routes
    {
        path: 'dashboard/cajero',
        canActivate: [authGuard, roleGuard(['CAJERO'])],
        loadComponent: () =>
            import('./private/dashboard/cajero/cajero-dashboard.component').then((m) => m.CajeroDashboardComponent),
    },
    {
        path: 'dashboard/cajero/compra',
        canActivate: [authGuard, roleGuard(['CAJERO'])],
        loadComponent: () =>
            import('./private/dashboard/cajero/compra/compra.component').then((m) => m.CompraComponent),
    },
    {
        path: 'dashboard/cajero/puntos',
        canActivate: [authGuard, roleGuard(['CAJERO'])],
        loadComponent: () =>
            import('./private/dashboard/cajero/puntos/puntos.component').then((m) => m.ConsultarPuntosComponent),
    },
    {
        path: 'dashboard/cajero/canjear',
        canActivate: [authGuard, roleGuard(['CAJERO'])],
        loadComponent: () =>
            import('./private/dashboard/cajero/canjear/canjear.component').then((m) => m.CanjearComponent),
    },
    {
        path: 'dashboard/cajero/incidentes',
        canActivate: [authGuard, roleGuard(['CAJERO'])],
        loadComponent: () =>
            import('./private/dashboard/cajero/incidentes/incidentes.component').then((m) => m.IncidentesComponent),
    },
    // CLIENTE Routes
    {
        path: 'dashboard/cliente',
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
        loadComponent: () =>
            import('./private/dashboard/cliente/cliente.component').then((m) => m.ClienteDashboardComponent),
    },
    {
        path: 'dashboard/cliente/puntos',
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
        loadComponent: () =>
            import('./private/dashboard/cliente/puntos/mis-puntos.component').then((m) => m.MisPuntosComponent),
    },
    {
        path: 'dashboard/cliente/historial',
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
        loadComponent: () =>
            import('./private/dashboard/cliente/historial/historial.component').then((m) => m.HistorialComponent),
    },
    {
        path: 'dashboard/cliente/catalogo',
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
        loadComponent: () =>
            import('./private/dashboard/cliente/catalogo/catalogo-cliente.component').then((m) => m.CatalogoClienteComponent),
    },
    {
        path: 'dashboard/cliente/comprar',
        canActivate: [authGuard, roleGuard(['CLIENTE'])],
        loadComponent: () =>
            import('./private/dashboard/cliente/comprar/comprar-producto.component').then((m) => m.ComprarProductoComponent),
    },
    { path: '**', redirectTo: 'login' },
];
