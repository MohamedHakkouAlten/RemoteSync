import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VisitorUiModule } from '../../shared/visitor-ui/visitor-ui.module';

// Translation imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LanguageSelectorComponent } from '../../../components/shared/language-selector/language-selector.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    // Add VisitorUiModule to use shared visitor UI components
    VisitorUiModule,
    // Add TranslateModule for i18n support
    TranslateModule.forChild(),
    // Add LanguageSelectorComponent for language selection
    LanguageSelectorComponent
  ],
  providers: [MessageService]
})
export class LoginModule { }
