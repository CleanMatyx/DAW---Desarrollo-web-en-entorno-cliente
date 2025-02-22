import { Component } from '@angular/core';
import { RestaurantsPageComponent } from './restaurants/restaurants-page/restaurants-page.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-foodscore';
}
