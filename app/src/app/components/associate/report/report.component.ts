// src/app/components/associate/report/report.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { Subject, Subscription, debounceTime, distinctUntilChanged, take } from 'rxjs';
import { MessageService } from 'primeng/api';

// Import services
import { AssociateService } from '../../../services/associate.service';

// Import DTOs and enums
import { PagedReportDTO } from '../../../dto/associate/paged-report.dto';
import { PagedReportSearchDTO } from '../../../dto/associate/paged-report-search.dto';
import { ReportStatus } from '../../../dto/report-status.enum';
import { ReportType } from '../../../dto/report-type.enum';
import { CreateAssociateReportDTO } from '../../../dto/associate/create-report.dto';

// Import shared models
import { Report, TagSeverity, SelectOption } from '../../../dto/associate/report.model';
import { ReportDTO } from '../../../dto/aio/report.dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  // Data properties
  reports: Report[] = [];
  pagedReports: PagedReportDTO | null = null;

  // New report form data
  newReportTitle: string = '';
  newReportType: string = ReportType.REQUEST_ROTATION; // Default type
  newReportReason: string = '';
  newReportDescription: string = '';

  // Filtering properties
  searchTerm: string = '';
  selectedStatus: string | null = null;
  selectedType: string | null = null;

  // Dropdown options
  statusOptions: SelectOption[] =[] 

  reportTypeOptions: SelectOption[] = [
    { label: 'Request Rotation', value: 'REQUEST_ROTATION' },
  ];
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

  // Pagination properties
  totalRecords: number = 0;
  rows: number = 10; // Number of reports per page (must match an option in rowsPerPageOptions)
  first: number = 0; // Index of the first record to display

  // Loading state
  isLoading = false;
  loadingError = false;
  formSubmitted = false;

  // UI state properties
  displayCreateDialog: boolean = false;

  // Form properties
  reportForm!: FormGroup;

  // Private properties for subscription management
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];
  private loadingTimeout: any = null;

  // Display data for UI
  displayedReports: Report[] = [];

  constructor(
    private associateService: AssociateService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private translate:TranslateService
  ) { }

  /**
   * Initialize component data and setup subscriptions
   */
        getTranslatedReportStatus(status: ReportStatus): string {
        if (!status) return '';
    
        const statusKey = status.toString().toLowerCase();
        return this.translate.instant(`report_rc.statusTypes.${statusKey}`);
      }

  ngOnInit(): void {
    // Set up debounce for search input
      this.initStatusOptions(); // Call the new initialization method

    // Optional: Re-initialize options if language changes dynamically
    this.translate.onLangChange
      .pipe() // Use takeUntil for proper unsubscription
      .subscribe(() => {
        console.log('Language changed, re-initializing all status options.');
 
        this.initStatusOptions();
      });
  

    const searchSubscription = this.searchSubject.pipe(
      debounceTime(400), // Wait for 400ms after user stops typing
      distinctUntilChanged() // Only emit if value changed
    ).subscribe(() => {
      this.loadReports();
    });

    // Add to subscriptions array for cleanup
    this.subscriptions.push(searchSubscription);

    // Initialize the form with validators
    this.initReportForm();

    // Initial load of reports
    this.loadReports();
  }

  // Initialize form with validation
  private initReportForm(): void {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      reason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      type: ['REQUEST_ROTATION', Validators.required],
      description: [''] // Optional field
    });
  }

  /**
   * Clean up resources when component is destroyed
   */
  ngOnDestroy(): void {
    // Cleanup all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Clear any pending timeouts
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  // --- NEW Methods for Dialog ---

  showCreateReportDialog(): void {
    // Reset form before showing
    this.reportForm.reset({
      type: 'REQUEST_ROTATION' // Set default type
    });
    this.formSubmitted = false;
    this.displayCreateDialog = true; // Show the dialog
  }

  hideCreateDialog(): void {
    this.displayCreateDialog = false; // Hide the dialog
   
  }

  saveNewReport(event:boolean): void {
   

if(event)     { this.messageService.add({
        severity: 'success',
        // Use translation keys for summary and detail
        summary: this.translate.instant('report.create.successSummary'),
        detail: this.translate.instant('report.create.successDetail')
      });
    } else {
      this.messageService.add({
        severity: 'error',
        // Use translation keys for summary and detail
        summary: this.translate.instant('report.create.errorSummary'),
        detail: this.translate.instant('report.create.errorDetail')
      });
    }
 
}
  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.reportForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) {
      return 'This field is required';
    }
    if (field.errors?.['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors?.['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
    }

    return '';
  }

  // We no longer need mock data as we're using real data from the API
  // This method is kept for reference only
  /*
  getMockReports(): Report[] {
    return [];
  }
  */

  /**
   * Load reports from service with current filters
   * Implements comprehensive error handling and clean API requests
   */
  loadReports(): void {
    // Guard clause to prevent multiple concurrent requests
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.loadingError = false;

      // Clear any existing timeout
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }

      // Set a timeout to show error if loading takes too long
      this.loadingTimeout = setTimeout(() => {
        if (this.isLoading) {
          this.loadingError = true;
          this.isLoading = false;
          this.messageService.add({
          severity: 'error',
          // Use translation keys for summary and detail
          summary: this.translate.instant('report.loading.errorSummary'),
          detail: this.translate.instant('report.loading.errorDetail'),
          life: 5000 // Message disappears after 5 seconds
        });
        }
      }, 15000); // 15 seconds timeout

      // Create DTO with current values - ensure pageSize is never zero
      const pageSize = this.rows || 10; // Default to 10 if rows is somehow 0

      // Create search parameters
      const searchParams: Record<string, any> = {
        pageNumber: Math.max(0, Math.floor(this.first / pageSize)), // Ensure non-negative
        pageSize: pageSize
      };

      // Only add defined and non-empty values
      if (this.searchTerm) searchParams['title'] = this.searchTerm.trim();
      if (this.selectedStatus) searchParams['status'] = this.selectedStatus;
      if (this.selectedType) searchParams['type'] = this.selectedType;

      // Clean the object by removing undefined, null, and empty string values
      const cleanSearchDto = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) =>
          value !== undefined && value !== null && value !== '')
      ) as PagedReportSearchDTO;

      // Create a subscription for report loading
      const reportSubscription = this.associateService.getAssociateOldReports(cleanSearchDto).subscribe({
        next: (response) => {
          // Clear the timeout as we got a response
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
          }

          // Validate response and data
          if (response && response.data) {
            const pagedData = response.data as PagedReportDTO;

            // Validate totalElements is a number
            this.totalRecords = typeof pagedData.totalElements === 'number' ? pagedData.totalElements : 0;

            // Validate reportDTOs is an array before mapping
            if (Array.isArray(pagedData.reportDTOs)) {
              this.displayedReports = pagedData.reportDTOs.map(dto => this.mapReportDtoToUi(dto));
            } else {
              console.warn('Expected reportDTOs to be an array but got:', pagedData.reportDTOs);
              this.displayedReports = [];
            }
          } else {
            console.warn('Response or response.data is null/undefined:', response);
            this.displayedReports = [];
            this.totalRecords = 0;
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading reports:', error);

          // Clear the timeout
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
          }

          this.isLoading = false;
          this.loadingError = true;
          this.messageService.add({
            severity: 'error',
   summary: this.translate.instant('report.loading.errorSummary'),
          detail: this.translate.instant('report.loading.errorDetail'),
            life: 5000
          });
        }
      });

      // Add to subscriptions for proper cleanup
      this.subscriptions.push(reportSubscription);
    } catch (error) {
      // Global error handler for any unexpected errors
      console.error('Unexpected error in loadReports:', error);
      this.isLoading = false;
      this.loadingError = true;
  this.messageService.add({
      severity: 'error',
      // Use translation keys for summary and detail
      summary: this.translate.instant('error.unexpected.summary'),
      detail: this.translate.instant('error.unexpected.detail'),
      life: 5000 // Message disappears after 5 seconds
    });
    }
  }

  // Maps backend DTO to UI format
  private mapReportDtoToUi(dto: ReportDTO): Report {
    // Determine icon based on type (this logic can be refined based on actual types)
    let typeIcon = 'pi pi-file';

    return {
      id: dto.reportId,
      title: dto.title,
      type: dto.type.toString(), // Convert enum to string if needed
      typeIcon: typeIcon,
      description: dto.description,
      date: new Date(dto.createdAt).toLocaleDateString(), // Format date
      status: dto.status
    };
  }

  // Method triggered by filter changes - doesn't debounce status changes
  onFilterChange(): void {
    this.first = 0; // Reset to first page when filters change
    this.loadReports();
  }

  // Handle search term changes with debouncing
  onSearchChange(): void {
    this.first = 0; // Reset to first page
    this.searchSubject.next(this.searchTerm);
  }

  // Method triggered by paginator
  onPageChange(event: PaginatorState): void {
    // Ensure event properties exist before assigning
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.loadReports();
  }

  // Method to get PrimeNG tag severity for status badge
  // Updated return type from 'string' to 'TagSeverity'
  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case ReportStatus.ACCEPTED: return 'success';
      case ReportStatus.PENDING: return 'warn';
      case ReportStatus.REJECTED: return 'danger';
      case ReportStatus.OPENED: return 'info';
      default: return 'secondary';
    }
  }

  // Placeholder for create report action
  onCreateReport(): void {
    console.log('Create Report button clicked');
    // Future implementation: Navigate to a create report form or open a dialog
  }
}
