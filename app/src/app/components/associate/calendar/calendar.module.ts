// src/app/calendar/calendar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Keep FormsModule for ngModel

// --- PrimeNG Modules ---
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';           // <-- Add for modal
import { InputTextarea } from 'primeng/inputtextarea'; // <-- Add for note input
import { RadioButtonModule } from 'primeng/radiobutton'; // <-- Add for event type selection
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // <-- Add for loading spinner

// --- Routing & Component ---
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { NavigationComponent } from "../../shared/navigation/navigation.component"; // Assuming standalone

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // Needed for [(ngModel)] in the modal
    CalendarRoutingModule,
    // PrimeNG
    ButtonModule,
    TooltipModule,
    DialogModule,         // <-- Import
    InputTextarea,  // <-- Import
    RadioButtonModule,    // <-- Import
    ProgressSpinnerModule, // <-- Import for loading state
    // Shared Components (if NavigationComponent is standalone, import it here)
    NavigationComponent // <-- Make sure this is correctly imported or declared standalone
  ]
})
export class CalendarModule { }