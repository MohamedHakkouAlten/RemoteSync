// src/app/report/report.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common'; // DatePipe still needed if used elsewhere or prefer it over template pipe
import { PaginatorState } from 'primeng/paginator';
import { ReportService } from '../../../services/report.service';
import { RCReport } from '../../../models/report.model';
import { ReportStatus } from '../../../enums/report-status.enum';
import { UserUtils } from '../../../utilities/UserUtils';
import { format } from 'date-fns';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { PagedReports } from '../../../dto/response-wrapper.dto';
import { MessageService } from 'primeng/api';

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

  allReports = signal<PagedReports>({
      reports:[],
      totalElements:0,
      totalPages:0,
      pageSize:0,
      currentPage:0
  
    });
  
    
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

  private searchUserInputChange$ = new Subject<string>();

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
 // Used to force modal rerender if needed

  constructor(
    private cdRef: ChangeDetectorRef,
    private reportService: ReportService,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {

    this.setupDebouncing()
    this.reportService.getReports().subscribe(pagedData => {
      this.allReports.set(pagedData);
    })
    console.log(this.allReports())
   

  }






  onStatusChange() {
    if (this.activeFilter() !== 'status') this.activeFilter.set('status')
         this.selectedDateRange=null

    this.searchTerm=''
    this.setReports()
  }

  onDateChange() {
    if (this.activeFilter() !== 'date') this.activeFilter.set('date')

    this.selectedStatus=null
    this.searchTerm=''
    this.setReports()
  }
  onNameChange(){
     if (this.activeFilter() !== 'user') this.activeFilter.set('user')
         this.selectedDateRange=null
    this.selectedStatus=null

    this.setReports()
  }
  onPageChange(event: PaginatorState): void {

    const rows = event.rows ?? this.state().row();
    const page = event.page ?? this.state().page();
    this.state().row.set(rows)
    this.state().page.set(page)
    if(this.activeFilter()=='user') this.reportService.getReportsByName(page, rows,this.searchTerm).subscribe(pagedData => { this.allReports.set(pagedData); });
    else this.setReports()
  }

  setReports() {
    const rows = this.state().row()
    const page = this.state().page()
    switch (this.activeFilter()) {

      case 'status': { this.reportService.getReportsByStatus(page, rows, this.selectedStatus!)
        .subscribe(pagedData => { this.allReports.set(pagedData); });break }
      case 'date' : {
        if (this.selectedDateRange) {
      const startDate = format(this.selectedDateRange[0],'yyyy-MM-dd');
      const endDate =  format(this.selectedDateRange[1],'yyyy-MM-dd');
      this.reportService.getReportsByDateRange(page, rows, startDate,endDate)
      .subscribe(pagedData => { this.allReports.set(pagedData); });
    }
    break
      }
    case 'user':{
      this.searchUserInputChange$.next(this.searchTerm)
    break;
    }
      default: this.reportService.getReports(page, rows).subscribe(pagedData => { this.allReports.set(pagedData); });
    }
  }

  clearFilters(){

    this.selectedDateRange=null
    this.selectedStatus=null
    this.searchTerm=''
    this.activeFilter.set('none')
    this.setReports()

  }
  viewReport(report: RCReport): void {
    // Defensive: Always close any open modal first
       this.displayReportModal=true
    this.selectedReport = report;
    // this.displayReportModal = true;
    // this.modalKey++;
    // console.log('Opening report modal for:', report, 'modalKey:', this.modalKey);
    // this.cdRef.markForCheck();
  }

  closeReportModal(): void {
    this.displayReportModal = false;
    this.selectedReport = null;
   

    this.cdRef.markForCheck();
  }
  
  setupDebouncing(){
        this.searchUserInputChange$.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          switchMap(searchTerm => {
    
            return this.reportService.getReportsByName(this.state().page(), this.state().row(),searchTerm)
          })
        ).subscribe(pagedData => { this.allReports.set(pagedData); });;
  }
  updateReportStatus(newStatus: ReportStatus): void {
    this.reportService.updateReport(this.selectedReport?.reportId!,newStatus).subscribe({
      next : ()=>{
        this.setReports()
        this.displayReportModal=false
        this.messageService.add({
          severity:'success',
          summary:"report updated successfully"
        })
      },
      error :(err)=>{
        console.log(err)
        this.displayReportModal=false
        this.messageService.add({
          severity:'error',
          summary:err
        })
      }
    })
  }
getStatusBgColor(status:ReportStatus):string{
     switch (status) {
      case ReportStatus.ACCEPTED: return '#ccf0e0'; // Added border for definition
      case ReportStatus.PENDING: return '#ccd5f0';
      case ReportStatus.OPENED: return '#ccd5f0'; // Added border
      case ReportStatus.REJECTED: return '#f4f5e6'; // Added border
      default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
    }
  }
  getStatusTextColor(status:ReportStatus):string{
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

  }
}