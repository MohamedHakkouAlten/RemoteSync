import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs'; // Import 'of'
import { map, switchMap, take } from 'rxjs/operators'; // Import 'switchMap'

import { AuthFacadeService } from '../services/auth-facade.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthFacadeService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isAuthenticated$.pipe(
      take(1), // Check authentication status once
      switchMap(isAuthenticated => { // Use switchMap to handle the async result
        // --- 1. Authentication Check ---
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          console.log('RoleGuard: Not authenticated, redirecting to login.');
          return of(this.router.createUrlTree(['/RemoteSync/Login'], { // Wrap UrlTree in 'of' to return Observable<UrlTree>
            queryParams: { returnUrl: state.url }
          }));
        }

        // --- 2. Role Check (Only if Authenticated) ---
        console.log('RoleGuard: Authenticated, checking roles.');
        const requiredRoles = route.data['roles'] as Array<string>;

        // If no specific roles are required for this route, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
          console.log('RoleGuard: No specific roles required, allowing access.');
          return of(true); // Allow access
        }

        // Get user roles (assuming this is available synchronously *after* authentication)
        // If getUserRoles() is also async, you'd need another switchMap/Observable chain here.
        const userRoles = this.authService.getUserRoles();

        // Handle case where user is authenticated but has no roles (shouldn't usually happen)
        if (!userRoles || userRoles.length === 0) {
            console.warn('RoleGuard: User authenticated but has no roles.');
            // Decide where to redirect: maybe a default dashboard or an error page
            // Redirecting to a default/error page might be safer than falling through
            // return of(this.router.createUrlTree(['/default-dashboard-or-error']));
             return of(this.determineRedirectUrl([])); // Or handle as unauthorized based on your logic
        }


        console.log('RoleGuard: Required roles:', requiredRoles);
        console.log('RoleGuard: User roles:', userRoles);

        // Check if the user has at least one of the required roles
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (hasRequiredRole) {
          console.log('RoleGuard: User has required role, allowing access.');
          return of(true); // User has the role, allow access
        }

        // --- 3. Role Mismatch - Redirect to Appropriate Dashboard ---
        console.log('RoleGuard: User does not have required role, redirecting based on user roles.');
        // User is authenticated but doesn't have the necessary role for *this* route.
        // Redirect them to their own dashboard based on their *actual* roles.
        return of(this.determineRedirectUrl(userRoles)); // Redirect
      })
    );
  }

  /**
   * Determines the redirect URL based on the user's roles.
   * @param userRoles - Array of roles the user possesses.
   * @returns UrlTree for redirection.
   */
  private determineRedirectUrl(userRoles: string[]): UrlTree {
     // Use the first role found as the primary role for redirection decision
     // Prioritize roles if needed (e.g., check for ADMIN first, then MANAGER, etc.)
    const primaryRole = userRoles.find(role => ['ADMIN', 'RC', 'ASSOCIATE'].includes(role)) || userRoles[0]; // Find a known role or take the first

    const roleDashboardMap: { [key: string]: string } = {
      'ADMIN': '/remotesync/admin/dashboard',
      'RC': '/remotesync/rc/dashboard',
      'ASSOCIATE': '/remotesync/associate/dashboard',
      // Add more role-dashboard mappings as needed
    };

    // Get the dashboard URL for the user's primary role, or default if no match/no roles
    // Consider a fallback if userRoles is empty or primaryRole is undefined
    const dashboardUrl = roleDashboardMap[primaryRole] || '/remoteSync/login'; // Default fallback
    console.log(`RoleGuard: Redirecting user without required role to: ${dashboardUrl}`);

    return this.router.createUrlTree([dashboardUrl]);
  }
}