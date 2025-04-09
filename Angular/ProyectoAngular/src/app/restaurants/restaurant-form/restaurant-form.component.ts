import { Component, DestroyRef, inject, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { OneCheckedDirective } from '../../shared/directives/one-checked.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive, OneCheckedDirective, ValidationClassesDirective],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  restForm = viewChild<NgForm>('restForm');

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant!: Restaurant;
  add = output<Restaurant>();
  daysOpen!: boolean[];

  filename = '';
  #saved = false;

  constructor() {
    this.resetForm();
  }

  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.#restaurantsService
      .insert(this.newRestaurant)
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
  }

  canDeactivate() {
    return this.#saved || this.restForm()?.pristine || confirm("¿Seguro que quieres abandonar la página?. Se perderán los cambios...")
  }
}
