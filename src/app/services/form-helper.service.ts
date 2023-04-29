import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormHelperService {
  constructor() {}

  processServerFormError(err: any, form: FormGroup, defaultMessage: string): string {
    var errorMessage = '';
    console.log(err);
    if (err.error.errors) {
      const validationErrors = err.error.errors;
      Object.keys(validationErrors).forEach((prop) => {
        console.log(prop + ' >> ' + validationErrors[prop]);
        const formControl = form.get(prop);
        if (formControl) {
          formControl.setErrors({
            serverError: validationErrors[prop],
          });
        } else {
          errorMessage = validationErrors[prop];
        }
      });
    }
    if (form.valid && errorMessage == '') {
      errorMessage = defaultMessage;
    }
    return errorMessage;
  }
}
