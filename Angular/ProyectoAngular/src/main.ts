/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function validateTokenOnStartup() {
  localStorage.removeItem('token'); // Elimina el token al iniciar la aplicación
}

//validateTokenOnStartup();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
