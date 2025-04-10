import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-foodscore';
  isLoggedIn: boolean = false;
  #router = inject(Router);
  #authService = inject(AuthService);

  logged = computed(() => this.#authService.logged());

  logout() {
    this.#authService.logout();
    this.isLoggedIn = false; // Asegura que el estado local se actualice correctamente
    this.#router.navigate(['/auth/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
