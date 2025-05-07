import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// src/app/rotation-schedule/rotation-schedule.model.ts
import { startOfWeek, addWeeks, format, addDays, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval, getWeek } from 'date-fns'; 
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ToggleSwitchChangeEvent } from 'primeng/toggleswitch';
import { ToggleState } from '../../shared/three-state-toggle/three-state-toggle.component';

export interface UserSchedule {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string; // Optional avatar
  schedule: { [dateKey: string]: 'on-site' | 'remote' | 'off' }; // Key is YYYY-MM-DD or similar
}

export interface ViewMode {
  label: string;
  value: 'month' | 'week'; // Add more modes if needed
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})

export class CalendarComponent implements OnInit {

  // --- Configuration & State ---
  users: UserSchedule[] = [];
  filteredUsers: UserSchedule[] = [];
  displayedDates: Date[] = []; // Dates representing the start of each week/day shown
  currentDateRangeLabel: string = '';
  numberOfWeeksToShow: number = 8; // How many weeks to display in 'month' (weekly) view
  currentStartDate: Date = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  
  searchText: string = '';
  // Add properties for other filters if needed (client, project etc.)
  // selectedClient: any = null;
  // selectedProject: any = null;

  viewModes: ViewMode[] = [
    { label: 'Month', value: 'month' }, // Represents the weekly view shown in the example
     { label: 'Week', value: 'week' } // Could add a daily view later
  ];
  selectedViewMode: ViewMode = this.viewModes[0]; // Default to 'month' (weekly view)
  items: any[]=[] ;

  value: any;

  search(event: AutoCompleteCompleteEvent) {
  let _items = [...Array(10).keys()];

  this.items = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
  }
  stateOptions: any[] =  [
  {  value: 'on' },{  value: 'remote' }];
  value1: string = 'off';
  formGroup!: FormGroup;
  // --- Lifecycle ---
  title = 'three-state-toggle-app';
  toggleValue: ToggleState = 0; // Initial state

  setState(user:UserSchedule,newState: ToggleState) {
    this.toggleValue = newState;
  }
  ngOnInit(): void {
    
    this.formGroup = new FormGroup({
      value: new FormControl('on')
  });
  this.loadRotationInitialData();
    this.loadInitialData();
    this.calculateDisplayedDates();
    this.applyFilters(); // Apply initial filter (shows all users)
  }
  onStateChange(event: any) {
    
    // Add any logic needed when the state changes
  }
  // --- Data Loading (Simulated) ---
  loadInitialData(): void {
    // Replace with actual API call
    this.users = [
      { id: 1, name: 'Sarah Wilson', role: 'Design', avatarUrl: 'https://via.placeholder.com/40/FF7F50/FFFFFF?text=SW', schedule: this.generateRandomSchedule(1) },
      { id: 2, name: 'Michael Chen', role: 'Engineering', avatarUrl: 'https://via.placeholder.com/40/6495ED/FFFFFF?text=MC', schedule: this.generateRandomSchedule(2) },
      { id: 3, name: 'Emily Davis', role: 'Marketing', avatarUrl: 'https://via.placeholder.com/40/9FE2BF/FFFFFF?text=ED', schedule: this.generateRandomSchedule(3) },
      { id: 4, name: 'David Kim', role: 'Product', avatarUrl: 'https://via.placeholder.com/40/DE3163/FFFFFF?text=DK', schedule: this.generateRandomSchedule(4) },
      { id: 5, name: 'Lisa Thompson', role: 'Operations', avatarUrl: 'https://via.placeholder.com/40/FFBF00/FFFFFF?text=LT', schedule: this.generateRandomSchedule(5) },

        { id: 6, name: 'Sarah Wilson', role: 'Design', avatarUrl: 'https://via.placeholder.com/40/FF7F50/FFFFFF?text=SW', schedule: this.generateRandomSchedule(1) },
        { id: 7, name: 'Michael Chen', role: 'Engineering', avatarUrl: 'https://via.placeholder.com/40/6495ED/FFFFFF?text=MC', schedule: this.generateRandomSchedule(2) },
        { id: 8, name: 'Emily Davis', role: 'Marketing', avatarUrl: 'https://via.placeholder.com/40/9FE2BF/FFFFFF?text=ED', schedule: this.generateRandomSchedule(3) },
        { id: 9, name: 'David Kim', role: 'Product', avatarUrl: 'https://via.placeholder.com/40/DE3163/FFFFFF?text=DK', schedule: this.generateRandomSchedule(4) },
        { id: 10, name: 'Lisa Thompson', role: 'Operations', avatarUrl: 'https://via.placeholder.com/40/FFBF00/FFFFFF?text=LT', schedule: this.generateRandomSchedule(5) },
    ];
    this.filteredUsers = [...this.users]; // Initialize filtered list
  }


