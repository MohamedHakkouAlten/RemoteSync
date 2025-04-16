import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequestDto } from '../../../dto/auth.dto';
import { LoginResponseDTO } from '../../../dto/login-response.dto';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  usernameOrEmail: string = ''; // Variable to hold either username or email
  password: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  returnUrl: string = '/RemoteSync/Associate/Dashboard';

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/RemoteSync/Associate/Dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/RemoteSync/Associate/Dashboard';

    // If already logged in, redirect to return URL
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  signIn(): void {
    this.submitted = true;

    if (this.loginForm) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
      });
    }

    if (this.loginForm?.valid) {
      this.loading = true;

      const credentials: LoginRequestDto = {
        usernameOrEmail: this.usernameOrEmail, // Using usernameOrEmail but mapping to 'email' field in DTO
        password: this.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: `Welcome back, ${response.firstName}!`,
            life: 3000
          });

          // Navigate to return URL or dashboard
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error.message || 'Invalid credentials. Please try again.',
            life: 5000
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Please enter a valid username or email and password.',
        life: 3000
      });
    }
  }
}
