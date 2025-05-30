import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

// --- PrimeNG Modules ---
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// --- Shared Components ---
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { UserAvatarComponent } from "../../shared/shared-ui/user-avatar/user-avatar.component";
import { UpdateReportComponent } from "../../shared/rc-ui/update-report/update-report.component";
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReportRoutingModule,
    
    // PrimeNG Modules
    InputTextModule,
    CalendarModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    AvatarModule,
    TagModule,
    ToastModule,
    
    // Standalone Components
    NavigationComponent,
    UserAvatarComponent,
    UpdateReportComponent,
    DefaultLayoutComponent
  ],
  providers: [
    MessageService,
    DatePipe,
    TitleCasePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }