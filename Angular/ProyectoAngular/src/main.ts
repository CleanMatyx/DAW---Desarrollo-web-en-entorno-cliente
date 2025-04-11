/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function validateTokenOnStartup() {
  localStorage.removeItem('token'); // Elimina el token al iniciar la aplicación
}
// Elimino el token al iniciar ya que me falla la aplicación si quiero volver a lanzarla
// y tengo el token válido en el localStorage
//validateTokenOnStartup();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
