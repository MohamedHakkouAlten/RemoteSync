import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { NotificationPanelComponent } from "../notification-panel/notification-panel.component";
import { AuthService } from '../../../services/auth.service';
import { UserUtils } from '../../../utilities/UserUtils';
import { UserAvatarComponent } from "../shared-ui/user-avatar/user-avatar.component";




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    RouterModule,
    NotificationPanelComponent,
    UserAvatarComponent
],
providers:[
  AuthService
]
})
export class NavigationComponent implements OnInit {


    userUtils=UserUtils
    // Properties to make the component more dynamic later
    userName: string = '';
    userInitials:string=""
    @ViewChild('userMenu') userMenu!: Menu; // Reference to the p-menu component
    menuItems: MenuItem[] = []; // Array to hold menu items
    userAvatarUrl: string = 'assets/images/avatar.png'; // Replace with your actual path
    logoUrl: string = 'assets/images/alten.png'; // Replace with your actual path
    navItems: {label: string, routerLink: string}[] = [];
   

    
  constructor(private router: Router, private authService: AuthService) {
   }

  /**
   * Updates the user name display from authentication data
   */
  private updateUserName(): void {
    const firstName = this.authService.getFirstName();
    const lastName = this.authService.getLastName();
    
    if (firstName && lastName) {
      this.userName = `${firstName} ${lastName}`;
    } else {
      this.userName = 'Guest User';
    }
  }

  ngOnInit(): void {
    console.log("jjjj"+this.authService.getUser()?.firstName)
    // Get user's first and last name from AuthService
this.updateUserName()
    this.userInitials=this.userUtils.getUserInitials(this.authService.getUser())
    // Subscribe to user info changes to update name when user logs in/out
    this.authService.userInfo$.subscribe(userInfo => {
     
      if (userInfo) {
        this.userName = `${userInfo.firstName} ${userInfo.lastName}`;
      } else {
        this.userName = 'Guest User';
      }
    });
    
    
    // Set up user menu items
    this.menuItems = [
      {
        label: 'Notifications',
        icon: 'pi pi-bell', // Reuse bell icon
        command: () => this.router.navigate(['/RemoteSync/Associate/Notification'])
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

    // Set up navigation items based on user role
    this.setupNavItems();
  }

  /**
   * Set up navigation items based on user role
   */
  setupNavItems(): void {
    const userRoles = this.authService.getUserRoles();
    
    if (userRoles.includes('ASSOCIATE')) {
      this.navItems = [
        { label: 'Dashboard', routerLink: '/RemoteSync/Associate/Dashboard' },
        { label: 'Project', routerLink: '/RemoteSync/Associate/Project' },
        { label: 'Calendar', routerLink: '/RemoteSync/Associate/Calendar' },
        { label: 'Report', routerLink: '/RemoteSync/Associate/Report' },
        { label: 'Notification', routerLink: '/RemoteSync/Associate/Notification' }
      ];
    } else if (userRoles.includes('RC')) {
      this.navItems = [
        { label: 'Dashboard', routerLink: '/RemoteSync/RC/Dashboard' },
        { label: 'Project', routerLink: '/RemoteSync/RC/Project' },
        { label: 'Report', routerLink: '/RemoteSync/RC/Report' },
        { label: 'Calendar', routerLink: '/RemoteSync/RC/Calendar' }
      ];
    } else if (userRoles.includes('ADMIN')) {
      this.navItems = [
        { label: 'Dashboard', routerLink: '/RemoteSync/Admin/Dashboard' }
        // Add more admin menu items as needed
      ];
    } else {
      // Default or fallback navigation
      this.navItems = [];
    }
  }
  

  onNotificationClick() {
    // Implement notification logic
    console.log('Notification clicked');
  }

  /**
   * Navigate to the user profile page based on their role
   */
  navigateToProfile(): void {
    const userRoles = this.authService.getUserRoles();
    
    if (userRoles.includes('ASSOCIATE')) {
      this.router.navigate(['/RemoteSync/Associate/Profile']);
    } else if (userRoles.includes('RC')) {
      this.router.navigate(['/RemoteSync/Rc/Profile']);
    } else if (userRoles.includes('ADMIN')) {
      this.router.navigate(['/RemoteSync/Admin/Profile']);
    } else {
      console.log('No valid role found for profile navigation');
    }
  }


  

  
    openSettingsPage(): void {
      console.log('Navigate to User Settings page triggered.');
      // Implement actual navigation logic
    }
  
    signOut(): void {
      console.log('Sign Out triggered.');
      // Implement sign out logic using auth service
      this.authService.logout().subscribe();
    }

   

  

}