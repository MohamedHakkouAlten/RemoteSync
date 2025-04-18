import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




// Import PrimeNG Modules
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button'; // For icon buttons
import { MenuModule } from 'primeng/menu';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { AvatarGroupModule } from 'primeng/avatargroup'; // Import AvatarGroupModule
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';       // Import TableModule
import { TagModule } from 'primeng/tag';   
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    // PrimeNG
    // Add PrimeNG Modules here
    // PrimeNG Modules
    MenubarModule,
    ButtonModule,
    AvatarModule,
    RippleModule,
    AvatarGroupModule, // Add AvatarGroupModule
    ProgressBarModule,
    TableModule, // Add TableModule
    TagModule,
    NavigationComponent
]
})
export class DashboardModule { }
