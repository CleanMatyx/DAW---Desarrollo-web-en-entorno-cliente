import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { GoogleLoginDirective } from '../../shared/google-login/google-login.directive';
import { FbLoginDirective } from '../../shared/fb-login/fb-login.directive';

@Component({
  selector: 'login',
  imports: [FormsModule, GoogleLoginDirective, FbLoginDirective, FaIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  #router = inject(Router);

  login() {
    this.#router.navigate(['/restaurants']);
  }

  fbIcon = faFacebook;

  loggedFacebook(resp: fb.StatusResponse) {
    // Envía esto a tu API
    console.log(resp.authResponse.accessToken);
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    // Envia esto tu API
    console.log(resp.credential);
  }

  showError(error: string) {
    console.error(error);
  }
}
