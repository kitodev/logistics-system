import {
  AbstractControlOptions,
  FormGroup,
  ValidatorFn,
  FormArray,
} from '@angular/forms';

export type FormModel<T> = {
  [P in keyof T]:
    | [
        T[P] | { value: T[P]; disabled: boolean },
        (AbstractControlOptions | ValidatorFn | ValidatorFn[])?
      ]
    | FormGroup
    | FormArray;
};
