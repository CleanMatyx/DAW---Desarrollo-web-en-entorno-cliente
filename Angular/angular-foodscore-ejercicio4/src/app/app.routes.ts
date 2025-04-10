import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
        title: 'Login | Angular Foodscore',
    },
    {
        path: 'restaurants',
        loadChildren: () => import('./restaurants/restaurants.routes').then((m) => m.restaurantsRoutes),
        title: 'Restaurantes | Angular Foodscore',
    },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' }
  ]
  
