import { Attribute, Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[mustMatchValidator]',
  providers:[
    {
      provide: NG_VALIDATORS,
      useClass: MustMatchValidatorDirective,
      multi: true
    }
  ]
})
export class MustMatchValidatorDirective implements Validator {

  constructor(@Attribute('mustMatchValidator') public matchControl: string) { }

  validate(c: FormControl) {
    const matchControl = c.root.get(this.matchControl);

    if (c.errors && !c.hasError('mustMatch')) {
      return null;
    }

    if (matchControl) {
      const subscription: Subscription = matchControl.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return matchControl && matchControl.value !== c.value ? { mustMatch: true } : null;
  }

}
