import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    title: 'Login | Sanvipop',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    title: 'Registro | Sanvipop',
    canDeactivate: [leavePageGuard],
    loadComponent: () =>
      import('./register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
];
