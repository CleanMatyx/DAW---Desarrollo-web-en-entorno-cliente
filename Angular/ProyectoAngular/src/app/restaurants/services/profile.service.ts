import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { map, Observable } from 'rxjs';
import { SingleUserResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  #http = inject(HttpClient);

  addUser(user: User): Observable<User> {
    
  }
 

  getUser(id: number): Observable<User> {
    return this.#http
      .get<SingleUserResponse>(`${this.#urlProfile}/${id}`)
      .pipe(map((response) => response.user));
  }

}
