import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseWrapperDto } from '../../dto/response-wrapper.dto';

// User info interface
export interface UserInfo {
  firstName: string;
  lastName: string;
  roles: string[];
}
export interface UserListItem{
  userId:string,
  name:string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Storage keys
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly FIRST_NAME_KEY = 'first_name';
  private readonly LAST_NAME_KEY = 'last_name';
  private readonly ROLES_KEY = 'roles';

  // Subject for basic user info (name, roles)
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  // Subject for authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http:HttpClient,
    private router: Router) {
    this.loadInitialState();
  }

  /**
   * Loads initial state from storage
   */
  private loadInitialState(): void {
    console.log("validdddd"+ this.hasValidAuthData())
    if (this.hasValidAuthData()) {
      const firstName = this.getFirstNameFromStorage() || '';
      const lastName = this.getLastNameFromStorage() || '';
      const roles = this.getRolesFromStorage();
      
      this.userInfoSubject.next({ firstName, lastName, roles });
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearUserData();
    }
  }
  readonly apiUrl=environment.apiUrl


  getUsersList(name=''):Observable<UserListItem[]>{

    const url=this.apiUrl+'/user/rc/users/byName'
    const params=new HttpParams().set('name',name)
    return this.http.get<ResponseWrapperDto<UserListItem[]>>(url,{params}).pipe(
      map(response=>response.data as UserListItem[] )
    )
  }
  /**
   * Stores user authentication data
   */
  storeUserData(accessToken: string, refreshToken: string, firstName: string, lastName: string, roles: string[]): void {
    // Process roles - remove 'ROLE_' prefix if present
    const processedRoles = roles.map(r => r.startsWith('ROLE_') ? r.slice(5) : r);
    
    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.FIRST_NAME_KEY, firstName);
    localStorage.setItem(this.LAST_NAME_KEY, lastName);
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(processedRoles));
    
    // Update state with processed roles
    this.userInfoSubject.next({ firstName, lastName, roles: processedRoles });
    this.isAuthenticatedSubject.next(true);
    
    // Log roles for debugging
    console.log('Stored roles:', processedRoles);
  }

  /**
   * Clears all user data and state
   */
  clearUserData(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.FIRST_NAME_KEY);
    localStorage.removeItem(this.LAST_NAME_KEY);
    localStorage.removeItem(this.ROLES_KEY);
    
    // Clear state
    this.userInfoSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Gets the access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isTokenExpired(token:string){
  
console.log(this.getExpirationDateFromToken(token))
return true;
  }
 getExpirationDateFromToken(token:string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);

    return payload ? payload.exp : null;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
  /**
   * Gets the refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Gets the first name from storage
   */
  private getFirstNameFromStorage(): string | null {
    return localStorage.getItem(this.FIRST_NAME_KEY);
  }

  /**
   * Gets the last name from storage
   */
  private getLastNameFromStorage(): string | null {
    return localStorage.getItem(this.LAST_NAME_KEY);
  }

  /**
   * Gets the roles from storage
   */
  private getRolesFromStorage(): string[] {
    const rolesJson = localStorage.getItem(this.ROLES_KEY);
    if (!rolesJson) {
      return [];
    }

    try {
      const roles = JSON.parse(rolesJson) as string[];
      return Array.isArray(roles) ? roles : [];
    } catch (error) {
      console.error("Failed to parse stored roles:", error);
      return [];
    }
  }

  /**
   * Checks if all required auth data exists
   */
  private hasValidAuthData(): boolean {
    const token = this.getToken();
    const firstName = this.getFirstNameFromStorage();
    const lastName = this.getLastNameFromStorage();
    const roles = this.getRolesFromStorage();
    
    return !!(token && firstName && lastName && roles.length > 0);
  }

  /**
   * Synchronously checks if the user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Gets the current user's info synchronously
   */
  getUserInfo(): UserInfo | null {
    return this.userInfoSubject.value;
  }

  /**
   * Gets the current user's first name synchronously
   */
  getFirstName(): string | null {
    return this.userInfoSubject.value?.firstName ?? null;
  }

  /**
   * Gets the current user's last name synchronously
   */
  getLastName(): string | null {
    return this.userInfoSubject.value?.lastName ?? null;
  }

  /**
   * Gets the current user's full name synchronously
   */
  getFullName(): string | null {
    return (this.userInfoSubject.value?.firstName ?? '') + ' ' + (this.userInfoSubject.value?.lastName ?? '');
  }

  /**
   * Gets the current user's roles synchronously
   */
  getUserRoles(): string[] {
    return this.userInfoSubject.value?.roles ?? [];
  }

  /**
   * Checks if the current user has a specific role
   */
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Get the default redirect URL based on user role
   */
  getDefaultRedirectUrl(): string {
    const roles = this.getUserRoles();
    
    // Debug logging
    console.log('Current roles for redirection:', roles);
    console.log('Has RC role?', roles.includes('RC'));
    console.log('Has ASSOCIATE role?', roles.includes('ASSOCIATE'));
    
    // Check for roles in a case-insensitive way
    const hasAdmin = roles.some(r => r.toUpperCase() === 'ADMIN');
    const hasRC = roles.some(r => r.toUpperCase() === 'RC');
    const hasAssociate = roles.some(r => r.toUpperCase() === 'ASSOCIATE');
    
    console.log('Case-insensitive checks - RC:', hasRC, 'Associate:', hasAssociate);
    
    if (hasAdmin) {
      console.log('Redirecting to Admin dashboard');
      return '/remotesync/admin/dashboard';
    } else if (hasRC) {
      console.log('Redirecting to RC dashboard');
      return '/remotesync/rc/dashboard';
    } else if (hasAssociate) {
      console.log('Redirecting to Associate dashboard');
      return '/remotesync/associate/dashboard';
    } else {
      console.log('No matching role found, redirecting to Login');
      return '/remoteSync/login';
    }
  }

  /**
   * Handle redirection after successful login
   */
  redirectAfterLogin(returnUrl?: string): void {
    // Debug logging
    console.log('redirectAfterLogin called with returnUrl:', returnUrl);
    
    // Only use returnUrl if it's explicitly provided and not a default dashboard URL
    const isDefaultDashboard = returnUrl && (
      returnUrl.includes('/associate/dashboard') ||
      returnUrl.includes('/rc/dashboard') ||
      returnUrl.includes('/admin/dashboard')
    );
    
    if (returnUrl && returnUrl !== '/' && !isDefaultDashboard) {
      console.log('Using provided returnUrl for redirection:', returnUrl);
      this.router.navigateByUrl(returnUrl);
    } else {
      // Get role-based URL
      const roleBasedUrl = this.getDefaultRedirectUrl();
      console.log('Using role-based URL for redirection:', roleBasedUrl);
      this.router.navigateByUrl(roleBasedUrl);
    }
  }
}