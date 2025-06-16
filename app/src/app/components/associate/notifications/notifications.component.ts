import { Component, computed, OnInit, signal } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { AssociateService } from '../../../services/associate.service';
import { NotificationDTO, PagedNotificationDTO } from '../../../dto/notification.dto';
import { PagedNotificationSearchDTO } from '../../../dto/aio/paged-notification-search.dto';
import { NotificationStatus } from '../../../dto/notification-status.enum';
import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../services/web-socket.service';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { UserService } from '../../../services/auth/user.service';
import { TranslateService } from '@ngx-translate/core';

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
  count:number
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
    { label: 'notification_page.status.urgent', value: NotificationStatus.URGENT },
    { label: 'notification_page.status.important', value: NotificationStatus.IMPORTANT },
    { label: 'notification_page.status.normal', value: NotificationStatus.NORMAL },
    { label: 'notification_page.status.info', value: NotificationStatus.INFO },
    { label: 'notification_page.status.alert', value: NotificationStatus.ALERT },
    { label: 'notification_page.status.request', value: NotificationStatus.REQUEST }
  ];

  private allNotifications = signal<Notification[]>([]); // Holds ALL notifications (using signals)
  loading = signal<boolean>(false); // Loading state
  currentLanguage: SupportedLanguage = 'en';
  // Computed signals for counts
  allCount = computed(() => this.allNotifications().length);
  urgentCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.URGENT).length);
  importantCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.IMPORTANT).length);
  normalCount = computed(() => this.allNotifications().filter(n => n.status === NotificationStatus.NORMAL || n.status === NotificationStatus.INFO).length);

  // Tab Configuration
  tabs: TabConfig[] = [
 { title: 'notification_page.tabs.all', value: 'all', count: 0 },
    { title: 'notification_page.tabs.urgent', value: 'urgent', count: 0 },
    { title: 'notification_page.tabs.important', value: 'important', count: 0 },
    { title: 'notification_page.tabs.normal', value: 'normal', count: 0 }
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
    const currentFilterFn = this.tabs.find(t => t.value === this.activeTabValue())?.count|| (() => true);
    return this.allNotifications();
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
    private datePipe: DatePipe,
    private router:Router,
    private languageService:LanguageService,
    private userService:UserService,
    private translateService:TranslateService

   
  ) {}

  ngOnInit(): void {
  //  this.loadNotifications();
      this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;

    });
    this.associateService.getInitialAssociateNotifications().subscribe(res=>{
      console.log(res)
      this.tabs[0].count=res.notifications.totalElements
      this.tabs[1].count=res.urgentCount
      this.tabs[2].count=res.importantCount
      this.tabs[3].count=res.normalCount
          const mappedNotifications = res.notifications.notificationDTOs.map(dto => this.mapNotificationDto(dto));
            
            // Update all signals
            this.allNotifications.set(mappedNotifications);

      
    })
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
    console.log("called")
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
    if (dto.title.toLocaleLowerCase().includes("report")) {
      type = 'report';
    } else if (dto.title.toLocaleLowerCase().includes("rotation")) {
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
      isRead: dto.isRead, // The API doesn't indicate if a notification is read
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
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) {
    return this.translateService.instant('time.ago.just_now');
  }

  if (diffMins < 60) {
    const key = diffMins === 1 ? 'time.ago.minutes_one' : 'time.ago.minutes_other';
    // The 'count' parameter will replace {{count}} in the JSON string
    return this.translateService.instant(key, { count: diffMins });
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    const key = diffHours === 1 ? 'time.ago.hours_one' : 'time.ago.hours_other';
    return this.translateService.instant(key, { count: diffHours });
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    const key = diffDays === 1 ? 'time.ago.days_one' : 'time.ago.days_other';
    return this.translateService.instant(key, { count: diffDays });
  }

  // Fallback for older dates, which is already locale-aware
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

  viewReport(notification:Notification): void {
     const userRoles = this.userService.getUserRoles();
    if(notification.type=="rotation") {
       if(userRoles.includes('ADMIN'))  {
       this.router.navigate([`/${this.currentLanguage}/remotesync/admin/calendar`])
      } else if  (userRoles.includes('RC'))
      {
    this.router.navigate([`/${this.currentLanguage}/remotesync/rc/calendar`])
      } else {
         this.router.navigate([`/${this.currentLanguage}/remotesync/associate/calendar`])
      }
       }
    
    else if(notification.type=="report") {
       if(userRoles.includes('ADMIN'))  {
       this.router.navigate([`/${this.currentLanguage}/remotesync/admin/report`])
      } else if  (userRoles.includes('RC'))
      {
    this.router.navigate([`/${this.currentLanguage}/remotesync/rc/report`])
      } else {
         this.router.navigate([`/${this.currentLanguage}/remotesync/associate/report`])
      }
    
    }
  this.associateService.setNotificationAsRead(notification.id).subscribe()
  }

  dismissNotification(id: string): void {
    console.log(`Dismissing notification ${id}`);
    this.allNotifications.update(currentNotifications =>
        currentNotifications.map(notification=>{
          if(notification.id==id){
       notification.isRead=true
    return notification
          }
       return notification
        })
    );
    // Re-calculate totalRecords based on potentially new filtered list size
    this.updateTotalRecords();
    this.associateService.setNotificationAsRead(id).subscribe()

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