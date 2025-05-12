import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




// Import PrimeNG Modules

import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button'; // For icon buttons
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { AvatarGroupModule } from 'primeng/avatargroup'; // Import AvatarGroupModule
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';       // Import TableModule
import { TagModule } from 'primeng/tag';   
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { RotationService } from '../../../services/rotation.service';
import { ProjectStatsCardComponent } from "../../shared/rc-ui/project-stats-card/project-stats-card.component";
import { SiteStatsCardComponent } from "../../shared/rc-ui/site-stats-card/site-stats-card.component";
import { UserAvatarComponent } from "../../shared/shared-ui/user-avatar/user-avatar.component";
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

    ButtonModule,
    AvatarGroupModule, // Add AvatarGroupModule
    ProgressBarModule,
    TableModule, // Add TableModule
    NavigationComponent,
    ProjectStatsCardComponent,
    SiteStatsCardComponent,
    UserAvatarComponent
],
providers:[
  AuthFacadeService,
  RotationService
]
})
export class DashboardModule { }
