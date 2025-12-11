export interface MenuItem {
    label: string;
    route: string;
    icon: string;
    exact?: boolean;
}

export interface MenuConfig {
    [role: string]: MenuItem[];
}

export const MENU_CONFIG: MenuConfig = {
    ADMIN: [
        { label: 'Dashboard', route: '/dashboard/admin', icon: 'dashboard', exact: true },
        { label: 'Gestión de Usuarios', route: '/dashboard/admin/usuarios', icon: 'users' },
        { label: 'Reportes', route: '/dashboard/admin/reportes', icon: 'chart' },
        { label: 'Campañas', route: '/dashboard/admin/campanas', icon: 'megaphone' },
        { label: 'Catálogo de Premios', route: '/dashboard/admin/catalogo', icon: 'gift' },
        { label: 'Configuración', route: '/dashboard/admin/configuracion', icon: 'gear' },
    ],
    CAJERO: [
        { label: 'Dashboard', route: '/dashboard/cajero', icon: 'dashboard', exact: true },
        { label: 'Registrar Compra', route: '/dashboard/cajero/compra', icon: 'cart' },
        { label: 'Consultar Puntos', route: '/dashboard/cajero/puntos', icon: 'search' },
        { label: 'Canjear Puntos', route: '/dashboard/cajero/canjear', icon: 'exchange' },
        { label: 'Incidentes', route: '/dashboard/cajero/incidentes', icon: 'warning' },
    ],
    CLIENTE: [
        { label: 'Dashboard', route: '/dashboard/cliente', icon: 'dashboard', exact: true },
        { label: 'Mis Puntos', route: '/dashboard/cliente/puntos', icon: 'info' },
        { label: 'Historial', route: '/dashboard/cliente/historial', icon: 'history' },
        { label: 'Catálogo de Premios', route: '/dashboard/cliente/catalogo', icon: 'gift' },
    ],
};
