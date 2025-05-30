// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Import enums and DTOs
import { ReportStatus } from '../../../dto/report-status.enum';
import { ProjectStatus } from '../../../dto/project-status.enum';
import { ProjectDTO } from '../../../dto/project.dto';
import { ReportDTO } from '../../../dto/report.dto';

// Import services
import { AssociateService } from '../../../services/associate.service';
import { AuthFacadeService } from '../../../services/auth-facade.service';

// Import shared models and helpers
import { CalendarDay, CalendarEvent, DashboardStats, DashboardProjectDTO, DashboardReportDTO } from '../models/dashboard.model';
import { CalendarHelpers } from '../utils/calendar-helpers';
import { AssociateUIHelpers } from '../utils/ui-helpers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Expose enums to template
  public ProjectStatus = ProjectStatus;
  public ReportStatus = ReportStatus;
  
  // Loading state properties
  isLoading: boolean = false;
  loadingError: boolean = false;
  
  // User info properties
  firstName: string = '';
  lastName: string = '';
  
  // Dashboard statistics
  dashboardStats: DashboardStats = {
    totalProjects: 0,
    onSiteWeeks: 0,
    reportsCount: 0
  };
  
  // Project and report data
  currentProject: DashboardProjectDTO | null = null;
  previousProjects: DashboardProjectDTO[] = [];
  recentReports: DashboardReportDTO[] = [];
  onSiteWorkDaysLabel: string = "On-site Work Days";
  
  // Calendar properties
  calendarValue: Date | null = null;
  highlightedDates: Date[] = [];
  calendarEvents: CalendarEvent[] = [];
  currentDate: Date = new Date();
  currentYear: number = this.currentDate.getFullYear();
  currentMonth: number = this.currentDate.getMonth();
  currentMonthName: string = CalendarHelpers.getMonthName(this.currentMonth);
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth: Date[] = [];
  daysBeforeMonth: number[] = [];
  daysAfterMonth: number[] = [];
  
  // Private properties
  private loadingTimeout: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private authFacadeService: AuthFacadeService,
    private associateService: AssociateService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    // Initialize calendar
    this.setupCalendar();
    
    // Load dashboard data
    this.loadDashboardData();
  }

  /**
   * Clean up resources when component is destroyed
   */
  ngOnDestroy(): void {
    // Clear any pending timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load dashboard data from the backend
   */
  loadDashboardData(): void {
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
      }
    }, 15000); // 15 seconds timeout
    
    // Subscribe to dashboard data
    const dashboardSubscription = this.associateService.getDashboard().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          // Set user info
          this.firstName = this.authFacadeService.getFirstName() || 'Associate';
          this.lastName = this.authFacadeService.getLastName() || '';
          
          // Set current project
          if (res.data.currentProject) {
            this.currentProject = this.mapToUiProject(res.data.currentProject);
          } else {
            this.currentProject = null;
          }
          
          // Set previous projects
          this.previousProjects = Array.isArray(res.data.oldProjects) 
            ? res.data.oldProjects.map(project => this.mapToUiProject(project))
            : [];
          
          // Set recent reports
          this.recentReports = Array.isArray(res.data.recentReports)
            ? res.data.recentReports.map(report => this.mapToUiReport(report))
            : [];
          
          // Update dashboard stats
          this.dashboardStats = {
            totalProjects: res.data.projectsCount || 0,
            reportsCount: res.data.reportsCount || 0,
            onSiteWeeks: Array.isArray(res.data.onSiteWeeks) ? res.data.onSiteWeeks.length : 0
          };
          
          // Process calendar data
          if (res.data.onSiteWeeks && Array.isArray(res.data.onSiteWeeks)) {
            // Convert string dates to Date objects for calendar highlighting
            this.highlightedDates = res.data.onSiteWeeks.map((dateStr: string) => new Date(dateStr));
            
            // Create calendar events from on-site dates
            this.calendarEvents = res.data.onSiteWeeks.map((dateStr: string) => ({
              date: new Date(dateStr),
              type: 'on-site',
              title: 'On-site work day'
            }));
          }
          
          // Clear the timeout as we got a response
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
          }
          
          this.isLoading = false;
        } else {
          this.handleError();
        }
      },
      error: () => {
        this.handleError();
      }
    });
    
    // Add subscription to the array for cleanup
    this.subscriptions.push(dashboardSubscription);
  }
  
  /**
   * Handle error in data loading
   */
  private handleError(): void {
    this.isLoading = false;
    this.loadingError = true;
    
    // Clear the timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }
  
  /**
   * Calculate project progress as a percentage
   */
  getProjectProgress(project: ProjectDTO): number {
    if (!project || !project.startDate || !project.deadLine) return 0;
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.deadLine).getTime();
    const now = Date.now();
    if (isNaN(start) || isNaN(end) || start >= end) return 0;
    const progress = ((now - start) / (end - start)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }
  
  /**
   * Setup calendar with initial data
   */
  setupCalendar(): void {
    // Initialize calendar with current month
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = CalendarHelpers.getMonthName(this.currentMonth);
    
    // Update calendar display
    this.updateCalendar();
  }
  
  /**
   * Update calendar display based on selected month and year
   */
  updateCalendar(): void {
    // Get current month and year from calendar value or current date
    const calendarMonth = this.calendarValue ? this.calendarValue.getMonth() : this.currentMonth;
    const calendarYear = this.calendarValue ? this.calendarValue.getFullYear() : this.currentYear;
    
    // Get calendar days using helper functions
    this.daysInMonth = CalendarHelpers.getDaysInMonth(calendarYear, calendarMonth);
    this.daysBeforeMonth = CalendarHelpers.getDaysBeforeMonth(calendarYear, calendarMonth);
    this.daysAfterMonth = CalendarHelpers.getDaysAfterMonth(calendarYear, calendarMonth);
    
    // Update month name
    this.currentMonthName = CalendarHelpers.getMonthName(calendarMonth);
  }
  
  /**
   * Navigate to projects page
   */
  viewAllProjects(): void {
    this.router.navigate(['/associate/projects']);
  }

  /**
   * Navigate to reports page
   */
  viewAllReports(): void {
    this.router.navigate(['/associate/reports']);
  }
  
  /**
   * Maps a backend ProjectDTO to the enhanced UI DashboardProjectDTO
   * @param project The backend project DTO
   * @returns Enhanced project DTO with additional UI properties
   */
  private mapToUiProject(project: ProjectDTO): DashboardProjectDTO {
    if (!project) return null as any;
    
    // Calculate progress value between 0-100 based on start and deadline dates
    const startDate = project.startDate ? new Date(project.startDate) : new Date();
    const deadlineDate = project.deadLine ? new Date(project.deadLine) : new Date();
    const now = new Date();
    
    // Calculate percentage complete (0-100)
    let progressValue = 0;
    try {
      const totalDuration = deadlineDate.getTime() - startDate.getTime();
      if (totalDuration > 0) {
        const elapsed = now.getTime() - startDate.getTime();
        progressValue = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
      }
    } catch (error) {
      console.error('Error calculating progress value:', error);
    }
    
    // Format client name from the owner information
    let client = 'N/A';
    if (project.owner) {
      client = project.owner.name || 'Unknown Client';
    }
    
    // Format timeline string
    const startDateStr = this.datePipe.transform(project.startDate, 'MMM dd, yyyy') || 'N/A';
    const endDateStr = this.datePipe.transform(project.deadLine, 'MMM dd, yyyy') || 'N/A';
    const timeline = `${startDateStr} - ${endDateStr}`;
    
    // Calculate duration in weeks
    let duration = 'N/A';
    try {
      if (project.startDate && project.deadLine) {
        const start = new Date(project.startDate);
        const end = new Date(project.deadLine);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        duration = `${Math.ceil(diffDays / 7)} weeks`;
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
    }
    
    // Default team size
    const teamSize = 5; // This would normally come from the backend
    
    return {
      ...project,
      progressValue,
      client,
      timeline,
      teamSize,
      duration
    };
  }
  
  /**
   * Maps a backend ReportDTO to the enhanced UI DashboardReportDTO
   * @param report The backend report DTO
   * @returns Enhanced report DTO with additional UI properties
   */
  private mapToUiReport(report: ReportDTO): DashboardReportDTO {
    if (!report) return null as any;
    
    // Format date string
    const date = this.datePipe.transform(report.createdAt, 'MMM dd, yyyy') || 'N/A';
    
    // Determine status severity for UI
    let statusSeverity = 'info';
    if (report.status) {
      switch (report.status) {
        case ReportStatus.ACCEPTED:
          statusSeverity = 'success';
          break;
        case ReportStatus.REJECTED:
          statusSeverity = 'danger';
          break;
        case ReportStatus.PENDING:
          statusSeverity = 'warn';
          break;
        default:
          statusSeverity = 'info';
      }
    }
    
    // Default values for missing properties
    const reason = report.reason || 'No reason provided';
    const description = report.description || 'No description available';
    
    return {
      ...report,
      statusSeverity,
      date,
      reason,
      description
    };
  }
  
  /**
   * Check if a date has any events
   */
  isHighlighted(date: Date): boolean {
    return this.highlightedDates.some(d =>
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
  }
  
  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  /**
   * Check if a date is selected
   */
  isSelected(date: Date): boolean {
    if (!this.calendarValue) return false;
    return date.getDate() === this.calendarValue.getDate() && 
           date.getMonth() === this.calendarValue.getMonth() && 
           date.getFullYear() === this.calendarValue.getFullYear();
  }
  
  /**
   * Navigate to previous month
   */
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.updateCalendar();
  }
  
  /**
   * Navigate to next month
   */
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.updateCalendar();
  }
  
  /**
   * Select a date in the calendar
   */
  selectDate(date: Date): void {
    this.calendarValue = date;
  }
}
