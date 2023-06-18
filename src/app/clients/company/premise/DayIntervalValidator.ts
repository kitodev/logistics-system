import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import moment from 'moment';
import { DateTimePickerComponent } from 'src/app/shared/form/date-time-picker/date-time-picker.component';

export const DayIntervalValidator: ValidatorFn = (
  openingDayFormGroup: FormGroup
) => {
  const openFromControl = openingDayFormGroup.get('openFrom');
  const openToControl = openingDayFormGroup.get('openTo');

  return (
    requiredChecks(openFromControl, openToControl) ??
    timeChecks(openFromControl, openToControl)
  );
};

function requiredChecks(
  openFromControl: AbstractControl,
  openToControl: AbstractControl
): ValidationErrors | null {

  if (openFromControl.value === DateTimePickerComponent.INVALID_DATE && openToControl.value === DateTimePickerComponent.INVALID_DATE) {
    return null;
  }
  if (!openFromControl.value && !openToControl.value) {
    return null;
  }
  if (!openFromControl.value && openToControl.value) {
    return { required: 'openFrom' };
  }
  if (openFromControl.value && !openToControl.value) {
    return { required: 'openTo' };
  }

  if (!openFromControl.value && openToControl.value) {
    return { required: 'openFrom' };
  }
  if (openFromControl.value && !openToControl.value) {
    return { required: 'openTo' };
  }
}

function timeChecks(
  openFromControl: AbstractControl,
  openToControl: AbstractControl
): ValidationErrors | null {
  if (!openFromControl.value && !openToControl.value) {
    return null;
  }
  if (openFromControl.value === DateTimePickerComponent.INVALID_DATE && openToControl.value === DateTimePickerComponent.INVALID_DATE) {
    return null;
  }

  const openFromDate = moment(openFromControl.value, 'HH:mm');
  const openToDate = moment(openToControl.value, 'HH:mm');

  if (!openFromControl.valid) {
    const error = { invalid: 'openFrom' };
    openFromControl.setErrors(error);
    return error;
  }

  if (!openToControl.valid) {
    const error = { invalid: 'openTo' };
    openToControl.setErrors(error);
    return error;
  }

  if (!openFromDate.isBefore(openToDate)) {
    return { interval: 'invalidInterval' };
  }

  return null;
}
