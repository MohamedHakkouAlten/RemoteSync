import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { LoginRequestDto, LoginResponseDTO } from '../dto/auth/login.dto';
import { ForgotPasswordRequestDto } from '../dto/auth/forgotpassword.dto';

import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
import { ResetPasswordRequestDto } from '../dto/auth/resetpassword.dto';
import { AuthService } from './auth/auth.service';
import { UserInfo, UserService } from './auth/user.service';

/**
 * This facade maintains the original AuthService interface
 * while delegating to the new separated services internally.
 * This helps minimize changes to existing components.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  // Expose observables from UserStateService
  public get userInfo$() { return this.userService.userInfo$; }
  public get isAuthenticated$() { return this.userService.isAuthenticated$; }

  /**
   * Login user using credentials
   */
  login(credentials: LoginRequestDto): Observable<ResponseWrapperDto<LoginResponseDTO>> {
    return this.authService.login(credentials);
  }

  refreshToken():Observable<ResponseWrapperDto<LoginResponseDTO>>{
    return this.authService.refreshToken()
  }

  /**
   * Request a password reset email
   */
  forgotPassword(data: ForgotPasswordRequestDto): Observable<any> {
    return this.authService.forgotPassword(data);
  }
  clearUserData(){
    return this.userService.clearUserData()
  }

   storeUserData(accessToken: string, refreshToken: string, firstName: string, lastName: string, roles: string[]): void {
    return this.userService.storeUserData(accessToken, refreshToken, firstName, lastName, roles)
   }
  /**
   * Reset password with token
   */
  resetPassword(data: ResetPasswordRequestDto): Observable<any> {
    return this.authService.resetPassword(data);
  }

  /**
   * Logout the current user
   */
  logout(): Observable<void> {
    const result = this.authService.logout();
    // Navigate to login page after logout
    this.router.navigate(['/remotesync/login']);
    return result;
  }

  /**
   * Gets the current access token
   */
  getToken(): string | null {
    return this.userService.getToken();
  }

  isTokenExpired(token:string):boolean{
    return this.userService.isTokenExpired(token);
  }
  /**
   * Gets the current refresh token
   */
  getRefreshToken(): string | null {
    return this.userService.getRefreshToken();
  }

  /**
   * Synchronously checks if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  /**
   * Gets the current user's info synchronously
   */
  getUserInfo(): UserInfo | null {
    return this.userService.getUserInfo();
  }

  /**
   * Gets the current user's first name synchronously
   */
  getFirstName(): string | null {
    return this.userService.getFirstName();
  }

  /**
   * Gets the current user's last name synchronously
   */
  getLastName(): string | null {
    return this.userService.getLastName();
  }

  /**
   * Gets the current user's roles synchronously
   */
  getUserRoles(): string[] {
    return this.userService.getUserRoles();
  }

  /**
   * Checks if the current user has a specific role
   */
  hasRole(role: string): boolean {
    return this.userService.hasRole(role);
  }

  /**
   * Handle redirection after successful login
   */
  redirectAfterLogin(returnUrl?: string): void {
    this.userService.redirectAfterLogin(returnUrl);
  }
}
