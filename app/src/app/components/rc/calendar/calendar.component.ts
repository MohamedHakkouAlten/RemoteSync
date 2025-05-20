import { Component, computed, OnInit, signal } from '@angular/core';
// src/app/rotation-schedule/rotation-schedule.model.ts
import { startOfWeek, addWeeks, format, addDays, subWeeks } from 'date-fns';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ToggleState } from '../../shared/three-state-toggle/three-state-toggle.component';
import { RotationService } from '../../../services/rotation.service';
import { Rotation, UserRotation } from '../../../models/rotation.model';
import { RotationStatus } from '../../../enums/rotation-status.enum';
import { ClientListItem, ClientService } from '../../../services/client.service';
import { ProjectListItem, ProjectService } from '../../../services/project.service';
import { FactoryListItem, FactoryService } from '../../../services/factory.service';
import { SubFactoryListItem, SubfactoryService } from '../../../services/subfactory.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UpdateUserRotationDTO } from '../../../dto/rotation/updateUserRotationDTO';
import { debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { PagedData, PagedRotation } from '../../../dto/response-wrapper.dto';
import { PaginatorState } from 'primeng/paginator';



export interface ViewMode {
  label: string;
  value: 'month' | 'week'; // Add more modes if needed
}
export interface ListItem {
  id: string,
  name: string
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})


export class CalendarComponent implements OnInit {


  clearFilters() {
    this.selectedClient = null;
    this.selectedProject = null;
    this.selectedFactory = null;
    this.selectedSubFactory = null;
    this.searchValue='';
    this.rotationService.getActiveUsersRotation(0,10).subscribe(rotations=>this.userRotations.set(rotations))


  }

  // --- Configuration & State ---
  userRotations = signal<PagedRotation>({
    assignedRotations:[],
    totalElements:0,
    totalPages:0,
    pageSize:0,
    currentPage:0

  });
  clients = signal<ClientListItem[]>([])
  projects = signal<ProjectListItem[]>([])
  factories:FactoryListItem[]=[]
  subFactories: SubFactoryListItem[]=[]
  currentFactories = signal<FactoryListItem[]>([])
  currentSubFactories = signal<SubFactoryListItem[]>([])
  // clientList=computed(()=>this.clients().map((client)=>client.name))
  //  projectList=computed(()=>this.projects().map((project)=>project.label))
  // factoryList=computed(()=>this.factories().map((factories)=>factories.name))
  //subFactoryList = computed(() => this.subFactories().map((subFactory) => subFactory.name))

  selectedClient: ClientListItem | null = null;
  selectedProject:ProjectListItem | null = null;
  selectedFactory: FactoryListItem | null = null;
  selectedSubFactory: FactoryListItem | null = null;

  searchValue: string = ''

  private searchUserInputChange$ = new Subject<string>();
  private searchProjectInputChange$ = new Subject<string>();
  private searchClientInputChange$ = new Subject<string>();

  toggleValue=0

  totalRecords=computed(()=>this.userRotations().totalElements)
 
  first=0
  activeFilter= signal<'user'|'client'|'project'|'factory'|'subFactory'|'none'>('none')
  isDialogVisible: boolean = false
  state=computed(()=>
    {
      return {
        userRotations:this.activeFilter(),
        page:signal(0),
        row:signal(5)
      }

  })

    onPageChange(event: PaginatorState): void {
    
   this.first = event.first  ?? 0;
   const page = event.page  ?? 0;
   const rows = event.rows ?? this.state().row();

   this.state().page.set(page)
   this.state().row.set(rows)
   if(this.activeFilter()=='user') this.rotationService.getActiveUsersRotationByName(this.state().page(), this.state().row(),this.searchValue).subscribe((pagedData) =>
      this.userRotations.set(pagedData))
   else this.fetchRotations()
   //  this.rotationService.getActiveUsersRotation()
     
    }
  //rotation 
  showRotationCreatedToast(isCreated: boolean) {

    if (isCreated) {

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('rotation.created'),
        life: 5000

      })
      this.loadRotation()
    }
  }
  onSearchInput(): void {

        this.selectedProject=null;
    this.selectedClient=null;
    this.selectedFactory=null;
    this.selectedSubFactory=null;
    this.activeFilter.set('user')
    this.fetchRotations()
    
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
    const query = event.query
    if (!query) this.clients.set([...this.clients()])
    this.searchClientInputChange$.next(event.query)

  }
  searchProject(event: AutoCompleteCompleteEvent): void {
    const query = event.query
    if (!query) this.projects.set([...this.projects()])

    this.searchProjectInputChange$.next(event.query)
  }

  searchFactory(event: AutoCompleteCompleteEvent): void {
   const query=event.query 
     if (!query) this.currentFactories.set([...this.factories]); 
    else {
      const lowerCaseQuery = query.toLowerCase();
      // Filter based on the query
      this. currentFactories.update(() =>
        this.factories.filter(factory=>factory.label.toString().toLowerCase().includes(lowerCaseQuery)) 
      
      
      );
    }


  }
  searchSubFactory(event: AutoCompleteCompleteEvent): void {
const query=event.query 
     if (!query) this.currentSubFactories.set([...this.subFactories]); 
    else {
      const lowerCaseQuery = query.toLowerCase();
      this. currentSubFactories.update(()=>
        this.subFactories.filter(subFactory=>subFactory.label.toString().toLowerCase().includes(lowerCaseQuery)) 
      
      
      );
    }
  }
  fetchUserRotationsByProject($event: AutoCompleteSelectEvent) {
    this.selectedFactory=null;
    this.selectedSubFactory=null;
    this.searchValue=''
    this.activeFilter.set('project')
    this.fetchRotations()
  }

  fetchRotations(){
    console.log(this.activeFilter()+this.searchValue)
    switch(this.activeFilter()){
      case 'project' :   this.rotationService.getActiveUsersRotationByProject(this.state().page(), this.state().row(), this.selectedProject!.projectId).subscribe((pagedData) =>
      this.userRotations.set(pagedData));break
      case 'client' :    this.rotationService.getActiveUsersRotationByClient(this.state().page(), this.state().row(),this.selectedClient!.clientId).subscribe((pagedData) =>
      this.userRotations.set(pagedData));break
      case 'factory' :    this.rotationService.getActiveUsersRotationByFactory(this.state().page(), this.state().row(),this.selectedFactory!.factoryId).subscribe((pagedData) =>
      this.userRotations.set(pagedData));break
      case 'subFactory' :    this.rotationService.getActiveUsersRotationBySubFactory(this.state().page(), this.state().row(),this.selectedSubFactory!.factoryId).subscribe((pagedData) =>
      this.userRotations.set(pagedData));break
      case 'user' :this.searchUserInputChange$.next(this.searchValue);break;
      default :this.rotationService.getActiveUsersRotation(this.state().page(), this.state().row()).subscribe((pagedData) =>
      this.userRotations.set(pagedData));break
    }
  }
  fetchUserRotationsByClient($event: AutoCompleteSelectEvent) {
       this.selectedFactory=null;
    this.selectedSubFactory=null;
    this.selectedClient=null;
    this.searchValue=''
    this.activeFilter.set('client')
    this.fetchRotations()
  }
    fetchUserRotationsByFactory($event: AutoCompleteSelectEvent) {
    this.selectedProject=null;
    this.selectedClient=null;
    this.searchValue=''
    this.activeFilter.set('factory')
    this.fetchRotations()
  }
    fetchUserRotationsBySubFactory($event: AutoCompleteSelectEvent) {
    this.selectedProject=null;
    this.selectedSubFactory=null;
    this.selectedClient=null;
    this.searchValue=''
    this.activeFilter.set('subFactory')
    this.fetchRotations()
  }

// Initial state

  constructor(private rotationService: RotationService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private factoryService: FactoryService,
    private subFactoryService: SubfactoryService,
    private messageService: MessageService,
    private translate: TranslateService


  ) { }
  ngOnInit(): void {

    this.loadFilterLists()
    this.loadRotation()
    this.setupSearchDebounce()

  }
  loadRotation() {
    this.rotationService.getActiveUsersRotation(this.state().page(),this.state().row()).subscribe(
      (pagedData) => {
        console.log(pagedData)
        this.userRotations.set(pagedData)
      },

    )
  };



  showDialog() {
    this.isDialogVisible = true;

  }
  loadFilterLists() {

    this.clientService.getClientListByLabel().subscribe((clients) => { this.clients.set(clients); })

    this.projectService.getProjectList().subscribe((projects) => { this.projects.set(projects); })

    this.factoryService.getFactoryList().subscribe((factories) => { this.factories=factories; })

    this.subFactoryService.getSubFactoryList().subscribe((subFactories) => { this.subFactories=subFactories; })


  }
  loadProjects() {

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
    prevouisToggleType(state: ToggleState): RotationStatus {
    switch (state) {
      case -1: return RotationStatus.OnSite;
      case 0: return RotationStatus.Remote;
      case 1: return RotationStatus.Off;
      default: return RotationStatus.Off; // Should not happen if ToggleState is used correctly
    }
  }
  // *** NEW METHOD TO HANDLE THE UPDATE ***
  updateRemoteState(userRotation: UserRotation, date: Date, newState: ToggleState) {
    const dateKey = this.formatDateKey(date);
    const rotation=userRotation.rotation
    // Convert the new ToggleState number back to the string status
    const newStatus = this.fromToggleType(newState);
   
 
    this.rotationService.updateRotationStatusForDate(rotation, dateKey, newStatus);
    const updateRotation: UpdateUserRotationDTO = {

      userId: userRotation.user.userId!,
      shift: rotation!.shift,
      cycle: rotation!.cycle,
      endDate: rotation!.endDate,
      startDate: rotation!.startDate,
      customDates: rotation!.customDates,
      projectId: userRotation.project,
      updatedDate:dateKey,
     updatedStatus:newStatus
    }
    console.log("yess")
    
    this.rotationService.updateUsersRotation(updateRotation).subscribe({
      next : (isUpdated) => {
      if (isUpdated) this.messageService.add({
        severity: 'success',
        summary: this.translate.instant("rotation.updated")
      })
    },
       error :(error) =>{
        this.rotationService.updateRotationStatusForDate(rotation,dateKey,this.prevouisToggleType(newState))
        this.messageService.add({
        severity: 'error',
        summary: error.message
      })}
  
  })
    console.log(updateRotation)
    // Update the schedule data for the specific user and date
    // this.userRotations().forEach(currRotation => {
    //   if (currRotation.rotation === rotation) {
    //     this.rotationService.updateRotationStatusForDate(currRotation.rotation, dateKey, newStatus);
    //   }
    // })


  }
  private setupSearchDebounce(): void {
    this.searchClientInputChange$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(searchTerm => {

        return this.clientService.getClientListByLabel(searchTerm);
      })
    ).subscribe(results => {

      this.clients.set(results);

    });

    this.searchProjectInputChange$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.projectService.getProjectList(searchTerm);
      })
    ).subscribe(results => {

      console.log(results)
      this.projects.set(results); // Assuming PagedData has 'content'

    });

    this.searchUserInputChange$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(searchTerm => {
       console.log("called"+searchTerm)
        return this.rotationService.getActiveUsersRotationByName(this.state().page(), this.state().row(), searchTerm);
      })
    ).subscribe(results => {
      if (results && (results as PagedRotation).assignedRotations) {
        console.log(results)
        this.userRotations.set(results); // Assuming PagedData has 'content'
      }
    });
  }

}
