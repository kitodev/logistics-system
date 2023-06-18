import { FormControl, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { DateTimePickerComponent } from 'src/app/shared/form/date-time-picker/date-time-picker.component';

export function futureValidator(): ValidatorFn {
  return (control: FormControl) => {
    const time = moment(control.value);
    if (!time.isValid()) {
      return { invalidDate: DateTimePickerComponent.INVALID_DATE };
    }
    const now = moment();
    if (time.isAfter(now)) {
      return null;
    }
    return { pastDate: 'past' };
  };
}
