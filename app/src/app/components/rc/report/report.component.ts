// src/app/report/report.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common'; // DatePipe still needed if used elsewhere or prefer it over template pipe
import { PaginatorState } from 'primeng/paginator';
import { RCReport } from '../../../models/report.model';
import { ReportStatus } from '../../../enums/report-status.enum';
import { UserUtils } from '../../../utilities/UserUtils';
import { format } from 'date-fns';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { PagedReports } from '../../../dto/response-wrapper.dto';
import { MessageService } from 'primeng/api';
import { RcService } from '../../../services/rc.service';

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
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  // Report data
  allReports = signal<PagedReports>({
      reports:[],
      totalElements:0,
      totalPages:0,
      pageSize:0,
      currentPage:0
  });
  
  // Loading states
  isLoading: boolean = false;
  loadingError: boolean = false;
  loadingTimeout: any = null;
      
  filteredReports: Report[] = [];
  paginatedReports: Report[] = [];

  state = computed(() => {
    return {
      filter: this.activeFilter(),
      page: signal(0),
      row: signal(6)
    }
  })
  activeFilter = signal<'status' | 'date' | 'user'|'none'>('none')
  userUtils = UserUtils
  // --- Filtering State ---
  searchTerm: string = '';
  selectedDateRange: Date[] | null = null;
  selectedStatus: string | null = null;
  selectedUser: string | null = null;

  // Create a subject for search debouncing exactly like ProjectComponent
  private searchSubject = new Subject<string>();

  // --- Status Options ---
  statusOptions = [
    { label: 'Completed', value: 'ACCEPTED' },
    { label: 'In Progress', value: 'OPENED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  // --- Pagination State ---
  totalRecords=computed(()=>this.allReports().totalElements)

  // --- Modal State ---
  displayReportModal: boolean = false;
  selectedReport: RCReport | null = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private rcService: RcService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Setup search debounce exactly like in ProjectComponent
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      // Reset to first page when search changes
      this.state().page.set(0);
      this.loadReports();
    });
    
    // Initial load of reports
    this.loadReports();
  }

  onStatusChange() {
    if (this.activeFilter() !== 'status') this.activeFilter.set('status')
    this.selectedDateRange = null
    this.searchTerm = ''
    
    // Reset to first page and load data immediately (like ProjectComponent.onFilterChange)
    this.state().page.set(0);
    this.loadReports();
  }

  onDateChange() {
    if (this.activeFilter() !== 'date') this.activeFilter.set('date')
    this.selectedStatus = null
    this.searchTerm = ''
    
    // Reset to first page and load data immediately
    this.state().page.set(0);
    this.loadReports();
  }
  
  onNameChange() {
    if (this.activeFilter() !== 'user') this.activeFilter.set('user')
    this.selectedDateRange = null
    this.selectedStatus = null
    
    // Reset to first page and load data immediately
    this.state().page.set(0);
    this.loadReports();
  }
  
  onSearchTermChange() {
    if (this.activeFilter() !== 'none') this.activeFilter.set('none')
    this.selectedDateRange = null
    this.selectedStatus = null
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(event: any) {
    // Check if event is a PaginatorState or convert it
    const paginatorEvent = event as PaginatorState;
    
    // Get page and rows per page from event
    const page = paginatorEvent.page !== undefined ? paginatorEvent.page : 0;
    const rows = paginatorEvent.rows !== undefined ? paginatorEvent.rows : 6;
    
    // Update state
    this.state().page.set(page);
    this.state().row.set(rows);
    
    // Load reports with new pagination
    this.loadReports();
  }

  /**
   * Load reports based on current filters and pagination
   */
  loadReports() {
    // Show loading state
    this.isLoading = true;
    this.loadingError = false;
    
    // Set a timeout to show loading state for at least 300ms for UX
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = false;
    }, 800);
    
    // Build search criteria
    const criteria: any = {
      pageNumber: this.state().page(),
      pageSize: this.state().row()
    };

    // Add search term filter if present
    if (this.searchTerm) {
      criteria.title = this.searchTerm.trim();
    }
    
    // Add status filter if present
    if (this.selectedStatus) {
      criteria.status = this.selectedStatus as any;
    }
    
    // Add date filter if date range is selected
    if (this.selectedDateRange && this.selectedDateRange.length === 2 && this.selectedDateRange[0]) {
      const startDate = this.selectedDateRange[0];
      criteria.startDate = format(startDate, 'yyyy-MM-dd');
    }

    // Clean the criteria object by removing undefined, null, or empty string values
    const cleanedCriteria = Object.fromEntries(
      Object.entries(criteria).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ''
      )
    );
    
    // Call API with cleaned criteria
    this.rcService.getRcReports(cleanedCriteria).subscribe(
      response => {
        // Clear loading state
        this.isLoading = false;
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
        }
        
        // Update reports data
        if (response && response.data && response.data.reportDTOs) {
          // Map the backend data structure to PagedReports format
          console.log('Backend response:', response.data);
          
          // Convert reportDTOs to RCReport[] format using any to avoid type conflicts
          const reportDTOs: any[] = response.data.reportDTOs;
          const mappedReports: RCReport[] = reportDTOs.map((dto: any) => {
            // Convert string status to ReportStatus enum if needed
            const reportStatus = dto.status as ReportStatus;
            
            return {
              reportId: dto.reportId,
              title: dto.title,
              description: dto.description || '',
              status: reportStatus,
              createdBy: dto.createdBy,
              createdAt: dto.createdAt
            } as RCReport;
          });
          
          const pagedReports: PagedReports = {
            reports: mappedReports,
            totalElements: mappedReports.length,
            totalPages: 1, // Since we're getting all reports at once
            pageSize: mappedReports.length,
            currentPage: 0
          };
          this.allReports.set(pagedReports);
        } else {
          // Handle empty response
          this.allReports.set({
            reports: [],
            totalElements: 0,
            totalPages: 0,
            pageSize: this.state().row(),
            currentPage: this.state().page()
          });
        }
      },
      error => {
        console.error('Error loading reports:', error);
        this.isLoading = false;
        this.loadingError = true;
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
        }
      }
    );
  }
