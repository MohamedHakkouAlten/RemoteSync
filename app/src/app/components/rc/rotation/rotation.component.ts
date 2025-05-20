
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
import {  ProjectService } from '../../../services/project.service';
import { ListItem } from '../calendar/calendar.component';
import {  UserService } from '../../../services/auth/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


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
  associates: string[]
  projectId: string | undefined;
  startDate: string; // Expect 'YYYY-MM-DD' 
  endDate: string;   // Expect 'YYYY-MM-DD'
  shift: number;     // Number of weeks 'OnSite' (should be > 0 for cycle logic)
  cycle?: number;     // Total length of the cycle in weeks (should be >= shift)
  customDates?: CustomDate[]|null; // Make optional if not always present
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
    InputTextModule,
     ToastModule
  ],
  providers: [
    RotationService,
    MessageService,
    TranslateService
  ]
})
export class RotationComponent implements OnInit {

  // --- Inputs ---
  @Input() visible: boolean = true;
  projects=signal<ListItem[]>([]); // Provide actual projects via Input
  collaborators=signal<ListItem[]>( []); // Provide actual collaborators via Input
  isLoadingProjects: boolean = false
  isLoadingCollaborators: boolean = false;

  // --- Outputs ---

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() createRotation = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  // --- Internal State ---
  selectedProject=signal< ListItem | null> (null);
  rotationMode: 'automatic' | 'custom' = 'automatic'; // Default mode
  startDate = signal<Date>(new Date()); // Default start date
  endDate = signal<Date>(addMonths(new Date(), 2));
  rotationInterval = signal<number>(1);
  rotationPeriod = signal<number>(3);
  
  autoDates=signal< Date[]>( []);
  selectedDates:Date[]=[];
  customDates = signal<CustomDate[]|null>(null);
  selectedCollaborators=signal<ListItem[]>( []); 
  dateFormat = 'yyyy-MM-dd';
  // Suggestions array for p-autoComplete
  filteredCollaborators: ListItem[] = [];
  selectedWeeks = new Set<string>(); // To keep track of selected weeks (use string key: "year-week")
  lastClickedDate: Date | null = null;
  rotation :Signal<RotationOutput> =computed(()=>({
    associates:  this.selectedCollaborators().map((collaborator)=>collaborator.id),
      startDate: format(startOfWeek(this.startDate(),{weekStartsOn:1}), this.dateFormat),
      endDate: format(startOfWeek(this.endDate(),{weekStartsOn:1}), this.dateFormat),
      cycle: this.rotationPeriod(),
      shift: this.rotationInterval(),
      customDates: this.customDates(),
      projectId: this.selectedProject()?.id
  }))




  constructor(private rotationService: RotationService,
         private projectService :ProjectService,
         private userService :UserService,
         private messageService: MessageService,
         private translate : TranslateService
  ) {


  

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
    this.isLoadingProjects = false;
    this.isLoadingCollaborators = false;
    this.projectService.getProjectList().subscribe((projects)=>
      this.projects.set(projects.map(project=>({id:project.projectId,name:project.label}))))
   console.log(this.projects())
   this.userService.getUsersList().subscribe((users)=>this.collaborators.set(users.map(user=>({id:user.userId,name:user.name}))))
   


  }




  // --- Methods ---
  // *** NEW: Method for p-autoComplete suggestions ***
  filterCollaborators(event: { originalEvent: Event, query: string }) {
    const query = event.query.toLowerCase();
    // Filter from the master list, EXCLUDING those already selected
    this.filteredCollaborators = this.collaborators().filter(collaborator => {
      const notSelected = !this.selectedCollaborators().some(sel => sel.id === collaborator.id);
      const nameMatches = collaborator.name.toLowerCase().includes(query);
      return notSelected && nameMatches;
    });
  }

  // *** NEW: Method to remove a collaborator from the selected list ***
  removeCollaborator(collaboratorToRemove: ListItem): void {
    this.selectedCollaborators.set(this.selectedCollaborators().filter(
      collaborator => collaborator.id !== collaboratorToRemove.id
    ));
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
    console.log(this.rotation())
    if (this.rotation().associates.length<=0) {
      // Optional: Show a warning message (e.g., using p-toast)
      this.messageService.add({
        severity:'error',
        summary: this.translate.instant('rotation.MissingCollaborators'),
        life: 5000
      })
 
    }else {
      console.log(this.rotation())
      this.rotationService.addUsersRotation(this.rotation()).subscribe({
        next:(isAdded)=>
      {
        console.log(isAdded)
        if(isAdded){
          this.visible=false
          this.createRotation.emit(true)}
      },
      error :(err)=>      this.messageService.add({
        severity:'error',
        summary: err.message,
        life: 5000
      })
      })
    }

  //   const output: RotationOutput = {
  //     projectId: this.selectedProject?.projectId ?? null,
  //     collaboratorIds: [4],
  //     mode: this.rotationMode,
  //   };

  //   if (this.rotationMode === 'automatic') {
  //     output.startDate = this.startDate();
  //     output.endDate = this.endDate();
  //     output.rotationInterval = this.rotationInterval();
  //     output.rotationPeriod = this.rotationPeriod();
  //   } else {
  //  //   output.selectedDates = this.selectedDates;
  //   }


    // Close dialog on successful submission

    // Consider resetting the form fields here if needed for the next opening
    // this.resetForm();
  }
  // handle selecting a week 
  onSelectDate(clickedDate: Date): void {
    const startOfSelectedWeek = startOfWeek(clickedDate,{weekStartsOn:1});
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
      this.customDates.set(
        newCustomDates,
      );
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
          deselectedWeekStart = startOfWeek(autoDate,{weekStartsOn:1}); // Add time to avoid timezone issues on parse
          break;
        }
      }

      if (!deselectedWeekStart) {
        // Fallback: If the Set logic didn't pinpoint, use the original finding method but with isEqual
        // This might happen if autoDates has individual days and selection is also per day,
        // and the Set logic above simplifies to weeks.
        // For more robust week-based deselection finding:
        for (const autoDate of currentAutoDates) {
            const weekOfAutoDate = startOfWeek(autoDate,{weekStartsOn:1});
            const isWeekStillSelected = newlySelectedDates.some(selDate =>
              isEqual(startOfWeek(selDate,{weekStartsOn:1}), weekOfAutoDate)
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
       
  

          const customDateIndex = (currentRotation.customDates || []).findIndex(cd => cd.date === formattedDeselectedWeekDate);
          let newCustomDates = currentRotation.customDates ? [...currentRotation.customDates] : [];

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
            this.customDates.set(
              newCustomDates,
            );
          }
      
        

        if (customDatesChanged) {
            console.log('Rotation updated due to deselection:', this.rotation());
        }

        // Update autoDates by removing all dates from the deselected week
        const weekToRemove = deselectedWeekStart; // For clarity
        this.autoDates.update(currentDays =>
          currentDays.filter(day => !isEqual(startOfWeek(day,{weekStartsOn:1}), weekToRemove))
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
