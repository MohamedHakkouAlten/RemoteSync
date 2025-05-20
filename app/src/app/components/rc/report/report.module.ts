// src/app/report/report.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule

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
import { NavigationComponent } from "../../shared/navigation/navigation.component"; // <-- Add DialogModule
import { ReportService } from '../../../services/report.service';
import { UserAvatarComponent } from "../../shared/shared-ui/user-avatar/user-avatar.component";
import { UserUtils } from '../../../utilities/UserUtils';
import { UpdateReportComponent } from "../../shared/rc-ui/update-report/update-report.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // <-- Add FormsModule
    ReportRoutingModule,
    // --- Add PrimeNG Modules ---
    InputTextModule,
    CalendarModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    AvatarModule,
    TagModule,
    NavigationComponent,
    UserAvatarComponent,
    UpdateReportComponent,
     ToastModule
],
providers :[
  ReportService,
  MessageService
]
  // No providers needed here unless DatePipe isn't provided elsewhere
})
export class ReportModule { }