//       this.fetchAllReports();
//       return;
//     }
    
//     // Create basic DTO and only add properties that have values
//     const pagedDto: Record<string, any> = {};
    
//     const page = this.state().page();
//     const rows = this.state().row();
    
//     if (page !== undefined && page !== null) {
//       pagedDto['pageNumber'] = page;
//     }
    
//     if (rows !== undefined && rows !== null) {
//       pagedDto['pageSize'] = rows;
//     }
    
//     // Only add startDate if we have a valid date
//     if (this.selectedDateRange && this.selectedDateRange[0]) {
//       pagedDto['startDate'] = format(this.selectedDateRange[0], 'yyyy-MM-dd');
//     }
    
//     this.reportService.getRcReports(pagedDto).subscribe(
//       pagedData => { 
//         this.allReports.set(pagedData);
//         this.isLoading = false;
//         if (this.loadingTimeout) {
//           clearTimeout(this.loadingTimeout);
//         }
//       },
//       error => {
//         console.error('Error loading reports by date:', error);
//         this.isLoading = false;
//         this.loadingError = true;
//         if (this.loadingTimeout) {
//           clearTimeout(this.loadingTimeout);
//         }
//       }
//     );
//   }

  clearFilters(){
    this.selectedDateRange = null
    this.selectedStatus = null
    this.searchTerm = ''
    this.activeFilter.set('none')
    this.state().page.set(0);
    this.loadReports()
  }
  
  viewReport(report: RCReport): void {
    // Defensive: Always close any open modal first
    this.displayReportModal = true
    this.selectedReport = report;
  }

  closeReportModal(): void {
    this.displayReportModal = false;
    this.selectedReport = null;
    this.cdRef.markForCheck();
  }
  
  // Method no longer needed since we're using a simpler approach like ProjectComponent
  setupDebouncing() {
    // Empty - implementation moved to ngOnInit
  }

  updateReportStatus(newStatus: any): void {
    // Ensure we have a valid report status
    const reportStatus = newStatus as ReportStatus;
    
    if (this.selectedReport?.reportId && reportStatus) {
      this.rcService.updateReport(this.selectedReport.reportId, reportStatus).subscribe({
        next: () => {
          this.loadReports()
          this.displayReportModal = false
          this.messageService.add({
            severity: 'success',
            summary: "Report updated successfully"
          })
        },
        error: (error: any) => {
          console.log(error)
          this.displayReportModal = false
          this.messageService.add({
            severity: 'error',
            summary: error?.message || 'Failed to update report'
          })
        }
      })
    }
  }
  getStatusBgColor(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.ACCEPTED: return '#ccf0e0'; // Added border for definition
      case ReportStatus.PENDING: return '#ccd5f0';
      case ReportStatus.OPENED: return '#ccd5f0'; // Added border
      case ReportStatus.REJECTED: return '#f4f5e6'; // Added border
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
    }
  }
  
  getStatusTextColor(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.ACCEPTED: return '#0da669'; // Added border for definition
      case ReportStatus.PENDING: return '#0d33a6';
      case ReportStatus.OPENED: return '#0d33a6'; // Added border
      case ReportStatus.REJECTED: return '#a3a60d'; // Added border
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
    }
  }
  
  getStatusClass(status: ReportStatus): string {
    // CSS classes remain the same
    switch (status) {
      case ReportStatus.ACCEPTED: return 'bg-green-100 text-green-700 border border-green-200'; // Added border for definition
      case ReportStatus.PENDING: return 'bg-blue-100 text-blue-700 border border-blue-200';
      case ReportStatus.OPENED: return 'bg-blue-100 text-blue-700 border border-blue-200'; // Added border
      case ReportStatus.REJECTED: return 'bg-yellow-100 text-yellow-700 border border-yellow-200'; // Added border
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
    }
  }

  get paginationSummary(): string {
    if (this.totalRecords() === 0) return 'Showing 0 reports';
    const row = this.state().row();
    const start = row * this.state().page()
    const end = Math.min(start + row, this.totalRecords());
    return `Showing ${start + 1}–${end} of ${this.totalRecords()} reports`;
  }

  clearDateRange(): void {
    this.selectedDateRange = null;
    this.state().page.set(0);
    this.loadReports();
  }
}