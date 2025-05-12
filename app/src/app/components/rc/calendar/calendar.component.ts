import { Component, computed, OnInit, signal } from '@angular/core';
// src/app/rotation-schedule/rotation-schedule.model.ts
import { startOfWeek, addWeeks, format, addDays, subWeeks } from 'date-fns';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ToggleState } from '../../shared/three-state-toggle/three-state-toggle.component';
import { RotationService } from '../../../services/rotation.service';
import { Rotation, UserRotation } from '../../../models/rotation.model';
import { RotationStatus } from '../../../enums/rotation-status.enum';
import { ClientService } from '../../../services/client.service';
import { ProjectListItem, ProjectService } from '../../../services/project.service';
import { FactoryService } from '../../../services/factory.service';
import { SubfactoryService } from '../../../services/subfactory.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';



export interface ViewMode {
  label: string;
  value: 'month' | 'week'; // Add more modes if needed
}
export interface ListItem {
  id:string,
  name : string
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})


export class CalendarComponent implements OnInit {

clearFilters() {
 this.selectedClient=null;
 this.selectedProject = null;
 this.selectedFactory = null;
 this.selectedSubFactory = null;


}

  // --- Configuration & State ---
  userRotations    = signal<UserRotation[]>([]);
  clients     =signal<ListItem[]>([])
  projects    =signal<ProjectListItem[]>([])
  factorys    =signal<ListItem[]>([])
  subFactorys =signal<ListItem[]>([])

  clientList=computed(()=>this.clients().map((client)=>client.name))
  projectList=computed(()=>this.projects().map((project)=>project.label))
  factoryList=computed(()=>this.factorys().map((factorys)=>factorys.name))
  subFactoryList=computed(()=>this.subFactorys().map((subFactory)=>subFactory.name))

  selectedClient  : string | null = null;
  selectedProject: string | null = null;
  selectedFactory: string | null = null;
  selectedSubFactory:string | null = null;


  activeFilter:string|number=0
  isDialogVisible:boolean=false
  //rotation 
  showRotationCreatedToast(isCreated:boolean){

if(isCreated){

   this.messageService.add({
          severity:'success',
          summary:this.translate.instant('rotation.created'),
          life:5000
          
        })
        this.loadRotation()
}
  }
  
  // Dates representing the start of each week/day shown

