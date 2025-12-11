import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';
import { UsuarioService } from '../../../../core/service/roles/usuario.service';
import { UsuarioResponse, UsuarioRequest, RolRequest } from '../../../../core/model/roles/usuario.models';
import { AdminService } from '../../../../core/service/roles/admin.service';
import { CajeroService } from '../../../../core/service/roles/cajero.service';
import { ClienteService } from '../../../../core/service/roles/cliente.service';

@Component({
	selector: 'app-usuarios',
	standalone: true,
	imports: [CommonModule, FormsModule, DashboardLayoutComponent],
	templateUrl: './usuarios.component.html',
	styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
		deleteUsuario(usuario: UsuarioResponse): void {
			if (confirm(`¿Seguro que deseas eliminar el usuario ${usuario.username}?`)) {
				this.loading = true;
				this.usuarioService.deleteUsuario(usuario.idUsuario).subscribe({
					next: () => {
						this.loadUsuarios();
						this.loading = false;
					},
					error: (err) => {
						this.error = 'Error al eliminar usuario';
						this.loading = false;
						console.error(err);
					}
				});
			}
		}
	usuarios: UsuarioResponse[] = [];
	loading = false;
	error = '';

	// Búsqueda y paginación
	searchTerm = '';
	pageSize = 10;
	currentPage = 1;
	pageSizeOptions = [10, 15, 20, 30, 50];

	// Modal de usuario
	showModal = false;
	isEditing = false;
	usuarioForm: UsuarioRequest = this.getEmptyForm();
	editingId: number | null = null;
	formErrors: { [key: string]: string } = {};

	// Modal de detalles
	showDetailsModal = false;
	selectedUsuario: UsuarioResponse | null = null;

	// Roles disponibles
	roles = ['ADMIN', 'CAJERO', 'CLIENTE'];

	constructor(
		private usuarioService: UsuarioService,
		private adminService: AdminService,
		private cajeroService: CajeroService,
		private clienteService: ClienteService
	) {}

	ngOnInit(): void {
		this.loadUsuarios();
	}

	loadUsuarios(): void {
		this.loading = true;
		this.error = '';
		this.usuarioService.getUsuarios().subscribe({
			next: (data) => {
				this.usuarios = data;
				this.loading = false;
			},
			error: (err) => {
				this.error = 'Error al cargar usuarios';
				this.loading = false;
				console.error(err);
			}
		});
	}

	// Filtrado por búsqueda
	get filteredUsuarios(): UsuarioResponse[] {
		if (!this.searchTerm.trim()) {
			return this.usuarios;
		}
		const term = this.searchTerm.toLowerCase();
		return this.usuarios.filter(u => 
			u.nombre1?.toLowerCase().includes(term) ||
			u.nombre2?.toLowerCase().includes(term) ||
			u.apellidoPaterno?.toLowerCase().includes(term) ||
			u.apellidoMaterno?.toLowerCase().includes(term) ||
			u.username?.toLowerCase().includes(term) ||
			u.correo?.toLowerCase().includes(term) ||
			u.rol?.toLowerCase().includes(term) ||
			u.nombreRol?.toLowerCase().includes(term)
		);
	}

	// Paginación
	get totalPages(): number {
		return Math.ceil(this.filteredUsuarios.length / this.pageSize);
	}

	get paginatedUsuarios(): UsuarioResponse[] {
		const start = (this.currentPage - 1) * this.pageSize;
		const end = start + this.pageSize;
		return this.filteredUsuarios.slice(start, end);
	}

	get startRecord(): number {
		return this.filteredUsuarios.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
	}

	get endRecord(): number {
		const end = this.currentPage * this.pageSize;
		return Math.min(end, this.filteredUsuarios.length);
	}

	onPageSizeChange(): void {
		this.currentPage = 1;
	}

	onSearchChange(): void {
		this.currentPage = 1;
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
		}
	}

	previousPage(): void {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}

	nextPage(): void {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
		}
	}

	getEmptyForm(): UsuarioRequest {
		return {
			nombre1: '',
			nombre2: '',
			apellidoPaterno: '',
			apellidoMaterno: '',
			username: '',
			contrasena: '',
			correo: '',
			rol: { nombreRol: 'CLIENTE' },
			estado: 1
		};
	}

	openCreateModal(): void {
		this.usuarioForm = this.getEmptyForm();
		this.isEditing = false;
		this.editingId = null;
		this.formErrors = {};
		this.showModal = true;
	}

	openEditModal(usuario: UsuarioResponse): void {
		this.usuarioForm = {
			nombre1: usuario.nombre1,
			nombre2: usuario.nombre2 || '',
			apellidoPaterno: usuario.apellidoPaterno,
			apellidoMaterno: usuario.apellidoMaterno || '',
			username: usuario.username,
			contrasena: '', // No mostramos la contraseña
			correo: usuario.correo,
			rol: { nombreRol: usuario.rol || usuario.nombreRol || 'CLIENTE' },
			estado: usuario.estado === '1' ? 1 : 0
		};
		this.isEditing = true;
		this.editingId = usuario.idUsuario;
		this.formErrors = {};
		this.showModal = true;
	}

	closeModal(): void {
		this.showModal = false;
		this.formErrors = {};
	}

	validateForm(): boolean {
		this.formErrors = {};
    
		if (!this.usuarioForm.nombre1 || this.usuarioForm.nombre1.trim().length < 2) {
			this.formErrors['nombre1'] = 'El nombre debe tener al menos 2 caracteres';
		}
		if (!this.usuarioForm.apellidoPaterno || this.usuarioForm.apellidoPaterno.trim() === '') {
			this.formErrors['apellidoPaterno'] = 'El apellido paterno es requerido';
		}
		if (!this.usuarioForm.username || this.usuarioForm.username.trim().length < 4) {
			this.formErrors['username'] = 'El usuario debe tener al menos 4 caracteres';
		}
		if (!this.usuarioForm.correo || !this.isValidEmail(this.usuarioForm.correo)) {
			this.formErrors['correo'] = 'Ingrese un correo válido';
		}
		if (!this.isEditing && (!this.usuarioForm.contrasena || this.usuarioForm.contrasena.length < 6)) {
			this.formErrors['password'] = 'La contraseña debe tener al menos 6 caracteres';
		}
    
		return Object.keys(this.formErrors).length === 0;
	}

	isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	saveUsuario(): void {
		if (!this.validateForm()) {
			return;
		}

		this.loading = true;

		if (this.isEditing && this.editingId) {
			// ...actualizar usuario existente...
		} else {
			this.usuarioService.createUsuario(this.usuarioForm).subscribe({
				next: (usuarioCreado) => {
					// Flujo automático para crear en tabla específica según rol
					const rol = usuarioCreado.rol || usuarioCreado.nombreRol;
					if (rol === 'ADMIN') {
						this.adminService.createAdmin({ idUsuario: usuarioCreado.idUsuario }).subscribe({
							next: () => this.finalizarCreacion(),
							error: () => this.finalizarCreacion()
						});
					} else if (rol === 'CAJERO') {
						this.cajeroService.createCajero({ idUsuario: usuarioCreado.idUsuario }).subscribe({
							next: () => this.finalizarCreacion(),
							error: () => this.finalizarCreacion()
						});
					} else if (rol === 'CLIENTE') {
						this.clienteService.createCliente({ idUsuario: usuarioCreado.idUsuario }).subscribe({
							next: () => this.finalizarCreacion(),
							error: () => this.finalizarCreacion()
						});
					} else {
						this.finalizarCreacion();
					}
				},
				error: (err) => {
					this.error = 'Error al crear usuario';
					this.loading = false;
					console.error(err);
				}
			});
		}
	}

	finalizarCreacion(): void {
		this.closeModal();
		this.loadUsuarios();
	}

	toggleEstado(usuario: UsuarioResponse): void {
		const nuevoEstado = usuario.estado === '1' ? 0 : 1;
		this.usuarioService.updateEstado(usuario.idUsuario, nuevoEstado).subscribe({
			next: () => {
				this.loadUsuarios();
			},
			error: (err) => {
				this.error = 'Error al cambiar estado';
				console.error(err);
			}
		});
	}

	getEstadoTexto(estado?: string): string {
		return estado === '1' ? 'Activo' : 'Inactivo';
	}

	getNombreCompleto(usuario: UsuarioResponse): string {
		let nombre = usuario.nombre1;
		if (usuario.nombre2) nombre += ' ' + usuario.nombre2;
		nombre += ' ' + usuario.apellidoPaterno;
		if (usuario.apellidoMaterno) nombre += ' ' + usuario.apellidoMaterno;
		return nombre;
	}

	openDetailsModal(usuario: UsuarioResponse): void {
		this.selectedUsuario = usuario;
		this.showDetailsModal = true;
	}

	closeDetailsModal(): void {
		this.showDetailsModal = false;
		this.selectedUsuario = null;
	}

	editFromDetails(): void {
		if (this.selectedUsuario) {
			this.closeDetailsModal();
			this.openEditModal(this.selectedUsuario);
		}
	}

	getRolBadgeClass(rol?: string): string {
		switch (rol) {
			case 'ADMIN': return 'bg-danger';
			case 'CAJERO': return 'bg-warning text-dark';
			case 'CLIENTE': return 'bg-info';
			default: return 'bg-secondary';
		}
	}
}

