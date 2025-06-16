import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-form-card',
  standalone: false,
  template: `
    <div class="form-card " [ngClass]="[alignClass, cardClass]">
      <h1 class="card-title !text-14" *ngIf="title">{{ title }}</h1>
      <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./visitor-form-card.component.scss']
})
export class VisitorFormCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() align: 'center' | 'left' = 'center';
  @Input() cardClass: string = '';

  get alignClass() {
    return this.align === 'center' ? 'text-center' : 'text-left';
  }
}
