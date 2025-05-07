
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2, AfterViewInit, output, input, signal, effect, computed, Signal } from '@angular/core';
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
import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format,  isBefore, isEqual, startOfMonth, startOfWeek } from 'date-fns';
import { CustomDate, Rotation } from '../../../models/rotation.model';
import { RotationService } from '../../../services/rotation.service';
import { RotationStatus } from '../../../enums/rotation-status.enum';


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
  selectedDates?: Date[] | null;
}
@Component({
  selector: 'app-rotation',
  standalone: true,
  templateUrl: './rotation.component.html',
  styleUrl: './rotation.component.css',
  imports: [CommonModule, FormsModule,
    // PrimeNG Modules
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    ButtonModule,
    AutoCompleteModule,
    DatePickerModule,
    InputTextModule
  ],
  providers: [
    RotationService
  ]
})
export class RotationComponent implements OnInit {

  // --- Inputs ---
  @Input() visible: boolean = true;
  projects: Project[] = []; // Provide actual projects via Input
  collaborators: Collaborator[] = []; // Provide actual collaborators via Input
  isLoadingProjects: boolean = false
  isLoadingCollaborators: boolean = false;

  // --- Outputs ---

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() createRotation = new EventEmitter<RotationOutput>();
  @Output() cancel = new EventEmitter<void>();
  // --- Internal State ---
  selectedProject: Project | null = null;
  rotationMode: 'automatic' | 'custom' = 'automatic'; // Default mode
  startDate = signal<Date>(new Date()); // Default start date
  endDate = signal<Date>(addMonths(new Date(), 2));
  rotationInterval = signal<number>(1);
  rotationPeriod = signal<number>(3);
  
  autoDates=signal< Date[]>( []);
  selectedDates:Date[]=[];
  customDates = signal<CustomDate[]>([]);
  selectedCollaborators: Collaborator[] = [];
  dateFormat = 'yyyy-MM-dd';
  // Suggestions array for p-autoComplete
  filteredCollaborators: Collaborator[] = [];
  selectedWeeks = new Set<string>(); // To keep track of selected weeks (use string key: "year-week")
  lastClickedDate: Date | null = null;
  rotation =signal<Rotation>({
    
      startDate: format(this.startDate(), this.dateFormat),
      endDate: format(this.endDate(), this.dateFormat),
      cycle: this.rotationPeriod(),
      shift: this.rotationInterval(),
      customDates:[]
     
  })




  constructor(private rotationService: RotationService) {

    effect(()=>{

     this.rotation.set({
      startDate: format(this.startDate(), this.dateFormat),
      endDate: format(this.endDate(), this.dateFormat),
      cycle: this.rotationPeriod(),
      shift: this.rotationInterval(),
      customDates: this.customDates()
     })
    
    })
  

  }




  ngOnInit(): void {

    this.loadRotationInitialData();


    this.loadAutoRotationDates()
   

  }

  loadAutoRotationDates() {
    const dates = this.getStartOfWeeksInMonth()
   this.autoDates.set([])
    const currRotation:Rotation= 
      {
        startDate:format(this.startDate(), this.dateFormat),
        endDate: format(this.endDate(), this.dateFormat),
        cycle:this.rotationPeriod() ,
        shift:this.rotationInterval() ,
      }
     

    dates.forEach(date => {
      console.log(date+" "+this.rotationService.getDateRotationStatus(currRotation, date))

      if(this.rotationService.getDateRotationStatus(currRotation, date)== RotationStatus.OnSite) {
          const start = startOfWeek(Date.parse(date));
          const end = endOfWeek(Date.parse(date));
        
          this.autoDates.update((currDates)=>[...currDates, ...eachDayOfInterval({ start, end })]);
        }
      
    })
    this.selectedDates=this.autoDates()

    console.log(this.selectedDates)

  }

  getStartOfWeeksInMonth( ): string[] {
    const result: string[] = [];
    let current = startOfWeek(startOfMonth(this.startDate()), { weekStartsOn:0 });
    const end = endOfMonth(this.endDate());

    while (isBefore(current, end) || current.getTime() === end.getTime()) {
      result.push(format(current, this.dateFormat));
      current = addWeeks(current, 1);
    }

    return result;
  }
  loadRotationInitialData() {
    // Mock data - Replace with actual service calls
    this.isLoadingProjects = true;
    this.isLoadingCollaborators = true;
    setTimeout(() => {
      this.projects = [
        { id: 1, name: 'Mobile App Refresh' },
        { id: 2, name: 'Web Platform Upgrade' },
        { id: 3, name: 'Data Analytics Pipeline' },
        { id: 4, name: 'Backend API Refactor' },
      ];
      this.isLoadingProjects = false;
    }, 500);
    setTimeout(() => {
      this.collaborators = [
        { id: 101, name: 'John Smith', avatar: 'https://via.placeholder.com/30/007bff/ffffff?text=JS' },
        { id: 102, name: 'Emma Wilson', avatar: 'https://via.placeholder.com/30/dc3545/ffffff?text=EW' },
        { id: 103, name: 'Youssef Amrani' },
        { id: 104, name: 'Amira Benali' },
        { id: 105, name: 'Karim Tazi' },
        { id: 106, name: 'John Smith', avatar: 'https://via.placeholder.com/30/007bff/ffffff?text=JS' },
        { id: 107, name: 'Emma Wilson', avatar: 'https://via.placeholder.com/30/dc3545/ffffff?text=EW' },
        { id: 108, name: 'Youssef Amrani' },
        { id: 109, name: 'Amira Benali' },
        { id: 110, name: 'Karim Tazi' },
      ];
      this.isLoadingCollaborators = false;
    }, 700);


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
      output.startDate = this.startDate();
      output.endDate = this.endDate();
      output.rotationInterval = this.rotationInterval();
      output.rotationPeriod = this.rotationPeriod();
    } else {
   //   output.selectedDates = this.selectedDates;
    }


