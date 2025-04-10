import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoogleLoginDirective } from '../google-login/google-login.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { FacebookLogin, UserLogin } from '../interfaces/responses';
import { AuthServiceService } from '../services/auth-service.service';
import { GoogleLogin } from '../interfaces/responses';
import { FbLoginDirective } from '../facebook-login/fb-login.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { MyGeolocation } from '../my-geolocation';
import { ModalService } from '../../shared/modals/services/modal.service';
@Component({
  selector: 'login',
  imports: [FormsModule, GoogleLoginDirective,ValidationClassesDirective,FbLoginDirective, RouterLink, FaIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  #router = inject(Router);
  #authService = inject(AuthServiceService);
  #modalService = inject(ModalService);

  iconFacebook = faFacebook;
  filename = '';
  userLogin! : UserLogin
  googleLogin!: GoogleLogin
  facebookLogin! : FacebookLogin
  coordinades : [number,number] = [0,0]

  loginForm = viewChild<NgForm>('loginForm');

  constructor(){
    this.resetForm();
    MyGeolocation.getLocation().then(r => {
      this.coordinades = [r.latitude, r.longitude];
    }).catch((error) => {
      this.#modalService.showInfoModal("Error al Geolocalizar", error);
    })
  }

  resetForm(){
    this.userLogin = {
      email: '',
      password: '',
      lat: 0,
      lng: 0,
    }
  }

  loggedFacebook(resp: fb.StatusResponse) {
    this.facebookLogin = {
      token: resp.authResponse.accessToken!,
      lat: this.coordinades[0],
      lng: this.coordinades[1]
    }
    
    this.#authService.loginFacebook(this.facebookLogin).subscribe({
      next: () => {
        if(this.#authService.logged()){
          this.#router.navigate(['/restaurants']);
        }
      },
      error: (error) => {
        this.showError(error);
      }
    });
  }

  showError(error : any) {
    this.#modalService.showInfoModal("Error Login", error.error.error);
  }


  loggedGoogle(resp: google.accounts.id.CredentialResponse) {

    this.googleLogin = {
      token: resp.credential,
      lat: this.coordinades[0],
      lng: this.coordinades[1]
    }

    this.#authService.loginGoogle(this.googleLogin).subscribe({
      next: () => {
        if(this.#authService.logged()){
          this.#router.navigate(['/restaurants']);
        }
      },
      error: (error) => {
        this.showError(error);
      }
    });
  }

  login() {      
    this.userLogin.lat = this.coordinades[0]
    this.userLogin.lng = this.coordinades[1]
    console.log(this.userLogin);
    
    this.#authService.login(this.userLogin).subscribe( {
      next: () => {        
        if(this.#authService.logged()){
          this.#router.navigate(['/restaurants']);
        }
      },
      error: (error) => {
        this.showError(error);
      }
    });    
  }
}