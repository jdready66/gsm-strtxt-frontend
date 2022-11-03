import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

const HEADER_AUTHORIZATION = "authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private jwt: JwtPayload = {};

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Some requests do NOT need authentication (public end-points like login/logout)
    if (!request.headers.has(HEADER_AUTHORIZATION)) {
      return next.handle(request);
    }

    return this.handleToken(request, next);
  }

  private handleToken(request: HttpRequest<unknown>, next: HttpHandler) {
    this.jwt = jwtDecode(this.authenticationService.currentUserValue.accessToken);

    const nowInSecs = Date.now() / 1000;
    const exp = this.jwt.exp || 0;

    if (exp > nowInSecs) {
      return next.handle(request);
    }

    return this.authenticationService.refreshToken().pipe(
      switchMap((response: User) => {
        this.authenticationService.setSessionUser(response);

        const cloned = request.clone({
          headers: request.headers.set(HEADER_AUTHORIZATION, 'Bearer ' + response.accessToken)
        });
        
        return next.handle(cloned);
      }),
      catchError(err => {
        this.authenticationService.logout();
        this.router.navigate(['/login']);

        return throwError(() => {
          return err;
        });
      })
    );

  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
