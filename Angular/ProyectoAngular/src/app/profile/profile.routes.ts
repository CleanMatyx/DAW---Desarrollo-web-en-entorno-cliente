import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    title: 'Mi perfil | FoodScore',
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: ':id',
    title: 'Perfil | FoodScore',
    canActivate: [numericIdGuard],
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
