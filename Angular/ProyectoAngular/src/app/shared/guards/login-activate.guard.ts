import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { map } from 'rxjs';

export const loginActivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  authService.isLogged().pipe(map(response => console.log(response)));
  return authService.isLogged().pipe(map(response => response ? true : router.createUrlTree(['/login'])))
};


