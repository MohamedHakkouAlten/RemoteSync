
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules (Import only what's needed)
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // Often needed by dropdown/multiselect filtering
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';

// Interfaces for clarity (adjust based on your actual data models)
interface Project {
  id: number;
  name: string;
}

interface Collaborator {
  id: number;
  name: string;
  avatar?: string; // Optional avatar URL
}

export interface RotationOutput {
  projectId: number | null;
  collaboratorIds: number[];
  mode: 'automatic' | 'custom';
  startDate?: Date | null;
  endDate?: Date | null;
  rotationInterval?: number;
  rotationPeriod?: number;
  customDates?: Date[] | null;
}
@Component({
  selector: 'app-rotation',
  standalone: true,
  templateUrl: './rotation.component.html',
  styleUrl: './rotation.component.css',
  imports :[ CommonModule,   FormsModule,
    // PrimeNG Modules
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    ButtonModule,
    AutoCompleteModule, 
    DatePickerModule,
    InputTextModule,]
})
export class RotationComponent implements OnInit {

  // --- Inputs ---
  @Input() visible: boolean = true;
  @Input() projects: Project[] = []; // Provide actual projects via Input
  @Input() collaborators: Collaborator[] = []; // Provide actual collaborators via Input
  @Input() isLoadingProjects: boolean = false;

  @Input() isLoadingCollaborators: boolean = false;

  // --- Outputs ---
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() createRotation = new EventEmitter<RotationOutput>();
  @Output() cancel = new EventEmitter<void>();

  // --- Internal State ---
  selectedProject: Project | null = null;
  rotationMode: 'automatic' | 'custom' = 'automatic'; // Default mode
  startDate: Date | null = new Date(); // Default start date
  endDate: Date | null = null;
  rotationInterval: number = 1;
  rotationPeriod: number = 6;
  customDates: Date[] | null = null;
  selectedCollaborators: Collaborator[] = [];

  // Suggestions array for p-autoComplete
  filteredCollaborators: Collaborator[] = [];

  ngOnInit(): void {
    // Set default end date (e.g., end of year) if needed
    
    if (!this.endDate) {
      const today = new Date();
      this.endDate = new Date(today.getFullYear(), 11, 31); // Dec 31st
    }

    // Example: Add some default selected collaborators if needed for testing
    // if (this.collaborators.length >= 2) {
    //   this.selectedCollaborators = [this.collaborators[0], this.collaborators[1]];
    // }
  }

  // --- Methods ---
 // *** NEW: Method for p-autoComplete suggestions ***
 filterCollaborators(event: { originalEvent: Event, query: string }) {
  const query = event.query.toLowerCase();
  // Filter from the master list, EXCLUDING those already selected
  this.filteredCollaborators = this.collaborators.filter(collaborator => {
    const notSelected = !this.selectedCollaborators.some(sel => sel.id === collaborator.id);
    const nameMatches = collaborator.name.toLowerCase().includes(query);
    return notSelected && nameMatches;
  });
}

// *** NEW: Method to remove a collaborator from the selected list ***
removeCollaborator(collaboratorToRemove: Collaborator): void {
    this.selectedCollaborators = this.selectedCollaborators.filter(
        collaborator => collaborator.id !== collaboratorToRemove.id
    );
  }
  onDialogHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit(); // Emit cancel when dialog is closed via 'x' or escape key
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  submitRotation(): void {
    if (!this.isFormValid()) {
      // Optional: Show a warning message (e.g., using p-toast)
      console.warn('Form is invalid.');
      return;
    }

    const output: RotationOutput = {
      projectId: this.selectedProject?.id ?? null,
      collaboratorIds: this.selectedCollaborators.map(c => c.id),
      mode: this.rotationMode,
    };

    if (this.rotationMode === 'automatic') {
      output.startDate = this.startDate;
      output.endDate = this.endDate;
      output.rotationInterval = this.rotationInterval;
      output.rotationPeriod = this.rotationPeriod;
    } else {
      output.customDates = this.customDates;
    }

    this.createRotation.emit(output);
    this.visible = false; // Close dialog on successful submission
    this.visibleChange.emit(false);
    // Consider resetting the form fields here if needed for the next opening
    // this.resetForm();
  }

  isFormValid(): boolean {
    if (!this.selectedProject || this.selectedCollaborators.length === 0) {
      return false;
    }

    if (this.rotationMode === 'automatic') {
      return !!this.startDate && !!this.endDate && this.rotationInterval > 0 && this.rotationPeriod > 0 && this.rotationInterval <= this.rotationPeriod;
      // Add date range validation if needed (startDate <= endDate)
    } else { // custom mode
      return !!this.customDates && this.customDates.length > 0;
    }
  }

  // Optional: Reset form fields
  // resetForm(): void {
  //   this.selectedProject = null;
  //   this.rotationMode = 'automatic';
  //   this.startDate = new Date();
  //   const today = new Date();
  //   this.endDate = new Date(today.getFullYear(), 11, 31);
  //   this.rotationInterval = 1;
  //   this.rotationPeriod = 6;
  //   this.customDates = null;
  //   this.selectedCollaborators = [];
  // }

}
