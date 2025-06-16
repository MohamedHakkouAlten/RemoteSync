import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visitor-action-button',
  standalone: false,
  template: `
    <button
      [type]="type"
      class="btn"
      [ngClass]="[btnClass, widthClass]"
      [disabled]="disabled"

      (click)="onClick($event)"
    >

      {{ label }}
    </button>
  `,
  styleUrls: ['./visitor-action-button.component.scss']
})
export class VisitorActionButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() icon: string = '';
  @Input() btnClass: string = '';
  @Input() width: 'full' | 'auto' = 'full';
  @Input() disabled: boolean = false;
  @Input() click: (event: Event) => void = () => {};

  get widthClass() {
    return this.width === 'full' ? 'w-full' : '';
  }

  onClick(event: Event) {
    if (this.click) {
      this.click(event);
    }
  }
}
