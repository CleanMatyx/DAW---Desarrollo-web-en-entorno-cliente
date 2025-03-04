import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: 'auth/login',
        loadComponent: () =>
          import('./login/login.component').then(
            (m) => m.LoginComponent
          ),    title: 'Login | Angular Foodscore',
      }
]
