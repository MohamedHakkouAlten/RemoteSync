import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Notification } from '../../../models/notification.model';



@Component({
  selector: 'app-notification-panel',
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    AvatarModule,
    OverlayBadgeModule

  ],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit {

  // Reference to the PrimeNG OverlayPanel component in the template
  @ViewChild('notificationOverlay') notificationOverlay!: OverlayPanel;
  // Array to hold notification data
 @Input() notifications: Notification[] = [];
  unreadCount: number = 0;

  constructor(    
    private cd: ChangeDetectorRef,private router:Router) { }

  ngOnInit(): void {
    this.calculateUnreadCount();
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
