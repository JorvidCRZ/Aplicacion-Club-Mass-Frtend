import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent {
  config = {
    puntosBase: 10,
    montoMinimo: 1,
    factorMultiplicador: 1,
    diasVencimiento: 365,
  };
  mensaje: string = '';

  constructor() {
    this.cargarConfig();
  }

  cargarConfig() {
    const data = localStorage.getItem('clubmass_config');
    if (data) {
      this.config = JSON.parse(data);
    }
  }

  guardarConfig() {
    localStorage.setItem('clubmass_config', JSON.stringify(this.config));
    this.mensaje = 'Configuración guardada correctamente';
    setTimeout(() => (this.mensaje = ''), 2000);
  }
}
