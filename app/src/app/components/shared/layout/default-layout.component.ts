import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from "../navigation/navigation.component";

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [CommonModule, NavigationComponent],
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
      align-items: center;
      justify-content: flex-start;
    }

    .layout-footer {
      flex: 0 0 auto;
    }
  `]
})
export class DefaultLayoutComponent {
  @Input() headerClass: string = '';
  @Input() contentClass: string = '';
  @Input() footerClass: string = '';
}