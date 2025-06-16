import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseWrapperDto } from '../../dto/response-wrapper.dto';
import { SupportedLanguage } from '../language/language.service';

// User info interface
export interface UserInfo {
  firstName: string;
  lastName: string;
  userId:string;
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

  // Private token keys in localStorage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly FIRST_NAME_KEY = 'first_name';
  private readonly LAST_NAME_KEY = 'last_name';
  private readonly USER_ID="userId";
  private readonly ROLES_KEY = 'roles';

  // Supported languages for URL detection
  private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'fr', 'es'];

  // Subject for basic user info (name, roles)
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  // Subject for authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadInitialState();
  }

  /**
   * Loads initial state from storage
   */
  private loadInitialState(): void {
    if (this.hasValidAuthData()) {
      const firstName = this.getFirstNameFromStorage() || '';
      const lastName = this.getLastNameFromStorage() || '';
      const roles = this.getRolesFromStorage();
      const userId=this.getUserIdFromStorage() || '';

      this.userInfoSubject.next({ firstName, lastName,userId, roles });
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
  storeUserData(accessToken: string, refreshToken: string, firstName: string, lastName: string,userId:string, roles: string[]): void {
    // Process roles - remove 'ROLE_' prefix if present
    const processedRoles = roles.map(r => r.startsWith('ROLE_') ? r.slice(5) : r);

    // Store in localStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.FIRST_NAME_KEY, firstName);
    localStorage.setItem(this.LAST_NAME_KEY, lastName);
    localStorage.setItem(this.USER_ID,userId)
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(processedRoles));

    // Update state with processed roles
    this.userInfoSubject.next({ firstName, lastName,userId, roles: processedRoles });
    this.isAuthenticatedSubject.next(true);

    // Log roles for debugging
    console.log('Stored roles:', processedRoles);
  }

  /**
   * Clears all user data and state
   */
  clearUserData(): void {
    // Clear localStorage
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
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
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
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

   private getUserIdFromStorage(): string | null {
    return localStorage.getItem(this.USER_ID);
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
    return this.getLastNameFromStorage();
  }

  /**
   * Updates the user's first and last name in localStorage and userInfoSubject
   * Used when profile is updated
   */
  updateUserName(firstName: string, lastName: string): void {
    // Update localStorage
    localStorage.setItem(this.FIRST_NAME_KEY, firstName);
    localStorage.setItem(this.LAST_NAME_KEY, lastName);

    // Update userInfoSubject with current roles
    const currentUserInfo = this.userInfoSubject.getValue();
       const userId=this.getUserIdFromStorage() || '';
    if (currentUserInfo) {
      this.userInfoSubject.next({
        firstName,
        lastName,
        userId,
        roles: currentUserInfo.roles
      });
    }
  }

  /**
   * Gets the current user's full name synchronously
   */
  getFullName(): string | null {
    return (this.userInfoSubject.value?.firstName ?? '') + ' ' + (this.userInfoSubject.value?.lastName ?? '');
  }

   getUserId(): string | null {
    return (this.userInfoSubject.value?.userId ?? '') ;
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
   * Get the current language from URL or default to English
   */
  getCurrentLanguage(): SupportedLanguage {
    try {
      // Get from URL if available
      const path = window.location.pathname;
      const segments = path.split('/');

      // Look for language code in URL segments
      for (const segment of segments) {
        if (segment && this.SUPPORTED_LANGUAGES.includes(segment as SupportedLanguage)) {
          return segment as SupportedLanguage;
        }
      }

      // Try to get from localStorage if set previously
      const storedLang = localStorage.getItem('remotesync_language');
      if (storedLang && this.SUPPORTED_LANGUAGES.includes(storedLang as SupportedLanguage)) {
        return storedLang as SupportedLanguage;
      }
    } catch (error) {
      console.error('Error determining language:', error);
    }

    // Default to English if not found or on error
    return 'en';
  }

  /**
   * Get the default redirect URL based on user role
   */
  getDefaultRedirectUrl(): string {
    const roles = this.getUserRoles();
    const currentLang = this.getCurrentLanguage();

    // Debug logging
    console.log('Current roles for redirection:', roles);
    console.log('Current language:', currentLang);
    console.log('Has RC role?', roles.includes('RC'));
    console.log('Has ASSOCIATE role?', roles.includes('ASSOCIATE'));

    // Check for roles in a case-insensitive way
    const hasAdmin = roles.some(r => r.toUpperCase() === 'ADMIN');
    const hasRC = roles.some(r => r.toUpperCase() === 'RC');
    const hasAssociate = roles.some(r => r.toUpperCase() === 'ASSOCIATE');

    console.log('Case-insensitive checks - RC:', hasRC, 'Associate:', hasAssociate);

    // Ensure we have a valid language prefix
    const langPrefix = currentLang ? `/${currentLang}` : '/en';

    if (hasAdmin) {
      console.log('Redirecting to Admin dashboard');
      return `${langPrefix}/remotesync/admin/dashboard`;
    } else if (hasRC) {
      console.log('Redirecting to RC dashboard');
      return `${langPrefix}/remotesync/rc/dashboard`;
    } else if (hasAssociate) {
      console.log('Redirecting to Associate dashboard');
      return `${langPrefix}/remotesync/associate/dashboard`;
    } else {
      console.log('No matching role found, redirecting to Login');
      return `${langPrefix}/remotesync/login`;
    }
  }

  /**
   * Handle redirection after successful login
   */
  redirectAfterLogin(returnUrl?: string): void {
    // Debug logging
    console.log('redirectAfterLogin called with returnUrl:', returnUrl);

    const currentLang = this.getCurrentLanguage();
    const langPrefix = currentLang ? `/${currentLang}` : '/en';

    // Only use returnUrl if it's explicitly provided and not a default dashboard URL
    const isDefaultDashboard = returnUrl && (
      returnUrl.includes(`${langPrefix}/remotesync/associate/dashboard`) ||
      returnUrl.includes(`${langPrefix}/remotesync/rc/dashboard`) ||
      returnUrl.includes(`${langPrefix}/remotesync/admin/dashboard`)
    );

    if (returnUrl && returnUrl !== '/' && !isDefaultDashboard) {
      console.log('Using provided returnUrl for redirection:', returnUrl);
      try {
        this.router.navigateByUrl(returnUrl);
      } catch (error) {
        console.error('Navigation error with returnUrl:', error);
        // Fallback to role-based URL on error
        const roleBasedUrl = this.getDefaultRedirectUrl();
        this.router.navigateByUrl(roleBasedUrl);
      }
    } else {
      // Get role-based URL
      const roleBasedUrl = this.getDefaultRedirectUrl();
      console.log('Using role-based URL for redirection:', roleBasedUrl);
      this.router.navigateByUrl(roleBasedUrl);
    }
  }
}
