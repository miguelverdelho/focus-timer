import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Inject AuthService in functional API
  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest).pipe(
      tap({
        next: (event) => {
          // Handle successful events if necessary
        },
        error: (err) => {
          // Handle errors if necessary
        },
      })
    );
  }

  return next(req); // If no token, pass the request as-is
};
