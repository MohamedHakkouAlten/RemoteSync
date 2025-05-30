import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { MessageService } from 'primeng/api';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag'; 
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DefaultLayoutComponent } from '../../shared/layout/default-layout.component';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule, 
    InputTextModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,        
    InputTextarea,
    ToastModule,
    ProgressSpinnerModule,
    DefaultLayoutComponent
  ],
  providers: [
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }