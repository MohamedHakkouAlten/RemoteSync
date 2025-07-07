import { Component, computed, OnInit, signal } from '@angular/core';
import { startOfWeek, addWeeks, format, addDays, subWeeks, weeksToDays, Locale, isEqual, isBefore } from 'date-fns';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ToggleState } from '../../shared/three-state-toggle/three-state-toggle.component';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { RcService } from '../../../services/rc.service';
import { ClientDropDownDTO } from '../../../dto/rc/client-dropdown.dto';
import { FactoryDropDownDTO } from '../../../dto/rc/factory-dropdown.dto';
import { PagedRotationsSearchDTO } from '../../../dto/rc/paged-rotations-search.dto';
import { RcRecentAssociateRotations } from '../../../dto/rc/rc-recent-associate-rotations.dto';
import { RotationStatus } from '../../../dto/rc/rotation-status.enum';
import { CustomDate } from '../../../dto/rc/custom-date.dto';
import { RcUpdateAssociateRotationDTO } from '../../../dto/rc/rc-update-associate-rotation.dto';
import { ResponseWrapperDto } from '../../../dto/response-wrapper.dto';
import { fr ,es} from 'date-fns/locale';

import { WebSocketService } from '../../../services/web-socket.service';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';

export interface ViewMode {
  label: string;
  value: 'month' | 'week'; // Add more modes if needed
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
createRotation(event:boolean) {


 if(event==true){
  this.showRotationModal=false
  this.messageService.add({
      severity: 'success',
      // Use a translation key for the summary
      summary: this.translate.instant('rotation.create.successSummary'),
      life: 5000 // Message disappears after 5 seconds
    });

  this.fetchRotations();}
  else {
   this.messageService.add({
      severity: 'error', // Note: Severity should be 'error' for a failed message
      // Use a translation key for the summary
      summary: this.translate.instant('rotation.create.failureSummary'),
      life: 5000 // Message disappears after 5 seconds
    });


  }
}
  // Pending changes to be saved
  pendingChanges: Map<string, CustomDate[]> = new Map<string, CustomDate[]>();
  hasPendingChanges = signal<boolean>(false);
  // --- Calendar navigation state ---
  currentDate = signal<Date>(new Date());
  daysToShow = 7;

selectionType: string = 'day';
  // View modes
  viewModes: ViewMode[] =[]
  selectedViewMode=signal<string> ('day'); // Default to week view

  // Display dates based on current date and view mode
  displayedDates = computed(() => {
    const dates: Date[] = [];
    const startDate = startOfWeek(this.currentDate(), { weekStartsOn: 0 });
    if(this.selectedViewMode()=='day'){
     // Monday start
    for (let i = 0; i < this.daysToShow; i++) {
      dates.push(addDays(startDate, i));
    }
  }
    else{
 for (let i = 0; i < this.daysToShow; i++) {
      dates.push(addWeeks(startDate, i));
    }
    }
      console.log(dates)
    return dates;
  });

  // Formatted date range for display
  currentDateRangeLabel = computed(() => {
    
    const firstDate = this.displayedDates()[0];
    const lastDate = this.displayedDates()[this.displayedDates().length - 1];
     const lang=this.getDateLang()

   
    return (lang)?`${format(firstDate, 'MMM d',{locale:lang})} - ${format(lastDate, 'MMM d, yyyy',{locale:lang})}`:`${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d, yyyy')}`;
  });

  // --- Rotation data ---
  userRotations = signal<RcRecentAssociateRotations[]>([]);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(5);

  // --- Dropdown data ---
  clients = signal<ClientDropDownDTO[]>([]);
  factories = signal<FactoryDropDownDTO[]>([]);
  projects = signal<any[]>([]);
  subFactories = signal<any[]>([]);
  filteredClients = signal<ClientDropDownDTO[]>([]);
  filteredFactories = signal<FactoryDropDownDTO[]>([]);

  // --- Filter state ---
  selectedClient: ClientDropDownDTO | null = null;
  selectedProject: any | null = null;
  selectedFactory: FactoryDropDownDTO | null = null;
  selectedSubFactory: any | null = null;
  searchValue: string = '';
  isDialogVisible: boolean = false;
  showRotationModal: boolean = false; // For the new rotation modal
  first = 0; // For paginator
  currentRotationForDialog = signal<any |  null>(null);//signal<RotationData | null>(null);

  // --- Computed values ---
  totalRecords = computed(() => this.totalElements());

  // --- Search and pagination parameters ---
  currentParams = signal<PagedRotationsSearchDTO>({
    pageNumber: 0,
    pageSize: 5
  });
   private rotationSubscription: Subscription | undefined;
  // Search debounce
  private searchTermsChange$ = new Subject<string>();
currentLanguage: SupportedLanguage = 'en';
  constructor(
    private rcService: RcService,
    private messageService: MessageService,
    private translate: TranslateService,
    private webSocketService :WebSocketService,
    private languageService:LanguageService
  ) { 

  }

  ngOnInit(): void {

     this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

this.setUpViewModes()
     this.rotationSubscription = this.webSocketService.watchRotationTopic().subscribe({
      next: (rotationData) => {
        console.log("Received rotation data:", rotationData);
   this.fetchRotations()
      },
      error: (err) => {
        console.error("Error receiving rotation data:", err);

      },
      complete: () => {
        console.log("Rotation topic subscription completed.");

      }
    });

    this.setupSearchDebounce();
    this.loadInitialCalendarData();

  }
setUpViewModes(){
  let weekLabel=''
  let monthLabel=''
  this.translate.get("calendarPage.viewMode.options.week").subscribe((res)=>{this.viewModes.push({ label:res , value: 'week' })})
  this.translate.get("calendarPage.viewMode.options.month").subscribe((res)=>{this.viewModes.push({ label: res, value: 'month' })})

}
  /**
   * Load initial calendar data including client dropdown, factory dropdown, and recent rotations
   */
  loadInitialCalendarData() {
    this.rcService.getRcInitialCalendar(this.pageSize()).subscribe({
      next: (response) => {
        if (response && response.data) {
          console.log('Initial calendar data:', response.data);

          // Set the clients and factories for dropdowns
          if (response.data.clientDropDown && Array.isArray(response.data.clientDropDown)) {
            // Make sure each client has the proper structure for the dropdown
            const clientList: ClientDropDownDTO[] = response.data.clientDropDown.map((client: ClientDropDownDTO) => ({
              clientId: client.clientId,
              label: client.label
            }));

            this.clients.set(clientList);
            this.filteredClients.set(clientList); // Set initial filtered list to all clients
            console.log('Clients loaded:', this.clients());
          } else {
            console.warn('No client data found or invalid format');
            this.clients.set([]);
            this.filteredClients.set([]);
          }

          if (response.data.factoryDropDown && Array.isArray(response.data.factoryDropDown)) {
            // Make sure each factory has the proper structure for the dropdown
            const factoryList: FactoryDropDownDTO[] = response.data.factoryDropDown.map((factory: FactoryDropDownDTO) => ({
              factoryId: factory.factoryId,
              label: factory.label
            }));

            this.factories.set(factoryList);
            this.filteredFactories.set(factoryList); // Set initial filtered list to all factories
            console.log('Factories loaded:', this.factories());
          } else {
            console.warn('No factory data found or invalid format');
            this.factories.set([]);
            this.filteredFactories.set([]);
          }

          // Prepare empty project and subfactory lists if they don't exist yet
          if (!this.projects() || this.projects().length === 0) {
            this.projects.set([]);
          }

          if (!this.subFactories() || this.subFactories().length === 0) {
            this.subFactories.set([]);
          }

          // Set user rotations with initial data
          if (response.data.allRecentAssociateRotations && Array.isArray(response.data.allRecentAssociateRotations)) {
            this.userRotations.set(response.data.allRecentAssociateRotations);
            console.log('User rotations loaded:', this.userRotations());
          }

          // For initial load, we set the total elements based on the length of rotations
          // since the initial calendar response doesn't include pagination data
          if (response.data.allRecentAssociateRotations) {
            this.totalElements.set(response.data.allRecentAssociateRotations.length);
          }
        }
      },
      error: (error) => {
        console.error('Error loading initial calendar data:', error);
          this.messageService.add({
      severity: 'error',
      // Use translation keys for summary and detail
      summary: this.translate.instant('calendar.load.errorSummary'),
      detail: this.translate.instant('calendar.load.errorDetail')
    });
      }
    });
  }

