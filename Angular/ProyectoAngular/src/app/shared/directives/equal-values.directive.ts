import { Directive, input } from "@angular/core";
import { FormGroup, NG_VALIDATORS, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[equalValues]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EqualValuesDirective, multi: true },
  ],
})
export class EqualValuesDirective {
  controls = input<[string, string] | null>(null, {alias: 'equalValues'});

  validate(group: FormGroup): ValidationErrors | null {
    if(!this.controls()) return null;

    const control1 = group.get(this.controls()![0]);
    const control2 = group.get(this.controls()![1]);
    if (control1?.value !== control2?.value) {
      return { equalValues: true };
    }

    return null; // No errors
  }
}