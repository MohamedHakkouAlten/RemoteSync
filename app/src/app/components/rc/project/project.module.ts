// src/app/components/admin/projects/projects.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectComponent } from './project.component';

import { NavigationComponent } from '../../shared/navigation/navigation.component'; // Adjust path if needed

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
// --- NEW: Add Dialog and Form Modules ---
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { RcService } from '../../../services/rc.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";
import { LanguageService } from '../../../services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// InputTextarea might be needed if you add a description field later
// import { InputTextareaModule } from 'primeng/inputtextarea';
// ---------------------------------------

@NgModule({
    declarations: [
        ProjectComponent
    ],
    imports: [
    CommonModule,
    FormsModule, // Make sure this is here for ngModel
    ProjectsRoutingModule,
    NavigationComponent, // Import shared component
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    TableModule,
    CheckboxModule,
    AvatarModule,
    AvatarGroupModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    // --- NEW: Add Dialog and Form Modules ---
    DialogModule,
    DropdownModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule
    // InputTextareaModule // Add if needed
    // ---------------------------------------
    ,
    TranslateModule,
    ToastModule,
    AddProjectComponent,
    EditProjectComponent,
    ViewProjectComponent,
    DefaultLayoutComponent
],
providers:[RcService,
    MessageService,
    LanguageService,
    TranslateService
]
})
export class ProjectModule { }