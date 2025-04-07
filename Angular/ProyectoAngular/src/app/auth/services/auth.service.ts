import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ExternalLogin, UserLogin, UserRegister } from '../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #userUrl = 'auth';
  #logged = signal(false);

  get logged() {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#userUrl}/login`, data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#logged.set(false);
  }

  isLogged(): Observable<boolean> {
    if (this.logged()) {
      return of(true);
    } else {
      if (!localStorage.getItem('token')) {
        return of(false);
      } else {
        return this.#http.get<void>(`${this.#userUrl}/validate`).pipe(
          map(() => {
            this.#logged.set(true);
            return true;
          }),
          catchError(() => {
            return of(false);
          })
        );
      }
    }
  }

  register(data: UserRegister): Observable<void> {
    return this.#http.post<void>(`${this.#userUrl}/register`, data);
  }

  googleLogin(data: ExternalLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#userUrl}/google`, data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      })
    );
  }

  facebookLogin(data: ExternalLogin): Observable<void> {
    return this.#http
      .post<TokenResponse>(`${this.#userUrl}/facebook`, data)
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.accessToken);
          this.#logged.set(true);
        })
      );
  }
}
