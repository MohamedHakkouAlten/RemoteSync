import { Component, OnInit } from '@angular/core';
// import { MenuItem } from 'primeng/api'; // Uncomment if using p-menu

interface Project { name: string; client: string; duration: string; status: 'Completed' | 'In Progress' | 'Pending'; }
interface Report { title: string; status: 'Accepted' | 'Rejected' | 'Pending'; statusSeverity: 'success' | 'danger' | 'warn'; date: string; }

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Use dedicated CSS
})
export class DashboardComponent implements OnInit {

  // Calendar properties
  currentDate: Date = new Date();
  currentYear: number = this.currentDate.getFullYear();
  currentMonthName: string = '';
  weekdays: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  daysInMonth: Date[] = [];
  daysBeforeMonth: number[] = [];
  daysAfterMonth: number[] = [];

  // --- Data Properties ---
  userName: string = "John Anderson";
  totalProjects: number = 24;
  onSiteWeeks: number = 8;
  reportsCount: number = 16;

  currentProject = {
    title: "Digital Transformation Strategy",
    client: "Tech Solutions Inc.",
    teamSize: "5 members",
    timeline: "Mar 2024 - Aug 2024",
    status: "On track",
    progressValue: 65
  };

  previousProjects: Project[] = [
    { name: 'Cloud Migration', client: 'Global Corp', duration: '6 months', status: 'Completed' },
    { name: 'IT Infrastructure', client: 'StartUp Inc', duration: '3 months', status: 'Completed' },
    { name: 'Data Analytics', client: 'Tech Giant', duration: '4 months', status: 'Completed' },
  ];

  recentReports: Report[] = [
    { title: 'Monthly Revenue Analysis', status: 'Accepted', statusSeverity: 'success', date: '15-03-2024' },
    { title: 'Monthly Revenue Analysis', status: 'Rejected', statusSeverity: 'danger', date: '15-03-2024' },
    { title: 'Monthly Revenue Analysis', status: 'Pending', statusSeverity: 'warn', date: '15-03-2024' },
  ];

  calendarValue: Date | null = null;
  // Highlight dates based on the SECOND image provided (April 2025, yellow bg)
  // Note: Month is 0-indexed, so April is 3.
  highlightedDates: Date[] = [
    new Date(2025, 3, 3), // April 3rd
    new Date(2025, 3, 4), // April 4th
    new Date(2025, 3, 5), // April 5th
    new Date(2025, 3, 11), // April 11th - THIS IS THE SELECTED ONE IN IMAGE
    new Date(2025, 3, 17), // April 17th
    new Date(2025, 3, 18), // April 18th
    new Date(2025, 3, 19)  // April 19th
  ];
  onSiteWorkDaysLabel: string = "On-site Work Days";

  constructor() { }

  ngOnInit(): void {
    // Set calendar to show April 2025 initially to match image
    this.currentDate = new Date(2025, 3, 11); // April 11th, 2025
    this.calendarValue = this.currentDate;
    
    // Initialize calendar
    this.updateCalendar();
  }

  // Function to generate example highlights (kept for reference, but might not be needed now)
  // generateHighlightedDates(): void { /* ... implementation ... */ }

  // --- Custom Calendar Methods ---
  updateCalendar(): void {
    // Update month name and year
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonthName = monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
    
    // Calculate days in current month
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate days before first day of month (empty cells)
    const firstDayOfWeek = firstDay.getDay();
    this.daysBeforeMonth = Array(firstDayOfWeek).fill(0);
    
    // Generate all days in month
    this.daysInMonth = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.daysInMonth.push(new Date(year, month, i));
    }
    
    // Calculate days after last day of month (empty cells)
    const lastDayOfWeek = lastDay.getDay();
    const daysAfterCount = 6 - lastDayOfWeek;
    this.daysAfterMonth = Array(daysAfterCount).fill(0);
  }
  
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateCalendar();
  }
  
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateCalendar();
  }
  
  selectDate(date: Date): void {
    this.calendarValue = date;
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  isSelected(date: Date): boolean {
    if (!this.calendarValue) return false;
    return date.getDate() === this.calendarValue.getDate() && 
           date.getMonth() === this.calendarValue.getMonth() && 
           date.getFullYear() === this.calendarValue.getFullYear();
  }
  
  isHighlighted(date: Date): boolean {
    return this.highlightedDates.some(d =>
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
  }

  // --- Placeholder Methods ---
  viewAllProjects(): void { console.log("Navigate to all projects"); }
  viewAllReports(): void { console.log("Navigate to all reports"); }
  onNotificationClick(): void { console.log("Show notifications"); }
}