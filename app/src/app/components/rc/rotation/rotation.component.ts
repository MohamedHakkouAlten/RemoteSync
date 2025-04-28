
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
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
  private weekClickListeners: Function[] = []; // To store listener cleanup functions
  selectedWeeks = new Set<string>(); // To keep track of selected weeks (use string key: "year-week")

  constructor(private renderer: Renderer2) { }

  
  private _datePickerElementRef: ElementRef | undefined;
  private listenersAttached = false; // Flag to avoid attaching multiple times unnecessarily

  @ViewChild('customDatesPicker', { read: ElementRef }) set datePickerElementRef(elRef: ElementRef | undefined) {
    // This setter is called when the element reference is resolved or changes.
    console.log('DatePicker ElementRef Setter Called. Ref:', elRef); // Debug log

    if (elRef && !this.listenersAttached) {
      // Only setup if we get a valid reference AND haven't set up listeners yet
      console.log('DatePicker ElementRef is valid, proceeding with setup.');
      this._datePickerElementRef = elRef;
      // Use setTimeout here as well, to ensure internal p-datepicker rendering is complete
      // even after the element itself is available in the DOM.
      setTimeout(() => {
        if (this._datePickerElementRef) { // Double-check ref inside timeout
             console.log('Running setup from setter timeout.');
             this.setupWeekClickListeners();
             this.reapplySelectedStyles(); // Apply styles for any pre-selected weeks
             this.listenersAttached = true; // Mark listeners as attached
        } else {
             console.warn('DatePicker ElementRef became undefined before setter timeout completed.');
        }
      }, 0);
    } else if (!elRef) {
       // Element was removed (e.g., *ngIf became false)
       console.log('DatePicker ElementRef became undefined (removed from DOM?). Clearing listeners.');
       this.clearWeekClickListeners();
       this._datePickerElementRef = undefined;
       this.listenersAttached = false; // Reset flag
    } else if (elRef && this.listenersAttached) {
        // Element ref is already set and listeners were attached.
        // This might happen on certain change detection cycles. Usually no action needed.
        // console.log('DatePicker ElementRef setter called, but listeners already attached.');
    }
  }

  // Getter is optional, used internally
  get datePickerElementRef(): ElementRef | undefined {
    return this._datePickerElementRef;
  }
  ngOnInit(): void {
 
  
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
  onViewChanged(): void {
    // Use setTimeout to allow the DOM to update before querying
    setTimeout(() => {
       if (this.datePickerElementRef) {
          this.setupWeekClickListeners();
          this.reapplySelectedStyles(); // Re-apply styles after view change
       }
    }, 0);
  }

  private clearWeekClickListeners(): void {
    this.weekClickListeners.forEach(removeListener => removeListener());
    this.weekClickListeners = [];
  }

  private setupWeekClickListeners(): void {
    this.clearWeekClickListeners();

    // Check moved inside setup function for safety, called from multiple places
    if (!this.datePickerElementRef) {
       console.warn('DatePicker ElementRef not available in setupWeekClickListeners');
       return;
    }

    const nativeEl = this.datePickerElementRef.nativeElement;
    // Robust query: ensure we are inside the datepicker table body
    const weekNumberCells = nativeEl.querySelectorAll('.p-datepicker-calendar-container .p-datepicker-calendar tbody td.p-datepicker-weeknumber');

    if (weekNumberCells.length === 0) {
        // This might happen briefly during transitions, log if it persists
        // console.warn('No week number cells found during setup.');
    }

    weekNumberCells.forEach((cell: HTMLElement) => {
      this.renderer.setAttribute(cell, 'tabindex', '0');
      this.renderer.setAttribute(cell, 'role', 'button');
      this.renderer.setStyle(cell, 'cursor', 'pointer'); // Ensure cursor style

      const removeClickListener = this.renderer.listen(cell, 'click', (event) => {
        this.handleWeekClick(event, cell);
      });
      this.weekClickListeners.push(removeClickListener);

       const removeKeyListener = this.renderer.listen(cell, 'keydown', (event: KeyboardEvent) => {
         if (event.key === 'Enter' || event.key === ' ') {
           event.preventDefault();
           this.handleWeekClick(event, cell);
         }
       });
      this.weekClickListeners.push(removeKeyListener);
    });
  }

  private handleWeekClick(event: Event, cell: HTMLElement): void {
    const weekNumberText = cell.textContent?.trim();
    const year = this.findYearForWeekCell(cell);

    if (weekNumberText && year !== null) {
      const weekNumber = parseInt(weekNumberText, 10);
      const weekKey = `${year}-${weekNumber}`;

      if (this.selectedWeeks.has(weekKey)) {
        this.selectedWeeks.delete(weekKey);
        this.renderer.removeClass(cell, 'selected-week');
        this.renderer.removeAttribute(cell, 'aria-pressed');
      } else {
        // Optional: Clear previous selection if only one week should be selected
        // this.clearAllWeekSelections();
        this.selectedWeeks.add(weekKey);
        this.renderer.addClass(cell, 'selected-week');
        this.renderer.setAttribute(cell, 'aria-pressed', 'true');
      }
      console.log('Selected Weeks:', Array.from(this.selectedWeeks));
    }
  }

  private findYearForWeekCell(weekCell: HTMLElement): number | null {
     let currentElement: HTMLElement | null = weekCell;
     // Go up until we find the table container for the specific month's calendar
     while (currentElement && !currentElement.classList.contains('p-datepicker-calendar-container')) {
         currentElement = currentElement.parentElement;
     }

     if (currentElement) {
         const monthElement = currentElement.querySelector('.p-datepicker-month');
         const yearElement = currentElement.querySelector('.p-datepicker-year');
         if (yearElement && yearElement.textContent) {
             const year = parseInt(yearElement.textContent, 10);
             const weekNumber = parseInt(weekCell.textContent || '0', 10);
             const monthText = monthElement?.textContent?.toLowerCase() || '';

             // Handle ISO week date edge cases (Week 1 in Dec, Week 52/53 in Jan)
             if (weekNumber >= 52 && monthText.includes('jan')) {
                 return year - 1; // Week belongs to the previous year
             }
             if (weekNumber === 1 && monthText.includes('dec')) {
                 return year + 1; // Week belongs to the next year
             }
             return year; // Default case
         }
     }
    console.warn("Could not determine year for week cell reliably.");
    const fallbackYearEl = this.datePickerElementRef?.nativeElement?.querySelector('.p-datepicker-year');
    return fallbackYearEl ? parseInt(fallbackYearEl.textContent || '0', 10) : new Date().getFullYear();
  }

  private reapplySelectedStyles(): void {
      if (!this.datePickerElementRef) return;
      const nativeEl = this.datePickerElementRef.nativeElement;
      const weekNumberCells = nativeEl.querySelectorAll('.p-datepicker-calendar-container .p-datepicker-calendar tbody td.p-datepicker-weeknumber');

      weekNumberCells.forEach((cell: HTMLElement) => {
          const weekNumberText = cell.textContent?.trim();
          const year = this.findYearForWeekCell(cell); // Use the same logic to find year
          if (weekNumberText && year !== null) {
              const weekNumber = parseInt(weekNumberText, 10);
              const weekKey = `${year}-${weekNumber}`;
              if (this.selectedWeeks.has(weekKey)) {
                  this.renderer.addClass(cell, 'selected-week');
                  this.renderer.setAttribute(cell, 'aria-pressed', 'true');
              } else {
                  // Ensure deselected state is clean
                  this.renderer.removeClass(cell, 'selected-week');
                  this.renderer.removeAttribute(cell, 'aria-pressed');
              }
          } else {
               // Ensure clean state if year/week couldn't be determined
               this.renderer.removeClass(cell, 'selected-week');
               this.renderer.removeAttribute(cell, 'aria-pressed');
          }
      });
  }

}
