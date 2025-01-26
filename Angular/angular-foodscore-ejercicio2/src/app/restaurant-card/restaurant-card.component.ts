import { Component, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-card',
  imports: [],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  restaurant = input.required<Restaurant>();
  deleted = output<void>();
  showImage = input(true);

  restaurants: Restaurant[] = [];

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  weekDay: number = new Date().getDay();

  deleteRestaurant() {
    this.deleted.emit();
  }

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }
}
