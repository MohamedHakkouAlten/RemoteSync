import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { ChatModule } from '../../rc/chat/chat.module';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, NavigationComponent, ChatModule],
  template: `
    <div class="layout-container">
      <header class="layout-header" [ngClass]="headerClass">
        <app-navigation></app-navigation>
      </header>

      <main class="layout-content" [ngClass]="contentClass">
        <ng-content></ng-content>
      </main>

      <footer class="layout-footer" [ngClass]="footerClass">
        WE NEED FOOOTER HERE
        <ng-content select="[slot=footer]"></ng-content>
      </footer>
      
      <!-- Only show chat for RC or ADMIN roles -->
      <app-chat *ngIf="isRcOrAdmin"></app-chat>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .layout-header {
      flex: 0 0 auto;
    }

    .layout-content {
      flex-direction: column;
      justify-content: flex-start;
      width: 100%;
      flex: 1 1 auto;
    }

    .layout-footer {
      flex: 0 0 auto;
    }
  `]
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  @Input() headerClass: string = '';
  @Input() contentClass: string = '';
  @Input() footerClass: string = '';
  
  isRcOrAdmin: boolean = false;
  private subscription: Subscription | null = null;

  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    // Subscribe to user role changes to detect RC or ADMIN role
    this.subscription = this.authFacade.userInfo$.subscribe(userInfo => {
      if (userInfo && userInfo.roles) {
        // Check if user has RC or ADMIN role
        this.isRcOrAdmin = userInfo.roles.some(role => 
          role.toUpperCase() === 'RC' || role.toUpperCase() === 'ADMIN'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
