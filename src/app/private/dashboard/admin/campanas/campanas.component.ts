import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

interface Campana {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  estado: string;
}

@Component({
  selector: 'app-campanas',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './campanas.component.html',
  styleUrls: ['./campanas.component.css'],
})
export class CampanasComponent {
  campanas: Campana[] = [];
  nuevaCampana: Partial<Campana> = {};
  campanaEditando: Campana | null = null;

  constructor() {
    this.cargarCampanas();
  }

  cargarCampanas() {
    const data = localStorage.getItem('clubmass_campanas');
    if (data) {
      this.campanas = JSON.parse(data);
    } else {
      this.campanas = [
        { id: 1, nombre: 'Oferta Primavera', fechaInicio: '2024-04-01', fechaFin: '2024-04-30', estado: 'Activa', descripcion: 'Descuentos de primavera' },
        { id: 2, nombre: 'Día del Cliente', fechaInicio: '2024-09-20', fechaFin: '2024-09-20', estado: 'Programada', descripcion: 'Celebración especial' },
        { id: 3, nombre: 'Navidad', fechaInicio: '2024-12-01', fechaFin: '2024-12-25', estado: 'Programada', descripcion: 'Promos navideñas' },
      ];
      this.guardarCampanas();
    }
  }

  guardarCampanas() {
    localStorage.setItem('clubmass_campanas', JSON.stringify(this.campanas));
  }

  agregarCampana() {
    if (!this.nuevaCampana.nombre || !this.nuevaCampana.fechaInicio || !this.nuevaCampana.fechaFin) return;
    const nueva: Campana = {
      id: this.campanas.length ? Math.max(...this.campanas.map(c => c.id)) + 1 : 1,
      nombre: this.nuevaCampana.nombre,
      fechaInicio: this.nuevaCampana.fechaInicio,
      fechaFin: this.nuevaCampana.fechaFin,
      descripcion: this.nuevaCampana.descripcion || '',
      estado: 'Programada',
    };
    this.campanas.push(nueva);
    this.guardarCampanas();
    this.nuevaCampana = {};
  }

  editarCampana(campana: Campana) {
    this.campanaEditando = { ...campana };
  }

  guardarEdicion() {
    if (!this.campanaEditando) return;
    const idx = this.campanas.findIndex(c => c.id === this.campanaEditando!.id);
    if (idx > -1) {
      this.campanas[idx] = { ...this.campanaEditando };
      this.guardarCampanas();
    }
    this.campanaEditando = null;
  }

  cancelarEdicion() {
    this.campanaEditando = null;
  }

  eliminarCampana(id: number) {
    this.campanas = this.campanas.filter(c => c.id !== id);
    this.guardarCampanas();
  }
}
