import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Notification } from '../../../models/notification.model';
import { AssociateService } from '../../../services/associate.service';
import { NotificationDTO } from '../../../dto/notification.dto';
import { NotificationStatus } from '../../../dto/notification-status.enum';
import { WebSocketService } from '../../../services/web-socket.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/auth/user.service';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';



@Component({
  selector: 'app-notification-panel',
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    AvatarModule,
    OverlayBadgeModule,
    ToastModule,
    TranslateModule

  ],
  providers:[AssociateService,WebSocketService,MessageService,TranslateService],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.css'
})
export class NotificationPanelComponent implements OnInit {
markAllAsRead() {
this.associateService.markAllNotificationAsRead().subscribe(()=>this.notifications=this.notifications.map((noti)=>{
  noti.isRead=true;
  return noti}));
  this.unreadCount=0

}
  currentLanguage: SupportedLanguage = 'en';
  // Reference to the PrimeNG OverlayPanel component in the template
  @ViewChild('notificationOverlay') notificationOverlay!: OverlayPanel;
  // Array to hold notification data
 @Input() notifications: Notification[] = [];
  rtNotification :Notification|null=null
  unreadCount: number = 0;

  constructor(    
    private cd: ChangeDetectorRef,
    private router:Router,
    private languageService:LanguageService,
    private userService:UserService,private translateService:TranslateService,
    private messageService:MessageService,
    private associateService:AssociateService,
    private websocketService:WebSocketService) { }

  ngOnInit(): void {
        this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;

    });
    this.websocketService.watchNotificationTopic().subscribe((res: NotificationDTO)=>{this.rtNotification=this.mapNotificationDto(res)
    this.unreadCount++
    this.notifications=[this.rtNotification,...this.notifications]
      this.messageService.add({
        key:'custom-notification',

      severity: 'custom',         
      
      life:10000
    });

    })
        this.websocketService.watchRCNotificationTopic().subscribe((res: NotificationDTO)=>{this.rtNotification=this.mapNotificationDto(res)
      this.unreadCount++
          this.notifications=[this.rtNotification,...this.notifications]
          this.messageService.add({
        key:'custom-notification',

      severity: 'custom',         
      
      life:10000
    });

    })
    this.associateService.getPanelAssociateNotifications().subscribe(res=>{
    
      this.unreadCount=res.countUnreadNotifications
      this.notifications=res.notifications.notificationDTOs.map(dto=>this.mapNotificationDto(dto))


    })
  
  }
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
      // Calculate the number of unread notifications
   
    
      // Toggle the notification panel visibility
      togglePanel(event: Event): void {
        this.notificationOverlay.toggle(event);
      }
     // Mark a specific notification as read
    //  markAsRead(notification: Notification, event?: Event): void {
    //   if (event) event.stopPropagation(); // Prevent panel close if needed
  
    //   if (!notification.isRead) {
    //     notification.isRead = true;

    //     this.cd.markForCheck(); // Trigger change detection
    //     console.log(`Notification ${notification.id} marked as read.`);
    //     // Optional: Add visual feedback or remove immediately after a delay
    //   }
    // }
  
    // Mark all notifications as read
    // markAllAsRead(): void {
    //   this.notifications.forEach(n => n.isRead = true);
   
    //   this.cd.markForCheck(); // Trigger change detection
    //   console.log('All notifications marked as read.');
    //   // Maybe close the panel after marking all as read?
    //   // this.notificationOverlay.hide();
    // }
  
    // Handle actions triggered by notification buttons
    handleAction(notification:Notification,actionKey: string): void {
 // Prevent panel close
  
         const userRoles = this.userService.getUserRoles();
  
      
       if (actionKey === 'dismiss') {
        this.notifications=this.notifications.map(noti=>{
          if(noti.id==notification.id) {
            notification.isRead=true
            return noti
          }return noti
        })
       }else   if(actionKey=="rotation"){
        if(userRoles.includes('ADMIN'))  {
       this.router.navigate([`/${this.currentLanguage}/remotesync/admin/calendar`])
      } else if  (userRoles.includes('RC'))
      {
    this.router.navigate([`/${this.currentLanguage}/remotesync/rc/calendar`])
      } else {
         this.router.navigate([`/${this.currentLanguage}/remotesync/associate/calendar`])
      }
       }
    else if(actionKey=="report") {
       if(userRoles.includes('ADMIN'))  {
       this.router.navigate([`/${this.currentLanguage}/remotesync/admin/report`])
      } else if  (userRoles.includes('RC'))
      {
    this.router.navigate([`/${this.currentLanguage}/remotesync/rc/report`])
      } else {
         this.router.navigate([`/${this.currentLanguage}/remotesync/associate/report`])
      }
    }
      this.unreadCount--
  this.associateService.setNotificationAsRead(notification.id).subscribe()
         
  
      
  
   
    }
  
    // Optional: Remove notification from the list
    // removeNotification(id: number): void {
    //     this.notifications = this.notifications.filter(n => n.id !== id);
    //   //  this.calculateUnreadCount(); // Recalculate count
    //     this.cd.markForCheck();
    // }
  
    // Placeholder for navigating to a full notifications page
    viewAllNotifications(): void {
      const userRoles = this.userService.getUserRoles();
  if(userRoles.includes('ADMIN'))  {
       this.router.navigate([`/${this.currentLanguage}/remotesync/admin/notification`])
      } else if  (userRoles.includes('RC'))
      {
    this.router.navigate([`/${this.currentLanguage}/remotesync/rc/notification`])
      } else {
         this.router.navigate([`/${this.currentLanguage}/remotesync/associate/notification`])
      }
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
