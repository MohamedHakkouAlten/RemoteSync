// dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe here to use in providers array
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MonthNamePipe } from './month-name.pipe'; // Your custom pipe

// Assuming NavigationComponent and DefaultLayoutComponent are standalone components.
// If they are part of a SharedModule that exports them, import that SharedModule instead.
import { NavigationComponent } from '../../shared/navigation/navigation.component';
import { DefaultLayoutComponent } from '../../shared/layout/default-layout.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MonthNamePipe
  ],
  imports: [
    CommonModule,        // Provides NgClass, NgFor, and DatePipe (for template usage and injection)
    FormsModule,
    DashboardRoutingModule,
    CalendarModule,
    ProgressBarModule,   // Import once
    ProgressSpinnerModule, // For loading spinner
    BadgeModule,
    AvatarModule,
    DefaultLayoutComponent, // Assuming standalone
    NavigationComponent     // Add NavigationComponent, assuming standalone (used in DashboardComponent.html)
  ],
  providers: [
    DatePipe             // Explicitly provide DatePipe for injection in DashboardComponent's constructor.
                         // CommonModule also provides DatePipe, so this makes it available via this module's injector.
  ]
})
export class DashboardModule { }