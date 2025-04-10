import { Component, Input, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faImage, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { ProfilesService } from '../services/profiles.service';
import {
  User,
  UserPasswordEdit,
  UserPhotoEdit,
  UserProfileEdit,
} from '../interfaces/user';
import { ImageModalComponent } from '../../shared/modals/image-modal/image-modal.component';
import { RouterLink } from '@angular/router';
import { sameValue } from '../../shared/validators/same-value.validator';
import { Coordinates } from '../../restaurants/interfaces/coordinates';
import { MapService } from '../../shared/services/map.service';
import { OlMapDirective } from '../../shared/ol-maps/ol-maps.directive.spec';
import { SearchResult } from '../../shared/ol-maps/search-result';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/ol-maps/ga-autocomplete.directive';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    NgClass,
    NgbModule,
    RouterLink,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  @Input() user!: User;
  #faIconLibrary = inject(FaIconLibrary);
  #modalService = inject(NgbModal);
  #profilesServices = inject(ProfilesService);
  #fb = inject(NonNullableFormBuilder);

  constructor(private cdr: ChangeDetectorRef) {}

  editProfile = signal(false);
  editPassword = signal(false);
  imageBase64 = '';
  coordinates = signal<[number, number]>([0, 0]);

  profileForm = this.#fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  emailControl = this.#fb.control('', {validators: [Validators.required, Validators.email]});
  passwordControl = this.#fb.control('', {validators: [Validators.required, Validators.minLength(4)]});

  passwordForm = this.#fb.group({
    passwordGroup: this.#fb.group(
      {
        password: this.passwordControl,
        passwordConfirm: ['', sameValue(this.passwordControl)],
      }
    ),
  });

  userResource = rxResource({
    request: () => null,
    loader: () => this.#profilesServices.getMyProfile().pipe(
      tap((user) => {
        this.user = user;
        this.coordinates.set([user.lng, user.lat]);
        this.setProfileValues();
      })
    ),
  });

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    console.log(result.address); // Habría que guardarlo
  }

  ngOnInit(): void {
    this.#faIconLibrary.addIcons(faImage, faPenToSquare, faLock);
    this.userResource.reload(); // Cargar los datos del perfil al inicializar el componente
  }

  setProfileValues() {
    this.profileForm.controls.name.setValue(this.user.name);
    this.profileForm.controls.email.setValue(this.user.email);
  }

  async showEditProfile() {
    if (!this.editProfile()) {
      this.editProfile.set(!this.editProfile());
    } else if (this.profileForm.pristine || (await this.askUser())) {
      this.editProfile.set(!this.editProfile());
      this.profileForm.reset();
      this.setProfileValues();
    }
  }

  async showEditPassword() {
    if (!this.editPassword()) {
      this.editPassword.set(!this.editPassword());
    } else if (this.passwordForm.pristine || (await this.askUser())) {
      this.editPassword.set(!this.editPassword());
      this.passwordForm.reset();
    }
  }

  async askUser() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = 'error';
    modalRef.componentInstance.icon = ['fas', 'circle-xmark'];
    modalRef.componentInstance.title = '¿Estás seguro de cancelar?';
    modalRef.componentInstance.body = 'Los cambios no se guardarán';
    return await modalRef.result.catch(() => false);
  }

  successModal(title: string) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.type = 'success';
    modalRef.componentInstance.icon = ['far', 'circle-check'];
    modalRef.componentInstance.color = 'text-success';
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = 'Se han guardado los cambios';
  }

  updateProfile() {
    const profile: UserProfileEdit = {
      ...this.profileForm.getRawValue(),
    };

    this.#profilesServices.updateProfile(profile).subscribe({
      next: () => {
        this.editProfile.set(!this.editProfile());
        this.#profilesServices.getMyProfile().subscribe((u) => (this.user = u));
        this.successModal('Informacion de perfil cambiada');
      },
      error: () => console.log('Error editando perfil'),
    });
  }

  updatePassword() {
    const password: UserPasswordEdit = {
      password: this.passwordForm.value.passwordGroup!.password!,
    };

    this.#profilesServices.updatePassword(password).subscribe({
      next: () => {
        this.editPassword.set(!this.editPassword());
        this.passwordForm.reset();
        this.successModal('Contraseña cambiada');
      },
      error: () => console.log('Error editando contraseña'),
    });
  }

  async updatePhoto() {
    const modalRef = this.#modalService.open(ImageModalComponent);
    modalRef.componentInstance.title = '¿Deseas elegir este avatar?';
    modalRef.componentInstance.image = this.imageBase64;
    if (await modalRef.result.catch(() => false)) {
      const photo: UserPhotoEdit = {
        avatar: this.imageBase64,
      };

      this.#profilesServices.updatePhoto(photo).subscribe({
        next: () => {
          this.#profilesServices.getMyProfile().subscribe((u) => {
            this.user = u;
            this.cdr.detectChanges(); // Forzar la detección de cambios
          });
          this.successModal('Avatar cambiado');
        },
        error: () => {
          const modalRef = this.#modalService.open(ConfirmModalComponent);
          modalRef.componentInstance.title = 'Error cambiando el avatar';
          modalRef.componentInstance.body =
            'El avatar seleccionado ocupa demasiado tamaño';
        },
      });
    }
  }

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imageBase64 = '';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
      this.updatePhoto();
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

  showMap(user: User) {
    const coordinates = [user.lat, user.lng];
    const [latitude, longitude] = coordinates;
    const coords: Coordinates = {latitude, longitude};
    const map = new MapService(coords, 'map');
    map.createMarker(coords);
  }
}
