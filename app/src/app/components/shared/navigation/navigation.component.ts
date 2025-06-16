import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { NotificationPanelComponent } from "../notification-panel/notification-panel.component";
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';




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
    NotificationPanelComponent,
    TranslateModule
]
})
export class NavigationComponent implements OnInit {
  currentLanguage: SupportedLanguage = 'en'; // Default language


    // Properties to make the component more dynamic later
    userName: string = '';
    @ViewChild('userMenu') userMenu!: Menu; // Reference to the p-menu component
    menuItems: MenuItem[] = []; // Array to hold menu items
    userAvatarUrl: string = 'assets/images/avatar.png'; // Replace with your actual path
    logoUrl: string = 'assets/images/alten.png'; // Replace with your actual path
    navItems: {label: string, routerLink: string}[] = [];

    // Mobile menu state
    isMobileMenuOpen: boolean = false;



  constructor(
    private router: Router,
    private authService: AuthFacadeService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Subscribe to language changes
    
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.setupNavItems();
      this.setupMenuItems();
      this.cdr.detectChanges();
    });

    // Get user's first and last name from AuthService
    const firstName = this.authService.getFirstName() || '';
    const lastName = this.authService.getLastName() || '';
    this.userName = firstName && lastName ? `${firstName} ${lastName}` : 'Guest User';

    // Subscribe to user info changes to update name when user logs in/out
    this.authService.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.userName = `${userInfo.firstName} ${userInfo.lastName}`;
      } else {
        this.userName = 'Guest User';
      }
    });

    this.setupMenuItems();
    // Set up navigation items based on user role
    this.setupNavItems();
  }

  /**
   * Set up user menu items
   */
  setupMenuItems(): void {
    const userRoles = this.authService.getUserRoles();
    this.menuItems = [
      {
        label: this.userName,
        icon: 'pi pi-user', // User icon
        command: () => this.navigateToProfile()
      },
      (userRoles.includes('ADMIN')) ? {
        label: 'navigation.notifications', // Use translation key directly
        icon: 'pi pi-bell', // Reuse bell icon
        command: () => this.router.navigate([`/${this.currentLanguage}/remotesync/admin/notification`])
      } :  (userRoles.includes('RC')) ?
      {
        label: 'navigation.notifications', // Use translation key directly
        icon: 'pi pi-bell', // Reuse bell icon
        command: () => this.router.navigate([`/${this.currentLanguage}/remotesync/rc/notification`])
      } : {
        label: 'navigation.notifications', // Use translation key directly
        icon: 'pi pi-bell', // Reuse bell icon
        command: () => this.router.navigate([`/${this.currentLanguage}/remotesync/associate/notification`])
      },
    
      {
        separator: true // Visual separator
      },
      {
        label: 'navigation.signOut', // Use translation key directly
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

    if (userRoles.includes('ADMIN')) {
      this.navItems = [
        { label: 'navigation.dashboard', routerLink: `/${this.currentLanguage}/remotesync/admin/dashboard` }
        // Add more admin menu items as needed
      ];
    } else if (userRoles.includes('RC')) {
      this.navItems = [
        { label: 'navigation.dashboard', routerLink: `/${this.currentLanguage}/remotesync/rc/dashboard` },
        { label: 'navigation.project', routerLink: `/${this.currentLanguage}/remotesync/rc/project` },
        { label: 'navigation.report', routerLink: `/${this.currentLanguage}/remotesync/rc/report` },
        { label: 'navigation.calendar', routerLink: `/${this.currentLanguage}/remotesync/rc/calendar` }
      ];
    } else if (userRoles.includes('ASSOCIATE')) {
      this.navItems = [
        { label: 'navigation.dashboard', routerLink: `/${this.currentLanguage}/remotesync/associate/dashboard` },
        { label: 'navigation.project', routerLink: `/${this.currentLanguage}/remotesync/associate/project` },
        { label: 'navigation.report', routerLink: `/${this.currentLanguage}/remotesync/associate/report` },
        { label: 'navigation.calendar', routerLink: `/${this.currentLanguage}/remotesync/associate/calendar` }
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

    if (userRoles.includes('ADMIN')) {
      this.router.navigate([`/${this.currentLanguage}/remotesync/admin/profile`]);
    } else if (userRoles.includes('RC')) {
      this.router.navigate([`/${this.currentLanguage}/remotesync/rc/profile`]);
    } else if (userRoles.includes('ASSOCIATE')) {
      this.router.navigate([`/${this.currentLanguage}/remotesync/associate/profile`]);
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

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu(): void {
      this.isMobileMenuOpen = false;
    }





}
