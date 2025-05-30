import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { addDays, addMonths, format, getDay, getMonth, getYear, isAfter, isBefore, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfMonth, getWeek, getDate, differenceInDays } from 'date-fns';
import { ProjectDropDownDTO, RcAssociateDTO, RcService, RcAssignRotationUser, CustomDate, RotationStatus } from '../../../services/rc.service';


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

@Component({
  selector: 'app-rotation',
  standalone: true,
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe]
})

export class RotationComponent implements OnInit {
  rotationForm: FormGroup;
  
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<boolean>();
  
  rotationType: 'automatic' | 'custom' = 'automatic';
  
  startDate: string = '';
  endDate: string = '';
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
  
  private dayStatuses: Map<string, 'none' | 'onsite' | 'remote'> = new Map();
  private modifiedDates: Set<string> = new Set(); // Track only manually modified dates
  
  collaboratorSearch: string = '';
  selectedCollaborators: RcAssociateDTO[] = [];
  filteredCollaborators: RcAssociateDTO[] = [];
  showCollaboratorDropdown: boolean = false;
  
  selectedProject: string = '';
  
  // Rotation Pattern:
  // Every X weeks (cycleLengthWeeks), Y weeks (remoteWeeksPerCycle) are remote
  weeksValue: number = 1;     // remoteWeeksPerCycle: Number of remote weeks in the cycle
  periodValue: number = 4;    // cycleLengthWeeks: Total weeks in a rotation cycle (typically 4 weeks per month)
  
