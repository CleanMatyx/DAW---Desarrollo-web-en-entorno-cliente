import { ResolveFn, Router } from '@angular/router';
import { ProfilesService } from '../services/profiles.service';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../interfaces/user';

export const profileResolver: ResolveFn<User> = (route) => {
  const router = inject(Router);
  if (route.paramMap.get('id')) {
    return inject(ProfilesService)
      .getProfile(+route.paramMap.get('id')!)
      .pipe(
        catchError(() => {
          router.navigate(['/profile']);
          return EMPTY;
        })
      );
  }
  return inject(ProfilesService).getMyProfile();
};
