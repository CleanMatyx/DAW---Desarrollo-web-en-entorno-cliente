import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantCardComponent, RestaurantFormComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  restaurants = signal<Restaurant[]>([
    {
      name: 'La Cueva del Oso',
      description: 'Restaurante de comida tradicional',
      cuisine: 'Mexicana',
      image: '',
      daysOpen: [0, 2, 3, 4, 5].map(String),
      phone: '987654321',
    },
    {
      name: 'La Casa del Pescador',
      description: 'Restaurante de mariscos',
      cuisine: 'Mariscos',
      image: '',
      daysOpen: [1, 3, 4, 5, 6].map(String),
      phone: '978654123',
    },
    {
      name: 'El Asador',
      description: 'Restaurante de carnes',
      cuisine: 'Carnes',
      image: '',
      daysOpen: [0, 1, 2, 3, 4, 5, 6].map(String),
      phone: '987654321',
    }
  ]);

  showImage = signal(true);
  showOpen = signal(false);
  search = signal('');

  restaurantsFiltered = computed(() => this.restaurants().filter((r) =>
    ( r.name.toLowerCase().includes(this.search().toLowerCase()) ||
    r.description.toLowerCase().includes(this.search().toLowerCase())) &&
    (this.showOpen() ? r.daysOpen.includes(new Date().getDay().toString()) : true)
  ));

  addRestaurant(restaurant: Restaurant) {
    this.restaurants.update((restaurants) => restaurants.concat(restaurant));
  }

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurants.update((restaurants) => restaurants.filter(r => r !== restaurant));
  }

}