import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { ResetPasswordRequestDto } from '../../../dto/auth/resetpassword.dto';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    // If controls haven't been interacted with yet, don't validate
    if (!newPassword || !confirmPassword) {
      return null;
    }

    // Return error if passwords don't match
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
    newPassword: string = '';
    confirmPassword: string = '';
    submitted: boolean = false;
    loading: boolean = false;
    resetToken: string | null = null;
    currentLanguage: SupportedLanguage = 'en';

    @ViewChild('setPasswordForm') setPasswordForm!: NgForm;

    constructor(
      private messageService: MessageService,
      private authService: AuthFacadeService,
      private route: ActivatedRoute,
      private router: Router,
      private translate: TranslateService,
      private languageService: LanguageService
    ) { }

    ngOnInit(): void {
      // Subscribe to language changes
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;
      });

      // Get reset token from URL query parameter
      this.route.queryParams.subscribe(params => {
        this.resetToken = params['token'];

        // Check token after params are received
        if (!this.resetToken) {
          // Use hardcoded messages initially
          const errorMessages = {
            'en': {
              summary: 'Invalid Link',
              detail: 'The password reset link is invalid or has expired.'
            },
            'fr': {
              summary: 'Lien invalide',
              detail: 'Le lien de réinitialisation du mot de passe est invalide ou a expiré.'
            },
            'es': {
              summary: 'Enlace inválido',
              detail: 'El enlace de restablecimiento de contraseña es inválido o ha expirado.'
            }
          };

          // Get messages for current language or fallback to English
          const messages = errorMessages[this.currentLanguage] || errorMessages['en'];

          setTimeout(() => {
            this.messageService.add({
              severity: 'error',
              summary: messages.summary,
              detail: messages.detail,
              life: 5000
            });
          }, 500);

          // Navigate to forgot password page after a delay
          setTimeout(() => {
            this.router.navigate(['/' + this.currentLanguage + '/remotesync/forgot-password']);
          }, 5500);
        }
      });
    }


    // --- Component Methods ---

    /**
     * Handles the password update logic.
     */
    updatePassword(): void {
      this.submitted = true;

      // Mark controls as touched for validation feedback
      if (this.setPasswordForm?.controls) {
        Object.keys(this.setPasswordForm.controls).forEach(key => {
          this.setPasswordForm.controls[key].markAsTouched();
        });
      }

      // Manual check for password match
      const passwordsDoMatch = this.newPassword === this.confirmPassword;

      // Check form validity and password match
      if (this.setPasswordForm?.valid && passwordsDoMatch && this.resetToken) {
        this.loading = true;

        // Make sure password fields are constructed correctly
        const credentials: ResetPasswordRequestDto = {
          token: this.resetToken!,
          password: this.newPassword,         // Use field name that matches backend DTO
          confPassword: this.confirmPassword  // Use field name that matches backend DTO
        };

        console.log('Sending reset password request with credentials:', credentials);

        // Call the auth service to reset the password
        this.authService.resetPassword(credentials)
          .subscribe({
            next: (response) => {
              this.loading = false;

              // Show success message
              this.messageService.add({
                severity: 'success',
                summary: this.translate.instant('resetPassword.passwordUpdated'),
                detail: this.translate.instant('resetPassword.passwordUpdateSuccess'),
                life: 4000
              });

              // Navigate to login page after success
              setTimeout(() => {
                this.router.navigate(['/' + this.currentLanguage + '/remotesync/login']);
              }, 2000);
            },
            error: (error) => {
              this.loading = false;

              // Show error message
              this.messageService.add({
                severity: 'error',
                summary: this.translate.instant('resetPassword.passwordUpdateFailed'),
                detail: error.message || this.translate.instant('resetPassword.invalidToken'),
                life: 5000
              });
            }
          });
      } else {
        // Handle validation errors
        let errorDetail = this.translate.instant('resetPassword.correctErrors');

        if (!this.resetToken) {
          errorDetail = this.translate.instant('resetPassword.invalidToken');
        } else if (!passwordsDoMatch && this.newPassword && this.confirmPassword) {
          errorDetail = this.translate.instant('resetPassword.passwordsMismatch');
          // Manually add error state to confirm password for visual feedback
          this.setPasswordForm.controls['confirmPassword']?.setErrors({ 'passwordsMismatch': true });
        } else if (!this.setPasswordForm?.valid) {
          errorDetail = this.translate.instant('resetPassword.fillPasswordFields');
        }

        console.log('Password reset failed: Form invalid or passwords mismatch.');
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('resetPassword.errorUpdatingPassword'),
          detail: errorDetail,
          life: 3000
        });
      }
    }
}
