import { Component, output} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent {
  newRestaurant: Restaurant = {
    name: '',
    description: '',
    cuisine: '',
    image: '',
    daysOpen: [],
    phone: '',
  };

  filename = '';

  add = output<Restaurant>();

  addRestaurant(form: NgForm) {
    this.newRestaurant.daysOpen = this.days
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.add.emit({...this.newRestaurant});
    form.resetForm();
    this.newRestaurant.image = '';
    this.filename = '';
  }

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newRestaurant.image = reader.result as string;
    });
  }

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  daysOpen: boolean[] = new Array(7).fill(false);
  weekDay: number = new Date().getDay();
}