import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { map, Observable } from 'rxjs';
import { SingleUserResponse } from '../interfaces/responses';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  
  addUser(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>('/auth/register', user)
      .pipe(map((response) => response.user));
  }

  // tryLoginGoogle(token: String): Observable<User> {
  //   return this.#http
  //     .post<SingleUserResponse>('/auth/google', user)
  //     .pipe(map((response) => response.user));
  // }



  login(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>('/auth/login', user)
      .pipe(map((response) => response.user));
  }
  
  checkToken(): Observable<boolean> {
    return this.#http
      .get('/auth/validate', { observe: 'response' })
      .pipe(map(response => response.status === 204));
  }

  
}
