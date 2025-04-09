/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GeolocateService } from '../../shared/services/geolocate.service';
import { AuthService } from '../services/auth.service';
import { UserRegister } from '../interfaces/auth';
import { InfoModalComponent } from '../../shared/modals/info-modal/info-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { sameValue } from '../../shared/validators/same-value.validator';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    EncodeBase64Directive,
],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements CanComponentDeactivate {
  #authService = inject(AuthService);
  #router = inject(Router);
  #geolocation = inject(GeolocateService);
  #modalService = inject(NgbModal);
  #fb = inject(NonNullableFormBuilder);

  emailControl = this.#fb.control('', {validators: [Validators.required, Validators.email]});

  registerForm = this.#fb.group({
    name: ['', [Validators.required]],
    emailGroup: this.#fb.group(
      {
        email: this.emailControl,
        emailConfirm: ['', sameValue(this.emailControl)],
      }
    ),
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: ['', [Validators.required]],
    lng: ['', [Validators.required]],
    avatar: ['', [Validators.required]],
  });

  imageBase64 = '';
  saved = false;

  constructor() {
    this.getGeolocation();
  }

  canDeactivate() {
    return this.saved || this.registerForm.pristine || this.askUser();
  }

  async askUser() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = 'question';
    modalRef.componentInstance.title = '¿Estás seguro de abandonar la página?';
    modalRef.componentInstance.body = 'Los cambios no se guardarán';
    return await modalRef.result.catch(() => false);
  }

  async getGeolocation(): Promise<void> {
    try {
      const geolocation = await this.#geolocation.getLocation();
      this.registerForm.controls.lat.setValue(geolocation.latitude + '');
      this.registerForm.controls.lng.setValue(geolocation.longitude + '');
    } catch (e) {
      this.registerForm.controls.lat.setValue('0');
      this.registerForm.controls.lng.setValue('0');

      const modalRef = this.#modalService.open(InfoModalComponent);
      modalRef.componentInstance.type = 'error';
      modalRef.componentInstance.title = 'Geolocalización denegada';
      modalRef.componentInstance.body = 'Se van a usar valores por defecto';
    }

    this.registerForm.controls.lat.markAsTouched();
    this.registerForm.controls.lng.markAsTouched();
  }

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imageBase64 = '';
      return;
    }
  
    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) {
      const modalRef = this.#modalService.open(InfoModalComponent);
      modalRef.componentInstance.type = 'error';
      modalRef.componentInstance.title = 'Archivo inválido';
      modalRef.componentInstance.body = 'Por favor, selecciona un archivo de imagen.';
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
    });
  }

  createAccount() {
    const register: UserRegister = {
      name: this.registerForm.value.name!,
      email: this.registerForm.value.emailGroup!.email!,
      password: this.registerForm.value.password!,
      avatar: this.imageBase64,
      lat: +this.registerForm.value.lat!,
      lng: +this.registerForm.value.lng!,
    };

    this.#authService.register(register).subscribe({
      next: async () => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.type = 'success';
        modalRef.componentInstance.title = 'Cuenta creada';
        modalRef.componentInstance.body = 'Te has registrado correctamente'
        await modalRef.result.catch(() => false);
        this.saved = true;
        this.#router.navigate(['/auth/login']);
      },
      error: (e) => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.type = 'error';
        modalRef.componentInstance.title = 'Registro fallido';
        modalRef.componentInstance.body = e.status == 0
          ? 'El avatar seleccionado ocupa demasiado tamaño'
          : e.error.message.join(', ');
      },
    });
  }

  validClasses(
    formControl: FormControl | FormGroup,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}

