import { Component, DestroyRef, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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
  #userService = inject(ProfilesService);
  #saved = false;
  #modalService = inject(NgbModal);
  addressLocation = false;

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
    if(this.restaurant) {
      this.newRestaurant.name = this.restaurant.name;
      this.newRestaurant.description = this.restaurant.description;
      this.newRestaurant.cuisine = this.restaurant.cuisine;
      this.newRestaurant.daysOpen = this.restaurant.daysOpen;
      this.newRestaurant.image = this.restaurant.image;
      this.newRestaurant.phone = this.restaurant.phone;
      this.newRestaurant.address = this.restaurant.address;
      this.newRestaurant.lat = this.restaurant.lat;
      this.newRestaurant.lng = this.restaurant.lng;
      this.nameButton = 'Modificar';
    }
  }

  addRestaurant() {
    console.log(this.newRestaurant);
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.newRestaurant.lat = this.coordinates()[0];
    this.newRestaurant.lng = this.coordinates()[1];
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
    const restaurant: RestaurantInsert = {
      name: this.newRestaurant.name,
      description: this.newRestaurant.description,
      cuisine: this.newRestaurant.cuisine,
      image: this.filename,
      daysOpen: this.newRestaurant.daysOpen,
      phone: this.newRestaurant.phone,
      address: this.address(),
      lat: this.coordinates()[0],
      lng: this.coordinates()[1],
    };

    console.log(restaurant);

    this.#restaurantsService
      .modify(restaurant)
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
    this.daysOpen = new Array(7).fill(true);
    this.addressLocation = false;
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
    console.log(result.address); // Habría que guardarlo
  }

  showMap(restaurant: Restaurant) {
      const coordinates = [restaurant.lat, restaurant.lng];
      const [latitude, longitude] = coordinates;
      const coords: Coordinates = {latitude, longitude};
      const map = new MapService(coords, 'map');
      map.createMarker(coords);
    }
}
