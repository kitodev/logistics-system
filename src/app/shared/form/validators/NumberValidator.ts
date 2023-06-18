import { FormControl, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
  return (control: FormControl) => {
    if (typeof +control.value === 'number' && !isNaN(+control.value)) {
      return null;
    }

    return { format: 'invalid' };
  };
}
