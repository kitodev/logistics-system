import { Injectable } from '@angular/core';
import { FormModel } from '../shared/FormModel';
import moment from 'moment';
import { DayOfWeek } from '../shared/day-of-week';
import { AddressService } from '../shared/form/address/address.service';
import { DateTimePickerComponent } from '../shared/form/date-time-picker/date-time-picker.component';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PremiseFormsService {
  public createOpeningDayFormGroup(
    dayInterval: OpeningIntervalDto
  ): FormModel<OpeningIntervalDto> {
    return {
      openFrom: [
        dayInterval?.openFrom
          ? moment(dayInterval.openFrom, ['h:m a', 'HH:mm']).format().toString()
          : null,
      ],
      openTo: [
        dayInterval?.openTo
          ? moment(dayInterval.openTo, ['h:m a', 'HH:mm']).format().toString()
          : null,
      ],
    } as FormModel<OpeningIntervalDto>;
  }

  public createEmptyPremise(companyId?: string): PremiseDto {
    const openingDays = this.getDefaultOpeningDays();
    return {
      companyId: companyId,
      name: '',
      premiseType: null,
      address: AddressService.createEmptyAddress(),
      openingDays: openingDays,
    };
  }

  public getDefaultOpeningDays(): { [key: string]: OpeningIntervalDto } {
    const openingDays = {};
    Object.keys(DayOfWeek).forEach((day) => {
      openingDays[DayOfWeek[day]] = {
        openFrom:
          day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY ? '08:00' : null,
        openTo:
          day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY ? '17:00' : null,
      };
    });
    return openingDays;
  }

  public sanitizeOpeningDays(form: FormGroup): void {
    Object.keys(DayOfWeek).forEach((day) => {
      const openingDay = form.value.openingDays[day] as OpeningIntervalDto;
      if (
        !openingDay ||
        !openingDay.openFrom ||
        !openingDay.openTo ||
        openingDay.openTo == DateTimePickerComponent.INVALID_DATE ||
        openingDay.openFrom == DateTimePickerComponent.INVALID_DATE
      ) {
        (<FormGroup>form.get('openingDays')).removeControl(day);
      }
    });
  }
}