  //rotation 
  isDialogVisible =false;
  availableProjects: any[] = []; // Populate with real data
  availableCollaborators: any[] = []; // Populate with real data
  loadingProjects = false;
  loadingCollaborators = false;
  loadRotationInitialData() {
    // Mock data - Replace with actual service calls
    this.loadingProjects = true;
    this.loadingCollaborators = true;
    setTimeout(() => {
       this.availableProjects = [
        { id: 1, name: 'Mobile App Refresh' },
        { id: 2, name: 'Web Platform Upgrade' },
        { id: 3, name: 'Data Analytics Pipeline' },
        { id: 4, name: 'Backend API Refactor' },
      ];
      this.loadingProjects = false;
    }, 500);
     setTimeout(() => {
       this.availableCollaborators = [
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
      this.loadingCollaborators = false;
     }, 700);

    // Example using a service:
    // this.loadingProjects = true;
    // this.dataService.getProjects().subscribe(data => {
    //   this.availableProjects = data;
    //   this.loadingProjects = false;
    // });
    // this.loadingCollaborators = true;
    // this.dataService.getCollaborators().subscribe(data => {
    //   this.availableCollaborators = data;
    //   this.loadingCollaborators = false;
    // });
  }


  showDialog() {
    this.isDialogVisible = true;
  }

  handleCreateRotation(output:any) {

    // Call your service to save the rotation data...
    this.isDialogVisible = false; // Ensure dialog closes if not closed internally
  }

  handleCancel() {
     
     this.isDialogVisible = false; // Ensure state consistency
  }

  // --- Date Calculation & Navigation ---
  calculateDisplayedDates(): void {
    this.displayedDates = [];
    let currentDate = this.currentStartDate;

    if (this.selectedViewMode.value === 'month') { // Weekly view logic
      for (let i = 0; i < this.numberOfWeeksToShow; i++) {
        this.displayedDates.push(currentDate);
        currentDate = addWeeks(currentDate, 1);
      }
      const endDate = addWeeks(this.currentStartDate, this.numberOfWeeksToShow - 1);
      this.currentDateRangeLabel = `${format(this.currentStartDate, 'dd MMM')} - ${format(endDate, 'dd MMM yyyy')}`;

    } // Add logic for 'week' (daily) view if implemented later
    // else if (this.selectedViewMode.value === 'week') { ... }

     // Ensure user schedules cover the new date range (or fetch new data)
     // In a real app, you might need to fetch schedule data for the new range here.
     // For demo, we'll just ensure the random generator covers enough dates.
    //this.users.forEach(u => u.schedule = this.generateRandomSchedule(u.id, this.currentStartDate, this.numberOfWeeksToShow * 7));
     //this.applyFilters(); // Re-apply filters as user data might have changed implicitly
  }

  previousPeriod(): void {
    if (this.selectedViewMode.value === 'month') {
      this.currentStartDate = subWeeks(this.currentStartDate, this.numberOfWeeksToShow);
    } // Add logic for 'week' view if needed
    this.calculateDisplayedDates();
  }

  nextPeriod(): void {
    if (this.selectedViewMode.value === 'month') {
      this.currentStartDate = addWeeks(this.currentStartDate, this.numberOfWeeksToShow);
    } // Add logic for 'week' view if needed
    this.calculateDisplayedDates();
  }

  onViewModeChange(): void {
    // Reset start date or adjust logic based on view mode switch if needed
    // For now, just recalculate based on the current start date
    this.calculateDisplayedDates();
  }

  // --- Filtering ---
  applyFilters(): void {
    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm)
      // Add other filter conditions here based on selectedClient, selectedProject etc.
      // && (this.selectedClient ? user.clientId === this.selectedClient.id : true)
      // && (this.selectedProject ? user.projectId === this.selectedProject.id : true)
    );
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilters();
  }




  // --- Helper / Demo Data Generation ---
  generateRandomSchedule(userId: number, startDate: Date = new Date(), days: number = 90): { [dateKey: string]: 'on-site' | 'remote' | 'off' } {
      const schedule: { [dateKey: string]: 'on-site' | 'remote' | 'off' } = {};
      startDate=this.currentStartDate
      let currentDate = startDate;
      const states: Array<'on-site' | 'remote' | 'off'> = ['on-site', 'remote', 'off'];

      // Seed random based on userId for some consistency during navigation demo
      let seed = userId;
      const random = () => {
          const x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
      }

      // Generate for a range around the start date to cover navigation
      const rangeStartDate = subWeeks(startDate, this.numberOfWeeksToShow * 2); // Go back further
      const rangeEndDate = addWeeks(startDate, this.numberOfWeeksToShow * 3); // Go forward further

      currentDate = rangeStartDate;

      while (currentDate <= rangeEndDate) {
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          // Generate status based on week number for demo variation
          const weekNum = getWeek(currentDate);
          let status: 'on-site' | 'remote' | 'off' = 'off'; // Default
          if ((userId + weekNum) % 4 === 0) {
               status = 'off';
          } else if ((userId + weekNum) % 2 === 0) {
               status = 'remote';
          } else {
               status = 'on-site';
          }
          schedule[dateKey] = status;


          // Only assign status for the start of the week for weekly view demo
          if (format(currentDate, 'i') === '1') { // 'i' gives ISO day of week (1 = Mon)
            schedule[dateKey] = status;
          } else if (!schedule[dateKey]) {
             // If not start of week, maybe assign 'off' or carry over status?
             // For simplicity in weekly view, we only care about the start date's status
             // schedule[dateKey] = 'off'; // Or remove this line
          }


          currentDate = addWeeks(currentDate, 1);
          
      }
     
      return schedule;
  }


    // Helper for status indicator classes
  getStatusClasses(status: 'on-site' | 'remote' | 'off'): string {
    switch (status) {
      case 'on-site': return 'bg-orange-100 border-orange-300 justify-end'; // Container showing orange active
      case 'remote': return 'bg-blue-100 border-blue-300 justify-start'; // Container showing blue active
      case 'off': return 'bg-gray-100 border-gray-300 justify-start'; // Container showing gray inactive/off
      default: return 'bg-gray-100 border-gray-300';
    }
  }

  getActiveDotClass(status: 'on-site' | 'remote' | 'off'): string {
     switch (status) {
      case 'on-site': return 'bg-orange-500'; // Orange dot
      case 'remote': return 'bg-blue-500'; // Blue dot
      case 'off': return 'bg-gray-300'; // Off uses the inactive dot style
      default: return 'bg-gray-300';
    }
  }

   getInactiveDotClass(status: 'on-site' | 'remote' | 'off'): string {
       // The inactive dot is always the light grey/beige color
       return 'bg-gray-300'; // Inactive dot color
   }





  onStatusToggle(event: ToggleSwitchChangeEvent, user: UserSchedule, date: Date): void { // <-- Updated event type
    const dateKey = this.formatDateKey(date);
    // Logic remains: Default to 'remote' when ON, 'off' when OFF
    const newStatus = event.checked ? 'on-site' : 'remote';
    

  

    if (!user.schedule) {
        user.schedule = {};
    }
    
    user.schedule[dateKey] = newStatus;

    // --- Backend Call Placeholder ---
    // Remember to call your service here to save the change.
    // this.scheduleService.updateUserStatus(user.id, dateKey, newStatus).subscribe(...);
    // ---

    // **Limitation Reminder:** This setup toggles between ('on-site' OR 'remote') and 'off'.
    // It cannot distinguish between toggling ON to 'on-site' vs. 'remote'.
    // When toggled ON (event.checked is true), it currently defaults to 'remote'.
  }


  // --- Helpers (Remain the same) ---
  formatDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  formatDateHeader(date: Date): string {
    return format(date, 'dd-MM');
  }
  getRemoteState(user: UserSchedule, date: Date):ToggleState {
    const dateKey = this.formatDateKey(date);

    return this.toToggleType(user.schedule[dateKey]) as ToggleState;
  }
  toToggleType(status:string){
 switch(status){
  case 'remote' :return -1;
  case 'off' :return 0;
  case 'on-site' :return 1;
  default :return 0;
 }

  }
  fromToggleType(state: ToggleState): 'on-site' | 'remote' | 'off' {
    switch (state) {
      case -1: return 'remote';
      case 0: return 'off';
      case 1: return 'on-site';
      default: return 'off'; // Should not happen if ToggleState is used correctly
    }
  }
   // *** NEW METHOD TO HANDLE THE UPDATE ***
   updateRemoteState(user: UserSchedule, date: Date, newState: ToggleState) {
    const dateKey = this.formatDateKey(date);
    // Convert the new ToggleState number back to the string status
    const newStatus = this.fromToggleType(newState);

    // Update the schedule data for the specific user and date
    user.schedule[dateKey] = newStatus;

    
    // Optional: You might want to trigger saving this change to a backend service here
    // this.scheduleService.saveSchedule(user).subscribe(...);
  }
  getStatus(user: UserSchedule, date: Date): 'on-site' | 'remote' | 'off' {
    const dateKey = this.formatDateKey(date);

    return user.schedule[dateKey] || 'off';
  }

  isUserWorking(user: UserSchedule, date: Date): boolean {
    return this.getStatus(user, date) === 'on-site';
  }

  getSwitchStyleClass(user: UserSchedule, date: Date): string {
    const status = this.getStatus(user, date);

  
    switch (status) {
      case 'on-site': return 'status-on-site';
      case 'remote': return 'status-remote';
      case 'off': return 'status-off';
      default: return '';
    }
  }

 // ... (rest of the component code)

}
