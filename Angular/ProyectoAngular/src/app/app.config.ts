import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { provideGoogleId } from './shared/google-login/google-login.config';
import { provideFacebookId } from './shared/fb-login/fb-login.config';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com'),
    provideFacebookId('1100988247798042', 'v21.0'), provideClientHydration(withEventReplay())
  ],
};
