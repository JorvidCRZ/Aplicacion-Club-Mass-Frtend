import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

interface Premio {
  id: number;
  nombre: string;
  puntos: number;
  imagen: string;
  disponible: boolean;
}

@Component({
  selector: 'app-catalogo-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoAdminComponent {
  premios: Premio[] = [];
  premioEditando: Premio | null = null;
  nuevoPremio: Partial<Premio> = {};

  constructor() {
    this.cargarPremios();
  }

  cargarPremios() {
    const data = localStorage.getItem('clubmass_premios');
    if (data) {
      this.premios = JSON.parse(data);
    } else {
      // Datos demo iniciales
      this.premios = [
        { id: 1, nombre: 'Descuento 10%', puntos: 500, imagen: '', disponible: true },
        { id: 2, nombre: 'Producto Gratis', puntos: 1000, imagen: '', disponible: true },
        { id: 3, nombre: 'Gift Card S/50', puntos: 2500, imagen: '', disponible: false },
      ];
      this.guardarPremios();
    }
  }

  guardarPremios() {
    localStorage.setItem('clubmass_premios', JSON.stringify(this.premios));
  }

  agregarPremio() {
    if (!this.nuevoPremio.nombre || !this.nuevoPremio.puntos) return;
    const nuevo: Premio = {
      id: this.premios.length ? Math.max(...this.premios.map(p => p.id)) + 1 : 1,
      nombre: this.nuevoPremio.nombre,
      puntos: Number(this.nuevoPremio.puntos),
      imagen: this.nuevoPremio.imagen || '',
      disponible: this.nuevoPremio.disponible ?? true,
    };
    this.premios.push(nuevo);
    this.guardarPremios();
    this.nuevoPremio = {};
  }

  editarPremio(premio: Premio) {
    this.premioEditando = { ...premio };
  }

  guardarEdicion() {
    if (!this.premioEditando) return;
    const idx = this.premios.findIndex(p => p.id === this.premioEditando!.id);
    if (idx > -1) {
      this.premios[idx] = { ...this.premioEditando };
      this.guardarPremios();
    }
    this.premioEditando = null;
  }

  cancelarEdicion() {
    this.premioEditando = null;
  }

  eliminarPremio(id: number) {
    this.premios = this.premios.filter(p => p.id !== id);
    this.guardarPremios();
  }
}
