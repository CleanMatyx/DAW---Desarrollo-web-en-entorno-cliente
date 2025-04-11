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
  }
}
