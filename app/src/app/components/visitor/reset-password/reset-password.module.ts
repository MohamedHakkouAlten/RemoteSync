import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VisitorUiModule } from '../../shared/visitor-ui/visitor-ui.module';

// Translation imports
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../../components/shared/language-selector/language-selector.component';


@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ResetPasswordRoutingModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    VisitorUiModule,
    // Add TranslateModule for i18n support
    TranslateModule.forChild(),
    // Add LanguageSelectorComponent for language selection
    LanguageSelectorComponent
  ],
  providers: [MessageService]
})
export class ResetPasswordModule { }
