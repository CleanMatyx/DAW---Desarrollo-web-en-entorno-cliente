import { Routes } from '@angular/router';
import { logoutActivateGuard } from './shared/guards/logout-activate-guard.guard';
import { loginActivateGuard } from './shared/guards/login-activate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    canActivate: [logoutActivateGuard]
  },
  {
    path: 'restaurants',
    loadChildren: () => import('./restaurants/restaurants.routes').then(m => m.restRoutes),
    canActivate: [loginActivateGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes').then(m => m.profileRoutes),
    canActivate: [loginActivateGuard],
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
