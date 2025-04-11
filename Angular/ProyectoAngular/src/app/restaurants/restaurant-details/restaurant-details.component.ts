import { Component, inject, Input, input, numberAttribute, signal } from '@angular/core';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { RestaurantsService } from '../services/restaurants.service';
import { tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OlMapDirective } from '../../shared/ol-maps/ol-maps.directive.spec';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { CommonModule, DatePipe } from '@angular/common';
import { Comment } from '../interfaces/comment';
import { User } from '../interfaces/user';
import { ProfilesService } from '../../profile/services/profiles.service';

@Component({
  selector: 'restaurant-details',
  imports: [
    ReactiveFormsModule,
    RestaurantCardComponent,
    RouterLink,
    OlMapDirective,
    OlMarkerDirective,
    StarRatingComponent,
    DatePipe,
    ReactiveFormsModule,
    CommonModule
],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css',
})
export class RestaurantDetailsComponent {
  #fb = inject(NonNullableFormBuilder);
  #restService = inject(RestaurantsService);
  #profilesServices = inject(ProfilesService);
  #router = inject(Router);
  #title = inject(Title);
  commented = false;
  comments = signal<Comment[]>([]);

  commentForm = this.#fb.group({
    comment: ['', Validators.required],
    stars: [0, Validators.required],
  });

  @Input() creator: User = {
    name: '',
    email: '',
    avatar: '',
    lat: 0,
    lng: 0,
  }

  coordinates = signal<[number, number]>([-0.5, 38.5]);
  rating = 0;

  comment : Comment = {
    stars: 0,
    text: '',};

  id = input.required({ transform: numberAttribute });

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restService
        .getById(id)
        .pipe(tap((r) => {
          this.#title.setTitle(`${r.name} | FoodScore`);
          this.coordinates.set([r.lng, r.lat]);
          this.creator = r.creator!;
          this.commented = r.commented!;
        })),
  });

  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restService
        .getComments(id)
        .pipe(tap((comments) => {
          comments.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
          this.comments.set(comments);
        })),
  });

  changeRating(rating: number) {
    console.log(this.commentsResource.value()!);
    this.rating = rating;
  }

  addComment() {
    const restaurant = this.restaurantResource.value()!;
    this.comment.text = this.commentForm.value.comment!;
    this.comment.stars = this.rating;
    this.#restService.addComment(this.comment, restaurant).subscribe(() => {
      this.commentForm.reset();
      this.rating = 0;
      this.commentsResource.reload();
      this.restaurantResource.reload();
    });
  }

  goBack() {
    this.#router.navigate(['/restaurants']);
  }

  validClasses(
    formControl: FormControl | FormGroup,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}