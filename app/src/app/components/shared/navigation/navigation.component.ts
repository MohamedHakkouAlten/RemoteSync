import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    AvatarGroupModule
  ]
})
export class NavigationComponent {
  userName: string = 'John Doe'; // This should be replaced with actual user data

  onNotificationClick() {
    // Implement notification logic
    console.log('Notification clicked');
  }
}