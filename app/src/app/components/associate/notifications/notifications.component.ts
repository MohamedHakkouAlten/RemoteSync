import { Component, computed, OnInit, signal } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';

// Define an interface for notification structure
// Define the interface WITHOUT styling properties
interface Notification {
  id: number;
  type: 'report' | 'rotation' | 'general';
  title: string;
  senderInitial: string;
  senderName: string;
  timestamp: string;
  message: string;
  isRead: boolean;
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

  private allNotifications = signal<Notification[]>([]); // Holds ALL notifications (using signals)

  // Computed signals for counts
  allCount = computed(() => this.allNotifications().length);
  unreadCount = computed(() => this.allNotifications().filter(n => !n.isRead).length);
  reportCount = computed(() => this.allNotifications().filter(n => n.type === 'report').length);
  // Assuming 'calendar' type doesn't exist, maybe it relates to reports? Adjust if needed.
  // Or add a 'calendar' type to the Notification interface and data.
  calendarCount = computed(() => this.allNotifications().filter(n => n.type === 'report').length); // Example: Calendar shows reports

  // Tab Configuration
  tabs: TabConfig[] = [
    { title: 'All', value: 'all', filterFn: (n) => true, countSignal: this.allCount },
    { title: 'Unread', value: 'unread', filterFn: (n) => !n.isRead, countSignal: this.unreadCount },
    { title: 'Reports', value: 'reports', filterFn: (n) => n.type === 'report', countSignal: this.reportCount },
    { title: 'Calendar', value: 'calendar', filterFn: (n) => n.type === 'report', countSignal: this.calendarCount } // Example mapping
  ];

  // Active Tab State
  activeTabValue = signal<string|number>(this.tabs[0].value); // Default to first tab's value

  // Pagination State
  first = signal<number>(0); // Index of the first record displayed
  rows = signal<number>(5); // Number of rows per page
  totalRecords = signal<number>(0); // Total number of notifications *for the active filter*

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

  ngOnInit(): void {
    this.loadNotifications();
    // Initial calculation of totalRecords for the default tab
    this.updateTotalRecords();
  }

  loadNotifications(): void {
    // Simulate fetching data
    const data: Notification[] = [
      { id: 1, type: 'report',   title: 'Report Approval', senderInitial: 'SJ', senderName: 'Sarah Johnson', timestamp: '14 min ago', message: 'Your quarterly report has been approved. You can now proceed...', isRead: false },
      { id: 2, type: 'rotation', title: 'Rotation Update', senderInitial: 'MC', senderName: 'Michael Chen',  timestamp: '1 hour ago', message: 'You have been assigned to the Project Aurora task force...', isRead: false },
      { id: 3, type: 'general',  title: 'System Update', senderInitial: 'IT', senderName: 'IT Department', timestamp: '1 day ago', message: 'A system maintenance is scheduled...', isRead: true },
      { id: 4, type: 'report',   title: 'Monthly Review Due', senderInitial: 'PM', senderName: 'Project Manager', timestamp: '2 days ago', message: 'Please submit your monthly review report by EOD Friday.', isRead: false },
      { id: 5, type: 'general',  title: 'Reminder: Timesheet', senderInitial: 'HR', senderName: 'Human Resources', timestamp: '2 days ago', message: 'Friendly reminder to submit your timesheet for the week.', isRead: true },
      { id: 6, type: 'rotation', title: 'Project Kickoff Meeting', senderInitial: 'MC', senderName: 'Michael Chen',  timestamp: '3 days ago', message: 'The kickoff meeting for Project Aurora is scheduled for next Monday.', isRead: false },
      { id: 7, type: 'report',   title: 'Budget Approved', senderInitial: 'FN', senderName: 'Finance Dept', timestamp: '4 days ago', message: 'The Q3 budget proposal has been approved.', isRead: true },
    ];
    this.allNotifications.set(data);
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
        // No need to explicitly update displayedNotifications, computed signal handles it
    }
  }

   // Triggered when tab changes
   onTabChange(newValue: string|number): void {
    this.activeTabValue.set(newValue);
    this.first.set(0); // Reset pagination to the first page
    this.updateTotalRecords(); // Update total records for the new filter
    // No need to explicitly update displayedNotifications, computed signal handles it
  }

  viewCalendar(id: number): void {
    console.log(`Viewing calendar related to notification ${id}`);
  }

  viewReport(id: number): void {
    console.log(`Viewing report related to notification ${id}`);
  }

  dismissNotification(id: number): void {
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
  trackById(index: number, notification: Notification): number {
    return notification.id;
  }
}