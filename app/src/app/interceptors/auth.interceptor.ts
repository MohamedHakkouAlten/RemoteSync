import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders // Import HttpHeaders
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, EMPTY } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../services/auth-facade.service'; // Assuming this is your service
// Assuming LoginResponseDTO and ResponseWrapperDto are defined somewhere
// import { LoginResponseDTO, ResponseWrapperDto } from 'path-to-your-dtos';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthFacadeService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Do not add Auth header for the refreshToken request itself
    // or if the request already has an Authorization header (e.g. from a retry)
    if (token && !request.url.includes('/refreshToken') && !request.headers.has('Authorization')) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the error is from the refreshToken endpoint itself, or not a 401, or already refreshing, just rethrow.
        if (request.url.includes('/refreshToken') || error.status !== 401 ) {
          // If it's the refresh token call itself that failed with 401,
          // logout and rethrow. The service calling refreshToken should handle this.
          if (request.url.includes('/refreshToken') && error.status === 401) {
            console.log('Interceptor: Refresh token call itself failed with 401. Logging out.');
            this.performLogout(); // Abstract logout logic
            return throwError(() => error); // Crucial: rethrow for the service to catch
          }
          return throwError(() => error); // For non-401 errors, or if already refreshing.
        }

        // Now we know it's a 401 on a regular API call (not /refreshToken)
        // and it's not because the JWT is invalid (e.g. malformed, which is a different 401)
        // Let's assume your backend signals an expired JWT specifically, e.g., in error.error.message
        // For simplicity, I'll assume any 401 on a non-refresh endpoint might be an expired token
        // You might need more specific checks based on your backend error response.
        // console.log('Interceptor: Caught 401, error body:', error.error);
        if (error.error && (error.error.error === 'JWT expired' || error.error.message === 'JWT expired')) { // Adjust to your backend's specific message
             console.log('Interceptor: JWT expired, attempting refresh.');
            return this.handle401Error(request, next);
        } else {
            // Other 401 errors (e.g., bad credentials initially, or invalid token structure)
            console.log('Interceptor: Non-JWT-expired 401. Logging out.');
            this.performLogout();
            return throwError(() => error); // Rethrow for the specific component/service to handle if needed
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Signal that refresh is in progress

      const currentRefreshToken = this.authService.getRefreshToken();
      if (!currentRefreshToken) {
        this.isRefreshing = false;
        console.log('Interceptor: No refresh token available. Logging out.');
        this.performLogout();
        return throwError(() => new HttpErrorResponse({ status: 401, error: 'No refresh token available' }));
      }

      // Call your service's refreshToken method.
      // It should return Observable<ResponseWrapperDto<LoginResponseDTO>>
      return this.authService.refreshToken().pipe( // refreshToken() from your service
        switchMap((response) => { // Type this 'response' correctly based on what your service returns
          this.isRefreshing = false;
          // Assuming response structure from your service: response.data.accessToken
          // Adjust if your service's refreshToken() already unwraps to LoginResponseDTO
          const newAccessToken = (response as any)?.data?.accessToken; // Make sure this path is correct
          if (!newAccessToken) {
            console.error('Interceptor: Refresh token response did not contain new access token.');
            this.performLogout();
            return throwError(() => new HttpErrorResponse({ status: 401, error: 'Refresh failed to return new token'}));
          }
          this.refreshTokenSubject.next(newAccessToken);
          console.log('Interceptor: Token refreshed. Retrying original request.');
          return next.handle(this.addTokenToRequest(request, newAccessToken));
        }),
        catchError((refreshError: any) => {
          this.isRefreshing = false;
          console.error('Interceptor: Error during token refresh process. Logging out.', refreshError);
          this.performLogout();
          // This error will be caught by the subscriber of the original request,
          // AND the subscriber of the authService.refreshToken() if it's called directly.
          return throwError(() => refreshError);
        })
      );
    } else {
      // If already refreshing, wait for the new token and then retry the request.
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(jwt => {
          console.log('Interceptor: Refresh was in progress, got new token. Retrying.');
          return next.handle(this.addTokenToRequest(request, jwt!));
        })
      );
    }
  }

  private addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private performLogout(): void {
    // Encapsulate logout logic.
    // Ensure this doesn't cause new HTTP calls that could loop if logout itself needs auth.
    // Typically, clear local storage/state and navigate.
    this.authService.clearUserData(); // Assuming this method exists and is synchronous or we don't wait for it.
    // Or if logout is async and you need to wait:
    // this.authService.logout().pipe(take(1)).subscribe(...);
    this.router.navigate(['/remotesync/login']); // Or your login route
  }
}