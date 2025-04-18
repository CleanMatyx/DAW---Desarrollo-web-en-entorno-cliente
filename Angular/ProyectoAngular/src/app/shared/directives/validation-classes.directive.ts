import { Directive, inject, input, signal, computed, untracked } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgModel } from "@angular/forms";

@Directive({
  selector: '[validationClasses][ngModel],[validationClasses][formControl],[validationClasses][formControlName])',
  standalone: true,
  host: {
    '[class]': 'inputClass()',
    '(blur)': 'touched.set(true)',
  },
})
export class ValidationClassesDirective {
  #ngModel = inject(NgModel);
  validationClasses = input.required<{ valid: string; invalid: string }>();
  valueChanges = toSignal(this.#ngModel.valueChanges!);
  touched = signal(false);

  inputClass = computed(() => {
    const touched = this.touched(); // dependencia
    const validationClasses = this.validationClasses(); // dependencia
    this.valueChanges(); // dependencia

    return untracked(() => {
      if (touched) {
        return this.#ngModel.invalid
          ? validationClasses.invalid
          : validationClasses.valid;
      }
      return '';
    });
  });
}