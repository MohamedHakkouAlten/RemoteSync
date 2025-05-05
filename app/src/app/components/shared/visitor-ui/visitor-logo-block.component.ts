import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-logo-block',
  standalone: false,
  template: `
    <div class="logo-container" [ngClass]="containerClass">
      <img [src]="logoSrc" [alt]="logoAlt" class="logo-image" *ngIf="logoSrc">
      <div class="logo-text-wrapper">
        <span class="logo-text-main">{{ mainText }}</span>
        <span class="logo-text-sub">{{ subText }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./visitor-logo-block.component.scss']
})
export class VisitorLogoBlockComponent {
  @Input() logoSrc: string = '';
  @Input() logoAlt: string = 'Logo';
  @Input() mainText: string = '';
  @Input() subText: string = '';
  @Input() containerClass: string = '';
}
