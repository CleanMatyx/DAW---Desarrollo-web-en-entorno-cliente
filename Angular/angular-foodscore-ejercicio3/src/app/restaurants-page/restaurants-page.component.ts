import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantFormComponent, RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantsService = inject(RestaurantsService);

  restaurantResource = rxResource({
    loader: () => this.#restaurantsService.getRestaurants(),
  })
  
  weekDay: number = new Date().getDay();

  search = signal('');
  onlyOpen = signal(false);

  filteredRestaurants = computed(() => {
    const searchLower = this.search().toLowerCase();
    const filtered = this.restaurantResource.value()?.filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
    );

    return this.onlyOpen()
      ? filtered!.filter((r) => r.daysOpen.includes(this.weekDay.toString()))
      : filtered;
  });

  addRestaurant(restaurant: Restaurant) {
    this.restaurantResource.update((restaurants) => 
      restaurants?.concat(restaurant)
    );
  }

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurantResource.update((restaurants) =>
      restaurants?.filter((r) => r !== restaurant)
    );
  }
}
