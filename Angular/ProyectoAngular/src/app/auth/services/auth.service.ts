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

  isLogged(): Observable<boolean> {
    if (this.logged()) {
      return of(true);
    } else {
      if (!localStorage.getItem('token')) {
        return of(false);
      } else {
        return this.#http.get<void>(`auth/validate`).pipe(
          map(() => {
            this.#logged.set(true);
            return true;
          }),
          catchError(() => {
            localStorage.removeItem('token'); // Eliminar token no válido
            this.#logged.set(false);
            return of(false);
          })
        );
      }
    }
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

  // Método para navegar al perfil del usuario actual
  navigateToMyProfile(): void {
    this.#router.navigate(['/profile']);
  }

  // Método para obtener el ID del usuario actual y navegar a su perfil
  getCurrentUserIdAndNavigateToProfile(): void {
    this.#http.get<{user: {id: number}}>(`auth/profile`).subscribe({
      next: (response) => {
        const userId = response.user.id;
        this.#router.navigate(['/profile', userId]);
      },
      error: () => {
        // Si hay un error, navegar a la ruta general de perfil
        this.#router.navigate(['/profile']);
      }
    });
  }
}
