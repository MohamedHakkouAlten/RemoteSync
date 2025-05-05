import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { LoginRequestDto, LoginResponseDTO } from '../../../dto/auth/login.dto';
import { ResponseWrapperDto } from '../../../dto/response-wrapper.dto';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';

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
  returnUrl: string | null = null; // Will be set from query params if available
  currentLanguage: SupportedLanguage = 'en'; // Default language

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(
    private messageService: MessageService,
    private authService: AuthFacadeService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    // Get return url from route parameters if available
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

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
        next: (response: ResponseWrapperDto<LoginResponseDTO>) => {
          this.loading = false;
          // Get translated messages
          const successSummary = this.translate.instant('login.loginSuccessful');
          const welcomeMessage = this.translate.instant('login.welcomeBackUser', { name: response.data!.firstName });
          
          this.messageService.add({
            severity: 'success',
            summary: successSummary,
            detail: welcomeMessage,
            life: 3000
          });

          // Navigate to return URL or role-based dashboard
          setTimeout(() => {
            this.loading = true;
            // Only use returnUrl if explicitly provided in query params
            // Otherwise let the role-based logic determine the dashboard
            // Convert null to undefined to match the expected parameter type
            this.authService.redirectAfterLogin(this.returnUrl || undefined);
            
            // Log for debugging
            console.log('Login successful, redirecting with returnUrl:', this.returnUrl);
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          // Get translated error messages
          const errorSummary = this.translate.instant('login.loginFailed');
          const errorDetail = error.message || this.translate.instant('login.invalidCredentials');
          
          this.messageService.add({
            severity: 'error',
            summary: errorSummary,
            detail: errorDetail,
            life: 5000
          });
        }
      });
    } else {
      // Get translated validation error message
      const errorSummary = this.translate.instant('login.loginFailed');
      const errorDetail = this.translate.instant('login.enterValidCredentials');
      
      this.messageService.add({
        severity: 'error',
        summary: errorSummary,
        detail: errorDetail,
        life: 3000
      });
    }
  }
}
