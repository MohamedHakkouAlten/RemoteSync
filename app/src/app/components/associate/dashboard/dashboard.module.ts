import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- PrimeNG Modules ---
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge'; // For status indicators
import { AvatarModule } from 'primeng/avatar'; // For user avatar
// Import MenuModule if using p-menu for user dropdown
// import { MenuModule } from 'primeng/menu';
// Import TableModule if choosing p-table for Previous Projects
// import { TableModule } from 'primeng/table';

// Import NavigationComponent
import { NavigationComponent } from '../../shared/navigation/navigation.component';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MonthNamePipe } from './month-name.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    MonthNamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    CalendarModule,
    ProgressBarModule,
    BadgeModule,
    AvatarModule,
    NavigationComponent, // Add the NavigationComponent to imports
  ],
  providers: [
    
  ]
})
export class DashboardModule { }