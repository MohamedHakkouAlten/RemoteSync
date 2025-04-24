import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';



interface Notification {
  id: number;
  type: 'report' | 'rotation' | 'general';
  sender: string; // Optional sender name
  message: string;
  timestamp: Date; // Use Date object for easier sorting/formatting
  isRead: boolean;
  

}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    OverlayPanelModule,
    TooltipModule,
    OverlayBadgeModule,
     MenubarModule,
      ButtonModule,
    AvatarModule,
     RippleModule,
     MenuModule,
     RouterModule
  ]
})
export class NavigationComponent implements OnInit {
  // Reference to the PrimeNG OverlayPanel component in the template
  @ViewChild('notificationOverlay') notificationOverlay!: OverlayPanel;

  // Array to hold notification data
  notifications: Notification[] =[];
  unreadCount: number = 0;

    // Properties to make the component more dynamic later
    userName: string = 'John Anderson';
    @ViewChild('userMenu') userMenu!: Menu; // Reference to the p-menu component
    menuItems: MenuItem[] = []; // Array to hold menu items
    userAvatarUrl: string = 'assets/images/avatar.png'; // Replace with your actual path
    logoUrl: string = 'assets/images/alten.png'; // Replace with your actual path
   

    
  constructor(    
    private cd: ChangeDetectorRef,private router:Router) { }

  ngOnInit(): void {
 
this.loadNotifications();
this.calculateUnreadCount();

this.menuItems = [
  {
    label: 'Notifications',
    icon: 'pi pi-bell', // Reuse bell icon
    command: () => this.router.navigate(['/RemoteSync/associate/notifications'])
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog', // Settings icon
    command: () => this.openSettingsPage() // Changed from previous openSettings() which was for notification settings
  },
  {
    separator: true // Visual separator
  },
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out', // Sign out icon
    command: () => this.signOut()
  }
];
  }
  

  onNotificationClick() {
    // Implement notification logic
    console.log('Notification clicked');
  }

    // Load sample notifications based on the provided images
    loadNotifications(): void {
      const now = new Date();
      this.notifications  = [
    
    
        {
          id: 1,
          type: 'report',
          sender: 'Sarah Johnson',
          message: 'approved your quarterly report.',
          timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
          isRead: false
         
        },
        {
          id: 2,
          type: 'rotation',
          sender: 'Michael Chen',
          message: 'assigned you to the Project Aurora task force.',
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
          isRead: false,
         
        },
        {
          id: 3,
          type: 'rotation',
          message: 'The reporting system will be offline for maintenance tonight from 12AM-2AM EST.',
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
          isRead: false,
          sender: 'Elena Petrova',
          // No actions needed for this type often
        },
        {
          id: 4,
          type: 'report',
          sender: 'Elena Petrova',
          message: 'commented on your project plan: "Great timeline structure, let\'s discuss the resource allocation tomorrow."',
          timestamp: new Date(now.setDate(now.getDate() - 1)), // Yesterday
          isRead: true, // Example of a read notification
        
        },
        {
          id: 5,
          type: 'rotation',
          message: "Don't forget: Quarterly planning meeting tomorrow at 10:00 AM in Conference Room B.",
          timestamp: new Date(now.setDate(now.getDate() - 2)), // 2 days ago
          isRead: false,
          sender: 'Elena Petrova',
        
        },
        // Add more notifications as needed for testing scroll
         {
          id: 6,
          type: 'rotation',
          message: 'Password policy updated. Please review the new requirements.',
          timestamp: new Date(now.setDate(now.getDate() - 3)), // 3 days ago
          isRead: true,
          sender: 'Elena Petrova',
        },
      ];
     
    }
  
    navigateToNotifications(): void {
      console.log('Navigate to Notifications page/view triggered from user menu.');
      // Implement actual navigation logic
      this.viewAllNotifications(); // Can reuse existing method if it fits
    }
  
    openSettingsPage(): void {
      console.log('Navigate to User Settings page triggered.');
      // Implement actual navigation logic
    }
  
    signOut(): void {
      console.log('Sign Out triggered.');
      // Implement sign out logic (clear session, redirect, etc.)
    }
    // Calculate the number of unread notifications
    calculateUnreadCount(): void {
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }
  
    // Toggle the notification panel visibility
    togglePanel(event: Event): void {
      this.notificationOverlay.toggle(event);
    }
  
    // Mark a specific notification as read
    markAsRead(notification: Notification, event?: Event): void {
      if (event) event.stopPropagation(); // Prevent panel close if needed
  
      if (!notification.isRead) {
        notification.isRead = true;
        this.calculateUnreadCount();
        this.cd.markForCheck(); // Trigger change detection
        console.log(`Notification ${notification.id} marked as read.`);
        // Optional: Add visual feedback or remove immediately after a delay
      }
    }
  
    // Mark all notifications as read
    markAllAsRead(): void {
      this.notifications.forEach(n => n.isRead = true);
      this.calculateUnreadCount();
      this.cd.markForCheck(); // Trigger change detection
      console.log('All notifications marked as read.');
      // Maybe close the panel after marking all as read?
      // this.notificationOverlay.hide();
    }
  
    // Handle actions triggered by notification buttons
    handleAction(notification:Notification,actionKey: string): void {
 // Prevent panel close
  
     
  
      
       if (actionKey === 'dismiss') {
           this.markAsRead(notification); // Dismiss implies read
           // Optionally remove the notification from the list after a short delay
           // setTimeout(() => this.removeNotification(notification.id), 300);
       }else this.router.navigate(["RemoteSync/rc/rapport"])
         
  
      
  
   
    }
  
    // Optional: Remove notification from the list
    removeNotification(id: number): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.calculateUnreadCount(); // Recalculate count
        this.cd.markForCheck();
    }
  
    // Placeholder for navigating to a full notifications page
    viewAllNotifications(): void {
      console.log('Navigating to all notifications page...');
      this.notificationOverlay.hide();
      // Add navigation logic here
    }
  
      // Placeholder for opening notification settings
    openSettings(): void {
      console.log('Opening notification settings...');
      this.notificationOverlay.hide();
      // Add navigation logic here
    }
  
    // Helper function to get relative time string
    getRelativeTime(date: Date): string {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (seconds < 60) {
        return `Just now`;
      } else if (minutes < 60) {
        return `${minutes} min ago`;
      } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (days === 1) {
        return `Yesterday`;
      } else {
        return `${days} days ago`;
      }
      // Could add more granular date formatting if needed (e.g., specific date for older items)
    }
}