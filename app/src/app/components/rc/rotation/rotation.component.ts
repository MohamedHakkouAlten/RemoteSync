import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { addDays, addMonths, format, getDay, getMonth, getYear, isAfter, isBefore, isSameDay, isSameMonth, startOfMonth, endOfMonth, getWeek, getDate, differenceInDays, addWeeks, startOfWeek } from 'date-fns';
import { RcService } from '../../../services/rc.service';
import { ProjectDropDownDTO } from '../../../dto/rc/project-dropdown.dto';
import { RcAssociateDTO } from '../../../dto/rc/rc-associate.dto';
import { RcAssignRotationUser } from '../../../dto/rc/rc-assign-rotation-user.dto';
import { CustomDate } from '../../../dto/rc/custom-date.dto';
import { RotationStatus } from '../../../dto/rc/rotation-status.enum';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // Often needed by dropdown/multiselect filtering
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  status: 'none' | 'onsite' | 'remote';
  isModified?: boolean; // Track if this day was manually modified
}

interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}
export interface ListItem {
  id: string,
  name: string
}

@Component({
  selector: 'app-rotation',
  standalone: true,
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.css'],
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
    TranslateModule,
    InputTextModule,
    ToastModule,
    SelectButtonModule
  ],
  providers: [DatePipe, LanguageService,

       TranslateService]
})

export class RotationComponent implements OnInit {
  rotationForm: FormGroup;
  private previousSelectedDates: Date[] = [];
  autoDates: Date[] = []
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<boolean>();
@Output() rotationCreated = new EventEmitter<boolean>();
  rotationType: 'automatic' | 'custom' = 'automatic';
  searchCollaboratorSubject$ = new Subject<string>()

stateOptions: any[] = [{ label: 'day', value: 'day' },{ label: 'week', value: 'week' }];

  selectionType: string = 'day';
  startDateObj: Date = new Date();
  endDateObj: Date = new Date();

  currentMonth: Date = new Date();
  calendarWeeks: CalendarWeek[] = [];
  nextMonthCalendarWeeks: CalendarWeek[] = [];
  weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  currentYear: number = 0;
  currentMonthName: string = '';
  nextMonthName: string = '';
  nextMonthYear: number = 0;
  calendarDate: Date = new Date();
  customDates: CustomDate[] = []

  private dayStatuses: Map<string, 'none' | 'onsite' | 'remote'> = new Map();
  private modifiedDates: Set<string> = new Set(); // Track only manually modified dates

  collaboratorSearch: string = '';
  selectedDates: Date[] = [];
  selectedCollaborators: ListItem[] = [];
  filteredCollaborators: ListItem[] = [];
  showCollaboratorDropdown: boolean = false;
  dateFormat = 'yyyy-MM-dd';
  selectedProject: ListItem | null = null;
  startDate = signal<Date>(new Date())
  endDate = signal<Date>(addMonths(new Date(), 1))
  // Rotation Pattern:
  // Every X weeks (cycleLengthWeeks), Y weeks (remoteWeeksPerCycle) are remote
  weeksValue: number = 1;     // remoteWeeksPerCycle: Number of remote weeks in the cycle
  periodValue: number = 4;    // cycleLengthWeeks: Total weeks in a rotation cycle (typically 4 weeks per month)

  projects: ListItem[] = [];
  collaborators: RcAssociateDTO[] = [];
  loading: boolean = false;


  constructor(private datePipe: DatePipe, private rcService: RcService, private fb: FormBuilder) {
    this.rotationForm = this.fb.group({
      project: [''],
      startDate: [''],
      endDate: [''],
      rotationType: ['automatic'],
      weeksValue: [1],
      periodValue: [3]
    });
  }

  ngOnInit() {
    this.setupDebouncing()
    this.initializeCalendar()
    const today = new Date();
    this.startDateObj = today;
    // this.startDate = this.formatDateForInput(today);

    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 2);
    this.endDateObj = endDate;
    //this.endDate = this.formatDateForInput(endDate);

    this.currentMonth = new Date(this.startDateObj);
    this.calendarDate = new Date(this.startDateObj);

