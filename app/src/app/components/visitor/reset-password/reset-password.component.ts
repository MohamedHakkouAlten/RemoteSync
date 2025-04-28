import { Component, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';

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
export class ResetPasswordComponent {
    newPassword: string = '';
    confirmPassword: string = '';
    submitted: boolean = false;
    resetToken: string | null = null; // To store the token from URL (example)
  
    // Access the form instance
    @ViewChild('setPasswordForm') setPasswordForm!: NgForm;
  
    // Inject services
    constructor(
      private messageService: MessageService,
      // private route: ActivatedRoute, // Inject ActivatedRoute to get token
      // private router: Router // Inject Router to navigate
    ) { }
  
    ngOnInit(): void {
      // --- Example: Get reset token from URL query parameter ---
      // In a real app, you'd get this securely
      // this.resetToken = this.route.snapshot.queryParamMap.get('token');
      // if (!this.resetToken) {
      //   console.error('Reset token not found!');
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid password reset link.', life: 5000 });
      //   // Optionally navigate away: this.router.navigate(['/login']);
      // }
  
      // --- Apply custom validator AFTER form is initialized ---
      // We need a slight delay or use a different approach for template-driven forms
      // For simplicity here, we'll check manually in updatePassword()
      // Alternatively, use Reactive Forms for easier cross-field validation.
    }
  
  
    // --- Component Methods ---
  
    /**
     * Handles the password update logic.
     */
    updatePassword(): void {
      this.submitted = true;
  
      // Mark controls as touched
      if (this.setPasswordForm?.controls) {
        Object.keys(this.setPasswordForm.controls).forEach(key => {
          this.setPasswordForm.controls[key].markAsTouched();
        });
      }
  
      // --- Manual Check for Password Match ---
      const passwordsDoMatch = this.newPassword === this.confirmPassword;
  
      // --- Check Form Validity AND Password Match ---
      if (this.setPasswordForm?.valid && passwordsDoMatch) {
        // --- Success ---
        console.log('Password update attempt. Token:', this.resetToken); // Include token if used
        // TODO: Implement actual API call to backend service here
        // Send this.newPassword and this.resetToken to your backend
  
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your password has been updated successfully!',
          life: 4000
        });
  
        // Optionally navigate to login page after success
        // setTimeout(() => this.router.navigate(['/login']), 4000);
  
      } else {
        // --- Failure ---
        let errorDetail = 'Please correct the errors below.';
        if (!passwordsDoMatch && this.newPassword && this.confirmPassword) {
          errorDetail = 'Passwords do not match.';
          // Manually add error state to confirm password for visual feedback (optional)
          this.setPasswordForm.controls['confirmPassword']?.setErrors({ 'passwordsMismatch': true });
        } else if (!this.setPasswordForm?.valid) {
           errorDetail = 'Please fill in both password fields correctly.';
        }
  
        console.log('Set Password failed: Form invalid or passwords mismatch.');
        this.messageService.add({
          severity: 'error',
          summary: 'Error Updating Password',
          detail: errorDetail,
          life: 3000
        });
      }
    }
}
