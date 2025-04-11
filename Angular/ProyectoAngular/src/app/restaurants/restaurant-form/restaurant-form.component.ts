import { Component, DestroyRef, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { OneCheckedDirective } from '../../shared/directives/one-checked.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Coordinates } from '../interfaces/coordinates';
import { MapService } from '../../shared/services/map.service';
import { OlMapDirective } from '../../shared/ol-maps/ol-maps.directive.spec';
import { GaAutocompleteDirective } from '../../shared/ol-maps/ga-autocomplete.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { SearchResult } from '../../shared/ol-maps/search-result';
import { User } from '../../profile/interfaces/user'; // Importar la interfaz User
import { ProfilesService } from '../../profile/services/profiles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../shared/modals/info-modal/info-modal.component';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'restaurant-form',
  imports: [
    FormsModule, 
    EncodeBase64Directive, 
    OneCheckedDirective, 
    ValidationClassesDirective,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #userService = inject(ProfilesService);
  #saved = false;
  #modalService = inject(NgbModal);
  addressLocation = false;
  isEditMode = false;
  restaurantId?: number;

  // Rastreador de campos modificados
  touchedFields: { [key: string]: boolean } = {};
  originalRestaurant?: Restaurant;

  coordinates = signal<[number, number]>([0, 0]);
  restForm = viewChild<NgForm>('restForm');
  address = signal<string>('');
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant!: Restaurant;
  restaurant?: Restaurant;
  add = output<Restaurant>();
  daysOpen!: boolean[];
  filename = '';
  nameButton = 'Crear';
  
  constructor() {
    this.#userService.getMyProfile().subscribe((user: User) => {
      this.coordinates.set([user.lng, user.lat]);
    });
    this.resetForm();
    this.initTouchedFields();
    
    // Comprobar si estamos en modo edición buscando el id en la ruta
    const id = this.#route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.restaurantId = +id;
      this.nameButton = 'Modificar';
      
      // Cargar el restaurante a editar
      this.#restaurantsService.getById(this.restaurantId)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((restaurant) => {
          this.restaurant = restaurant;
          this.originalRestaurant = { ...restaurant }; // Guardamos una copia del original
          
          // Rellenar el formulario con los datos del restaurante
          this.newRestaurant.name = this.restaurant.name;
          this.newRestaurant.description = this.restaurant.description;
          this.newRestaurant.cuisine = this.restaurant.cuisine;
          this.newRestaurant.daysOpen = this.restaurant.daysOpen;
          this.newRestaurant.image = this.restaurant.image;
          this.filename = this.restaurant.image;
          this.newRestaurant.phone = this.restaurant.phone;
          this.newRestaurant.address = this.restaurant.address;
          this.address.set(this.restaurant.address);
          this.newRestaurant.lat = this.restaurant.lat;
          this.newRestaurant.lng = this.restaurant.lng;
          this.coordinates.set([this.restaurant.lng, this.restaurant.lat]);
          
          // Configurar días de apertura
          this.daysOpen = new Array(7).fill(false);
          for (const day of this.restaurant.daysOpen) {
            this.daysOpen[+day] = true;
          }
          
          // Marcar la ubicación como configurada si estamos en modo edición
          this.addressLocation = true;
        });
    }
  }

  // Inicializa el objeto de campos tocados
  initTouchedFields() {
    this.touchedFields = {
      name: false,
      description: false,
      cuisine: false,
      daysOpen: false,
      phone: false,
      image: false,
      address: false
    };
  }

  // Marca un campo como tocado cuando el usuario interactúa con él
  markAsTouched(field: string) {
    this.touchedFields[field] = true;
  }

  // Verifica si un campo necesita validación
  needsValidation(field: string): boolean {
    // En modo creación, todos los campos requieren validación
    if (!this.isEditMode) return true;
    // En modo edición, solo los campos tocados necesitan validación
    return this.touchedFields[field];
  }

  addRestaurant() {
    if (this.isEditMode && this.restaurantId) {
      this.updateRestaurant();
      return;
    }

    console.log(this.newRestaurant);
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.newRestaurant.lng = this.coordinates()[0];
    this.newRestaurant.lat = this.coordinates()[1];
    this.newRestaurant.address = this.address();
    this.#restaurantsService
      .insert(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((r) => {
        this.#saved = true;
        this.#router.navigate(['/restaurants', r.id]);
      });
  }

  updateRestaurant() {
    if (!this.restaurantId || !this.originalRestaurant) return;
    
    // Preparar objeto para la actualización con los valores del original
    let updatedRestaurant: any = { ...this.originalRestaurant };
    
    // Solo actualizar los campos que han sido modificados o siempre incluir los obligatorios
    if (this.touchedFields['name']) {
      updatedRestaurant.name = this.newRestaurant.name;
    }
    
    if (this.touchedFields['description']) {
      updatedRestaurant.description = this.newRestaurant.description;
    }
    
    if (this.touchedFields['cuisine']) {
      updatedRestaurant.cuisine = this.newRestaurant.cuisine;
    }
    
    if (this.touchedFields['phone']) {
      updatedRestaurant.phone = this.newRestaurant.phone;
    }
    
    if (this.touchedFields['daysOpen']) {
      updatedRestaurant.daysOpen = this.daysOpen
        .map((d, i) => String(i))
        .filter((i) => this.daysOpen[+i]);
    }
    
    // Determinar qué imagen usar
    if (this.touchedFields['image']) {
      updatedRestaurant.image = this.filename && this.filename.startsWith('data:image') 
        ? this.filename // Nueva imagen seleccionada (base64)
        : this.newRestaurant.image; // Mantener la imagen existente
    }
    
    // Siempre actualizar la ubicación si ha sido modificada
    if (this.touchedFields['address']) {
      updatedRestaurant.address = this.address();
      updatedRestaurant.lat = this.coordinates()[1];
      updatedRestaurant.lng = this.coordinates()[0];
    }
    
    updatedRestaurant.id = this.restaurantId;
    
    console.log('Actualizando con:', updatedRestaurant);
    
    this.#restaurantsService
      .modify(updatedRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((r) => {
        this.#saved = true;
        this.#router.navigate(['/restaurants', r.id]);
      });
  }

  resetForm() {
    this.newRestaurant = {
      name: '',
      description: '',
      cuisine: '',
      image: '',
      daysOpen: [],
      phone: '',
      address: '',
      lat: 0,
      lng: 0,
    };
    this.filename = '';
    this.daysOpen = new Array(7).fill(false);
    this.addressLocation = false;
    this.initTouchedFields();
  }

  canDeactivate() {
    if(this.#saved || this.restForm()?.pristine) {
      return true;
    } else {
      const modalRef = this.#modalService.open(ConfirmModalComponent);
      modalRef.componentInstance.type = 'error';
      modalRef.componentInstance.title = '¿Abandonar página?';
      modalRef.componentInstance.body = '¿Seguro que quieres abandonar la página?. Se perderán los cambios...';
      return modalRef.result.catch(() => false);
    }
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
    this.addressLocation = true;
    this.markAsTouched('address');
    console.log(result.address);
  }

  showMap(restaurant: Restaurant) {
      const coordinates = [restaurant.lat, restaurant.lng];
      const [latitude, longitude] = coordinates;
      const coords: Coordinates = {latitude, longitude};
      const map = new MapService(coords, 'map');
      map.createMarker(coords);
    }
}
