import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for ngModel

// --- PrimeNG Modules ---
import { InputTextModule } from 'primeng/inputtext'; // For search input
import { DropdownModule } from 'primeng/dropdown'; // For status/client filters
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup'; // For stacked avatars
import { BadgeModule } from 'primeng/badge'; // For status tags
import { ButtonModule } from 'primeng/button'; // Optional for icons etc.

// Import NavigationComponent
import { NavigationComponent } from '../../shared/navigation/navigation.component';

// --- Routing & Component ---
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';

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
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    ButtonModule,
    NavigationComponent // Add the NavigationComponent to imports
  ]
})
export class ProjectModule { }