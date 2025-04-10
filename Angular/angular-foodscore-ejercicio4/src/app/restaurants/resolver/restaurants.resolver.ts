import { ResolveFn, Router } from '@angular/router';
import { Restaurant } from '../interfaces/restaurant';
import { inject } from '@angular/core';
import { RestaurantsService } from '../services/restaurants.service';
import { catchError, EMPTY } from 'rxjs';

export const restaurantsResolver: ResolveFn<Restaurant> = (route) => {
  const restaurantsService = inject(RestaurantsService);
  const router = inject(Router);
  return restaurantsService.getById(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/restaurants']);
      return EMPTY;
    })
  );
};
