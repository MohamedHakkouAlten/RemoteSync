import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs'; // Added 'of'
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { LoginRequestDto } from '../dto/auth.dto';
import { LoginResponseDTO } from '../dto/login-response.dto';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';

// Simple interface for basic user info state
interface UserInfo {
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  // Keep individual keys for simplicity as requested
  private readonly FIRST_NAME_KEY = 'first_name';
  private readonly LAST_NAME_KEY = 'last_name';
  private readonly ROLES_KEY = 'roles'; // Store roles as JSON string array

  // Subject for basic user info (name, roles)
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  // Subject for authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Load initial state from localStorage on service creation
    this.loadInitialAuthState();
  }

  /**
   * Checks localStorage on startup to initialize auth state.
   */
  private loadInitialAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const firstName = localStorage.getItem(this.FIRST_NAME_KEY);
    const lastName = localStorage.getItem(this.LAST_NAME_KEY);
    const rolesJson = localStorage.getItem(this.ROLES_KEY);

    if (token && firstName && lastName && rolesJson) {
      try {
        const roles = JSON.parse(rolesJson) as string[];
        if (Array.isArray(roles)) {
          this.userInfoSubject.next({ firstName, lastName, roles });
          this.isAuthenticatedSubject.next(true);
        } else {
          // Invalid roles format
          this.clearAuthData();
        }
      } catch (error) {
        console.error("Failed to parse stored roles:", error);
        this.clearAuthData(); // Clear storage if roles JSON is corrupted
      }
    } else {
      // If any essential item is missing, ensure clean state
      this.clearAuthData();
    }
  }

  /**
   * Login user using credentials.
   */
  login(credentials: LoginRequestDto): Observable<LoginResponseDTO> {
    return this.http.post<ResponseWrapperDto<LoginResponseDTO>>(`${this.API_URL}/login`, credentials) // Expect wrapper object
      .pipe(
        map((response  )=> {
          // Adapt this based on your *actual* backend response structure
          if (response && response.status === 'success' && response.data) {
             // Assuming LoginResponseDTO is the type of response.data
            return response.data as LoginResponseDTO;
          }
          console.error('Invalid login response format:', response);
          throw new Error('Login failed: Invalid response format from server.');
        }),
        tap(loginData => {
          // Process the successful login data
          this.storeAuthData(loginData);
        }),
        catchError(error => {
          console.error('Login failed:', error);
          // Clear any potentially partial auth data just in case
          this.clearAuthData();
          // Extract backend error message if available
          const message = error.error?.message || error.message || 'Login failed. Please check credentials and try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  /**
   * Stores authentication data from the login response.
   */
  private storeAuthData(data: LoginResponseDTO): void {
    localStorage.setItem(this.TOKEN_KEY, data.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(this.FIRST_NAME_KEY, data.firstName);
    localStorage.setItem(this.LAST_NAME_KEY, data.lastName);

    // Assuming roles might come with prefix like "ROLE_ADMIN"
    // Adjust slice(5) if your roles don't have this prefix
    const processedRoles = data.roles.map(r => r.startsWith('ROLE_') ? r.slice(5) : r);
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(processedRoles));

    // Update reactive subjects
    this.userInfoSubject.next({
      firstName: data.firstName,
      lastName: data.lastName,
      roles: processedRoles
    });
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Logout the current user. Clears local data and optionally calls backend.
   */
  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken(); // Use getter
    const wasAuthenticated = this.isAuthenticated(); // Check status *before* clearing

    // Clear local data immediately
    this.clearAuthData();

    // Navigate to login page
    // Do this *after* clearing data but *before* potential backend delay
    this.router.navigate(['/RemoteSync/Login']);

    // Optionally call backend logout endpoint
    if (refreshToken && wasAuthenticated) { // Only call if user was actually logged in
      return this.http.post<void>(`${this.API_URL}/logout`, { refreshToken })
        .pipe(
          catchError(error => {
            console.warn('Backend logout failed:', error);
            // Error is logged, but user is already logged out locally. Return success.
            return of(undefined); // Use 'of(undefined)' for Observable<void>
          })
        );
    } else {
      // No refresh token or wasn't authenticated, just return completed observable
      return of(undefined); // Use 'of(undefined)' for Observable<void>
    }
  }

  /**
   * Clear all stored authentication data and reset subjects.
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.FIRST_NAME_KEY);
    localStorage.removeItem(this.LAST_NAME_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    // Reset subjects
    this.userInfoSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // --- Getters ---

  /**
   * Gets the current access token.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Gets the current refresh token.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Synchronously checks if the user is currently authenticated.
   * Use isAuthenticated$ for reactive scenarios.
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Gets the current user's info (firstName, lastName, roles) synchronously.
   * Returns null if not authenticated.
   * Use userInfo$ for reactive scenarios.
   */
  getUserInfo(): UserInfo | null {
    return this.userInfoSubject.value;
  }

  /**
   * Gets the current user's first name synchronously.
   * Returns null if not authenticated.
   */
  getFirstName(): string | null {
    return this.userInfoSubject.value?.firstName ?? null;
    // Or read directly: return localStorage.getItem(this.FIRST_NAME_KEY);
  }

  /**
   * Gets the current user's last name synchronously.
   * Returns null if not authenticated.
   */
  getLastName(): string | null {
     return this.userInfoSubject.value?.lastName ?? null;
  }

  /**
   * Gets the current user's roles synchronously.
   * Returns an empty array if not authenticated or roles are not set.
   */
  getUserRoles(): string[] {
    return this.userInfoSubject.value?.roles ?? [];
  }

  /**
   * Checks if the current user has a specific role.
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}