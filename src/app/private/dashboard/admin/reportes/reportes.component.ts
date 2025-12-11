import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../../shared/components/dashboard-layout/dashboard-layout.component';
import { ClienteService } from '../../../../core/service/roles/cliente.service';
import { UsuarioService } from '../../../../core/service/roles/usuario.service';
import { AdminService } from '../../../../core/service/roles/admin.service';
import { CajeroService } from '../../../../core/service/roles/cajero.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
    filtro: string = '';
  tipoReporte: 'Clientes' | 'Usuarios' | 'Cajeros' | 'Admins' = 'Clientes';
  tiposReporte = ['Clientes', 'Usuarios', 'Cajeros', 'Admins'];

  loading = false;
  error: string | null = null;
  items: any[] = [];
  resumen: { total: number; activos?: number; inactivos?: number; nuevosMes?: number } = {
    total: 0,
  };

  constructor(
    private clientes: ClienteService,
    private usuarios: UsuarioService,
    private admins: AdminService,
    private cajeros: CajeroService
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  onTipoChange(): void {
    this.cargarReporte();
  }

  private cargarReporte(): void {
    this.loading = true;
    this.error = null;
    this.items = [];
    this.resumen = { total: 0 };
    this.filtro = '';

    let obs$: Observable<any[]> | null = null;
    let localKey = '';
    switch (this.tipoReporte) {
      case 'Clientes':
        obs$ = this.clientes.getClientes() as unknown as Observable<any[]>;
        localKey = 'clubmass_clientes';
        break;
      case 'Usuarios':
        obs$ = this.usuarios.getUsuarios() as unknown as Observable<any[]>;
        localKey = 'clubmass_usuarios';
        break;
      case 'Cajeros':
        obs$ = this.cajeros.getCajeros() as unknown as Observable<any[]>;
        localKey = 'clubmass_cajeros';
        break;
      case 'Admins':
        obs$ = this.admins.getAdmins() as unknown as Observable<any[]>;
        localKey = 'clubmass_admins';
        break;
    }

    // Si no hay backend, usar localStorage para demo
    if (!obs$) {
      // Demo: buscar en localStorage
      try {
        const localData = localKey ? localStorage.getItem(localKey) : null;
        if (localData) {
          this.items = JSON.parse(localData);
          this.resumen = this.calcularResumen(this.items, this.tipoReporte);
        } else {
          this.items = [];
        }
        this.loading = false;
      } catch (e) {
        this.error = 'Error al cargar datos demo';
        this.loading = false;
      }
      return;
    }

    obs$.subscribe({
      next: (data: any[]) => {
        this.items = Array.isArray(data) ? data : [];
        this.resumen = this.calcularResumen(this.items, this.tipoReporte);
        this.loading = false;
      },
      error: (err: any) => {
        // Si hay error de backend, fallback a localStorage demo
        try {
          const localData = localKey ? localStorage.getItem(localKey) : null;
          if (localData) {
            this.items = JSON.parse(localData);
            this.resumen = this.calcularResumen(this.items, this.tipoReporte);
          } else {
            this.items = [];
          }
        } catch (e) {
          this.items = [];
        }
        this.error = err?.message || 'Error al cargar datos';
        this.loading = false;
      },
    });
  }

  private calcularResumen(arr: any[], tipo: ReportesComponent['tipoReporte']) {
    const total = arr.length;
    const now = new Date();
    const mesActual = now.getMonth();
    const anioActual = now.getFullYear();

    const resultado: { total: number; activos?: number; inactivos?: number; nuevosMes?: number } = {
      total,
    };

    if (tipo === 'Usuarios') {
      const activos = arr.filter((x) => x.estado === '1' || x.estado === 1).length;
      resultado.activos = activos;
      resultado.inactivos = total - activos;
    } else if (tipo === 'Admins' || tipo === 'Cajeros') {
      const activos = arr.filter((x) => x.estado === '1' || x.estado === 1).length;
      resultado.activos = activos;
      resultado.inactivos = total - activos;
      const nuevos = arr.filter((x) => {
        const d = x.fechaRegistro ? new Date(x.fechaRegistro) : null;
        return d && d.getMonth() === mesActual && d.getFullYear() === anioActual;
      }).length;
      resultado.nuevosMes = nuevos;
    } else if (tipo === 'Clientes') {
      const nuevos = arr.filter((x) => {
        const d = x.fechaRegistro ? new Date(x.fechaRegistro) : null;
        return d && d.getMonth() === mesActual && d.getFullYear() === anioActual;
      }).length;
      resultado.nuevosMes = nuevos;
    }

    return resultado;
  }

  exportarPDF(): void {
    // Generar PDF con jsPDF y autoTable
    const doc = new jsPDF();
    // Encabezado principal estilizado
    // Encabezado Club Mass (azul oscuro)
    doc.setFillColor(13, 27, 76); // #0d1b4c
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255); // blanco
    doc.setFontSize(16);
    doc.text(`Reporte de ${this.tipoReporte}`, 10, 13);

    // Resumen analítico arriba de la tabla
    doc.setFontSize(10);
    doc.setTextColor(13, 27, 76); // azul oscuro
    let resumenY = 25;
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, resumenY);
    resumenY += 6;
    doc.text(`Cantidad de registros: ${this.items.length}`, 10, resumenY);
    resumenY += 6;
    let resumen = `Total: ${this.resumen.total}`;
    if (this.resumen.activos !== undefined) resumen += ` | Activos: ${this.resumen.activos}`;
    if (this.resumen.inactivos !== undefined) resumen += ` | Inactivos: ${this.resumen.inactivos}`;
    if (this.resumen.nuevosMes !== undefined) resumen += ` | Nuevos (mes): ${this.resumen.nuevosMes}`;
    doc.text(resumen, 10, resumenY);

    // Tabla profesional con autoTable
    const itemsFiltrados = this.filtrarItems(this.items, this.filtro);
    const { headers, rows } = this.obtenerDatosTabla(itemsFiltrados, this.tipoReporte);
    (autoTable as any)(doc, {
      head: [headers],
      body: rows,
      startY: resumenY + 8,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        textColor: [13, 27, 76], // azul oscuro
      },
      headStyles: {
        fillColor: [26, 45, 109], // #1a2d6d azul medio
        textColor: 255, // blanco
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [255, 193, 7], // amarillo acento
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
      tableLineColor: [26, 45, 109], // azul medio
      tableLineWidth: 0.2,
    });

    // Pie de página
    doc.setFontSize(9);
    doc.setTextColor(255, 193, 7); // amarillo acento
    doc.text('Club Mass - Aplicación de gestión', 10, 290);

    // Crear blob para previsualización
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Abrir previsualización en nueva ventana con opción de descarga y detalles
    const win = window.open('', '_blank');
    if (!win) {
      this.error = 'No se pudo abrir la previsualización. Permite ventanas emergentes.';
      return;
    }
    win.document.write(`
      <html><head><title>Previsualización PDF</title>
      <style>
        html, body { height: 100%; margin: 0; padding: 0; background: #fff; }
        body { display: flex; flex-direction: column; height: 100vh; }
        .club-header { background: #0d1b4c; color: #ffc107; padding: 16px; font-size: 20px; text-align: center; font-weight: 700; letter-spacing: 1px; }
        .pdf-viewer { flex: 1 1 auto; width: 100vw; height: 0; min-height: 0; }
        .pdf-viewer iframe { width: 100vw; height: 100%; border: none; background: #0d1b4c; display: block; }
        .club-footer { text-align: center; margin: 0; padding: 16px 0 8px 0; background: #0d1b4c; }
        .club-footer a { background: #ffc107; color: #0d1b4c; padding: 10px 22px; border-radius: 4px; text-decoration: none; font-size: 17px; font-weight: 600; }
        .club-footer .info { color: #0d1b4c; font-size: 13px; margin-top: 8px; }
      </style>
      </head><body>
      <div class="club-header">Previsualización PDF - Club Mass</div>
      <div class="pdf-viewer"><iframe src="${blobUrl}"></iframe></div>
      <div class="club-footer">
        <a href="${blobUrl}" download="reporte_${this.tipoReporte.toLowerCase()}.pdf">Descargar PDF</a>
        <div class="info">Cantidad de registros: ${this.items.length} | Fecha: ${new Date().toLocaleDateString()}</div>
      </div>
      </body></html>
    `);
    win.document.close();
    win.focus();
  }



  private generarCSV(items: any[], tipo: ReportesComponent['tipoReporte']): string {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tipo === 'Clientes') {
      headers = ['idCliente', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'dni', 'codigoMembresia', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idCliente ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.dni ?? ''),
        String(x.codigoMembresia ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    } else if (tipo === 'Usuarios') {
      headers = ['idUsuario', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'rol', 'estado'];
      rows = items.map((x) => [
        String(x.idUsuario ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.rol ?? x.nombreRol ?? ''),
        String(x.estado ?? ''),
      ]);
    } else if (tipo === 'Admins') {
      headers = ['idAdmin', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'estado', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idAdmin ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.estado ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    } else if (tipo === 'Cajeros') {
      headers = ['idCajero', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'estado', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idCajero ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.estado ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    }

    const escape = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    const headerLine = headers.map(escape).join(',');
    const rowLines = rows.map((r) => r.map((v) => escape(v)).join(',')).join('\n');
    return headerLine + '\n' + rowLines;
  }

  private obtenerDatosTabla(items: any[], tipo: ReportesComponent['tipoReporte']): { headers: string[]; rows: string[][] } {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (tipo === 'Clientes') {
      headers = ['idCliente', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'dni', 'codigoMembresia', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idCliente ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.dni ?? ''),
        String(x.codigoMembresia ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    } else if (tipo === 'Usuarios') {
      headers = ['idUsuario', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'rol', 'estado'];
      rows = items.map((x) => [
        String(x.idUsuario ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.rol ?? x.nombreRol ?? ''),
        String(x.estado ?? ''),
      ]);
    } else if (tipo === 'Admins') {
      headers = ['idAdmin', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'estado', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idAdmin ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.estado ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    } else if (tipo === 'Cajeros') {
      headers = ['idCajero', 'nombre1', 'apellidoPaterno', 'username', 'correo', 'estado', 'fechaRegistro'];
      rows = items.map((x) => [
        String(x.idCajero ?? ''),
        String(x.nombre1 ?? ''),
        String(x.apellidoPaterno ?? ''),
        String(x.username ?? ''),
        String(x.correo ?? ''),
        String(x.estado ?? ''),
        String(x.fechaRegistro ?? ''),
      ]);
    }

    return { headers, rows };
    }

    filtrarItems(items: any[], filtro: string): any[] {
      if (!filtro || filtro.trim() === '') return items;
      const f = filtro.trim().toLowerCase();
      return items.filter(item => {
        return Object.values(item).some(val =>
          val && String(val).toLowerCase().includes(f)
        );
      });
  }

  private generarHTMLReporte(): string {
    const { headers, rows } = this.obtenerDatosTabla(this.items, this.tipoReporte);
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; }
        h2 { margin: 0 0 12px; }
        .meta { color: #666; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
        th { background: #f3f3f3; text-align: left; }
      </style>
    `;
    const headerHtml = headers.map((h) => `<th>${h}</th>`).join('');
    const rowsHtml = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
    const resumenHtml = `Total: ${this.resumen.total}` +
      (this.resumen.activos !== undefined ? ` • Activos: ${this.resumen.activos}` : '') +
      (this.resumen.inactivos !== undefined ? ` • Inactivos: ${this.resumen.inactivos}` : '') +
      (this.resumen.nuevosMes !== undefined ? ` • Nuevos (mes): ${this.resumen.nuevosMes}` : '');

    return `
      <html>
        <head>
          <title>Reporte ${this.tipoReporte}</title>
          ${styles}
        </head>
        <body>
          <h2>Reporte de ${this.tipoReporte}</h2>
          <div class="meta">${resumenHtml}</div>
          <table>
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `;
  }
}
