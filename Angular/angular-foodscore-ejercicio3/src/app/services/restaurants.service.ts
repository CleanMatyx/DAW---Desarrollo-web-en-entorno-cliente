import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestaurantsResponse } from '../interfaces/restaurants-response';
import { map, Observable } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { SingleRestaurantResponse } from '../interfaces/single-restaurant-response';


@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  #urlRestaurants = 'restaurants'
  #http = inject(HttpClient)

  getRestaurants() : Observable<Restaurant[]> {
    return this.#http
      .get<RestaurantsResponse>(this.#urlRestaurants)
      .pipe(map((response) => response.restaurants));
  }

  getRestaurant(id: number) : Observable<Restaurant> {
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#urlRestaurants}/${id}`)
      .pipe(map((response) => response.restaurant));
  }

  addRestaurant(restaurant: Restaurant) : Observable<Restaurant> {
    return this.#http
      .post<SingleRestaurantResponse>(this.#urlRestaurants, restaurant)
      .pipe(map((response) => response.restaurant));
  }

  deleteRestaurant(id: number) : Observable<void> {
    return this.#http
      .delete<void>(`${this.#urlRestaurants}/${id}`);
  }
}
