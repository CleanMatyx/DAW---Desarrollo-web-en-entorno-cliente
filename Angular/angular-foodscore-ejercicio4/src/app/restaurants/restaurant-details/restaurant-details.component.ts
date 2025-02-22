import { Component, DestroyRef, effect, inject, input, numberAttribute, output } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'restaurant-details',
  imports: [RouterLink],
  templateUrl: '../restaurant-card/restaurant-card.component.html',
  styleUrl: '../restaurant-card/restaurant-card.component.css',
})
export class RestaurantDetailsComponent {
  #restaurantsService = inject(RestaurantsService);
  #title = inject(Title);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router)

  restaurant = input.required<Restaurant>();
  deleted = output<void>();

  constructor() {
    effect(() => this.#title.setTitle(this.restaurant().name + ' | Angular Foodscore'));
  }

  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

  deleteRestaurant() {
    this.#restaurantsService
      .delete(this.restaurant().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.deleted.emit()
        this.#router.navigate(['restaurants']);
      }
    );
  }

  toRestaurants() {
    this.#router.navigate(['/restaurants']);
  }
}

