import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class CustomValidators {
  static match(controlName: string, matchControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const matchControl = controls.get(matchControlName);

      if (!control || !matchControl) {
        return null;
      }
      //console.log(matchControl.errors);

      if (matchControl.errors && !matchControl.errors['match']) {
        return null
      }

      if (control.value !== matchControl.value) {
        matchControl.setErrors({ match: true });
        return { match: true };
      }

      matchControl.setErrors(null);
      return null;
    }
  }
}