    this.visible = false; // Close dialog on successful submission

    // Consider resetting the form fields here if needed for the next opening
    // this.resetForm();
  }
  // handle selecting a week 
  onSelectDate(clickedDate: Date): void {
    const startOfSelectedWeek = startOfWeek(clickedDate);
    const endOfSelectedWeek = endOfWeek(clickedDate);
    const formattedWeekStartDate = format(startOfSelectedWeek, this.dateFormat);

    const currentRotation = this.rotation();
    if (!currentRotation) {
      console.warn("onDateClicked: No current rotation found. Aborting.");
      return;
    }

    // Determine the "default" status of the week before any custom overrides
    const defaultStatusForWeek = this.rotationService.getDateRotationStatus(
      {
        startDate: currentRotation.startDate,
        endDate: currentRotation.endDate,
        cycle: currentRotation.cycle,
        shift: currentRotation.shift,
      },
      formattedWeekStartDate
    );

    const existingCustomDates = currentRotation.customDates ? [...currentRotation.customDates] : [];
    let newCustomDates = existingCustomDates; // Start with a copy

    const customDateIndex = this.getCustomDateIndx(startOfSelectedWeek); // Use the already calculated startOfSelectedWeek

    let customDatesChanged = false;

    if (defaultStatusForWeek !== RotationStatus.OnSite) {
      // Case 1: Default is Remote. Clicking should make it OnSite.
      if (customDateIndex !== -1) {
        // Custom date already exists, update its status
        if (newCustomDates[customDateIndex].rotationStatus !== RotationStatus.OnSite) {
          newCustomDates[customDateIndex] = {
            ...newCustomDates[customDateIndex],
            rotationStatus: RotationStatus.OnSite,
          };
          customDatesChanged = true;
        }
      } else {
        // No custom date, add a new one as OnSite
        newCustomDates.push({
          date: formattedWeekStartDate,
          rotationStatus: RotationStatus.OnSite,
        });
        customDatesChanged = true;
      }
    } else {
      // Case 2: Default is NOT Remote (e.g., OnSite).
      // Clicking should remove any custom override for this date, reverting it to its default.
      if (customDateIndex !== -1) {
        // Custom date exists, remove it
        newCustomDates.splice(customDateIndex, 1);
        customDatesChanged = true;
      }
      // If no custom date exists, there's nothing to remove, and the state effectively remains default.
    }

    if (customDatesChanged) {
      this.rotation.set({
        ...currentRotation,
        customDates: newCustomDates,
      });
      console.log('Rotation updated:', this.rotation());
    }

    // Update autoDates: Add unique days from the selected week
    // This assumes autoDates accumulates all days from clicked weeks.
    // If it should only be the *current* selected week, the logic would be simpler:
    // this.autoDates.set(eachDayOfInterval({ start: startOfSelectedWeek, end: endOfSelectedWeek }));
    this.autoDates.update(currentSelectedDays => {
      const daysInClickedWeek = eachDayOfInterval({ start: startOfSelectedWeek, end: endOfSelectedWeek });
      const updatedDays = [...currentSelectedDays]; // Start with existing days

      daysInClickedWeek.forEach(dayToAdd => {
        // Add only if not already present to avoid duplicates
        if (!updatedDays.some(existingDay => isEqual(existingDay, dayToAdd))) {
          updatedDays.push(dayToAdd);
        }
      });
      return updatedDays.sort((a,b) => a.getTime() - b.getTime()); 
    });

    this.selectedDates = this.autoDates(); // Update if this property is used for binding

    console.log('Date Clicked. AutoDates:', this.autoDates());
    // The console.log for rotation is better placed after the .set if customDatesChanged
  }

  onDeSelectDate(newlySelectedDates: Date[]): void {
    const currentAutoDates = this.autoDates();

    if (newlySelectedDates.length < currentAutoDates.length) {
      // A date/week was deselected. Find which week.
      let deselectedWeekStart: Date | null = null;

      // Iterate through weeks represented in currentAutoDates

      for (const autoDate of currentAutoDates) {
        if (!newlySelectedDates.includes(autoDate)) {
          // This week was in autoDates but not in newlySelectedDates
          // Re-parse to Date object (ensure timezone consistency if it matters)
          deselectedWeekStart = startOfWeek(autoDate); // Add time to avoid timezone issues on parse
          break;
        }
      }

      if (!deselectedWeekStart) {
        // Fallback: If the Set logic didn't pinpoint, use the original finding method but with isEqual
        // This might happen if autoDates has individual days and selection is also per day,
        // and the Set logic above simplifies to weeks.
        // For more robust week-based deselection finding:
        for (const autoDate of currentAutoDates) {
            const weekOfAutoDate = startOfWeek(autoDate);
            const isWeekStillSelected = newlySelectedDates.some(selDate =>
              isEqual(startOfWeek(selDate), weekOfAutoDate)
            );
            if (!isWeekStillSelected) {
              deselectedWeekStart = weekOfAutoDate;
              break;
            }
          }
      }


      if (deselectedWeekStart) {
        const formattedDeselectedWeekDate = format(deselectedWeekStart, this.dateFormat);
        const currentRotation = this.rotation();

        if (!currentRotation) {
          console.warn("onDatesChange: No current rotation found. Aborting update.");
          return;
        }

        // Get default status ONCE
        const defaultStatusForWeek = this.rotationService.getDateRotationStatus(
          {
            startDate: currentRotation.startDate,
            endDate: currentRotation.endDate,
            cycle: currentRotation.cycle,
            shift: currentRotation.shift,
          },
          formattedDeselectedWeekDate
        );
        console.log('Default status for deselected week:', defaultStatusForWeek);

        let customDatesChanged = false;

        // Using signal's update for immutable changes
        this.rotation.update(currRot => {
          if (!currRot) return currRot; // Should be caught by earlier check, but good practice

          const customDateIndex = (currRot.customDates || []).findIndex(cd => cd.date === formattedDeselectedWeekDate);
          let newCustomDates = currRot.customDates ? [...currRot.customDates] : [];

          if (defaultStatusForWeek !== RotationStatus.Remote) {
            // Default is OnSite. Deselecting means making it Remote (custom).
            if (customDateIndex !== -1) {
              if (newCustomDates[customDateIndex].rotationStatus !== RotationStatus.Remote) {
                newCustomDates[customDateIndex] = {
                  ...newCustomDates[customDateIndex],
                  rotationStatus: RotationStatus.Remote,
                };
                customDatesChanged = true;
              }
            } else {
              newCustomDates.push({
                date: formattedDeselectedWeekDate,
                rotationStatus: RotationStatus.Remote,
              });
              customDatesChanged = true;
            }
          } else { // Default is Remote (or anything else)
            // Deselecting means removing any custom override.
            if (customDateIndex !== -1) {
              newCustomDates.splice(customDateIndex, 1);
              customDatesChanged = true;
            }
          }

          if (customDatesChanged) {
            return { ...currRot, customDates: newCustomDates };
          }
          return currRot; // No actual change to customDates
        });

        if (customDatesChanged) {
            console.log('Rotation updated due to deselection:', this.rotation());
        }

        // Update autoDates by removing all dates from the deselected week
        const weekToRemove = deselectedWeekStart; // For clarity
        this.autoDates.update(currentDays =>
          currentDays.filter(day => !isEqual(startOfWeek(day), weekToRemove))
        );

        this.selectedDates = this.autoDates(); // Update the mirror property

        console.log('After deselection - AutoDates:', this.autoDates());
      } else {
        console.warn("onDatesChange: Deselection detected, but couldn't identify the specific deselected week.");
      }
    } else if (newlySelectedDates.length > currentAutoDates.length) {
      // Dates were added. This function's current structure is primarily for deselection.
      // Addition logic would typically be in `onDateClicked` or a similar handler.
      console.log("onDatesChange: Dates were added. This function primarily handles deselections.");
    }
    // If lengths are equal, no change in count of selected days.
    // Could add logic here if specific date *swaps* need handling without count change.
  }



  getCustomDateIndx(date:Date):number{
    const weekDay = format(date, this.dateFormat);
    const customDates = this.rotation()?.customDates;
  
    return customDates ? customDates.findIndex(cd => cd.date === weekDay) : -1;
  }
  isFormValid(): boolean {
    if (!this.selectedProject || this.selectedCollaborators.length === 0) {
      return false;
    }

    if (this.rotationMode === 'automatic') {
      return !!this.startDate && !!this.endDate && this.rotationInterval() > 0 && this.rotationPeriod() > 0 && this.rotationInterval <= this.rotationPeriod;
      // Add date range validation if needed (startDate <= endDate)
    } else { // custom mode
      return !!this.selectedDates && this.selectedDates.length > 0;
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
  //   this.selectedDates = null;
  //   this.selectedCollaborators = [];
  // }
  onViewChanged(): void {

  }

}
