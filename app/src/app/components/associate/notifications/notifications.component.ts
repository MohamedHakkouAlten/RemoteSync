import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Notification } from '../../../models/notification.model';
import { NotificationType } from '../../../enums/notification-type.enum';

// Define an interface for notification structure
// Define the interface WITHOUT styling properties


// Interface for Tab Configuration
interface TabConfig {
 
  value: string; // Unique identifier for the tab

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
  private unReadNotifications = signal<Notification[]>([]); 
  private reportsNotifications = signal<Notification[]>([]); 
  private calendarNotifications = signal<Notification[]>([]); 
  // Computed signals for counts
  allCount = signal<number>(0);
  unreadCount = signal<number>(0);
  reportCount =signal<number>(0);
  calendarCount = signal<number>(0); 

  // Tab Configuration
  tabs: TabConfig[] = [
    { value: 'all',  countSignal: this.allCount },
    {  value: 'unread', countSignal: this.unreadCount },
    {  value: 'reports',countSignal: this.reportCount },
    {  value: 'calendar',  countSignal: this.calendarCount } // Example mapping
  ];

  // Active Tab State
  activeTabValue = signal<string|number>(this.tabs[0].value); // Default to first tab's value

  // Pagination State
  first = signal<number>(0); // Index of the first record displayed
  rows = signal<number>(2); // Number of rows per page
  totalRecords = computed(()=>{
    
      switch(this.activeTabValue()){
        case 'unread' :return this.unreadCount();
        case 'reports':return this.reportCount();
        case 'calendar' :return this.calendarCount();
        default :return this.allCount();
      
    }
  }); // Total number of notifications *for the active filter*

  // Filtered list based on active tab (computed signal)
  // filteredNotifications = computed(() => {
  //   const currentFilterFn = this.tabs.find(t => t.value === this.activeTabValue())?.filterFn || (() => true);
  //   return this.allNotifications().filter(currentFilterFn);
  // });

  
  // Displayed list based on pagination applied to filtered list (computed signal)
  displayedNotifications = computed(() => {
    const list = this.activeList();
    const startIndex = this.first();
    const endIndex = startIndex + this.rows();
    return list.slice(startIndex, endIndex);
  });
  private activeList = computed(() => {
    switch (this.activeTabValue()) {
      case 'unread':   return this.unReadNotifications();
      case 'reports':  return this.reportsNotifications();
      case 'calendar': return this.calendarNotifications();
      default:         return this.allNotifications();
    }
  });

  ngOnInit(): void {
    this.loadNotifications();
    // Initial calculation of totalRecords for the default tab
   // this.updateTotalRecords();
  }

  loadNotifications(): void {
    // Simulate fetching data
    const now = new Date();
    this.unreadCount.set(8);
    this.allCount.set(4);
    this.reportCount.set(2);
    this.calendarCount.set(2);

    this.calendarNotifications.set([
      {
        id: 22,
        type: NotificationType.Rotation,
        sender: { firstName: 'Michael', lastName: 'Chen' },
        message: 'assigned you to the Project Aurora task force.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,

      },
      {
        id: 31,
        type: NotificationType.Rotation,
        message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        sender: { firstName: 'Mic', lastName: 'drop' },
        // No actions needed for this type often
      },
      {
        id: 21,
        type: NotificationType.Report,
        message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        sender: { firstName: 'Mic', lastName: 'drop' },
        // No actions needed for this type often
      },
      {
        id: 5,
        type: NotificationType.Rotation,
        message: "Don't forget: Quarterly planning meeting tomorrow at 10:00 AM in Conference Room B.",
        timestamp: new Date(now.setDate(now.getDate() - 2)), // 2 days ago
        isRead: false,
        sender: { firstName: 'Walk', lastName: 'Talk' },

      },
    ])


    this.unReadNotifications.set([
      {
        id: 22,
        type: NotificationType.Rotation,
        sender: { firstName: 'Michael', lastName: 'Chen' },
        message: 'assigned you to the Project Aurora task force.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,

      },
      {
        id: 31,
        type: NotificationType.Rotation,
        message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        sender: { firstName: 'Mic', lastName: 'drop' },
        // No actions needed for this type often
      },
      {
        id: 21,
        type: NotificationType.Report,
        message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        sender: { firstName: 'Mic', lastName: 'drop' },
        // No actions needed for this type often
      },
      {
        id: 5,
        type: NotificationType.Rotation,
        message: "Don't forget: Quarterly planning meeting tomorrow at 10:00 AM in Conference Room B.",
        timestamp: new Date(now.setDate(now.getDate() - 2)), // 2 days ago
        isRead: false,
        sender: { firstName: 'Walk', lastName: 'Talk' },

      },
    ])

    const data: Notification[] =[
    
    
          {
            id: 1,
            type:NotificationType.Report,
            sender: { firstName: 'Sarah', lastName: 'Johnson' },
            message: 'approved your quarterly report.',
            timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
            isRead: false
    
          },
          {
            id: 2,
            type: NotificationType.Rotation,
            sender: { firstName: 'Michael', lastName: 'Chen' },
            message: 'assigned you to the Project Aurora task force.',
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
            isRead: false,
    
          },
          {
            id: 3,
            type: NotificationType.Rotation,
            message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
            isRead: false,
            sender: { firstName: 'Mic', lastName: 'drop' },
            // No actions needed for this type often
          },
          {
            id: 4,
            type: NotificationType.Report,
            sender: { firstName: 'Cheef', lastName: 'Beef' },
            message: 'commented on your project plan: "Great timeline structure, let\'s discuss the resource allocation tomorrow."',
            timestamp: new Date(now.setDate(now.getDate() - 1)), // Yesterday
            isRead: true, // Example of a read notification
    
          },
          {
            id: 5,
            type: NotificationType.Rotation,
            message: "Don't forget: Quarterly planning meeting tomorrow at 10:00 AM in Conference Room B.",
            timestamp: new Date(now.setDate(now.getDate() - 2)), // 2 days ago
            isRead: false,
            sender: { firstName: 'Walk', lastName: 'Talk' },
    
          },
          // Add more notifications as needed for testing scroll
    
        ];
    this.allNotifications.set(data);
  }
  handleNotificationDismiss(notificationId: string|number) {
  if(this.unreadCount()>0)  this.unreadCount.update(count=>count-1)
    this.updateSpecificNotificationList(this.allNotifications, notificationId);
  this.updateSpecificNotificationList(this.reportsNotifications, notificationId);
  this.updateSpecificNotificationList(this.calendarNotifications, notificationId);
  this.updateSpecificNotificationList(this.unReadNotifications, notificationId);
  this.deleteReadNotification(notificationId);
  }


  private updateSpecificNotificationList(
    listSignal: WritableSignal<Notification[]>, // Pass the signal itself
    notificationId: string | number
  ): void {
    listSignal.update(currentNotifications =>
      this.markNotificationAsReadInArray(currentNotifications, notificationId)
    );
}
deleteReadNotification(notificationId:string|number){
  this.unReadNotifications.update(notifications => notifications.filter(n=>!n.isRead))
}
  private markNotificationAsReadInArray(
    notifications: Notification[],
    notificationId: string | number
  ): Notification[] {
    return notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true } // Create new object if ID matches
        : notification                     // Return original object otherwise
    );
  }
  // Update total records based on the currently filtered list
  // updateTotalRecords(): void {
  //   this.totalRecords.set(this.filteredNotifications().length);
  // }

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
 //   this.updateTotalRecords(); // Update total records for the new filter
    // No need to explicitly update displayedNotifications, computed signal handles it
  }


  


}