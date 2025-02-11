import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SetColorDirective } from './directives/set-color.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SetColorDirective, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Parte3';
  color = signal('yellow');
}
