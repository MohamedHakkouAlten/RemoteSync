import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  // --- Component Properties ---
  email: string = ''; // Bound to the email input field
  submitted: boolean = false; // Flag for submission attempt

  // Access the form instance
  @ViewChild('forgotPasswordForm') forgotPasswordForm!: NgForm;

  // Inject services
  constructor(
    private messageService: MessageService,
    private router: Router
    // private router: Router // Inject Router if needed
  ) { }

  // --- Component Methods ---

  /**
   * Handles the request to send a password reset link.
   */
  sendResetLink(): void {
    this.submitted = true; // Mark form as submitted

    // Mark control as touched for immediate validation feedback
    if (this.forgotPasswordForm?.controls['email']) {
      this.forgotPasswordForm.controls['email'].markAsTouched();
    }

    // Check form validity (based on required and email validators)
    if (this.forgotPasswordForm?.valid && this.email) {
      // --- Success ---
      console.log('Password reset request for:', this.email);
      // TODO: Implement actual API call to backend service here

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password reset instructions sent to your email.',
        life: 4000 // Longer display time
      });

      // Optionally navigate to a confirmation page or login after a delay
      setTimeout(() => {
        // THIS IS JUST FOR TEST TO CHECK IF THE UI WORKING PERFECTLY FINE OR NOT
        this.router.navigate(['/RemoteSync/ResetPassword']); // Navigate to login page
      }, 2000); // 2 seconds delay

      // Optionally clear field or disable button after sending
      // this.email = '';
      // this.submitted = false; // Allow resubmission if needed after timeout?
      // this.forgotPasswordForm.reset();

    } else {
      // --- Failure ---
      console.log('Forgot Password failed: Form invalid or email empty.');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid email address.',
        life: 3000
      });
    }
  }
}