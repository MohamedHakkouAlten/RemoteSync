import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MessageService } from 'primeng/api';

import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { VisitorUiModule } from "../../shared/visitor-ui/visitor-ui.module";

// Translation imports
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../../components/shared/language-selector/language-selector.component';


@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ForgotPasswordRoutingModule,
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
export class ForgotPasswordModule { }
