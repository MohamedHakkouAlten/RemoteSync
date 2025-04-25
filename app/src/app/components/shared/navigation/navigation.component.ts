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
import { NotificationPanelComponent } from "../notification-panel/notification-panel.component";




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
    TooltipModule,
    OverlayBadgeModule,
    MenubarModule,
    ButtonModule,
    RippleModule,
    MenuModule,
    RouterModule,
    NotificationPanelComponent
]
})
export class NavigationComponent implements OnInit {



    // Properties to make the component more dynamic later
    userName: string = 'John Anderson';
    @ViewChild('userMenu') userMenu!: Menu; // Reference to the p-menu component
    menuItems: MenuItem[] = []; // Array to hold menu items
    userAvatarUrl: string = 'assets/images/avatar.png'; // Replace with your actual path
    logoUrl: string = 'assets/images/alten.png'; // Replace with your actual path
   

    
  constructor( private router:Router) { }

  ngOnInit(): void {
 


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


  

  
    openSettingsPage(): void {
      console.log('Navigate to User Settings page triggered.');
      // Implement actual navigation logic
    }
  
    signOut(): void {
      console.log('Sign Out triggered.');
      // Implement sign out logic (clear session, redirect, etc.)
    }

   

  

}