import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-form-group',
  standalone: false,
  template: `
    <div class="form-group" [ngClass]="groupClass">
      <label *ngIf="label" [for]="controlId" class="form-label">{{ label }}</label>
      <span class="p-input-icon-left w-full">
        <i *ngIf="icon" [class]="icon"></i>
        <ng-content></ng-content>
      </span>
      <ng-content select=".form-error"></ng-content>
    </div>
  `,
  styleUrls: ['./visitor-form-group.component.scss']
})
export class VisitorFormGroupComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() controlId: string = '';
  @Input() groupClass: string = '';
}
