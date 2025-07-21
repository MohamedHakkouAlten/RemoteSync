// src/app/report/report.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common'; // DatePipe still needed if used elsewhere or prefer it over template pipe
import { PaginatorState } from 'primeng/paginator';
import { RCReport } from '../../../models/report.model';
import { ReportStatus } from '../../../enums/report-status.enum';
import { UserUtils } from '../../../utilities/UserUtils';
import { format } from 'date-fns';
import { debounceTime, distinctUntilChanged, Subject, switchMap, take } from 'rxjs';
import { PagedReports } from '../../../dto/response-wrapper.dto';
import { MessageService } from 'primeng/api';
import { RcService } from '../../../services/rc.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportFilter } from '../../../dto/rc/report-filter.dto';

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

  page = signal(0);
  rows = signal(6); // Initial page size
  first = signal(0);

  allReports = signal<PagedReports>({
    reports: [],
    totalElements: 0,
    totalPages: 0,
    pageSize: 0,
    currentPage: 0,
    totalCompleted: 0,
    totalPending: 0,
    totalInProgress: 0,
    totalRejected: 0
  });

  filter = computed((): ReportFilter => {
    return {
      pageNumber: this.page(),
      pageSize: this.rows(),
      name: this.searchTerm(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      status: this.selectedStatus(),
    };
  });
  
  totalRecords = computed(() => this.allReports().totalElements);

  filteredReports: Report[] = [];
  paginatedReports: Report[] = [];
  startDate = computed(() => (this.selectedDateRange()?.[0] ? format(this.selectedDateRange()![0], 'yyyy-MM-dd') : ''));
  endDate = computed(() => (this.selectedDateRange()?.[1] ? format(this.selectedDateRange()![1], 'yyyy-MM-dd') : ''));

  state = computed(() => {
    return {
      filter: this.activeFilter(),
      page: signal(0),
      row: signal(6),
      first: signal(0)
    }
  })

  activeFilter = signal<'status' | 'date' | 'user' | 'none'>('none')
  userUtils = UserUtils
  // --- Filtering State ---
  searchTerm = signal<string>('');
  // --- Filtering State ---
  selectedDateRange = signal<Date[] | null>(null);
  selectedStatus = signal<string>('');
  selectedUser: string | null = null;

  private searchUserInputChange$ = new Subject<string>();

  // --- Status Options ---
  statusOptions: { label: string, value: string }[] = [];

  // --- Status Counts ---
  acceptedReportsCount = computed(() => {
    return this.allReports().totalCompleted;
  });
  
  pendingReportsCount = computed(() => {
    return this.allReports().totalPending;
  });
  
  openedReportsCount = computed(() => {
    return this.allReports().totalInProgress;
  });
  
  rejectedReportsCount = computed(() => {
    return this.allReports().totalRejected;
  });
  

  // --- Modal State ---
  displayReportModal: boolean = false;
  selectedReport: RCReport | null = null;
  // Used to force modal rerender if needed

  constructor(
    private rcService: RcService,

    private messageService: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Initialize status options with translated labels
       this.initStatusOptions(); // Call the new initialization method

    // Optional: Re-initialize options if language changes dynamically
    this.translate.onLangChange
      .pipe() // Use takeUntil for proper unsubscription
      .subscribe(() => {
        console.log('Language changed, re-initializing all status options.');
 
        this.initStatusOptions();
      });
    
    // Setup search debouncing
    this.setupDebouncing();
    
    // Fetch initial reports
    this.setReports();
  }

  onStatusChange() {
    if (this.activeFilter() !== 'status') this.activeFilter.set('status')
    this.selectedDateRange.set(null)

    this.searchTerm.set('')
    this.setReports()
  }

  onDateChange() {
    if (this.activeFilter() !== 'date') this.activeFilter.set('date')

    this.selectedStatus.set('')
    this.searchTerm.set('')
    this.setReports()
  }
  onNameChange() {
    if (this.activeFilter() !== 'user') this.activeFilter.set('user')
    this.selectedDateRange.set(null)
    this.selectedStatus.set('')

    this.setReports()
  }
   onPageChange(event: PaginatorState): void {
    const { page, rows, first } = event;
    if (page === undefined || rows === undefined || first === undefined) return;

    // Update the single source of truth
    this.page.set(page);
    this.rows.set(rows);
    this.first.set(first);

    // Fetch data for the new page
    this.setReports();
  }
  setReports() {

    // this.rcService.getReports().subscribe(reports => { this.allReports.set(reports); });
    this.rcService.getFilteredReports(this.filter()).subscribe(pagedData => { this.allReports.set(pagedData); });
  }

  clearFilters() {

    this.selectedDateRange.set(null)
    this.selectedStatus.set('')
    this.searchTerm.set('')
    this.activeFilter.set('none')
    this.setReports()

  }
  viewReport(report: RCReport): void {
    // Defensive: Always close any open modal first
    this.displayReportModal = true
    this.selectedReport = report;
    // this.displayReportModal = true;
    // this.modalKey++;
    // console.log('Opening report modal for:', report, 'modalKey:', this.modalKey);
    // this.cdRef.markForCheck();
  }

  closeReportModal(): void {
    this.displayReportModal = false;
    this.selectedReport = null;



  }

  setupDebouncing() {
    this.searchUserInputChange$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(searchTerm => {

        return this.rcService.getFilteredReports(this.filter())
      })
    ).subscribe(pagedData => { this.allReports.set(pagedData); });;
  }
  updateReportStatus(updatedReport: RCReport): void {
    this.rcService.updateReport(updatedReport.reportId!, updatedReport.status!).subscribe({
      next: () => {
        this.setReports()
        this.displayReportModal = false
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('report_rc.update.success')
        })
      },
      error: (err) => {
        console.error(err)
        this.displayReportModal = false
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('report_rc.update.error')
        })
      }
    })
  }
  getStatusBgColor(status: ReportStatus): string {
    return 'white'
    switch (status) {
      case ReportStatus.ACCEPTED: return '#ccf0e0'; // Added border for definition
      case ReportStatus.PENDING: return '#ccd5f0';
      case ReportStatus.OPENED: return '#ccd5f0'; // Added border
      case ReportStatus.REJECTED: return '#f4f5e6'; // Added border
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
    }
  }
   private initStatusOptions(): void {
      
      const translationKeys = [
        "report_rc.statusTypes.accepted",
        "report_rc.statusTypes.pending",
        "report_rc.statusTypes.opened",
        "report_rc.statusTypes.rejected"
      ];
  
      this.translate.get(translationKeys).pipe(
        take(1)
      ).subscribe(translations => {
        // Populate the reportStatusOptions array with translated labels
        this.statusOptions = [
          { label: translations["report_rc.statusTypes.accepted"], value: ReportStatus.ACCEPTED },
          { label: translations["report_rc.statusTypes.pending"], value: ReportStatus.PENDING },
          { label: translations["report_rc.statusTypes.opened"], value: ReportStatus.OPENED },
          { label: translations["report_rc.statusTypes.rejected"], value: ReportStatus.REJECTED }
        ];
    
      }, error => {
        console.error('Error fetching translations for report status options:', error);
        // Fallback to untranslated labels on error
        this.statusOptions = [
          { label: 'Accepted', value: ReportStatus.ACCEPTED },
          { label: 'Pending', value: ReportStatus.PENDING },
          { label: 'In Progress', value: ReportStatus.OPENED },
          { label: 'Rejected', value: ReportStatus.REJECTED }
        ];
      });
    }
  getReportBorder(report: RCReport) {
    console.log(`border-1 border-[${this.getStatusTextColor(report.status!)}]`)
    return {

      'border-color': this.getStatusTextColor(report.status!),
      'border-with': '2px'
      // If you want the border color to match bg
    };
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
    // Updated classes to match the orange theme for consistency

    switch (status) {
      case ReportStatus.ACCEPTED: return 'bg-green-100 text-green-700 border border-green-200';
      case ReportStatus.PENDING: return 'bg-orange-100 text-orange-700 border border-orange-200';
      case ReportStatus.OPENED: return 'bg-orange-100 text-orange-700 border border-orange-200';
      case ReportStatus.REJECTED: return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  clearDateRange(): void {
    this.selectedDateRange.set(null);
  }

  /**
   * Gets the translated status label from translation keys
   * @param status The status enum value
   * @returns Translated status text
   */
  getTranslatedStatus(status: ReportStatus): string {
    if (!status) return '';

    const statusKey = status.toString().toLowerCase();
    return this.translate.instant(`report_rc.statusTypes.${statusKey}`);
  }
  
  /**
   * Initializes status dropdown options with translated labels
   */
  
}