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
    ToggleSwitch,
    NavigationComponent,
    InputIcon,
    IconField,
    AutoCompleteModule,
    SelectButton,
    ReactiveFormsModule,
    ThreeStateToggleComponent,
    RotationComponent
]
})
export class CalendarModule { }
