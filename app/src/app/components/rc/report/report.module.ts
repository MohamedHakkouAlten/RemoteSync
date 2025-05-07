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
import { DialogModule } from 'primeng/dialog';
import { NavigationComponent } from "../../shared/navigation/navigation.component"; // <-- Add DialogModule

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
    DialogModule,
    NavigationComponent
]
  // No providers needed here unless DatePipe isn't provided elsewhere
})
export class ReportModule { }