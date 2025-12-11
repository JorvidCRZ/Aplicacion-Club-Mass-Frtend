import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

interface Incidente {
  id: number;
  cliente: string;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha: string;
}

@Component({
  selector: 'app-incidentes',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './incidentes.component.html',
  styleUrls: ['./incidentes.component.css'],
})
export class IncidentesComponent {
  incidentes: Incidente[] = [];
  nuevo: Partial<Incidente> = {};
  editando: Incidente | null = null;
  mensaje: string = '';

  constructor() {
    this.cargarIncidentes();
  }

  cargarIncidentes() {
    const data = localStorage.getItem('clubmass_incidentes');
    if (data) {
      this.incidentes = JSON.parse(data);
    } else {
      this.incidentes = [
        { id: 1, cliente: 'García, E.', tipo: 'Reclamo', descripcion: 'Producto defectuoso', estado: 'Pendiente', fecha: '2024-04-15' },
        { id: 2, cliente: 'López, M.', tipo: 'Pregunta', descripcion: 'Beneficios de socio', estado: 'Pendiente', fecha: '2024-04-14' },
        { id: 3, cliente: 'Martínez, R.', tipo: 'Reclamo', descripcion: 'Problema con el envío', estado: 'Pendiente', fecha: '2024-04-13' },
        { id: 4, cliente: 'Sánchez, P.', tipo: 'Pregunta', descripcion: 'Problema gracioso bro', estado: 'En curso', fecha: '2024-04-12' },
        { id: 5, cliente: 'Torres, A.', tipo: 'Pregunta', descripcion: 'Error en puntos', estado: 'Pendiente', fecha: '2024-04-10' },
      ];
      this.guardarIncidentes();
    }
  }

  guardarIncidentes() {
    localStorage.setItem('clubmass_incidentes', JSON.stringify(this.incidentes));
  }

  agregarIncidente() {
    if (!this.nuevo.cliente || !this.nuevo.tipo || !this.nuevo.descripcion) return;
    const nuevo: Incidente = {
      id: this.incidentes.length ? Math.max(...this.incidentes.map(i => i.id)) + 1 : 1,
      cliente: this.nuevo.cliente,
      tipo: this.nuevo.tipo,
      descripcion: this.nuevo.descripcion,
      estado: this.nuevo.estado || 'Pendiente',
      fecha: new Date().toISOString().slice(0, 10),
    };
    this.incidentes.unshift(nuevo);
    this.guardarIncidentes();
    this.nuevo = {};
    this.mensaje = 'Incidencia registrada';
    setTimeout(() => (this.mensaje = ''), 2000);
  }

  editarIncidente(inc: Incidente) {
    this.editando = { ...inc };
  }

  guardarEdicion() {
    if (!this.editando) return;
    const idx = this.incidentes.findIndex(i => i.id === this.editando!.id);
    if (idx > -1) {
      this.incidentes[idx] = { ...this.editando };
      this.guardarIncidentes();
    }
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarIncidente(id: number) {
    this.incidentes = this.incidentes.filter(i => i.id !== id);
    this.guardarIncidentes();
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'status-pendiente';
      case 'en curso': return 'status-encurso';
      case 'resuelto': return 'status-resuelto';
      default: return '';
    }
  }
}
