import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FooterComponent, HeaderComponent],
  template: `
    <div class="dashboard-wrapper">
      <app-header></app-header>
      <div class="dashboard-layout">
        <app-sidebar></app-sidebar>
        <div class="dashboard-main">
          <div class="dashboard-content">
            <ng-content></ng-content>
          </div>
          <app-footer></app-footer>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .dashboard-layout {
      display: flex;
      flex: 1;
      background-color: #f5f5f5;
    }

    .dashboard-main {
      margin-left: 250px;
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: calc(100vw - 250px);
    }

    .dashboard-content {
      flex: 1;
      padding: 1.5rem;
      overflow-x: hidden;
      box-sizing: border-box;
    }
  `]
})
export class DashboardLayoutComponent { }