  /**
   * Fetch rotations with current parameters
   */
  fetchRotations() {
    this.rcService.getRcRotations(this.currentParams()).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Set the rotations and pagination data
          this.userRotations.set(response.data.rcAllRecentAssociateRotations || []);
          this.totalPages.set(response.data.totalPages || 0);
          this.totalElements.set(response.data.totalElements || 0);
          this.currentPage.set(response.data.currentPage || 0);
          this.pageSize.set(response.data.pageSize || 0);
        }
      },
      error: (error) => {
        console.error('Error fetching rotations:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('calendar.fetchError') || 'Error fetching rotations',
          detail: error.message
        });
      }
    });
  }

  /**
   * Clear all filters and reload initial data
   */
  clearFilters() {
    this.selectedClient = null;
    this.selectedProject = null;
    this.selectedFactory = null;
    this.selectedSubFactory = null;
    this.searchValue = '';

    // Reset filter params
    this.currentParams.set({
      pageNumber: 0,
      pageSize: this.pageSize()
    });

    // Reload initial data
    this.loadInitialCalendarData();
  }

  /**
   * Handle search input changes
   */
  onSearchInput(): void {
    // Update search parameters
    this.currentParams.set({
      ...this.currentParams(),
      label: this.searchValue,
      pageNumber: 0 // Reset to first page
    });

    // Trigger search with debounce
    this.searchTermsChange$.next(this.searchValue);
  }

  /**
   * Handle pagination events
   */
  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    const page = event.page ?? 0;
    const rows = event.rows ?? this.pageSize();

    // Update current parameters with new pagination values
    this.currentParams.set({
      ...this.currentParams(),
      pageNumber: page,
      pageSize: rows
    });

    // Fetch rotations with updated params
    this.fetchRotations();
  }

  /**
   * Filter client dropdown options based on input
   */
  searchClient(event: AutoCompleteCompleteEvent): void {
    // No need to wait - immediately provide the filtered list
    const query = event.query.toLowerCase();
    const allClients = this.clients();

    this.filteredClients.set(allClients);

    // Filter based on label (client name)
    const filtered = allClients.filter(client =>
      client && client.label && client.label.toLowerCase().includes(query)
    );

    // If no matches found, still show all clients
    if (!filtered || filtered.length === 0) {
      this.filteredClients.set(allClients);
    } else {
      this.filteredClients.set(filtered);
    }
  }

  /**
   * Filter factory dropdown options based on input
   */
  searchFactory(event: AutoCompleteCompleteEvent): void {
    // No need to wait - immediately provide the filtered list
    const query = event.query.toLowerCase();
    const allFactories = this.factories();

    this.filteredFactories.set(allFactories);

    // Filter based on label (factory name)
    const filtered = allFactories.filter(factory =>
      factory && factory.label && factory.label.toLowerCase().includes(query)
    );

    // If no matches found, still show all factories
    if (!filtered || filtered.length === 0) {
      this.filteredFactories.set(allFactories);
    } else {
      this.filteredFactories.set(filtered);
    }
  }

  /**
   * Handle client selection and fetch related rotations and projects
   */
  fetchUserRotationsByClient(event: any) {
    // Set client ID in search parameters
    if (event && event.value) {
      this.selectedClient = event.value;
      const clientId = this.selectedClient?.clientId;

      // Reset project selection when client changes
      this.selectedProject = null;

      // Update search parameters
      this.currentParams.set({
        ...this.currentParams(),
        clientId: clientId,
        projectId: undefined, // Clear project ID when client changes
        pageNumber: 0 // Reset to first page when changing filters
      });

      // Load projects for this client
      if (clientId) {
        this.rcService.getRcProjectsByClient(clientId).subscribe({
          next: (response) => {
            if (response && response.data) {
              this.projects.set(response.data);
              console.log('Projects loaded for client:', response.data);
            } else {
              this.projects.set([]);
            }
          },
          error: (error) => {
            console.error('Error loading projects:', error);
            this.projects.set([]);
          }
        });
      }

      // Fetch rotations with updated parameters
      this.fetchRotations();
    } else {
      // If selection was cleared
      this.currentParams.set({
        ...this.currentParams(),
        clientId: undefined,
        projectId: undefined, // Also clear project ID
        pageNumber: 0
      });
      this.projects.set([]);
      this.selectedProject = null;
      this.fetchRotations();
    }
  }

  /**
   * Show all clients in dropdown when clicked without filtering
   */
  showAllClients() {
    // Simply return all clients without any filtering
    return this.clients();
  }

  /**
   * Handle factory selection and fetch related rotations and subfactories
   */
  fetchUserRotationsByFactory(event: any) {
    // Update factory ID in search parameters
    if (event && event.value) {
      this.selectedFactory = event.value;
      const factoryId = this.selectedFactory?.factoryId;

      // Reset subfactory selection when factory changes
      this.selectedSubFactory = null;

      // Update search parameters
      this.currentParams.set({
        ...this.currentParams(),
        factoryId: factoryId,
        subFactoryId: undefined, // Clear subfactory ID when factory changes
        pageNumber: 0 // Reset to first page when changing filters
      });

      // Load subfactories for this factory
      if (factoryId) {
        this.rcService.getRcSubFactoriesByFactory(factoryId).subscribe({
          next: (response) => {
            if (response && response.data) {
              this.subFactories.set(response.data);
              console.log('Subfactories loaded for factory:', response.data);
            } else {
              this.subFactories.set([]);
            }
          },
          error: (error) => {
            console.error('Error loading subfactories:', error);
            this.subFactories.set([]);
          }
        });
      }

      // Fetch rotations with updated parameters
      this.fetchRotations();
    } else {
      // If selection was cleared
      this.currentParams.set({
        ...this.currentParams(),
        factoryId: undefined,
        subFactoryId: undefined, // Also clear subfactory ID
        pageNumber: 0
      });
      this.subFactories.set([]);
      this.selectedSubFactory = null;
      this.fetchRotations();
    }
  }

  /**
   * Show all factories in dropdown when clicked without filtering
   */
  showAllFactories() {
    // Simply return all factories without any filtering
    return this.factories();
  }

  /**
   * Handle project selection
   */
  fetchUserRotationsByProject(event: any) {
    // Update project ID in search parameters
    if (event && event.value) {
      this.selectedProject = event.value;
      this.currentParams.set({
        ...this.currentParams(),
        projectId: this.selectedProject?.projectId,
        pageNumber: 0 // Reset to first page when changing filters
      });

      // Fetch rotations with updated parameters
      this.fetchRotations();
    } else {
      // If selection was cleared
      this.currentParams.set({
        ...this.currentParams(),
        projectId: undefined,
        pageNumber: 0
      });
      this.fetchRotations();
    }
  }

  /**
   * Handle subfactory selection
   */
  fetchUserRotationsBySubFactory(event: any) {
    // Update subfactory ID in search parameters
    if (event && event.value) {
      this.selectedSubFactory = event.value;
      // Handle both property naming conventions (subFactoryId or subFactoryID)
      const subFactoryIdValue = this.selectedSubFactory?.subFactoryId || this.selectedSubFactory?.subFactoryID;

      this.currentParams.set({
        ...this.currentParams(),
        subFactoryId: subFactoryIdValue,
        pageNumber: 0 // Reset to first page when changing filters
      });

      // Fetch rotations with updated parameters
      this.fetchRotations();
    } else {
      // If selection was cleared
      this.currentParams.set({
        ...this.currentParams(),
        subFactoryId: undefined,
        pageNumber: 0
      });
      this.fetchRotations();
    }
  }

  /**
   * Show dialog for creating new rotations
   */
  showDialog() {
    // Set default data for a new rotation
    this.currentRotationForDialog.set({
      mode: 'automatic', // Default mode
      associates: [],
      projectId: undefined, // Or a default project ID if applicable
      startDate: new Date(), // Default to today
      endDate: addDays(new Date(), 30), // Default to 30 days from today
      shift: 1, // Default shift (e.g., 1 day on)
      cycle: 1, // Default cycle (e.g., 1 day off)
      customDates: [],
      selectedDates: [], // Initialize as empty for new rotation
      selectedWeek: null
    });
    this.isDialogVisible = true;
  }

  /**
   * Navigate to previous period
   */
  previousPeriod(): void {

    // Move current date back by number of days shown
    this.currentDate.update(date =>
      subWeeks(date, this.selectedViewMode() === 'week' ? 4 : 1)
    );
  }

  /**
   * Navigate to next period
   */
  nextPeriod(): void {


    // Move current date forward by number of days shown
    this.currentDate.update(date =>
      addWeeks(date, this.selectedViewMode() === 'week' ? 4 : 1)
    );
  }

  /**
   * Handle view mode changes (week/month)
   */
  onViewModeChange(): void {
this.selectedViewMode.set(this.selectionType)
  }

  /**
   * Format date for display in header
   */
  formatDateHeader(date: Date): string {
    const lang=this.getDateLang()

    return (lang)?format(date, 'MMM dd',{locale:lang}):format(date, 'MMM dd');
  }

  getDateLang():Locale|null{
    if(this.currentLanguage=='fr') return fr
    else if(this.currentLanguage=='es') return es
    return null
  }
  /**
   * Format day name (Mon, Tue, etc) for calendar header
   */
  formatDay(date: Date): string {
       const lang=this.getDateLang()

    return (lang)?format(date, 'EEE',{locale:lang}):format(date, 'EEE');
  
  }

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  isWeek(date:Date):boolean{

return isEqual(startOfWeek(new Date()),startOfWeek(date))
  }
  isPastDate(date:Date):boolean{
    return isBefore(date,new Date())
  }
  /**
   * Format date as key for rotation lookup
   */
  formatDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Determine the remote state for a rotation on a specific date
   */
