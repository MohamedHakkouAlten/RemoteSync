import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Import Dashboard Components and Routing
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

// Import PrimeNG Modules
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

// Import Chat Module
import { ChatModule } from '../chat/chat.module';

// Import standalone components
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { ProjectStatsCardComponent } from "../../shared/rc-ui/project-stats-card/project-stats-card.component";
import { SiteStatsCardComponent } from "../../shared/rc-ui/site-stats-card/site-stats-card.component";
import { UserAvatarComponent } from "../../shared/shared-ui/user-avatar/user-avatar.component";

// Import services
import { TranslateService } from '@ngx-translate/core';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";
import { LanguageService } from '../../../services/language/language.service';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DashboardRoutingModule,
    ChatModule,
    // PrimeNG Modules
    RippleModule,
    MenubarModule,
    AvatarModule,
    ButtonModule,
    AvatarGroupModule,
    ProgressBarModule,
    TableModule,
    TagModule,
    CardModule,
    // Standalone components
    TranslateModule,
    NavigationComponent,
    ProjectStatsCardComponent,
    SiteStatsCardComponent,
    UserAvatarComponent,
    DefaultLayoutComponent
],
  providers: [
    AuthFacadeService,
    TranslateService,
    LanguageService
  ]
})
export class DashboardModule { }
