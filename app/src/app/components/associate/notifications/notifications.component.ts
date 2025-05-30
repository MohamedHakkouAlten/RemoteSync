import { Component, computed, OnInit, signal } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { AssociateService } from '../../../services/associate.service';
import { NotificationDTO, PagedNotificationDTO } from '../../../dto/notification.dto';
import { PagedNotificationSearchDTO } from '../../../dto/paged-notification-search.dto';
import { NotificationStatus } from '../../../dto/notification-status.enum';
import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';

// Local interface for mapped notification data with UI-specific properties
interface Notification {
  id: string;
  type: 'report' | 'rotation' | 'general';
  title: string;
  senderInitial: string;
  senderName: string;
  timestamp: string;
  message: string;
  isRead: boolean;
  status: NotificationStatus;
  statusClass: string;
}

// Interface for Tab Configuration
interface TabConfig {
  title: string;
  value: string; // Unique identifier for the tab
  filterFn: (notification: Notification) => boolean; // Function to filter notifications
  countSignal: () => number; // Function returning the count signal for the badge
}

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  // Search and filter controls
  titleFilter = signal<string>('');
  statusFilter = signal<NotificationStatus | null>(null);
  dateFilter = signal<Date | null>(null);
  today = new Date(); // For date picker max date
  
  // Status dropdown options
  statusOptions = [
    { label: 'Urgent', value: NotificationStatus.URGENT },
    { label: 'Important', value: NotificationStatus.IMPORTANT },
    { label: 'Normal', value: NotificationStatus.NORMAL },
    { label: 'Info', value: NotificationStatus.INFO },
    { label: 'Alert', value: NotificationStatus.ALERT },
    { label: 'Request', value: NotificationStatus.REQUEST }
  ];

  private allNotifications = signal<Notification[]>([]); // Holds ALL notifications (using signals)
  loading = signal<boolean>(false); // Loading state

  // Computed signals for counts
  allCount = computed(() => this.allNotifications().length);
  urgentCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.URGENT).length);
  importantCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.IMPORTANT).length);
  normalCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.NORMAL || n.status === NotificationStatus.INFO).length);

  // Tab Configuration
  tabs: TabConfig[] = [
    { title: 'All', value: 'all', filterFn: (n) => true, countSignal: this.allCount },
    { title: 'Urgent', value: 'urgent', filterFn: (n) => n.status === NotificationStatus.URGENT, countSignal: this.urgentCount },
    { title: 'Important', value: 'important', filterFn: (n) => n.status === NotificationStatus.IMPORTANT, countSignal: this.importantCount },
    { title: 'Normal', value: 'normal', filterFn: (n) => n.status === NotificationStatus.NORMAL || n.status === NotificationStatus.INFO, countSignal: this.normalCount }
  ];

  // Active Tab State
  activeTabValue = signal<string|number>(this.tabs[0].value); // Default to first tab's value

  // Pagination State
  first = signal<number>(0); // Index of the first record displayed
  rows = signal<number>(10); // Number of rows per page
  totalRecords = signal<number>(0); // Total number of notifications *for the active filter*
  totalPages = signal<number>(0); // Total number of pages
  currentPage = signal<number>(0); // Current page number (0-based indexing)

  // Filtered list based on active tab (computed signal)
  filteredNotifications = computed(() => {
    const currentFilterFn = this.tabs.find(t => t.value === this.activeTabValue())?.filterFn || (() => true);
    return this.allNotifications().filter(currentFilterFn);
  });

  // Displayed list based on pagination applied to filtered list (computed signal)
  displayedNotifications = computed(() => {
    const filtered = this.filteredNotifications();
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return filtered.slice(startIndex, endIndex);
  });

  constructor(
    private associateService: AssociateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    
    const searchParams: PagedNotificationSearchDTO = {
      pageNumber: this.currentPage(),
      pageSize: this.rows()
    };
    
    // Apply title filter if provided
    if (this.titleFilter() && this.titleFilter().trim()) {
      searchParams.title = this.titleFilter().trim();
    }
    
    // Apply status filter - either from the dropdown or from tab selection
    if (this.statusFilter()) {
      // Dropdown selection takes precedence over tab selection
      searchParams.status = this.statusFilter() as NotificationStatus; // Cast to remove null possibility
    } else if (this.activeTabValue() === 'urgent') {
      searchParams.status = NotificationStatus.URGENT;
    } else if (this.activeTabValue() === 'important') {
      searchParams.status = NotificationStatus.IMPORTANT;
    } else if (this.activeTabValue() === 'normal') {
      searchParams.status = NotificationStatus.NORMAL;
    }
    
    // Apply date filter if provided
    if (this.dateFilter()) {
      // Format date to ISO format (YYYY-MM-DD)
      const formattedDate = this.datePipe.transform(this.dateFilter(), 'yyyy-MM-dd');
      if (formattedDate) {
        searchParams.createdAt = formattedDate;
      }
    }
    
    this.associateService.getAssociateNotifications(searchParams)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response.data) {
            const pagedData = response.data;
            
            // Map the backend DTOs to our UI model
            const mappedNotifications = pagedData.notificationDTOs.map(dto => this.mapNotificationDto(dto));
            
            // Update all signals
            this.allNotifications.set(mappedNotifications);
            this.totalRecords.set(pagedData.totalElements);
            this.totalPages.set(pagedData.totalPages);
            this.currentPage.set(pagedData.currentPage);
          }
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.allNotifications.set([]);
        }
      });
  }
  
  // Search filter methods
  
  /**
   * Apply all active filters and reload notifications
   */
  applyFilters(): void {
    this.currentPage.set(0); // Reset to first page
    this.first.set(0);
    this.loadNotifications();
  }
  
  /**
   * Clear all filters and reload notifications
   */
  clearFilters(): void {
    this.titleFilter.set('');
    this.statusFilter.set(null);
    this.dateFilter.set(null);
    this.applyFilters();
  }
  
  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    return !!(this.titleFilter() || this.statusFilter() || this.dateFilter());
  }

  // Map DTO from backend to local notification model with UI properties
  private mapNotificationDto(dto: NotificationDTO): Notification {
    // Determine notification type based on status
    let type: 'report' | 'rotation' | 'general' = 'general';
    if (dto.status === NotificationStatus.URGENT || dto.status === NotificationStatus.IMPORTANT) {
      type = 'report';
    } else if (dto.status === NotificationStatus.REQUEST) {
      type = 'rotation';
    }
    
    // Extract initials for the avatar
    const initials = this.getInitials(dto.title);
    
    // Format timestamp
    const timestamp = this.formatTimestamp(dto.createdAt);
    
    // Determine status class for styling
    const statusClass = this.getStatusClass(dto.status);
    
    return {
      id: dto.notificationId,
      type,
      title: dto.title,
      senderInitial: initials,
      senderName: 'System Notification', // The API doesn't provide a sender name
      timestamp,
      message: dto.description,
      isRead: false, // The API doesn't indicate if a notification is read
      status: dto.status,
      statusClass
    };
  }
  
  // Helper method to get initials from a string
  private getInitials(name: string): string {
    if (!name) return 'SN';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] || 'S').toUpperCase();
  }
  
  // Helper method to format timestamp
  private formatTimestamp(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
  
  // Helper method to get CSS class based on notification status
  private getStatusClass(status: NotificationStatus): string {
    switch (status) {
      case NotificationStatus.URGENT:
        return 'bg-red-100 text-red-800';
      case NotificationStatus.IMPORTANT:
        return 'bg-amber-100 text-amber-800';
      case NotificationStatus.ALERT:
        return 'bg-orange-100 text-orange-800';
      case NotificationStatus.REQUEST:
        return 'bg-teal-100 text-teal-800';
      case NotificationStatus.NORMAL:
      case NotificationStatus.INFO:
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  // Update total records based on the currently filtered list
  updateTotalRecords(): void {
    this.totalRecords.set(this.filteredNotifications().length);
  }

  // --- Event Handlers ---

  // Triggered by the paginator
  onPageChange(event: PaginatorState): void {
    if (event.first !== undefined && event.rows !== undefined) {
        this.first.set(event.first);
        this.rows.set(event.rows);
        
        // Calculate the new page number
        if (event.page !== undefined) {
          this.currentPage.set(event.page); // Using 0-based indexing
        }
        
        // Reload data with new pagination
        this.loadNotifications();
    }
  }

  // Triggered when tab changes
  onTabChange(newValue: string|number): void {
    this.activeTabValue.set(newValue);
    this.first.set(0); // Reset pagination to the first page
    this.currentPage.set(0); // Reset to page 0
    
    // Reload notifications with the new filter
    this.loadNotifications();
  }

  viewCalendar(id: string): void {
    console.log(`Viewing calendar related to notification ${id}`);
  }

  viewReport(id: string): void {
    console.log(`Viewing report related to notification ${id}`);
  }

  dismissNotification(id: string): void {
    console.log(`Dismissing notification ${id}`);
    this.allNotifications.update(currentNotifications =>
        currentNotifications.filter(n => n.id !== id)
    );
    // Re-calculate totalRecords based on potentially new filtered list size
    this.updateTotalRecords();

    // Adjust 'first' if the current page becomes empty after deletion (more complex with signals)
    // Check if the current 'first' is now beyond the new totalRecords
    const currentFirst = this.first();
    const currentRows = this.rows();
    const newTotal = this.totalRecords();
    if (currentFirst >= newTotal && newTotal > 0) {
        const newLastPageFirst = Math.floor((newTotal - 1) / currentRows) * currentRows;
        this.first.set(newLastPageFirst);
    } else if (newTotal === 0) {
        this.first.set(0); // Reset if list becomes empty
    }
    // Computed signals 'filteredNotifications' and 'displayedNotifications' will update automatically
  }

  markAllAsRead(): void {
    console.log('Marking all as read');
    this.allNotifications.update(notifications =>
        notifications.map(n => ({ ...n, isRead: true }))
    );
    // If the current tab is 'unread', the list will automatically become empty.
    // If we are on the 'unread' tab, we might need to reset pagination and update totalRecords.
    if(this.activeTabValue() === 'unread') {
        this.first.set(0);
        this.updateTotalRecords(); // totalRecords will become 0
    }
    // Counts and displayed list will update automatically via signals.
  }

  // Helper for *ngFor trackBy
  trackById(index: number, notification: Notification): string {
    return notification.id;
  }
  
  // Helper for tab tracking
  trackByTabValue(index: number, tab: TabConfig): string {
    return tab.value as string;
  }
}