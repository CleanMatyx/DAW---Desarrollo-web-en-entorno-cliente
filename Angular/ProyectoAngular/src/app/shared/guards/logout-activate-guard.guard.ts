import { CanActivateFn } from '@angular/router';

export const logoutActivateGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
