// src/app/components/associate/report/report.component.ts

import { Component, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator'; // Import PaginatorState

// Define the structure of a Report object
interface Report {
  id: number;
  title: string;
  type: string; // e.g., 'Monthly Summary', 'Expense Report', 'Incident Report'
  typeIcon: string; // e.g., 'pi pi-chart-bar', 'pi pi-receipt', 'pi pi-exclamation-triangle'
  description: string;
  date: string; // Or use Date object if preferred
  status: 'Pending' | 'Accepted' | 'Rejected' | 'In review';
}

// Define options for dropdowns
interface SelectOption {
  label: string;
  value: string | null; // Use null for 'All'
}

// Corrected TagSeverity type - uses "warn" (not "warning")
type TagSeverity = "success" | "danger" | "warn" | "info" | "secondary" | "contrast" | undefined;

@Component({
  selector: 'app-report',
  // Ensure standalone is false or removed if using NgModules
  standalone: false,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'] // Use dedicated CSS
})
export class ReportComponent implements OnInit {

  allReports: Report[] = []; // Holds all reports fetched (simulate fetch)
  displayedReports: Report[] = []; // Holds reports currently visible on the page
  // --- NEW Properties for Create Dialog ---
  displayCreateDialog: boolean = false; // Controls dialog visibility
  newReportTitle: string = '';
  newReportReason: string = '';
  newReportDescription: string = '';
  // --------------------------------------
  // --- Filtering ---
  searchTerm: string = '';
  selectedStatus: string | null = null; // Matches SelectOption value
  selectedType: string | null = null;   // Matches SelectOption value

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'In review', value: 'In review' }
  ];

  typeOptions: SelectOption[] = [
    { label: 'All Types', value: null },
    { label: 'Monthly Summary', value: 'Monthly Summary' },
    { label: 'Expense Report', value: 'Expense Report' },
    { label: 'Incident Report', value: 'Incident Report' }
  ];

  // --- Pagination ---
  totalRecords: number = 0;
  rows: number = 9; // Number of reports per page (3 columns * 3 rows)
  first: number = 0; // Index of the first record to display

  constructor() { }

  ngOnInit(): void {
    // Simulate fetching data
    this.allReports = this.getMockReports();
    this.totalRecords = this.allReports.length;
    this.applyFiltersAndPagination();
  }
  // --- NEW Methods for Dialog ---

  showCreateReportDialog(): void {
    // Reset fields before showing
    this.newReportTitle = '';
    this.newReportReason = '';
    this.newReportDescription = '';
    this.displayCreateDialog = true; // Show the dialog
  }

  hideCreateDialog(): void {
    this.displayCreateDialog = false; // Hide the dialog
  }

  saveNewReport(): void {
    console.log('Saving Report:');
    console.log('Title:', this.newReportTitle);
    console.log('Reason:', this.newReportReason);
    console.log('Description:', this.newReportDescription);

    // TODO: Here you would typically call a service to send the data to your backend
    // e.g., this.reportService.createReport({ title: this.newReportTitle, reason: this.newReportReason, description: this.newReportDescription }).subscribe(...)

    // After successful save (or for now, after logging):
    this.hideCreateDialog(); // Close the dialog
    // Optionally: Refresh the report list if the save was real
    // this.refreshReports(); // You would need to implement this method if uncommented
  }
  // --------------------------------------
  getMockReports(): Report[] {
    // Data based on the image
    return [
      { id: 1, title: 'Q1 Financial Summary', type: 'Monthly Summary', typeIcon: 'pi pi-chart-bar', description: 'Quarterly financial performance review and analysis', date: 'Mar 15, 2024', status: 'Pending' },
      { id: 2, title: 'Travel Expense Report', type: 'Expense Report', typeIcon: 'pi pi-receipt', description: 'Business trip to San Francisco conference', date: 'Mar 14, 2024', status: 'Accepted' },
      { id: 3, title: 'Server Downtime Incident', type: 'Incident Report', typeIcon: 'pi pi-exclamation-triangle', description: 'Emergency maintenance and resolution steps', date: 'Mar 13, 2024', status: 'In review' },
      { id: 4, title: 'Marketing Budget Review', type: 'Monthly Summary', typeIcon: 'pi pi-chart-bar', description: 'Q2 marketing campaign budget allocation', date: 'Mar 12, 2024', status: 'Rejected' },
      { id: 5, title: 'Office Supply Expenses', type: 'Expense Report', typeIcon: 'pi pi-receipt', description: 'Monthly office supplies and equipment', date: 'Mar 11, 2024', status: 'Accepted' },
      { id: 6, title: 'Security Breach Report', type: 'Incident Report', typeIcon: 'pi pi-exclamation-triangle', description: 'Analysis of recent security incident', date: 'Mar 10, 2024', status: 'Pending' },
      { id: 7, title: 'Q2 Performance Review', type: 'Monthly Summary', typeIcon: 'pi pi-chart-bar', description: 'Team performance metrics and KPIs', date: 'Mar 09, 2024', status: 'In review' },
      { id: 8, title: 'Client Meeting Expenses', type: 'Expense Report', typeIcon: 'pi pi-receipt', description: 'Client dinner and transportation costs', date: 'Mar 08, 2024', status: 'Accepted' },
      { id: 9, title: 'System Maintenance Report', type: 'Incident Report', typeIcon: 'pi pi-exclamation-triangle', description: 'Scheduled system updates and patches', date: 'Mar 07, 2024', status: 'Rejected' },
      // Add more reports if needed for pagination testing
      { id: 10, title: 'Q4 Sales Forecast', type: 'Monthly Summary', typeIcon: 'pi pi-chart-bar', description: 'Projected sales figures for the upcoming quarter', date: 'Mar 05, 2024', status: 'Pending' },
      { id: 11, title: 'Software Licensing Costs', type: 'Expense Report', typeIcon: 'pi pi-receipt', description: 'Annual renewal fees for essential software', date: 'Mar 04, 2024', status: 'Accepted' },
      { id: 12, title: 'Network Outage Analysis', type: 'Incident Report', typeIcon: 'pi pi-exclamation-triangle', description: 'Root cause analysis of the brief network outage', date: 'Mar 03, 2024', status: 'In review' },
    ];
  }

  applyFiltersAndPagination(): void {
    // 1. Filter
    let filtered = this.allReports.filter(report => {
      const titleMatch = this.searchTerm ? report.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const statusMatch = this.selectedStatus ? report.status === this.selectedStatus : true;
      const typeMatch = this.selectedType ? report.type === this.selectedType : true;
      return titleMatch && statusMatch && typeMatch;
    });

    this.totalRecords = filtered.length;

    // 2. Paginate
    this.displayedReports = filtered.slice(this.first, this.first + this.rows);

    // If filtering causes the current page to be empty, reset to first page
    if (this.displayedReports.length === 0 && this.totalRecords > 0 && this.first > 0) {
        this.first = 0; // Reset to first page index
        this.applyFiltersAndPagination(); // Re-apply with reset index
    }
  }

  // Method triggered by filter changes
  onFilterChange(): void {
    this.first = 0; // Reset to first page when filters change
    this.applyFiltersAndPagination();
  }

  // Method triggered by paginator
  onPageChange(event: PaginatorState): void {
    // Ensure event properties exist before assigning
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.applyFiltersAndPagination();
  }

  // Method to get PrimeNG tag severity for status badge
  // Updated return type from 'string' to 'TagSeverity'
  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'Accepted': return 'success';
      // --- CORRECTED THIS LINE ---
      case 'Pending': return 'warn'; // Use "warn", not "warning"
      // --- END CORRECTION ---
      case 'Rejected': return 'danger';
      case 'In review': return 'info';
      default: return 'secondary';
    }
  }

  // Placeholder for create report action
  onCreateReport(): void {
    console.log('Create Report button clicked');
    // Future implementation: Navigate to a create report form or open a dialog
  }
}