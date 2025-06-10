import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { RecoverPasswordDto } from '../../../dto/auth/recoverpassword.dto';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  currentLanguage: SupportedLanguage = 'en';

  @ViewChild('forgotPasswordForm') forgotPasswordForm!: NgForm;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthFacadeService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  sendResetLink(): void {
    this.submitted = true;

    if (this.forgotPasswordForm?.controls['email']) {
      this.forgotPasswordForm.controls['email'].markAsTouched();
    }

    if (this.forgotPasswordForm?.valid && this.email) {
      this.loading = true;

      const recoverPasswordData: RecoverPasswordDto = {
        email: this.email,
      };

      this.authService.recoverPassword(recoverPasswordData).subscribe({
        next: (response) => {
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('forgotPassword.resetLinkSent'),
            detail: this.translate.instant('forgotPassword.checkYourEmail'),
            life: 4000,
          });

          this.email = '';
          this.submitted = false;

          setTimeout(() => {
            this.router.navigate([
              '/' + this.currentLanguage + '/remotesync/login',
            ]);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;

          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('forgotPassword.resetLinkFailed'),
            detail:
              error.message ||
              this.translate.instant('forgotPassword.emailNotFound'),
            life: 5000,
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('forgotPassword.resetLinkFailed'),
        detail: this.translate.instant('forgotPassword.enterValidEmail'),
        life: 3000,
      });
    }
  }
}
