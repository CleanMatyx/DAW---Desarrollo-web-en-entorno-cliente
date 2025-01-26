import { Component } from '@angular/core';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

@Component({
  selector: 'app-root',
  imports: [RestaurantsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-foodscore';
}
