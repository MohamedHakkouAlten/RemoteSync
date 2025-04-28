import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

export type ToggleState = -1 | 0 | 1; // -1: Left, 0: Middle, 1: Right

@Component({
  selector: 'app-three-state-toggle',
  standalone: true, // Remove if not using standalone
  imports: [NgClass],  // Remove if not using standalone
  templateUrl: './three-state-toggle.component.html',
  styleUrls: ['./three-state-toggle.component.css']
})
export class ThreeStateToggleComponent {

  @Input() value: ToggleState = 1; // Default to middle state
  @Output() valueChange = new EventEmitter<ToggleState>();

  // Make the component focusable
  @HostBinding('attr.tabindex') tabindex = 0;
  // ARIA role - slider is often used for multi-value selection
  @HostBinding('attr.role') role = 'slider';
  @HostBinding('attr.aria-valuemin') valuemin = -1;
  @HostBinding('attr.aria-valuemax') valuemax = 1;
  @HostBinding('attr.aria-valuenow') get ariaValueNow() {
      return this.value;
  }
  @HostBinding('attr.aria-valuetext') get ariaValueText() {
      switch (this.value) {
          case -1: return 'Left';
          case 0: return 'Middle';
          case 1: return 'Right';
          default: return 'Middle';
      }
  }
  @HostBinding('attr.aria-label') ariaLabel = 'Three state toggle switch'; // Consider making this an @Input

  // --- Event Handlers ---

  @HostListener('click')
  onClick() {
    this.cycleState();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    let newState: ToggleState | undefined;

    switch (event.key) {
      case 'ArrowLeft':
        newState = Math.max(-1, this.value - 1) as ToggleState;
        event.preventDefault(); // Prevent page scroll
        break;
      case 'ArrowRight':
        newState = Math.min(1, this.value + 1) as ToggleState;
        event.preventDefault(); // Prevent page scroll
        break;
      case ' ': // Spacebar
      case 'Enter':
        this.cycleState();
        event.preventDefault(); // Prevent button activation / form submission
        break;
      default:
        // Ignore other keys
        return;
    }

    if (newState !== undefined && newState !== this.value) {
        this.valueChange.emit(newState);
    }
  }

  // --- Internal Logic ---

  private cycleState() {
    let nextState: ToggleState;
    switch (this.value) {
      case -1: nextState = 0; break; // Left -> Middle
      case 0: nextState = 1; break;  // Middle -> Right
      case 1: nextState = -1; break; // Right -> Left
      default: nextState = 0; // Default fallack
    }
    this.valueChange.emit(nextState);
  }

  // --- CSS Class Binding ---

  get stateClass() {
    switch (this.value) {
      case -1: return 'state-left';
      case 0: return 'state-middle';
      case 1: return 'state-right';
      default: return 'state-middle';
    }
  }
}