import { Component, linkedSignal, model } from '@angular/core';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
  imports: [FaIconComponent]
})
export class StarRatingComponent {
  rating = model.required<number>();
  auxRating = linkedSignal(() => this.rating());

  starEmpty = faStarEmpty;
  starFull = faStarFull;

  public getStars(): string {
    return this.generateStars(this.rating());
  }

  public generateStars(rating: number): string {
    const fullStar = '<i class="bi bi-star-fill"></i>';
    const emptyStar = '<i class="bi bi-star"></i>';
    const maxStars = 5;
    let stars = '';

    for (let i = 0; i < maxStars; i++) {
        stars += i < rating ? fullStar : emptyStar;
    }

    return `${stars} ${rating.toFixed(2)}`;
}

}
