
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';

import { NavigationComponent } from '../../shared/navigation/navigation.component'; 

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

@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectsRoutingModule,

    NavigationComponent,

    ButtonModule,
    InputTextModule,
    TableModule,
    CheckboxModule,
    AvatarModule,
    AvatarGroupModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class ProjectsModule { }