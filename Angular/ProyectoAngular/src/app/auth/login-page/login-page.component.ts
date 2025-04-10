import { NgClass } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GeolocateService } from '../../shared/services/geolocate.service';
import { AuthService } from '../services/auth.service';
import { ExternalLogin, UserLogin } from '../interfaces/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../shared/modals/info-modal/info-modal.component';
import { LoadGoogleApiService } from '../../shared/google-login/load-google-api.service';
import { GoogleLoginDirective } from '../../shared/google-login/google-login.directive';
import { Subscription } from 'rxjs';
import { FbLoginDirective } from '../../shared/fb-login/fb-login.directive';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TokenResponse } from '../interfaces/responses';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    GoogleLoginDirective,
    FbLoginDirective,
    FontAwesomeModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  #authService = inject(AuthService);
  #router = inject(Router);
  #geolocation = inject(GeolocateService);
  #modalService = inject(NgbModal);
  #loadGoogle = inject(LoadGoogleApiService);
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);

  credentialsSub!: Subscription;
  fbIcon = faFacebook;
  userLogin!: UserLogin;
  fbLogin!: TokenResponse;
  googleLogin!: TokenResponse;

  coordinates : [number,number] = [0,0]

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    lat: '0',
    lng: '0',
  });

  constructor() {
    this.getGeolocation();
  }

  async getGeolocation(): Promise<void> {
    try {
      const geolocation = await this.#geolocation.getLocation();
      this.loginForm.controls.lat.setValue(geolocation.latitude + '');
      this.loginForm.controls.lng.setValue(geolocation.longitude + '');
    } catch (e) {
      const modalRef = this.#modalService.open(ConfirmModalComponent);
      modalRef.componentInstance.type = 'error';
      modalRef.componentInstance.title = 'Geolocalización denegada';
      modalRef.componentInstance.body = 'Se van a usar valores por defecto';
    }
  }

  ngOnInit(): void {
    this.credentialsSub = this.#loadGoogle.credential$.subscribe((resp) => {
      const login: ExternalLogin = {
        token: resp.credential,
        lat: +this.loginForm.value.lat!,
        lng: +this.loginForm.value.lng!,
      };

      this.#authService.googleLogin(login).subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: () => console.error('Error logueando'),
      });
    });
  }

  ngOnDestroy(): void {
    this.credentialsSub.unsubscribe();
  }

  loggedFacebook(resp: fb.StatusResponse) {
    // Envía esto a tu API
    const login: ExternalLogin = {
      token: resp.authResponse.accessToken!,
      lat: +this.loginForm.value.lat!,
      lng: +this.loginForm.value.lng!,
    };

    this.#authService.facebookLogin(login).subscribe({
      next: () => {
        this.#router.navigate(['/restaurants']);
      },
      error: () => console.error('Error logueando'),
    });
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    // Envia esto tu API
    const login: ExternalLogin = {
      token: resp.credential,
      lat: +this.loginForm.value.lat!,
      lng: +this.loginForm.value.lng!,
    };

    this.#authService.googleLogin(login)
    .pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.#router.navigate(['/restaurants']);
      },
      error: () => console.error('Error logueando'),
    });
  }

  showError(error: any) {
    console.error(error);
  }

  login() {
    const login: UserLogin = {
      ...this.loginForm.getRawValue(),
      lat: +this.loginForm.value.lat!,
      lng: +this.loginForm.value.lng!,
    };

    this.#authService.login(login).subscribe({
      next: () => {
        this.#router.navigate(['/restaurants']);
      },
      error: () => {
        const modalRef = this.#modalService.open(ConfirmModalComponent);
        // modalRef.componentInstance.type = 'error';
        modalRef.componentInstance.title = 'Login incorrecto';
        modalRef.componentInstance.body =
          'El email o la contraseña son incorrectos';
      },
    });
  }

  validClasses(
    formControl: FormControl,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}