    this.loadProjects();
    this.loadAssociates();


  }











  loadProjects() {
    this.loading = true;
    this.rcService.getRcProjects().subscribe(
      (response) => {

        this.projects = response.data!.map(p => { return { id: p.projectId, name: p.label } }) || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    );
  }


  onSelectionChange(newlySelectedDates: Date[]): void {
    const currentSelection = newlySelectedDates || [];

    // --- 1. Identify Deselected Dates (from previous selection) ---
    let deselectedDates = this.previousSelectedDates.filter(prevDate =>
      !currentSelection.some(currDate => currDate.getTime() === prevDate.getTime())
    );

    // --- 2. Identify Newly Selected Dates (from previous selection) ---
    let newlyAddedDates = currentSelection.filter(currDate =>
      !this.previousSelectedDates.some(prevDate => prevDate.getTime() === currDate.getTime())
    );
     console.log(deselectedDates)

     if(deselectedDates.length>0 && this.selectionType=='week') {
       
        const weekStart=startOfWeek(deselectedDates[0])
        deselectedDates=[]
        for(let i=0;i<7;i++) deselectedDates.push(addDays(weekStart,i))
      }
    console.log(deselectedDates)
    // --- Handle Deselected Dates ---
    deselectedDates.forEach(deselectedDate => {
    if(this.selectionType=='week')  this.selectedDates=this.selectedDates.filter((sd)=>sd.getTime()!==deselectedDate.getTime())
      const dateKey = format(deselectedDate, this.dateFormat);
      const deselectedDateTime = deselectedDate.getTime();

      // Check if this date was automatically selected

      const wasAutoSelected = this.autoDates.some(autoDate => autoDate.getTime() === deselectedDateTime);
      // Check if this date currently exists in customDates (formatted string comparison)
      const existingCustomDateIdx = this.customDates.findIndex(cd => cd.date === dateKey);
    console.log(wasAutoSelected)

      if (wasAutoSelected ) {
        // Case: Auto-selected date was deselected by user (now effectively REMOTE)

        if (existingCustomDateIdx !== -1) {


          if( this.customDates[existingCustomDateIdx].rotationStatus ==RotationStatus.ONSITE)this.customDates = this.customDates.filter(cd => cd.date !== dateKey);
        } else {
          // This is a date that was auto-selected, and the user deselected it,

          this.customDates.push({ date: dateKey, rotationStatus: RotationStatus.REMOTE });
        }
      } else {
        // Case: Non-auto-selected date was deselected by user (now effectively REMOTE)

        if (existingCustomDateIdx !== -1) {
                    
          console.log(`Deselected ${dateKey}. Was NOT auto-selected. Removing from customDates (was a custom override).`);
          this.customDates = this.customDates.filter(cd => cd.date !== dateKey);
        }else {
          console.log("here 3")
          this.customDates.push({ date: dateKey, rotationStatus: RotationStatus.REMOTE });
        }
        // If it was not auto-selected and not in customDates, and user deselected, there's nothing to do.
      }
    });
      console.log(newlyAddedDates)
      if(newlyAddedDates.length>0 &&  this.selectionType=='week') {
        
        const weekStart=startOfWeek(newlyAddedDates[0])
        newlyAddedDates=[]
        for(let i=0;i<7;i++) newlyAddedDates.push(addDays(weekStart,i))
      }
    // --- Handle Newly Selected Dates ---
    console.log(newlyAddedDates)
    newlyAddedDates.forEach(newlyAddedDate => {
    if(this.selectionType=='week')  this.selectedDates.push(newlyAddedDate)
      const dateKey = format(newlyAddedDate, this.dateFormat);
      const newlyAddedDateTime = newlyAddedDate.getTime();

      // Check if this date was automatically selected
      const wasAutoSelected = this.autoDates.some(autoDate => autoDate.getTime() === newlyAddedDateTime);
      // Check if this date currently exists in customDates (formatted string comparison)
      const existingCustomDateIdx = this.customDates.findIndex(cd => cd.date === dateKey);



      if (wasAutoSelected) {
        // Case: Auto-selected date was selected by user (now effectively ONSITE)

        if (existingCustomDateIdx !== -1) {

       if( this.customDates[existingCustomDateIdx].rotationStatus ==RotationStatus.REMOTE)   this.customDates = this.customDates.filter(cd => cd.date !== dateKey);
        }
      } else {
        // Case: Non-auto-selected date was selected by user (now effectively ONSITE)

        if (existingCustomDateIdx === -1) {
          console.log(`Selected ${dateKey}. Was NOT auto-selected. Adding as ONSITE to customDates.`);
          this.customDates.push({ date: dateKey, rotationStatus: RotationStatus.ONSITE });
        } else {
          // If it was already in customDates (e.g., previously REMOTE and user re-selected), update its status

          this.customDates = this.customDates.map(cd =>
            cd.date === dateKey ? { ...cd, rotationStatus: RotationStatus.ONSITE } : cd
          );
        }
      }
    });


    this.previousSelectedDates = [...this.selectedDates];

    console.log('Final customDates state:', this.customDates);
  }



  initializeCalendar() {
    this.selectedDates = []
    this.customDates = []
    let weekStart = startOfWeek(this.startDate());
    console.log(weekStart, isBefore(weekStart, startOfWeek(this.endDate())), this.weeksValue)
    let counter = 1
    while (isBefore(weekStart, startOfWeek(this.endDate()))) {
      counter++


      weekStart = addWeeks(weekStart, this.weeksValue)
      for (let j = 0; j < this.periodValue - this.weeksValue; j++) {
        for (let i = 0; i < 7; i++) {
          const currectWeek = weekStart
          this.selectedDates.push(addDays(currectWeek, i))

        }
        weekStart = addWeeks(weekStart, 1)
      }

    }

    this.autoDates = [...this.selectedDates]
    this.previousSelectedDates = [...this.selectedDates]
  }

  loadAssociates() {
    this.loading = true;
    this.rcService.getRcAssociates().subscribe(
      (response) => {
        this.collaborators = response.data || [];
        // this.filteredCollaborators = response.data || []; 
        this.loading = false;
      },
      (error) => {
        console.error('Error loading associates:', error);
        this.loading = false;
      }
    );
  }



  closeModal() {
    this.showModal = false;
    this.modalClosed.emit(false);
  }

 


  filterCollaborators(event: { originalEvent: Event, query: string }) {
    const query = event.query
    if (!query) this.filteredCollaborators = this.collaborators.map(c => { return { id: c.userId, name: c.firstName + " " + c.lastName } })
    this.searchCollaboratorSubject$.next(query)

  }
  setupDebouncing() {
    this.searchCollaboratorSubject$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(searchLabel => {

        return this.rcService.getRcAssociates(searchLabel)
      })

    ).subscribe(res => this.filteredCollaborators = res.data?.map(c => { return { id: c.userId, name: c.firstName + " " + c.lastName } }) || [])
  }
  



  createRotation() {
    // Validate required fields
    if (!this.startDate || !this.endDate) {
      alert('Please select start and end dates');
      return;
    }

    if (this.selectedCollaborators.length === 0) {
      alert('Please select at least one collaborator');
      return;
    }

    // Extract just the IDs from the collaborators to avoid sending full objects
    const associateIds = this.selectedCollaborators.map(collaborator => collaborator.id);

    // Create the rotation request payload matching the backend DTO structure
    const rotationData: RcAssignRotationUser = {
      userId: '', // This is required by our interface but not used by the backend
      dates: [], // This is required by our interface but not used by the backend
      projectId: this.selectedProject?.id,
      // Send only the associate IDs in the associates field (matching backend's expected field name)
      associates: associateIds,
      // Additional properties used by the application
      startDate: this.formatDateKey(this.startDate()),
      endDate: this.formatDateKey(this.endDate()),
      remoteWeeksPerCycle: this.weeksValue,
      cycleLengthWeeks: this.periodValue,
      customDates: this.customDates
    };

    console.log('Sending rotation request:', rotationData);

    this.loading = true;
  
    this.rcService.createRotation(rotationData).subscribe(
      (response) => {
        console.log('Rotation created successfully:', response);
        this.loading = false;
        this.closeModal();
        this.rotationCreated.emit(true);
      },
      (error) => {
        console.error('Error creating rotation:', error);
        this.loading = false;
        this.rotationCreated.emit(false)
        }
      );
  }
  formatDateKey(date: Date): string {
    return format(date, this.dateFormat)
  }
}

