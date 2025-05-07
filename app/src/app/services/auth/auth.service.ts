import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LoginRequestDto, LoginResponseDTO } from '../../dto/auth/login.dto';

import { ForgotPasswordRequestDto } from '../../dto/auth/forgotpassword.dto';
import { UserService } from './user.service';
import { ResponseWrapperDto } from '../../dto/response-wrapper.dto';
import { ResetPasswordRequestDto } from '../../dto/auth/resetpassword.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  /**
   * Login user using credentials
   */
  login(credentials: LoginRequestDto): Observable<ResponseWrapperDto<LoginResponseDTO>> {
    return this.http.post<ResponseWrapperDto<LoginResponseDTO>>(`${this.API_URL}/login`, credentials)
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.data) {
            return response as ResponseWrapperDto<LoginResponseDTO>;
          }
          console.error('Invalid login response format:', response);
          throw new Error('Login failed: Invalid response format from server.');
        }),
        tap((loginData: ResponseWrapperDto<LoginResponseDTO>) => {
          // Store user data and update state in one call
          this.userService.storeUserData(
            loginData.data!.accessToken,
            loginData.data!.refreshToken,
            loginData.data!.firstName,
            loginData.data!.lastName,
            loginData.data!.roles
          );
        }),
        catchError(error => {
          console.error('Login failed:', error);
          // Extract backend error message if available
          const message = error.error?.message || error.message || 'Login failed. Please check credentials and try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  /**
   * Logout the current user
   */
  logout(): Observable<void> {
    const refreshToken = this.userService.getRefreshToken();
    
    // Clear user data regardless of API call result
    this.userService.clearUserData();
    
    // Call backend logout endpoint if we have a refresh token
    if (refreshToken) {
      return this.http.post<void>(`${this.API_URL}/logout`, { refreshToken })
        .pipe(
          catchError(error => {
            console.warn('Backend logout failed:', error);
            return of(undefined);
          })
        );
    } else {
      return of(undefined);
    }
  }

  /**
   * Request a password reset email
   */
  forgotPassword(data: ForgotPasswordRequestDto): Observable<ResponseWrapperDto<any>> {
    return this.http.post<ResponseWrapperDto<any>>(`${this.API_URL}/forgot-password`, data)
      .pipe(
        catchError(error => {
          console.error('Forgot password request failed:', error);
          const message = error.error?.message || error.message || 'Failed to send password reset email. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  /**
   * Reset password with token
   */
  resetPassword(data: ResetPasswordRequestDto): Observable<ResponseWrapperDto<any>> {
    return this.http.post<ResponseWrapperDto<any>>(`${this.API_URL}/reset-password`, data).pipe(
      catchError(error => {
        console.error('Password reset failed:', error);
        const message = error.error?.message || error.message || 'Failed to reset password. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }
}