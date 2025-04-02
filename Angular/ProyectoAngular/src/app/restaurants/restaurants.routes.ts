import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";

export const restRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./restaurants-page/restaurants-page.component').then(m => m.RestaurantsPageComponent),
    title: 'Restaurantes | FoodScore',

  },
  {
    path: 'add',
    loadComponent: () => import('./restaurant-form/restaurant-form.component').then(m => m.RestaurantFormComponent),
    title: 'Nuevo Restaurante | FoodScore',
    canDeactivate: [leavePageGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./restaurant-details/restaurant-details.component').then(m => m.RestaurantDetailsComponent),
    canActivate: [numericIdGuard]
  },
];
