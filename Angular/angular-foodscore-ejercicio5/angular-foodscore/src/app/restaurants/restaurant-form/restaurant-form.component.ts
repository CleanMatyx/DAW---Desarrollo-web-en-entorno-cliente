import { Component, DestroyRef, inject, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OneCheckedDirective } from '../../shared/directives/one-checked.directive';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, OneCheckedDirective],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate{
  newRestaurant: Restaurant = {
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    image: '',
    daysOpen: [],
  };

  form = viewChild.required<NgForm>('addRestaurantForm')

  constructor() {}
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  add = output<Restaurant>();
  daysOpen: boolean[] = [];
  filename = '';
  saved = false;

  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.#restaurantsService
      .insert(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((r) => {
        this.add.emit(r);
        this.saved = true;
        this.#router.navigate(['restaurants', r.id]);
      });
  }

  canDeactivate() {
    return this.saved || 
    this.form().pristine || 
    confirm("Are you sure you want to leave the page? Changes will be lost...")
  }
}
