import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

// --- PrimeNG Modules ---
import { InputTextModule } from 'primeng/inputtext'; // For search input
import { DropdownModule } from 'primeng/dropdown'; // For status/client filters
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup'; // For stacked avatars
import { BadgeModule } from 'primeng/badge'; // For status tags
import { ButtonModule } from 'primeng/button'; // Optional for icons etc.
import { PaginatorModule } from 'primeng/paginator';
import { InputIconModule } from 'primeng/inputicon'; // For search icon
import { IconFieldModule } from 'primeng/iconfield'; // For icon+input field

// Import NavigationComponent
import { NavigationComponent } from '../../shared/navigation/navigation.component';

// --- Routing & Component ---
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { DefaultLayoutComponent } from '../../shared/layout/default-layout.component';

@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule,    
    InputTextModule,
    DropdownModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    ButtonModule,
    NavigationComponent,
    DefaultLayoutComponent,
    PaginatorModule,
    InputIconModule,
    IconFieldModule
  ]
})
export class ProjectModule { }