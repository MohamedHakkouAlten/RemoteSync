import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LoginRequestDto, LoginResponseDTO } from '../../dto/auth/login.dto';

import { ForgotPasswordRequestDto } from '../../dto/auth/forgotpassword.dto';
import { UserService } from './user.service';
import { ResponseWrapperDto } from '../../dto/response-wrapper.dto';
import { ResetPasswordRequestDto } from '../../dto/auth/resetpassword.dto';
import { RecoverPasswordDto } from '../../dto/auth/recoverpassword.dto'

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
            loginData.data!.userId,
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
   * Recover password by sending email to user
   * @param data Object containing user email
   */
  recoverPassword(data: RecoverPasswordDto): Observable<ResponseWrapperDto<any>> {
    return this.http.post<ResponseWrapperDto<any>>(`${this.API_URL}/recover-password`, data)
      .pipe(
        catchError(error => {
          console.error('Password recovery request failed:', error);
          const message = error.error?.message || error.message || 'Failed to send password recovery email. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  /**
   * Reset password with token
   * @param data Object containing new password and confirmation password
   */
  resetPassword(data: ResetPasswordRequestDto): Observable<ResponseWrapperDto<any>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${data.token}`
    });

    // Create the payload matching exactly what the backend expects
    const payload = {
      password: data.password,
      confPassword: data.confPassword
    };

    console.log('Reset password payload:', payload); // Log the payload for debugging

    return this.http.put<ResponseWrapperDto<any>>(`${this.API_URL}/reset-password`, payload, { headers })
      .pipe(
        catchError(error => {
          console.error('Password reset failed:', error);
          const message = error.error?.message || error.message || 'Failed to reset password. Please try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  /**
   * Logout the current user
   */
  refreshToken(): Observable<ResponseWrapperDto<LoginResponseDTO>>{
     const refreshToken = this.userService.getRefreshToken();
    // this.userService.clearUserData()
        const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });
      return this.http.get<ResponseWrapperDto<LoginResponseDTO>>(`${this.API_URL}/refreshToken`,{headers}).pipe(
      map(response => {
        console.log('Response in map:', response);
        if (response && response.status === 'success' && response.data) {
          return response; // No need to cast here, it's already typed by http.get
        }
        console.error('Invalid login response format in map:', response);
        // This error will now be caught by the catchError below
        throw new Error('Login failed: Invalid response format from server.');
      }),
      tap((loginData: ResponseWrapperDto<LoginResponseDTO>) => {
        // Ensure loginData and loginData.data are not null before accessing nested properties
        if (loginData && loginData.data) {
            this.userService.storeUserData(
                loginData.data.accessToken,
                loginData.data.refreshToken,
                loginData.data.firstName,
                loginData.data.lastName,
                loginData.data.userId,
                loginData.data.roles
            );
        } else {
            // This case should ideally be caught by the map operator,
            // but good to have a defensive check here too.
            console.error('Tap operator received invalid loginData:', loginData);
            // Optionally throw an error here too if this state is critical
            // throw new Error('Tap: loginData or loginData.data is null/undefined');
        }
      }),
      catchError((error) => {
        // This will catch errors from http.get(), map(), or tap()
        console.log("Error caught in catchError:", error);

        // Differentiate between HttpErrorResponse and other errors
        if (error instanceof HttpErrorResponse) {
          console.error(`HTTP Error: ${error.status} - ${error.message}`, error.error);
          // Handle specific HTTP errors if needed
        } else {
          console.error('Application Error:', error.message);
        }

        this.userService.clearUserData();
        return throwError(() => error); // Re-throw the error for the subscriber to handle
      })
    );
  }
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



}
