import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ExternalLogin, UserLogin, UserRegister } from '../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../interfaces/responses';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);
  #userUrl = 'auth';
  #logged = signal(false);

  get logged() {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`auth/login`, data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      })
    );
  }

  logout(): void {
    this.#logged.set(false);
    localStorage.removeItem('token');
    
    this.#router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  // isLogged(): Observable<boolean> {
  //   if (this.logged()) {
  //     return of(true);
  //   } else {
  //     if (!localStorage.getItem('token')) {
  //       return of(false);
  //     } else {
  //       return this.#http.get<void>(`auth/validate`).pipe(
  //         map(() => {
  //           this.#logged.set(true);
  //           return true;
  //         }),
  //         catchError(() => {
  //           localStorage.removeItem('token'); // Eliminar token no válido
  //           this.#logged.set(false);
  //           return of(false);
  //         })
  //       );
  //     }
  //   }
  // }

  isLogged(): Observable<boolean> {
    if(!this.logged() && !localStorage.getItem('token')) {
      console.log('No token found');
      this.#logged.set(false);
      this.#router.navigate(['/login']);
      return of(false);
    } else if (this.logged()) {
      console.log('User is already logged in');
      return of(true);
    } else if (localStorage.getItem('token') && !this.logged()) {
      console.log('Token found, validating...');
      return this.#http.get<void>(`auth/validate`).pipe(
        map(() => {
          this.#logged.set(true);
          console.log('Token is valid');
          return true;
        }),
        catchError(() => {
          console.log('Token is invalid');
          localStorage.removeItem('token'); // Eliminar token no válido
          this.#router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
          this.#logged.set(false);
          return of(false);
        })
      );
    }
    return of(false);
  }

  register(data: UserRegister): Observable<void> {
    return this.#http.post<void>(`auth/register`, data);
  }

  googleLogin(data: ExternalLogin & { lat: number; lng: number }): Observable<void> {
    return this.#http.post<TokenResponse>(`auth/google`, data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
      })
    );
  }

  facebookLogin(data: ExternalLogin & { lat: number; lng: number }): Observable<void> {
    return this.#http
      .post<TokenResponse>(`auth/facebook`, data)
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.accessToken);
          this.#logged.set(true);
        })
      );
  }
}
