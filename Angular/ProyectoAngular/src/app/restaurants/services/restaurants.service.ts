import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  RestaurantsResponse,
  SingleRestaurantResponse,
} from '../interfaces/responses';
import { Comment } from '../interfaces/comment';
import { map } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  #http = inject(HttpClient);

  getAll(params?: { [key: string]: string }) {
    return this.#http
      .get<RestaurantsResponse>('restaurants', { params })
      .pipe(map((resp) => resp.restaurants));
  }

  getById(id: number) {
    return this.#http
      .get<SingleRestaurantResponse>(`restaurants/${id}`)
      .pipe(map((resp) => resp.restaurant));
  }

  getByUserId(userId: number) {
    return this.#http
      .get<RestaurantsResponse>(`restaurants?creator=${userId}`)
      .pipe(map((resp) => resp.restaurants));
  }

  insert(restaurant: Restaurant) {
    return this.#http
      .post<SingleRestaurantResponse>('restaurants', restaurant)
      .pipe(map((resp) => resp.restaurant));
  }

  modify(restaurant: Restaurant) {
    return this.#http
      .put<SingleRestaurantResponse>(`restaurants/${restaurant.id}`, restaurant)
      .pipe(map((resp) => resp.restaurant));
  }

  addComment(comment: Comment, restaurant: Restaurant) {
    return this.#http
      .post<SingleRestaurantResponse>(`restaurants/${restaurant.id}/comments`, comment)
      .pipe(map((resp) => resp.restaurant));
  }

  delete(id: number) {
    return this.#http.delete<void>(`restaurants/${id}`);
  }
}
