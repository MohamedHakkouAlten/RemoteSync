import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from '../../../../models/notification.model';
import { AvatarModule } from 'primeng/avatar';


import { CommonModule } from '@angular/common';
import { UserUtils } from '../../../../utilities/UserUtils';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-card',
  imports: [    CommonModule,
    AvatarModule,
    ButtonModule
  
   
    ],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {

userUtils=UserUtils
@Input() notification! :Notification
@Output() dismissed = new EventEmitter<string | number>();
constructor(private router:Router){

}
onDismiss( ): void {

  this.dismissed.emit(this.notification.id)
}

viewCalendar(): void {
if(!this.notification.isRead)  this.dismissed.emit(this.notification.id)
this.router.navigate(['RemoteSync/Rc/Calendar'])


}

viewReport(): void {
  if(!this.notification.isRead)  this.dismissed.emit(this.notification.id)
  this.router.navigate(['RemoteSync/RC/Report'])
}

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
