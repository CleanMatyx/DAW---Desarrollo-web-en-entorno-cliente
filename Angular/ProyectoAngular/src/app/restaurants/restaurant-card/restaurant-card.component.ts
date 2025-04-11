import { Component, DestroyRef, inject, Input, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { User } from '../interfaces/user';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';

@Component({
  selector: 'restaurant-card',
  imports: [RouterLink, StarRatingComponent],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css',
})
export class RestaurantCardComponent {
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #modalRef = inject(NgbModal);

  getDistance(restaurant: Restaurant) {
    const distance = restaurant.distance
    return distance!.toFixed(2);
  }

  getStars(restaurant: Restaurant) {
    const stars = restaurant.stars;
    return stars!.toFixed(1);
  }

  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  restaurant = input.required<Restaurant>();
  deleted = output<void>();

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

  deleteRestaurant() {
    const modalRef = this.#modalRef.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Eliminar Restaurante';
    modalRef.componentInstance.message = `¿Estás seguro de que deseas eliminar el restaurante ${this.restaurant().name}?`;
    modalRef.componentInstance.body = 'Esta acción no se puede deshacer.';
    modalRef.result.then((result) => {
      if(result) {
        this.#restaurantsService
          .delete(this.restaurant().id!)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => this.deleted.emit());
          modalRef.close();
      } else {
        modalRef.dismiss();
      }
    });
  }
  
  getCreatorName(creator: User) {
    return creator.name;
  }

  changeRating(rating: number) {
    const oldRating = this.restaurant().stars;
    this.restaurant().stars = rating;
  }
}