  projects: ProjectDropDownDTO[] = [];
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
    const today = new Date();
    this.startDateObj = today;
    this.startDate = this.formatDateForInput(today);
    
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 2);
    this.endDateObj = endDate;
    this.endDate = this.formatDateForInput(endDate);
    
    this.currentMonth = new Date(this.startDateObj);
    this.calendarDate = new Date(this.startDateObj);

    this.loadProjects();
    this.loadAssociates();
    
    if (this.rotationType === 'automatic') {
        this.applyAutomaticRotationPattern();
    } else {
        this.initializeCalendar();
    }
  }
  
  initializeCalendar() {
    this.currentMonth = new Date(this.calendarDate); 
    
    this.currentYear = getYear(this.currentMonth);
    this.currentMonthName = format(this.currentMonth, 'MMMM');
    
    const nextMonthDate = addMonths(this.currentMonth, 1);
    this.nextMonthName = format(nextMonthDate, 'MMMM');
    this.nextMonthYear = getYear(nextMonthDate);
    
    this.calendarWeeks = this.generateCalendarWeeks(this.currentMonth);
    this.nextMonthCalendarWeeks = this.generateCalendarWeeks(nextMonthDate);
  }
  
  generateCalendarWeeks(dateForMonth: Date): CalendarWeek[] {
    const weeks: CalendarWeek[] = [];
    const firstDayOfMonth = startOfMonth(dateForMonth);
    const lastDayOfMonth = endOfMonth(dateForMonth);
    let currentDayIter = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); 

    for (let i = 0; i < 6; i++) { 
        const weekDays: CalendarDay[] = [];
        const firstDayCurrentWeek = new Date(currentDayIter); 

        for (let j = 0; j < 7; j++) {
            const dateStr = format(currentDayIter, 'yyyy-MM-dd');
            const existingStatus = this.dayStatuses.get(dateStr) || 'none';

            weekDays.push({
                date: new Date(currentDayIter),
                day: getDate(currentDayIter),
                isCurrentMonth: isSameMonth(currentDayIter, dateForMonth),
                status: existingStatus
            });
            currentDayIter = addDays(currentDayIter, 1);
        }

        weeks.push({
            weekNumber: getWeek(firstDayCurrentWeek, { weekStartsOn: 0 }),
            days: weekDays
        });

        // Improved break condition: if all days of the current month are rendered, and we have at least 4 weeks.
        const lastDayOfGeneratedWeek = weekDays[6].date;
        if (isAfter(lastDayOfGeneratedWeek, lastDayOfMonth) && i >=3 ) { // Check after rendering at least 4 weeks
            const allDaysOfMonthVisible = weeks.flatMap(w => w.days)
                                             .filter(d => d.isCurrentMonth && isSameMonth(d.date, dateForMonth))
                                             .length >= getDate(lastDayOfMonth);
            if (allDaysOfMonthVisible) break;
        }
    }
    return weeks;
  }

  applyAutomaticRotationPattern() {
    // Validate inputs
    if (!this.startDateObj || !this.endDateObj || this.weeksValue < 0 || this.periodValue < 1) {
        this.dayStatuses.clear(); // Clear statuses if pattern is invalid
        this.initializeCalendar();
        return;
    }

    this.dayStatuses.clear();

    // Normalize start and end dates to ignore time component for accurate comparisons
    const actualStartDate = new Date(this.startDateObj.getFullYear(), this.startDateObj.getMonth(), this.startDateObj.getDate());
    const actualEndDate = new Date(this.endDateObj.getFullYear(), this.endDateObj.getMonth(), this.endDateObj.getDate());

    if (isAfter(actualStartDate, actualEndDate)) {
        this.initializeCalendar(); // No range to apply pattern
        return;
    }

    // Rotation Pattern:
    // Every cycleLengthWeeks (periodValue) weeks, remoteWeeksPerCycle (weeksValue) are remote
    const cycleLengthWeeks = this.periodValue;       // Total weeks in a cycle (e.g., 4)
    const remoteWeeksPerCycle = this.weeksValue;     // Number of remote weeks in the cycle (e.g., 1)
    
    // Find the first Monday on or after the start date to begin our pattern
    // This ensures we're starting at the beginning of a work week
    let currentDate = new Date(actualStartDate);
    while (currentDate.getDay() !== 1) { // 1 is Monday
      currentDate = addDays(currentDate, 1);
    }
    
    // Process the date range week by week to ensure consistent status within each week
    let weekCounter = 0;
    while (!isAfter(currentDate, actualEndDate)) {
      let weekStatus: 'onsite' | 'remote';
      
      // Get the day of week for the current date (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = getDay(currentDate);
      
      // Calculate which week of the cycle we're in
      // We need to calculate this based on days since start date to match backend
      const daysSinceStart = differenceInDays(currentDate, actualStartDate);
      const weeksSinceStart = Math.floor(daysSinceStart / 7);
      
      // Calculate which week in the cycle this is
      const weekInCycle = weeksSinceStart % cycleLengthWeeks;
      
      // Determine if this week is remote or onsite
      // First (cycleLengthWeeks - remoteWeeksPerCycle) weeks are onsite, remaining are remote
      const isRemoteWeek = weekInCycle >= (cycleLengthWeeks - remoteWeeksPerCycle);
      weekStatus = isRemoteWeek ? 'remote' : 'onsite';
      
      // Debug logging to help troubleshoot
      console.log(`Date: ${format(currentDate, 'yyyy-MM-dd')}, Day of week: ${dayOfWeek}`);
      console.log(`Days since start: ${daysSinceStart}, Weeks since start: ${weeksSinceStart}`);
      console.log(`Week in cycle: ${weekInCycle} of ${cycleLengthWeeks}`);
      console.log(`Remote threshold: ${cycleLengthWeeks - remoteWeeksPerCycle}, Is remote: ${isRemoteWeek}`);
      console.log(`Status: ${weekStatus}`);
      console.log('---');
      
      // Apply the same status to all weekdays (Monday-Friday) in this week
      for (let i = 0; i < 5; i++) { // 5 days, Monday through Friday
        const dayDate = addDays(currentDate, i);
        
        // Only set status if the day is within our selected date range
        if (!isBefore(dayDate, actualStartDate) && !isAfter(dayDate, actualEndDate)) {
          const dateStr = format(dayDate, 'yyyy-MM-dd');
          this.dayStatuses.set(dateStr, weekStatus);
        }
      }
      
      // Move to the next Monday and increment week counter
      currentDate = addDays(currentDate, 7);
      weekCounter++;
    }
    
    this.initializeCalendar();
  }
  
  previousMonth() {
    this.calendarDate = addMonths(this.calendarDate, -1);
    this.initializeCalendar();
  }
  
  nextMonth() {
    this.calendarDate = addMonths(this.calendarDate, 1);
    this.initializeCalendar();
  }
  
  isDateInRange(date: Date): boolean {
    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const userStartDate = new Date(this.startDateObj.getFullYear(), this.startDateObj.getMonth(), this.startDateObj.getDate());
    const userEndDate = new Date(this.endDateObj.getFullYear(), this.endDateObj.getMonth(), this.endDateObj.getDate());
    return !isBefore(dateToCheck, userStartDate) && !isAfter(dateToCheck, userEndDate);
  }
  
  selectWeekFromDay(day: CalendarDay, week: CalendarWeek) {
    if (this.rotationType === 'automatic') return;

    if (!day.isCurrentMonth) return;
    if (!this.isDateInRange(day.date)) {
      console.log('Date is outside the allowed range');
      return;
    }
    
    let nextStatus: 'onsite' | 'remote' | 'none';
    if (day.status === 'none') {
      nextStatus = 'onsite';
    } else if (day.status === 'onsite') {
      nextStatus = 'remote';
    } else {
      nextStatus = 'none';
    }
    
    for (const weekDay of week.days) {
      if (weekDay.isCurrentMonth && this.isDateInRange(weekDay.date)) {
        weekDay.status = nextStatus;
        weekDay.isModified = true; // Mark as manually modified
        const dateStr = format(weekDay.date, 'yyyy-MM-dd');
        
        // Track this date as manually modified
        this.modifiedDates.add(dateStr);
        
        if (nextStatus === 'none') {
            this.dayStatuses.delete(dateStr);
            this.modifiedDates.delete(dateStr); // Remove from modified dates if set to none
        } else {
            this.dayStatuses.set(dateStr, nextStatus);
        }
      }
    }
  }
  
  toggleWeek(week: CalendarWeek) {
    if (this.rotationType === 'automatic') return;

    const currentMonthDaysInRange = week.days.filter(d => d.isCurrentMonth && this.isDateInRange(d.date));
    if (currentMonthDaysInRange.length === 0) return;
    
    let nextStatus: 'onsite' | 'remote' | 'none' = 'onsite';
    const firstStatus = currentMonthDaysInRange[0].status;
    const allSameStatus = currentMonthDaysInRange.every(d => d.status === firstStatus);
    
    if (allSameStatus) {
      if (firstStatus === 'none') {
        nextStatus = 'onsite';
      } else if (firstStatus === 'onsite') {
        nextStatus = 'remote';
      } else {
        nextStatus = 'none';
      }
    } else {
      nextStatus = 'onsite';
    }
    
    for (const dayInWeek of week.days) {
      if (dayInWeek.isCurrentMonth && this.isDateInRange(dayInWeek.date)) {
        dayInWeek.status = nextStatus;
        dayInWeek.isModified = true; // Mark as manually modified
        const dateStr = format(dayInWeek.date, 'yyyy-MM-dd');
        
        // Track this date as manually modified
        this.modifiedDates.add(dateStr);
        
        if (nextStatus === 'none') {
            this.dayStatuses.delete(dateStr);
            this.modifiedDates.delete(dateStr); // Remove from modified dates if set to none
        } else {
            this.dayStatuses.set(dateStr, nextStatus);
        }
      }
    }
  }
  
  loadProjects() {
    this.loading = true;
    this.rcService.getRcProjects().subscribe(
      (response) => {
        this.projects = response.data || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    );
  }
  
  loadAssociates() {
    this.loading = true;
    this.rcService.getRcAssociates().subscribe(
      (response) => {
        this.collaborators = response.data || [];
        this.filteredCollaborators = response.data || []; 
        this.loading = false;
      },
      (error) => {
        console.error('Error loading associates:', error);
        this.loading = false;
      }
    );
  }
  
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  closeModal() {
    this.showModal = false;
    this.modalClosed.emit(false);
  }
  
  onStartDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      this.startDateObj = new Date(dateValue + 'T00:00:00');
      
      if (isAfter(this.startDateObj, this.endDateObj)) {
        this.endDateObj = new Date(this.startDateObj);
        this.endDateObj.setMonth(this.startDateObj.getMonth() + 2);
        this.endDate = this.formatDateForInput(this.endDateObj);
      }
      
      this.calendarDate = new Date(this.startDateObj);
      if (this.rotationType === 'automatic') {
        this.applyAutomaticRotationPattern();
      } else {
        this.initializeCalendar();
      }
    }
  }
  
  onEndDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      this.endDateObj = new Date(dateValue + 'T00:00:00');
      
      // It's generally better to ensure endDate is not before startDate.
      // If it is, either alert user or auto-adjust startDate.
      // For now, if endDate < startDate, applyAutomaticRotationPattern will likely result in no pattern.
      if (isBefore(this.endDateObj, this.startDateObj)) {
          // console.warn("End date cannot be before start date for automatic pattern.");
          // Optionally: reset startDateObj to endDateObj or show an error
      }
      
      if (this.rotationType === 'automatic') {
        this.applyAutomaticRotationPattern();
      } else {
        this.initializeCalendar();
      }
    }
  }
  
  searchCollaborators() {
    if (this.collaboratorSearch.trim() === '') {
      this.filteredCollaborators = this.collaborators;
      this.showCollaboratorDropdown = this.collaborators.length > 0;
      return;
    }
    this.filteredCollaborators = this.collaborators.filter(c => 
      (c.firstName + ' ' + c.lastName).toLowerCase().includes(this.collaboratorSearch.toLowerCase())
    );
    this.showCollaboratorDropdown = true;
  }
  
  selectCollaborator(collaborator: RcAssociateDTO) {
    if (!this.selectedCollaborators.some(c => c.userId === collaborator.userId)) {
      this.selectedCollaborators.push(collaborator);
    }
    this.collaboratorSearch = '';
    this.showCollaboratorDropdown = false;
    this.filteredCollaborators = this.collaborators;
  }
  
  removeCollaborator(collaborator: RcAssociateDTO) {
    this.selectedCollaborators = this.selectedCollaborators.filter(c => c.userId !== collaborator.userId);
  }
  
  selectRotationType(type: 'automatic' | 'custom') {
    this.rotationType = type;
    if (type === 'automatic') {
      // Clear the modified dates tracking when switching back to automatic
      this.modifiedDates.clear();
      this.applyAutomaticRotationPattern();
    } else {
      this.calendarDate = new Date(this.startDateObj);
      this.initializeCalendar();
    }
  }
  
  decrementWeeks() {
    if (this.weeksValue > 1) this.weeksValue--;
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }
  
  incrementWeeks() {
    this.weeksValue++;
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }
  
  decrementPeriod() {
    if (this.periodValue > 0) this.periodValue--;
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }
  
  incrementPeriod() {
    this.periodValue++;
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }
  
  swapPattern() {
    // Swap the values (remote weeks <-> total cycle weeks)
    const temp = this.weeksValue;
    this.weeksValue = this.periodValue;
    this.periodValue = temp;
    
    // Ensure valid values after swap
    if (this.periodValue < 1) { 
        this.periodValue = 4; // Default cycle length is 4 weeks (typical month)
    }
    
    // Remote weeks cannot exceed total cycle length
    if (this.weeksValue > this.periodValue) {
        this.weeksValue = this.periodValue;
    }
    
    // Minimum remote weeks is 0
    if (this.weeksValue < 0) {
        this.weeksValue = 0;
    }
    
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }
  
  updatePattern() {
    // Validate and correct input values
    if (isNaN(this.weeksValue) || this.weeksValue < 0) this.weeksValue = 0;
    if (isNaN(this.periodValue) || this.periodValue < 1) this.periodValue = 4; // Default to 4 weeks per month
    
    // Remote weeks cannot exceed total cycle length
    if (this.weeksValue > this.periodValue) this.weeksValue = this.periodValue;
    
    if (this.rotationType === 'automatic') this.applyAutomaticRotationPattern();
  }

  createRotation() {
    // Validate required fields
    if (!this.selectedProject) {
      alert('Please select a project');
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert('Please select start and end dates');
      return;
    }

    if (this.selectedCollaborators.length === 0) {
      alert('Please select at least one collaborator');
      return;
    }

    // Create the rotation request payload
    const rotationData: RcAssignRotationUser = {
      associates: this.selectedCollaborators.map(c => c.userId),
      projectId: this.selectedProject,
      startDate: this.startDate,
      endDate: this.endDate,
      remoteWeeksPerCycle: this.weeksValue,
      cycleLengthWeeks: this.periodValue,
      customDates: undefined
    };

    // For custom mode, only include manually modified dates
    if (this.rotationType === 'custom' && this.modifiedDates.size > 0) {
      const customDates: CustomDate[] = [];
      
      // Only process dates that were explicitly modified by the user
      this.modifiedDates.forEach(dateStr => {
        const status = this.dayStatuses.get(dateStr);
        if (status && status !== 'none') {
          customDates.push({
            date: dateStr,
            rotationStatus: status === 'onsite' ? RotationStatus.ONSITE : RotationStatus.REMOTE
          });
        }
      });
      
      // Only include custom dates if there are modifications
      if (customDates.length > 0) {
        customDates.sort((a, b) => a.date.localeCompare(b.date));
        rotationData.customDates = customDates;
        console.log(`Sending ${customDates.length} manually modified dates`);
      }
    }
    
    console.log('Sending rotation request:', rotationData);
    
    this.loading = true;
    
    // Call the service to create the rotation
    this.rcService.createRotation(rotationData).subscribe(
      (response) => {
        console.log('Rotation created successfully:', response);
        this.loading = false;
        this.closeModal();
        this.modalClosed.emit(true);
      },
      (error) => {
        console.error('Error creating rotation:', error);
        this.loading = false;
        alert('Failed to create rotation. Please try again.');
      }
    );
  }
}