import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButton } from 'primeng/selectbutton';
import { ThreeStateToggleComponent } from "../../shared/three-state-toggle/three-state-toggle.component";
import { RotationComponent } from "../rotation/rotation.component";
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule, // Import FormsModule
    // PrimeNG
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AvatarModule,
    NavigationComponent,
    InputIcon,
    IconField,
    AutoCompleteModule,
    ThreeStateToggleComponent,
    RotationComponent,
    ToastModule,
    PaginatorModule,
    DefaultLayoutComponent
],
providers :[
    MessageService,
    TranslateService
]
})
export class CalendarModule { }
