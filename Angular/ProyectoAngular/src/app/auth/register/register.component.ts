import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ProfileService } from '../../restaurants/services/profile.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SameValueDirective } from '../../shared/directives/same-value.directive';

@Component({
  selector: 'register',
  imports: [
    FormsModule,
    ReactiveFormsModule, 
    EncodeBase64Directive,  
    ValidationClassesDirective,
    SameValueDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = signal('');

  newUser = {
    name: '',
    email: '',
    password: '',
    lat: '',
    lng: '',
    photo: '',
  };
  
  saved = false;

  #profileService = inject(ProfileService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  registerForm = viewChild.required<FormGroup>('addForm')

  addUser() {
    this.#profileService
      .addUser(this.newUser)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.#router.navigate(['/login']);
        },
        error: () => console.log('Error'),
      });
  }

  canDeactivate() {
    return (
      this.saved ||
      this.registerForm().pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}
