import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Notification } from '../../../models/notification.model';
import { NotificationCardComponent } from "../associate-ui/notification-card/notification-card.component";
import { NotificationType } from '../../../enums/notification-type.enum';



@Component({
  selector: 'app-notification-panel',
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    OverlayBadgeModule,
    NotificationCardComponent
  ],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit {

  // Reference to the PrimeNG OverlayPanel component in the template
  @ViewChild('notificationOverlay') notificationOverlay!: OverlayPanel;
  // Array to hold notification data
  @Input() notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  constructor(private router:Router){

  }


  ngOnInit(): void {
    this.loadNotifications();

  }

  handleNotificationDismiss(notificationId: string | number) {
    this.unreadCount.update(currentUnreadCount => currentUnreadCount - 1);
    this.notifications.update(currentNotifications =>
      // Use map to create a new array with the updated notification
      currentNotifications.map(notification => {
        // If this is the notification we want to update...
        if (notification.id === notificationId) {
          // ...return a *new* object with isRead set to true
          // Use the spread operator (...) to copy existing properties
          return { ...notification, isRead: true };
        } else {
          // ...otherwise, return the original notification object unchanged
          return notification;
        }
      })
    );
  }
  // Load sample notifications based on the provided images
  loadNotifications(): void {
    const now = new Date();
    this.unreadCount.set(7);
    this.notifications.set([


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

    ]);


  }


  // Toggle the notification panel visibility
  togglePanel(event: Event): void {
    this.notificationOverlay.toggle(event);
  }


  // Mark all notifications as read
  markAllAsRead(): void {
    //  this.notifications.forEach(n => n.isRead = true);
    // this.calculateUnreadCount();
    const countUnread = this.notifications().filter(notification => !notification.isRead).length
   if(this.unreadCount()>0 && countUnread>0) this.unreadCount.update(currentUnreadCount => currentUnreadCount - countUnread)
    this.notifications.update(currentNotifications =>
      currentNotifications.map((notification) => {
        notification.isRead = true;
        return notification
      }

      )

    )

  }

  // Placeholder for navigating to a full notifications page
  viewAllNotifications(): void {
    this.router.navigate(['RemoteSync/Associate/Notification'])
    this.notificationOverlay.hide();
    // Add navigation logic here
  }



}
