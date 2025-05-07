// src/app/report/report.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common'; // DatePipe still needed if used elsewhere or prefer it over template pipe
import { PaginatorState } from 'primeng/paginator';

// --- Interface & Data ---
interface Report {
  id: number;
  authorName: string;
  authorDept: string;
  authorAvatarUrl: string;
  title: string;
  date: Date;
  status: 'completed' | 'in progress' | 'pending';
  description?: string;
}

@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe],
})
export class ReportComponent implements OnInit {

  allReports: Report[] = [];
  filteredReports: Report[] = [];
  paginatedReports: Report[] = [];

  // --- Filtering State ---
  searchTerm: string = '';
  selectedDateRange: Date[] | null = null;
  selectedStatus: string | null = null;
  selectedUser: string | null = null;

  // --- Status Options ---
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Pending', value: 'pending' }
  ];

  // --- Pagination State ---
  totalRecords: number = 0;
  rows: number = 6;
  first: number = 0;

  // --- Modal State ---
  displayReportModal: boolean = false;
  selectedReportForModal: Report | null = null;
  modalKey: number = 0; // Used to force modal rerender if needed

  constructor(
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe // Keep injection if used in TS logic, otherwise optional
  ) {}

  ngOnInit(): void {
    this.loadMockReports();
    this.applyFiltersAndPagination();
  }

  loadMockReports(): void {
    // Use a single avatar image for all reports to avoid 404 errors
    this.allReports = [
        { id: 1, authorName: 'Sarah Wilson', authorDept: 'Design', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Q1 Performance Review', date: new Date(2024, 3, 15), status: 'completed', description: 'Quarterly performance review covering team achievements, challenges, and goals for Q1 2024. Including detailed metrics on project deliverables and team productivity.' },
        { id: 2, authorName: 'Michael Chen', authorDept: 'Engineering', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Project Progress Report', date: new Date(2024, 3, 14), status: 'in progress', description: 'Weekly update on the Project Phoenix development milestones, blocker identification, and resource allocation.' },
        { id: 3, authorName: 'Emily Davis', authorDept: 'Marketing', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Marketing Campaign Analysis', date: new Date(2024, 3, 13), status: 'pending', description: 'Analysis of the recent "Spring Forward" campaign results, including lead generation, conversion rates, and ROI.' },
        { id: 4, authorName: 'David Kim', authorDept: 'Product', authorAvatarUrl: 'assets/images/avatar1.png', title: 'User Research Findings', date: new Date(2024, 3, 12), status: 'completed', description: 'Summary of findings from recent user interviews regarding the checkout process improvements. Key pain points and recommendations outlined.' },
        { id: 5, authorName: 'Lisa Thompson', authorDept: 'Operations', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Operations Overview', date: new Date(2024, 3, 11), status: 'in progress', description: 'Monthly overview of operational efficiency metrics, including server uptime, support ticket resolution times, and infrastructure costs.' },
        { id: 6, authorName: 'Sarah Wilson', authorDept: 'Design', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Team Performance Review', date: new Date(2024, 3, 10), status: 'completed', description: 'Review of the design team\'s performance over the last month, focusing on project completion rates and cross-functional collaboration.' },
        { id: 7, authorName: 'Michael Chen', authorDept: 'Engineering', authorAvatarUrl: 'assets/images/avatar1.png', title: 'Infrastructure Audit', date: new Date(2024, 3, 9), status: 'pending', description: 'Results of the quarterly security and infrastructure audit, highlighting areas for improvement and required patching schedules.' },
    ];
    this.totalRecords = this.allReports.length;
  }

  applyFiltersAndPagination(): void {
    // Filter logic remains the same
    this.filteredReports = this.allReports.filter(report => {
      const searchTermMatch = !this.searchTerm ||
                              report.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              report.authorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const dateMatch = !this.selectedDateRange || !this.selectedDateRange[0] ||
                         (this.selectedDateRange[0] && !this.selectedDateRange[1] &&
                          report.date >= this.selectedDateRange[0]) ||
                         (this.selectedDateRange[0] && this.selectedDateRange[1] &&
                          report.date >= this.selectedDateRange[0] && report.date <= this.selectedDateRange[1]);
      const statusMatch = !this.selectedStatus || report.status === this.selectedStatus;
      const userMatch = !this.selectedUser || report.authorName === this.selectedUser;
      return searchTermMatch && dateMatch && statusMatch && userMatch;
    });
    this.totalRecords = this.filteredReports.length;
    this.updatePaginatedReports();
    this.cdRef.markForCheck();
  }

  onFilterChange(): void {
    this.first = 0;
    this.applyFiltersAndPagination();
  }

  onPageChange(event: PaginatorState): void {
   this.first = event.first ?? 0;
   this.rows = event.rows ?? this.rows;
   this.updatePaginatedReports();
   this.cdRef.markForCheck();
  }

  updatePaginatedReports(): void {
     const startIndex = this.first;
     const endIndex = this.first + this.rows;
     this.paginatedReports = this.filteredReports.slice(startIndex, endIndex);
   }

  viewReport(report: Report): void {
    // Defensive: Always close any open modal first
    if (this.displayReportModal) {
      this.closeReportModal();
    }
    this.selectedReportForModal = report;
    this.displayReportModal = true;
    this.modalKey++;
    console.log('Opening report modal for:', report, 'modalKey:', this.modalKey);
    this.cdRef.markForCheck();
  }

  closeReportModal(): void {
    this.displayReportModal = false;
    this.selectedReportForModal = null;
    this.modalKey++;
    console.log('Closing report modal, modalKey:', this.modalKey);
    this.cdRef.markForCheck();
  }

  updateReportStatus(newStatus: 'completed' | 'in progress' | 'pending'): void {
    if (!this.selectedReportForModal) return;
    const reportIdToUpdate = this.selectedReportForModal.id;
    console.log(`Updating report ${reportIdToUpdate} status to: ${newStatus} (Simulated)`);
    const reportIndex = this.allReports.findIndex(r => r.id === reportIdToUpdate);
    if (reportIndex > -1) {
      this.allReports[reportIndex].status = newStatus;
      this.applyFiltersAndPagination(); // Refresh list
    } else {
      console.warn(`Report with ID ${reportIdToUpdate} not found.`);
    }
    this.closeReportModal();
  }

  getStatusClass(status: 'completed' | 'in progress' | 'pending'): string {
    // CSS classes remain the same
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-700 border border-green-200'; // Added border for definition
        case 'in progress': return 'bg-blue-100 text-blue-700 border border-blue-200'; // Added border
        case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200'; // Added border
        default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
      }
  }

  get paginationSummary(): string {
      if (this.totalRecords === 0) return 'Showing 0 reports';
      const start = this.first + 1;
      const end = Math.min(this.first + this.rows, this.totalRecords);
      return `Showing ${start}–${end} of ${this.totalRecords} reports`;
   }

   clearDateRange(): void {
      this.selectedDateRange = null;
      this.onFilterChange();
  }
}