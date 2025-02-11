import { Component, DestroyRef, inject, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Importar la directiva de Base64
import { EncodeBase64Directive } from '../directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive],  // Añadir la directiva al módulo para hacerla accesible en el html
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent {


  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  saved = false;
  
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant: Restaurant = {
    id: 0,
    name: '',
    image: '',
    cuisine: '',
    description: '',
    phone: '',
    daysOpen: [],
  }

  add = output<Restaurant>();
  daysOpen!: boolean[];

  filename = '';

  constructor() {
    this.resetForm();
  }

  onFileEncoded(encodedString: string) {
    // Asigna la cadena codificada a la imagen del restaurante
    this.newRestaurant.image = encodedString;
  }

  addRestaurant() {
    this.newRestaurant.daysOpen = this.days
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.#restaurantsService
      .addRestaurant(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.add.emit(this.newRestaurant);
          this.resetForm();
          this.#router.navigate(['/restaurants']);
        },
        error: () => console.error('Error adding restaurant'),
      });
  }

  resetForm() {
    this.newRestaurant = {
      id: 0,
      name: '',
      description: '',
      cuisine: '',
      image: '',
      daysOpen: [],
      phone: '',
    };
    this.filename = '';
    this.daysOpen = new Array(7).fill(true);
  }
}
