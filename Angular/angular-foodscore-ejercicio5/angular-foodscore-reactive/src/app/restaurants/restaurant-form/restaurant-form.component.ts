import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { oneCheckedValidator } from '../../shared/validators/one-checked.validators';

@Component({
  selector: 'restaurant-form',
  imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate{
  newRestaurant: Restaurant = {
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    image: '',
    daysOpen: [],
  };

  constructor() {}
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #formBuilder = inject(NonNullableFormBuilder)

  restForm = this.#formBuilder.group({
    name: ['', 
      [
        Validators.required, 
        Validators.pattern('^[a-zA-Z][a-zA-Z ][a-zA-Z]*$'),
        Validators.minLength(3)
      ]
    ],
    description: ['',
      [Validators.required,
        Validators.minLength(10)
      ]
    ],
    cuisine: ['',
      [Validators.required,
        Validators.minLength(3)
      ]
    ],
    daysOpen: this.#formBuilder.array(
      new Array(7).fill(0).map(() => this.#formBuilder.control(true)),
      {validators: [oneCheckedValidator]}
    ),
    phone: ['',
      [
        Validators.required,
        Validators.pattern('([+0]?[0-9]{2} ?)?[0-9]{9}')
      ]
    ],
    image: ['',
      [Validators.required]
    ]
  })

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  add = output<Restaurant>();
  daysOpen: boolean[] = [];
  filename = '';
  saved = false;

  addRestaurant() {
    this.daysOpen = (
      this.restForm.get('daysOpen') as FormArray)
      .controls.map(controls => controls.value)

    this.newRestaurant = {
      ...this.restForm.getRawValue(),
      daysOpen : this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]) ,
      image : this.filename,
    }

    this.#restaurantsService
      .insert(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((r) => {
        this.saved = true;
        this.#router.navigate(['/restaurants', r.id]);
      });
  }

  canDeactivate() {
    return this.saved 
    || this.restForm.pristine
    || confirm('Are you sure you want to leave the page? Changes will be lost...');
  }
}
