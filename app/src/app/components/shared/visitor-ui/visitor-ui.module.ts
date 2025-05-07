import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorLogoBlockComponent } from './visitor-logo-block.component';
import { VisitorFormCardComponent } from './visitor-form-card.component';
import { VisitorFormGroupComponent } from './visitor-form-group.component';
import { VisitorActionButtonComponent } from './visitor-action-button.component';

@NgModule({
  declarations: [
    VisitorLogoBlockComponent,
    VisitorFormCardComponent,
    VisitorFormGroupComponent,
    VisitorActionButtonComponent
  ],
  imports: [CommonModule],
  exports: [
    VisitorLogoBlockComponent,
    VisitorFormCardComponent,
    VisitorFormGroupComponent,
    VisitorActionButtonComponent
  ]
})
export class VisitorUiModule {}