  numberOfWeeksToShow: number = 8; // How many weeks to display in 'month' (weekly) view
  currentStartDate = signal<Date>(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday

  searchText: string = ''

  viewModes: ViewMode[] = [
    { label: 'Month', value: 'month' }, // Represents the weekly view shown in the example
    { label: 'Week', value: 'week' } // Could add a daily view later
  ];
  selectedViewMode: ViewMode = this.viewModes[0]; // Default to 'month' (weekly view)

  

  searchClient(event: AutoCompleteCompleteEvent): void {
    const filtered = this.filterListItems(event.query, this.clients());

    this.clients.set([...filtered]); // Update the suggestions signal

  }
  searchProject(event: AutoCompleteCompleteEvent): void {
    // const filtered = this.filterListItems(event.query, this.projects());
     this.projects.set([...this.projects()]); // Update the suggestions signal

  }
  searchFactory(event: AutoCompleteCompleteEvent): void {
    const filtered = this.filterListItems(event.query, this.factorys());
    this.factorys.set([...filtered]); // Update the suggestions signal

  }
  searchSubFactory(event: AutoCompleteCompleteEvent): void {
    const filtered = this.filterListItems(event.query, this.subFactorys());

    this.subFactorys.set([...filtered]); // Update the suggestions signal

  }
  private filterListItems(query: string, sourceItems: ListItem[]): ListItem[] {
    if (!query) {
      // Return a copy of the full list if query is empty
      return [...sourceItems];
    } else {
      const lowerCaseQuery = query.toLowerCase();
      // Filter based on the query
      return sourceItems.filter(item =>
        item.name.toString().toLowerCase().includes(lowerCaseQuery)
      );
    }
  }

  toggleValue: ToggleState = 0; // Initial state

  constructor(private rotationService: RotationService,
    private clientService:ClientService,
    private projectService : ProjectService,
    private factoryService : FactoryService,
    private subFactoryService : SubfactoryService,
    private messageService:MessageService,
    private translate:TranslateService


  ) { }
  ngOnInit(): void {

    this.loadFilterLists()
    this.loadRotation()
    this.userRotations.set([...this.rotationService.getUsersRotations()])

  }
loadRotation(){
  this.rotationService.getActiveUsersRotation(0, 10).subscribe(
   (pagedData) => {
    console.log(pagedData)
     this.userRotations.set([...pagedData.assignedRotations])
    },
   
  )};
  


  showDialog() {
   this.isDialogVisible = true;
    console.log(this.clientList())
  }
loadFilterLists(){
    // --- Populate Client List ---
    this.clients.set(this.clientService.getClientList()); // Update the signal's value
    // --- Populate Project List ---

    this.projectService.getProjectList().subscribe((projects)=>{console.log(projects);this.projects.set([...projects]);    })


    // --- Populate Factory List ---
    this.factorys.set(this.factoryService.getFactoryList()); // Update the signal's value
    // --- Populate Sub-Factory List ---
    this.subFactorys.set(this.subFactoryService.getSubFactoryList()); // Update the signal's value


  }


  displayedDates = computed(() => {
    const currentStart = this.currentStartDate();
    const numWeeks = this.numberOfWeeksToShow;
    const mode = this.selectedViewMode.value;
    const dates: Date[] = [];
    let currentDate = currentStart;
    console.log('Calculating displayedDates...'); // See when this runs

    if (mode === 'month') {
      for (let i = 0; i < numWeeks; i++) {
        dates.push(currentDate);
        currentDate = addWeeks(currentDate, 1);
      }
    } // Add other view modes if needed
    return dates;
  });
  currentDateRangeLabel = computed(() => {
    const dates = this.displayedDates();
    if (!dates.length) return '';
    const firstDate = dates[0];
    const lastWeekStartDate = dates[dates.length - 1];
    // Note: end date logic might need slight adjustment based on view
    const endDateForLabel = addDays(lastWeekStartDate, 6); // Assuming week ends 6 days after start
    console.log('Calculating date range label...');
    return `${format(firstDate, 'dd MMM')} - ${format(endDateForLabel, 'dd MMM yyyy')}`;
  });

  previousPeriod(): void {
    if (this.selectedViewMode.value === 'month') {
      this.currentStartDate.update((date) => subWeeks(date, this.numberOfWeeksToShow));
    } // Add logic for 'week' view if needed

  }

  nextPeriod(): void {
    if (this.selectedViewMode.value === 'month') {
      this.currentStartDate.update((date) => addWeeks(date, this.numberOfWeeksToShow));
    } // Add logic for 'week' view if needed

  }

  onViewModeChange(): void {
    // Reset start date or adjust logic based on view mode switch if needed
    // For now, just recalculate based on the current start date
    // this.calculateDisplayedDates();
  }


  clearSearch(): void {
    this.searchText = '';

  }


  // --- Helpers (Remain the same) ---
  formatDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  formatDateHeader(date: Date): string {
    return format(date, 'dd-MM');
  }
  getRemoteState(rotation: Rotation, date: Date): ToggleState {
    const dateKey = this.formatDateKey(date);

    return this.toToggleType(this.rotationService.getDateRotationStatus(rotation, dateKey)) as ToggleState;
  }
  toToggleType(status: RotationStatus) {
    switch (status) {
      case RotationStatus.Remote: return -1;
      case RotationStatus.Off: return 0;
      case RotationStatus.OnSite: return 1;
      default: return 0;
    }

  }
  fromToggleType(state: ToggleState): RotationStatus {
    switch (state) {
      case -1: return RotationStatus.Remote;
      case 0: return RotationStatus.Off;
      case 1: return RotationStatus.OnSite;
      default: return RotationStatus.Off; // Should not happen if ToggleState is used correctly
    }
  }
  // *** NEW METHOD TO HANDLE THE UPDATE ***
  updateRemoteState(rotation: Rotation, date: Date, newState: ToggleState) {
    const dateKey = this.formatDateKey(date);
    // Convert the new ToggleState number back to the string status
    const newStatus = this.fromToggleType(newState);
    console.log(rotation.rotationId)
    // Update the schedule data for the specific user and date
    this.userRotations().forEach(currRotation => {
      if (currRotation.rotation === rotation) {
        this.rotationService.updateRotationStatusForDate(currRotation.rotation, dateKey, newStatus);
      }
    })


  }


}