getRemoteState(rotation: RcRecentAssociateRotations, date: Date): ToggleState {

    const dateKey = this.formatDateKey(date);


    const onSiteDatesSet = new Set(rotation.onSiteDates || []);
    const remoteDatesSet = new Set(rotation.remoteDates || []);

    // --- Logic for 'week' view mode ---
    if (this.selectedViewMode()=== 'day') {

      if (onSiteDatesSet.has(dateKey)) {
        return 1;
      }
      if (remoteDatesSet.has(dateKey)) {
        return -1;
      }
      // If not found in either for 'week' view, it's OFF
      return 0;
    }


    let onSiteCount = 0;
    let remoteCount = 0;

    for (let i = 0; i < 7; i++) {
      const day = this.formatDateKey(addDays(date, i));
      if (onSiteDatesSet.has(day)) {
        onSiteCount++;
      } else if (remoteDatesSet.has(day)) {
        remoteCount++;
      }
    }
   if(onSiteCount>0 || remoteCount>0) return onSiteCount > remoteCount ? 1 : -1;
   return 0

}

  /**
   * Add a pending change for rotation state on a specific date
   * Changes will be saved when the user confirms them
   */
  updateRemoteState(rotation: RcRecentAssociateRotations, date: Date, newState: ToggleState) {
    const dateKey = this.formatDateKey(date);

    // Convert ToggleState to RotationStatus
    let rotationStatus: RotationStatus;
    if (newState === 1) { // OnSite
      rotationStatus = RotationStatus.ONSITE;
    } else { // Remote (newState === -1)
      rotationStatus = RotationStatus.REMOTE;
    }

    // Create a unique key for this change (userId + date)
    const changeKey = `${rotation.userId}_${dateKey}`;
    let customDates:CustomDate[]=[]
    // Create the custom date object
    if(this.selectedViewMode()=='day'){
    const customDate: CustomDate = {
      date: dateKey,
      rotationStatus: rotationStatus
    };
   customDates.push(customDate)
   this.updateLocalRotationData(rotation, dateKey, rotationStatus);
  }
    else {
      for (let i = 0; i < 7; i++) {
        const day=this.formatDateKey(addDays(date, i));
     customDates.push({
      date: day,
      rotationStatus: rotationStatus
     })

    this.updateLocalRotationData(rotation, day, rotationStatus);
  }
    }

    // Add to pending changes
    this.pendingChanges.set(changeKey, customDates);
    this.hasPendingChanges.set(true);

    // Update the UI immediately (but don't save to backend yet)


    // Show notification about pending changes
   this.messageService.add({
      severity: 'info',
      // Use translation keys for summary and detail
      summary: this.translate.instant('changes.pending.summary'),
      detail: this.translate.instant('changes.pending.detail'),
      life: 3000 // Message disappears after 3 seconds
    });
  }

  /**
   * Update local rotation data after successful API update
   * @param rotation - The rotation to update
   * @param dateKey - The date key in format YYYY-MM-DD
   * @param status - The new rotation status
   */
  /**
   * Save all pending rotation changes to the backend
   */
  saveChanges(): void {
    if (this.pendingChanges.size === 0) {
  this.messageService.add({
      severity: 'info',
      // Use translation keys for summary and detail
      summary: this.translate.instant('changes.no_changes.summary'),
      detail: this.translate.instant('changes.no_changes.detail')
    });
      return;
    }

    // Group changes by user ID
    const changesByUser = new Map<string, CustomDate[]>();

    this.pendingChanges.forEach((customDates, key) => {
      const userId = key.split('_')[0];
      if (!changesByUser.has(userId)) {
        changesByUser.set(userId, []);
      }
      customDates.forEach((customDate)=>changesByUser.get(userId)?.push(customDate))

    });

    // Track number of successful updates
    let successCount = 0;
    let totalUpdates = changesByUser.size;
    let errorOccurred = false;

    // Process each user's changes
    changesByUser.forEach((customDates, userId) => {
      const updateData: RcUpdateAssociateRotationDTO = {
        userId: userId,
        customDates: customDates
      };

      this.rcService.updateRcAssignedRotation(updateData).subscribe({
        next: (response: ResponseWrapperDto<any>) => {
          if (response && response.status === 'success') {
            successCount++;

            // If all updates are complete, show success message
            if (successCount === totalUpdates && !errorOccurred) {
         this.messageService.add({
      severity: 'success',
      // Use translation keys for summary and detail
      summary: this.translate.instant('changes.saved.summary'),
      // Pass the 'count' for interpolation in the detail message
      detail: this.translate.instant('changes.saved.detail', { count: totalUpdates })
    });

              // Clear pending changes
              this.pendingChanges.clear();
              this.hasPendingChanges.set(false);

              // Refresh the data to ensure we have the latest from the server
              this.fetchRotations();
            }
          } else {
            errorOccurred = true;
  this.messageService.add({
      severity: 'error',
      // Use translation key for the summary
      summary: this.translate.instant('rotation.update.failureSummary'),
      // If response.message exists, use it. Otherwise, use a translated fallback.
      detail:  this.translate.instant('rotation.update.failureDetailDefault')
    });
          }
        },
        error: (error) => {
          errorOccurred = true;
          console.error('Error updating rotation:', error);
         this.messageService.add({
      severity: 'error',
      // Use translation keys for summary and detail
      summary: this.translate.instant('rotation.update.genericErrorSummary'),
      detail: this.translate.instant('rotation.update.genericErrorDetail')
    });
        }
      });
    });
  }

  /**
   * Cancel all pending changes
   */
  cancelChanges(): void {
    if (this.pendingChanges.size === 0) {
      return;
    }

    // Clear pending changes
    this.pendingChanges.clear();
    this.hasPendingChanges.set(false);

    // Refresh the data to revert local changes
    this.fetchRotations();

this.messageService.add({
      severity: 'info',
      // Use translation keys for summary and detail
      summary: this.translate.instant('changes.cancelled.summary'),
      detail: this.translate.instant('changes.cancelled.detail')
    });
  }

  private updateLocalRotationData(rotation: RcRecentAssociateRotations, dateKey: string, status: RotationStatus): void {
    // Create a copy of the rotations array
    const updatedRotations = [...this.userRotations()];

    // Find the index of the rotation to update
    const rotationIndex = updatedRotations.findIndex(r => r.userId === rotation.userId);

    if (rotationIndex !== -1) {
      const updatedRotation = { ...updatedRotations[rotationIndex] };

      // Remove the date from both arrays first
      updatedRotation.onSiteDates = updatedRotation.onSiteDates?.filter(d => d !== dateKey) || [];
      updatedRotation.remoteDates = updatedRotation.remoteDates?.filter(d => d !== dateKey) || [];

      // Add the date to the appropriate array based on status
      if (status === RotationStatus.ONSITE) {
        updatedRotation.onSiteDates = [...updatedRotation.onSiteDates, dateKey];
      } else if (status === RotationStatus.REMOTE) {
        updatedRotation.remoteDates = [...updatedRotation.remoteDates, dateKey];
      }

      // Update the rotation in the array
      updatedRotations[rotationIndex] = updatedRotation;

      // Update the signal with the new array
      this.userRotations.set(updatedRotations);
    }
  }

  /**
   * Set up search debounce to prevent too many API calls
   */
  private setupSearchDebounce(): void {
    this.searchTermsChange$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        // Return the API call with search term
        return this.rcService.getRcRotations({
          ...this.currentParams(),
          label: searchTerm
        });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Update rotations and pagination data
          this.userRotations.set(response.data.rcAllRecentAssociateRotations || []);
          this.totalPages.set(response.data.totalPages || 0);
          this.totalElements.set(response.data.totalElements || 0);
          this.currentPage.set(response.data.currentPage || 0);
          this.pageSize.set(response.data.pageSize || 0);
        }
      },
      error: (error) => {
        console.error('Error searching rotations:', error);
      }
    });
  }


  handleDialogClosed(): void {
    this.isDialogVisible = false;
    this.currentRotationForDialog.set(null); // Clear the data when dialog is closed without applying
    console.log('Rotation dialog closed by user.');
  }

  /**
   * Open the rotation creation modal
   */
  openRotationModal(): void {
    this.showRotationModal = true;
    console.log('Opening rotation creation modal');
  }

  /**
   * Handle rotation modal closed event
   */
  onRotationModalClosed(): void {
    this.showRotationModal = false;
    console.log('Rotation creation modal closed');
    // Optionally refresh the rotations data after a new rotation is created

  }
}
