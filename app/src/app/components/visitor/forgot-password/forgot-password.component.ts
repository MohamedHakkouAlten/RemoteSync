import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { ForgotPasswordRequestDto } from '../../../dto/auth/forgotpassword.dto';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  currentLanguage: SupportedLanguage = 'en'; // Default language

  @ViewChild('forgotPasswordForm') forgotPasswordForm!: NgForm;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthFacadeService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
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
      console.log('Password reset request for:', this.email);
      
      const forgotPasswordData: ForgotPasswordRequestDto = {
        email: this.email
      };
      
      this.authService.forgotPassword(forgotPasswordData).subscribe({
        next: (response) => {
          this.loading = false;
          
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('forgotPassword.resetLinkSent'),
            detail: this.translate.instant('forgotPassword.checkYourEmail'),
            life: 4000
          });
          
          // Clear the email field after successful submission
          this.email = '';
          this.submitted = false;
          
          // Optional: Navigate to login page after a delay
          setTimeout(() => {
            this.router.navigate(['/RemoteSync/Login']);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('forgotPassword.resetLinkFailed'),
            detail: error.message || this.translate.instant('forgotPassword.emailNotFound'),
            life: 5000
          });
        }
      });
    } else {
      console.log('Forgot Password failed: Form invalid or email empty.');
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('forgotPassword.resetLinkFailed'),
        detail: this.translate.instant('forgotPassword.enterValidEmail'),
        life: 3000
      });
    }
  }
}