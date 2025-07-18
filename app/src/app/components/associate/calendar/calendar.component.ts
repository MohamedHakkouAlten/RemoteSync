// src/app/calendar/calendar.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, getDaysInMonth, getDay, addMonths, subMonths, addYears, subYears, getMonth, getYear, eachMonthOfInterval, startOfYear, endOfYear, eachDayOfInterval, isSameDay, isSameMonth, isToday as isDateToday, set, parseISO } from 'date-fns'; // Import isToday as isDateToday to avoid conflict
import { Subscription } from 'rxjs';

// Import services
import { AssociateService } from '../../../services/associate.service';
import { WebSocketService } from '../../../services/web-socket.service';

// Import DTOs
import { CurrentRotationsDTO } from '../../../dto/associate/current-rotations.dto';

// Import shared models
import { CalendarEvent, DayData, WeekData, MonthSummary, CalendarView, CalendarFilter } from '../../../dto/associate/calendar.model';

// Import helpers
import { CalendarHelpers } from '../utils/calendar-helpers';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
openAddReport() {
this.displayCreateDialog=true
}
  saveNewReport(event:boolean): void {
   

if(event)   { this.messageService.add({
        severity: 'success',
        // Use translation keys for summary and detail
        summary: this.translateService.instant('report.create.successSummary'),
        detail: this.translateService.instant('report.create.successDetail')
      });
    } else {
      this.messageService.add({
        severity: 'error',
        // Use translation keys for summary and detail
        summary: this.translateService.instant('report.create.errorSummary'),
        detail: this.translateService.instant('report.create.errorDetail')
      });
    }
 
}

  hideCreateDialog(): void {
    this.displayCreateDialog = false; // Hide the dialog
   
  }


  // --- View State ---
  currentView: CalendarView = 'year'; // Start with Year view as per first image
  currentDate: Date = new Date();

  // --- Data for Views ---
  weekViewData: DayData[] = [];
  monthViewData: WeekData[] = [];
  yearViewData: MonthSummary[] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Array to store dates with their work location status ---
  workLocationDates: { date: Date; locationType: 'Remote' | 'In Site' }[] = [];

  // --- Event Data (Loaded from LocalStorage) ---
  // Key: 'yyyy-MM-dd', Value: CalendarEvent (we'll store only one primary event per day now)
  eventsData: { [key: string]: CalendarEvent } = {};

  // --- Modal State ---
  displayEditModal: boolean = false;
  selectedDayData: DayData | null = null;
  selectedDateFormatted: string = '';
  editedNote: string = '';
  isEditingExistingEvent: boolean = false; // Flag to track if editing an existing event

  // --- Loading State ---
  isLoading = false;
  loadingError = false;
  private loadingTimeout: any = null;

  // --- Labels ---
  // Using translation keys instead of hardcoded strings
  inSiteLabel = "calendar_associate.in_site";
  remoteLabel = "calendar_associate.remote";
  noEventsLabel = "calendar_associate.no_entry";
  createReportLabel = "calendar_associate.create_report";
  weekLabel = "calendar_associate.week";
  monthLabel = "calendar_associate.month";
  yearLabel = "calendar_associate.year";
  noRotationsMessage = "calendar_associate.no_rotations";
  hasRotations: boolean = true;

  private webSocketSubscription: Subscription | null = null;
