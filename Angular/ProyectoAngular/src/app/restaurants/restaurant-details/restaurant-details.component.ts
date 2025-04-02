import { Component, inject, input, numberAttribute } from '@angular/core';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { RestaurantsService } from '../services/restaurants.service';
import { tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'restaurant-details',
  imports: [RestaurantCardComponent, RouterLink],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css',
})
export class RestaurantDetailsComponent {
  #restService = inject(RestaurantsService);
  #router = inject(Router);
  #title = inject(Title);

  id = input.required({ transform: numberAttribute });

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restService
        .getById(id)
        .pipe(tap((r) => this.#title.setTitle(`${r.description} | FoodScore`))),
  });

  goBack() {
    this.#router.navigate(['/restaurants']);
  }
}
