import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AvatarModule,
    FormsModule, // Import FormsModule for ngModel
    InputTextModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    ProgressSpinnerModule,
    RippleModule,
    DefaultLayoutComponent
  ],
  providers: [
    MessageService
  ]
})
export class ProfileModule { }