displayCreateDialog: boolean=false;

  constructor(
    private cdRef: ChangeDetectorRef, 
    private associateService: AssociateService, 
    private translateService: TranslateService,
    private webSocketService: WebSocketService,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    this.loadEventsFromLocalStorage();
    // Load rotation data from the backend
    this.loadCurrentRotations();
    // Set initial view based on example images (optional, default to month is also fine)
    this.currentView = 'year'; // Or 'month' if preferred default
    this.updateViewData();
    
    // Subscribe to WebSocket updates
    this.subscribeToRotationUpdates();
  }

  ngOnDestroy(): void {
    // Clear any pending timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    
    // Unsubscribe from WebSocket
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
      this.webSocketSubscription = null;
    }
  }

  private subscribeToRotationUpdates(): void {
    this.webSocketSubscription = this.webSocketService.watchRotationTopic().subscribe({
      next: (data) => {
        console.log('Received rotation update:', data);
        // Clear current calendar data
        this.eventsData = {};
        this.workLocationDates = [];
        // Reload the calendar data
        this.loadCurrentRotations();
      },
      error: (error) => {
        console.error('Error in rotation WebSocket subscription:', error);
      }
    });
  }

  // Helper method to populate sample data for demonstration
  populateSampleData(): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Clear existing data for demo purposes
    this.eventsData = {};
    this.workLocationDates = [];

    // Add entries for current week (mix of remote and in-site)
    for (let i = -2; i <= 2; i++) {
      const date = addDays(today, i);
      if (getDay(date) > 0 && getDay(date) < 6) { // Weekdays only
        const isRemote = i % 2 === 0; // Alternate between remote and in-site
        this.addSampleEntry(date, isRemote ? 'Remote' : 'In Site',
          isRemote ? 'Working from home today' : 'Meeting with client team');
      }
    }

    // Add some entries from last month
    const lastMonth = subMonths(today, 1);
    for (let i = 5; i <= 20; i += 3) {
      const date = set(lastMonth, { date: i });
      if (getDay(date) > 0 && getDay(date) < 6) { // Weekdays only
        const isRemote = i % 2 === 0;
        this.addSampleEntry(date, isRemote ? 'Remote' : 'In Site');
      }
    }

    // Add some entries from next month
    const nextMonth = addMonths(today, 1);
    for (let i = 3; i <= 25; i += 4) {
      const date = set(nextMonth, { date: i });
      if (getDay(date) > 0 && getDay(date) < 6) { // Weekdays only
        const isRemote = i % 3 === 0; // Different pattern
        this.addSampleEntry(date, isRemote ? 'Remote' : 'In Site');
      }
    }

    // Add some entries from previous year
    const lastYear = subYears(today, 1);
    for (let month = 0; month < 12; month += 2) { // Every other month
      const monthDate = set(lastYear, { month: month, date: 15 });
      // Add a week of entries
      for (let i = 0; i < 5; i++) {
        const date = addDays(monthDate, i);
        if (getDay(date) > 0 && getDay(date) < 6) { // Weekdays only
          const isRemote = month % 4 === 0; // Some months all remote, others all in-site
          this.addSampleEntry(date, isRemote ? 'Remote' : 'In Site');
        }
      }
    }

    // Save the sample data
    this.saveEventsToLocalStorage();
    this.saveWorkLocationDates();
  }

  // Helper to add a sample entry
  addSampleEntry(date: Date, locationType: 'Remote' | 'In Site', note: string = ''): void {
    const key = format(date, 'yyyy-MM-dd');
    const color = locationType === 'Remote' ? 'orange' : 'blue';

    // Create event
    this.eventsData[key] = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type: locationType,
      color: color,
      note: note,
      date: date // Add required date property
    };

    // Update work location dates array
    this.updateWorkLocationDates(date, locationType);
  }

  // --- View Logic ---
  changeView(view: CalendarView): void {
    if (this.currentView !== view) {
      this.currentView = view;
      // Add a small delay for more consistent UI updates
      setTimeout(() => {
        this.updateViewData();
        this.cdRef.detectChanges();
      }, 0);
    }
  }

  updateViewData(): void {
    // Ensure currentDate reflects reality if needed (e.g., when navigating)
    // this.currentDate = new Date(); // Uncomment if you always want the view centered on 'today' when switching

    switch (this.currentView) {
      case 'week':
        this.generateWeekViewData();
        break;
      case 'month':
        this.generateMonthViewData();
        break;
      case 'year':
        this.generateYearViewData();
        break;
    }
    this.cdRef.markForCheck();
  }

  // --- Data Generation ---
  generateWeekViewData(): void {
    const start = startOfWeek(this.currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(this.currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });
    const today = new Date(); // Get today's date once

    this.weekViewData = days.map(date => ({
      date: date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: true, // All days relevant in week view
      isToday: isSameDay(date, today),
      // Get single event or empty array
      events: this.getEventsForDate(date) ? [this.getEventsForDate(date)!] : []
    }));
  }

  generateMonthViewData(): void {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const today = new Date(); // Get today's date once

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks: WeekData[] = [];
    let currentWeek: DayData[] = [];

    days.forEach((date, index) => {
      const dayData: DayData = {
        date: date,
        dayOfMonth: date.getDate(),
        isCurrentMonth: isSameMonth(date, this.currentDate),
        isToday: isSameDay(date, today),
        // Get single event or empty array
        events: this.getEventsForDate(date) ? [this.getEventsForDate(date)!] : []
      };
      // Optional: Simplified Week Indicator Logic (colors based on dominant event type in week)
      if (dayData.isCurrentMonth && getDay(date) === 1) { // Check on Mondays
         const weekEvents = this.getEventsForWeekContainingDate(date);
         const inSiteCount = weekEvents.filter(ev => ev?.type === 'In Site').length;
         const remoteCount = weekEvents.filter(ev => ev?.type === 'Remote').length;
         if (inSiteCount > remoteCount) dayData.weekIndicator = 'orange';
         else if (remoteCount > inSiteCount) dayData.weekIndicator = 'blue';
      }

      currentWeek.push(dayData);

      if ((index + 1) % 7 === 0) {
        weeks.push({ days: currentWeek });
        currentWeek = [];
      }
    });
    this.monthViewData = weeks;
  }

   getEventsForWeekContainingDate(date: Date): (CalendarEvent | null)[] {
       const start = startOfWeek(date, { weekStartsOn: 0 });
       const end = endOfWeek(date, { weekStartsOn: 0 });
       const daysInWeek = eachDayOfInterval({ start, end });
       return daysInWeek.map(d => this.getEventsForDate(d));
   }

  generateYearViewData(): void {
    const yearStart = startOfYear(this.currentDate);
    const yearEnd = endOfYear(this.currentDate);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    const currentMonthIndex = getMonth(new Date()); // For highlighting current month
    const currentYearNum = getYear(new Date());

    this.yearViewData = months.map((monthDate) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        let inSiteCount = 0;
        let remoteCount = 0;
        const totalBusinessDays = daysInMonth.filter(d => getDay(d) > 0 && getDay(d) < 6).length; // Basic count Mon-Fri

        daysInMonth.forEach(day => {
            const event = this.getEventsForDate(day);
            if (event?.type === 'In Site') {
                inSiteCount++;
            } else if (event?.type === 'Remote') {
                remoteCount++;
            }
        });

        // Base percentage on days with entries or estimate based on business days
        const totalEnteredDays = inSiteCount + remoteCount;
        const denominator = totalEnteredDays > 0 ? totalEnteredDays : 1; // Avoid division by zero

        const inSitePercent = Math.round((inSiteCount / denominator) * 100);
        const remotePercent = Math.round((remoteCount / denominator) * 100);
        // Ensure percentages add up roughly (adjust if needed)
        const calculatedRemotePercent = 100 - inSitePercent;


      return {
        monthName: format(monthDate, 'MMMM'),
        monthIndex: getMonth(monthDate),
        year: getYear(monthDate),
        inSitePercent: inSitePercent,
        // Use calculated remote % to ensure it sums to 100 with the rounded inSite %
        remotePercent: totalEnteredDays > 0 ? calculatedRemotePercent : 0,
        // Check if this month is the actual current month of the real-world date
        isCurrentMonth: getMonth(monthDate) === currentMonthIndex && getYear(monthDate) === currentYearNum
      };
    });
  }

  // --- Event Handling ---

  /** Retrieves the single event for a specific date */
  getEventsForDate(date: Date): CalendarEvent | null {
    const key = format(date, 'yyyy-MM-dd');
    return this.eventsData[key] || null;
  }

  /** Opens the modal to add/edit the event for the selected day */
  openEditModal(dayData: DayData): void {
    // Prevent opening modal for previous/next month days in Month View
    if (this.currentView === 'month' && !dayData.isCurrentMonth) {
        return;
    }

    this.selectedDayData = dayData;
    this.selectedDateFormatted = format(dayData.date, 'EEEE, MMMM d, yyyy'); // e.g., Monday, March 11, 2024
    const existingEvent = this.getEventsForDate(dayData.date);

    if (existingEvent) {
        this.editedNote = existingEvent.note || '';
        this.isEditingExistingEvent = true; // Set flag for existing event
    } else {
        // Reset fields if no existing event
        this.editedNote = '';
        this.isEditingExistingEvent = false; // Clear flag for new event
    }

    this.displayEditModal = true;
    this.cdRef.markForCheck(); // Important for OnPush when modal state changes
  }

  /** Saves changes from the modal */
  saveEventChanges(): void {
    if (!this.selectedDayData) {
        return;
    }

    const key = format(this.selectedDayData.date, 'yyyy-MM-dd');
    const existingEvent = this.eventsData[key];

    let newOrUpdatedEvent: CalendarEvent;
    if (existingEvent) {
        // Update existing event, preserve type/color
        newOrUpdatedEvent = {
            ...existingEvent,
            note: this.editedNote.trim() || undefined
        };
    } else {
        // New note-only event (no type/color)
        newOrUpdatedEvent = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            note: this.editedNote.trim() || undefined,
            date: this.selectedDayData.date // Add required date property
        };
    }
    this.eventsData[key] = newOrUpdatedEvent;

    // Only update workLocationDates if this is a new event and has a type
    if (!this.isEditingExistingEvent && newOrUpdatedEvent.type) {
        this.updateWorkLocationDates(this.selectedDayData.date, newOrUpdatedEvent.type);
    }

    this.saveEventsToLocalStorage();
    this.saveWorkLocationDates(); // Save work location dates
    this.closeEditModal(); // Close modal first
    this.updateViewData(); // Then update the view
  }

  /** Deletes the event for the selected day */
  deleteEvent(): void {
      if (!this.selectedDayData) return;
      const key = format(this.selectedDayData.date, 'yyyy-MM-dd');
      if (this.eventsData[key]) {
          delete this.eventsData[key];

          // Remove from workLocationDates array
          this.removeWorkLocationDate(this.selectedDayData.date);

          this.saveEventsToLocalStorage();
          this.saveWorkLocationDates(); // Save work location dates
          this.closeEditModal();
          this.updateViewData();
      } else {
          this.closeEditModal(); // Just close if no event existed
      }
  }

  /** Closes the modal and resets state */
  closeEditModal(): void {
    this.displayEditModal = false;
    this.selectedDayData = null;
    this.editedNote = '';
    this.isEditingExistingEvent = false; // Reset editing flag
    this.cdRef.markForCheck(); // Update view state
  }


  // --- Navigation ---
  previous(): void {
    switch (this.currentView) {
      case 'week': this.currentDate = addDays(this.currentDate, -7); break;
      case 'month': this.currentDate = subMonths(this.currentDate, 1); break;
      case 'year': this.currentDate = subYears(this.currentDate, 1); break;
    }
    setTimeout(() => {
      this.updateViewData();
      this.cdRef.detectChanges();
    }, 0);
  }

  next(): void {
    switch (this.currentView) {
      case 'week': this.currentDate = addDays(this.currentDate, 7); break;
      case 'month': this.currentDate = addMonths(this.currentDate, 1); break;
      case 'year': this.currentDate = addYears(this.currentDate, 1); break;
    }
    setTimeout(() => {
      this.updateViewData();
      this.cdRef.detectChanges();
    }, 0);
  }

  // Get translated month name
  private getTranslatedMonth(date: Date): string {
    const monthIndex = getMonth(date);
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return this.translateService.instant(`calendar_associate.${monthKeys[monthIndex]}`);
  }

  get displayDateRange(): string {
    switch (this.currentView) {
      case 'week':
        const start = startOfWeek(this.currentDate, { weekStartsOn: 0 });
        const end = endOfWeek(this.currentDate, { weekStartsOn: 0 });
        const startDay = format(start, 'd');
        const endDay = format(end, 'd');
        const year = format(end, 'yyyy');

        if (!isSameMonth(start, end)) {
            return `${this.getTranslatedMonth(start)} ${startDay} - ${this.getTranslatedMonth(end)} ${endDay}, ${year}`;
        } else {
            return `${this.getTranslatedMonth(start)} ${startDay} - ${endDay}, ${year}`;
        }
      case 'month':
        return `${this.getTranslatedMonth(this.currentDate)} ${format(this.currentDate, 'yyyy')}`;
      case 'year':
        return format(this.currentDate, 'yyyy');
    }
  }

  // --- LocalStorage ---
  loadEventsFromLocalStorage(): void {
    const storedData = localStorage.getItem('calendarEventsDataV2'); // Use a new key if structure changed
    if (storedData) {
      try {
        this.eventsData = JSON.parse(storedData);
      } catch (e) {
        console.error("Error parsing events data from LocalStorage:", e);
        this.eventsData = {};
      }
    } else {
      this.eventsData = {};
    }
  }

  saveEventsToLocalStorage(): void {
    try {
      localStorage.setItem('calendarEventsDataV2', JSON.stringify(this.eventsData));
      console.log('Events saved to localStorage');
    } catch (e) {
      console.error("Error saving events data to LocalStorage:", e);
    }
  }

  // --- Load Rotation Data from Backend ---
  loadCurrentRotations(): void {
    this.isLoading = true;
    this.loadingError = false;

    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    // Set a timeout to show error if loading takes too long
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.loadingError = true;
        console.error('Loading timeout: Calendar data could not be loaded within 15 seconds');
      }
    }, 15000); // 15 seconds timeout

    console.log('Fetching current rotations...');
    // First, load existing events data from localStorage to preserve user notes
    this.loadEventsFromLocalStorage();

    this.associateService.getCurrentRotations().subscribe({
      next: (response) => {
        console.log('Received rotation data:', response);
        
        // Clear the timeout as we got a response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }

        this.isLoading = false;

        if (!response || !response.data) {
          // Handle 204 NO CONTENT or empty response
          this.eventsData = {};
          this.workLocationDates = [];
          this.saveEventsToLocalStorage();
          this.saveWorkLocationDates();
          this.updateViewData();
          this.cdRef.detectChanges();
          return;
        }

        // Save existing events with notes before clearing work location dates
        const existingEventsWithNotes: { [key: string]: CalendarEvent } = {};
        Object.keys(this.eventsData).forEach(key => {
          if (this.eventsData[key].note) {
            existingEventsWithNotes[key] = this.eventsData[key];
          }
        });

        // Clear work location dates but preserve notes
        this.workLocationDates = [];

        console.log('Processing on-site dates:', response.data.onSiteDates);
        // Process on-site dates
        if (response.data.onSiteDates && response.data.onSiteDates.length > 0) {
          response.data.onSiteDates.forEach(dateStr => {
            const date = parseISO(dateStr);
            console.log('Adding on-site date:', dateStr, date);

            // Add to workLocationDates array
            this.workLocationDates.push({
              date: date,
              locationType: 'In Site'
            });

            // Also add to eventsData for proper display
            const key = format(date, 'yyyy-MM-dd');
            // If there's an existing note for this date, preserve it
            if (existingEventsWithNotes[key]) {
              this.eventsData[key] = {
                ...existingEventsWithNotes[key],
                id: `onsite-${key}`,
                type: 'In Site',
                color: 'orange', // Orange for In Site (per visitor UI preferences)
                description: `In Site: ${response.data?.projectLabel || 'Project'}`
              };
            } else {
              this.eventsData[key] = {
                id: `onsite-${key}`,
                type: 'In Site',
                color: 'orange', // Orange for In Site (per visitor UI preferences)
                description: `In Site: ${response.data?.projectLabel || 'Project'}`,
                date: parseISO(key) // Add required date property using the key (yyyy-MM-dd format)
              };
            }
          });
        }

        console.log('Processing remote dates:', response.data.remoteDates);
        // Process remote dates
        if (response.data.remoteDates && response.data.remoteDates.length > 0) {
          response.data.remoteDates.forEach(dateStr => {
            const date = parseISO(dateStr);
            console.log('Adding remote date:', dateStr, date);

            // Add to workLocationDates array
            this.workLocationDates.push({
              date: date,
              locationType: 'Remote'
            });

            // Also add to eventsData for proper display
            const key = format(date, 'yyyy-MM-dd');
            // If there's an existing note for this date, preserve it
            if (existingEventsWithNotes[key]) {
              this.eventsData[key] = {
                ...existingEventsWithNotes[key],
                id: `remote-${key}`,
                type: 'Remote',
                color: 'blue', // Blue for Remote
                description: `Remote: ${response.data?.projectLabel || 'Project'}`
              };
            } else {
              this.eventsData[key] = {
                id: `remote-${key}`,
                type: 'Remote',
                color: 'blue', // Blue for Remote
                description: `Remote: ${response.data?.projectLabel || 'Project'}`,
                date: parseISO(key) // Add required date property using the key (yyyy-MM-dd format)
              };
            }
          });
        }

        // Save data to localStorage for persistence
        this.saveEventsToLocalStorage();
        this.saveWorkLocationDates();

        console.log('Updated workLocationDates:', this.workLocationDates);
        console.log('Updated eventsData:', this.eventsData);

        // Force a complete refresh of the view
        setTimeout(() => {
          this.updateViewData();
          this.cdRef.detectChanges();
          console.log('Calendar view updated with rotation data');
        }, 0);
      },
      error: (error) => {
        console.error('Error loading rotations:', error);

        // Clear the timeout as we got an error response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }

        this.isLoading = false;
        this.loadingError = true;

        // If there's an error, try to load from local storage as fallback
        this.loadWorkLocationDatesFromLocalStorage();
      }
    });
  }

  // --- Work Location Dates Methods (As Fallback) ---
  loadWorkLocationDatesFromLocalStorage(): void {
    const storedData = localStorage.getItem('workLocationDatesV1');
    if (storedData) {
      try {
        // Parse the dates from strings back to Date objects
        const parsedData = JSON.parse(storedData);
        this.workLocationDates = parsedData.map((item: any) => ({
          date: new Date(item.date),
          locationType: item.locationType
        }));
      } catch (e) {
        console.error("Error parsing work location dates from LocalStorage:", e);
        this.workLocationDates = [];
      }
    } else {
      this.workLocationDates = [];
    }
  }

  saveWorkLocationDates(): void {
    try {
      localStorage.setItem('workLocationDatesV1', JSON.stringify(this.workLocationDates));
    } catch (e) {
      console.error("Error saving work location dates to LocalStorage:", e);
    }
  }

  updateWorkLocationDates(date: Date, locationType: 'Remote' | 'In Site'): void {
    // Check if the date already exists in the array
    const existingIndex = this.workLocationDates.findIndex(item =>
      isSameDay(item.date, date)
    );

    if (existingIndex !== -1) {
      // Update existing entry
      this.workLocationDates[existingIndex].locationType = locationType;
    } else {
      // Add new entry
      this.workLocationDates.push({
        date: date,
        locationType: locationType
      });
    }
  }

  removeWorkLocationDate(date: Date): void {
    // Remove the date from the array
    this.workLocationDates = this.workLocationDates.filter(item =>
      !isSameDay(item.date, date)
    );
  }

  // Get all dates with a specific location type
  getDatesByLocationType(locationType: 'Remote' | 'In Site'): Date[] {
    return this.workLocationDates
      .filter(item => item.locationType === locationType)
      .map(item => item.date);
  }

  // --- Utility ---
   trackByDate(index: number, dayData: DayData): string {
      // Use a composite key including relevant state if needed for better tracking
      const eventType = dayData.events[0]?.type || 'none';
      return `${dayData.date.toISOString()}-${eventType}`;
    }
    trackByWeek(index: number, weekData: WeekData): string {
      return weekData.days[0]?.date.toISOString() ?? index.toString();
    }
    trackByMonth(index: number, monthData: MonthSummary): string {
      return `${monthData.year}-${monthData.monthIndex}`;
    }
    // Template helpers
    getDay(date: Date): number { return getDay(date); }
    setMonth(date: Date, monthIndex: number): Date {
        // Create a new date to avoid mutating the original currentDate directly
        // Set day to 1 initially to avoid month overflow issues (e.g., going from Jan 31 to Feb)
        const newDate = set(date, { month: monthIndex, date: 1 });
        this.currentDate = newDate; // Update the main date
        this.updateViewData(); // Ensure view is updated after changing the month
        return newDate; // Return it although side effect happened
    }

    // Helper to get event for template checks
    getPrimaryEvent(day: DayData): CalendarEvent | null {
        return day.events.length > 0 ? day.events[0] : null;
    }
}
