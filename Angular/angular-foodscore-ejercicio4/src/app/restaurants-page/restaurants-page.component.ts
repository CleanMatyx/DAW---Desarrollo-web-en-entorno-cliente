import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantFormComponent, RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantsService = inject(RestaurantsService);

  restaurantsResource = rxResource({
    loader: () => this.#restaurantsService.getAll()
  });
  restaurants = computed(() => this.restaurantsResource.value() ?? []);
  search = signal('');
  onlyOpen = signal(false);
  filteredRestaurants = computed(() => {
    const searchLower = this.search().toLowerCase();
    const filtered = this.restaurants().filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
    );

    return this.onlyOpen()
      ? filtered.filter((r) => r.daysOpen.includes(this.weekDay.toString()))
      : filtered;
  });
  weekDay: number = new Date().getDay();

  addRestaurant(restaurant: Restaurant) {
    this.restaurantsResource.update((restaurants) => restaurants?.concat(restaurant));
  }

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurantsResource.update((restaurants) =>
      restaurants?.filter((r) => r !== restaurant)
    );
  }
}
