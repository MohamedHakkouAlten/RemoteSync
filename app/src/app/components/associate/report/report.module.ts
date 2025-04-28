
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag'; 
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog'; 
import { InputTextarea } from 'primeng/inputtextarea'; 

import { NavigationComponent } from '../../shared/navigation/navigation.component'; 


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReportRoutingModule, 
    InputTextModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,        
    InputTextModule,  
    NavigationComponent
  ]
})
export class ReportModule { }