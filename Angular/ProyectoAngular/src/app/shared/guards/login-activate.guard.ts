import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs';

export const loginActivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLogged().pipe(
    map((logged) => {
      if (logged) return true;
      else return router.createUrlTree(['/auth/login']);
    })
  );
};
