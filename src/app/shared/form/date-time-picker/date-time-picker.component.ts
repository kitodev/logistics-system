import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  PickerType,
  SelectMode,
} from '@danielmoncada/angular-datetime-picker/lib/date-time/date-time.class';
import moment from 'moment';

@Component({
  selector: 'form-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit {
  private static readonly TIMER_FORMAT = 'HH:mm';
  private static readonly CALENDAR_FORMAT = 'YYYY-MM-DD';

  public static readonly INVALID_DATE = 'Invalid date';

  get datetime(): string {
    return this._datetime;
  }

  @Input()
  set datetime(value: string) {
    this._datetime = value;
    this.value = value;
    if (!this.parentForm) {
      return;
    }
    switch (this.type) {
      case 'timer':
        if (
          moment(this.value, DateTimePickerComponent.TIMER_FORMAT).isValid()
        ) {
          this.value = moment(
            this.value,
            DateTimePickerComponent.TIMER_FORMAT
          ).toISOString();
          this.parentForm.controls[this.name].setValue(value);
        } else {
          this.parentForm.controls[this.name].setValue(undefined);
        }
        break;
      case 'calendar':
        if (
          moment(this.value, DateTimePickerComponent.CALENDAR_FORMAT).isValid()
        ) {
          this.value = moment(
            this.value,
            DateTimePickerComponent.CALENDAR_FORMAT
          ).toISOString();
          this.parentForm.controls[this.name].setValue(value);
        } else {
          this.parentForm.controls[this.name].setValue(undefined);
        }
        break;
      case 'both':
        if (moment(this.value).isValid()) {
          this.parentForm.controls[this.name].setValue(
            DateTimePickerComponent.formatDate(this.value, this.type)
          );
        } else {
          this.parentForm.controls[this.name].setValue(undefined);
        }
        break;
    }
  }

  private _datetime: string;
  @Input() parentForm: FormGroup;
  @Input() name: string;
  @Input() type: PickerType;
  @Input() mode: SelectMode;
  @Input() label?: string;
  @Input() helper?: string;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() disabled = false;
  @Input() required?: boolean;
  startAt: Date;
  value: string;

  ngOnInit(): void {
    const start = moment().toDate();

    if (this.type == 'both' && !this._datetime) {
      this.name == 'earliestArrival' ?? start.setHours(8);
      this.name == 'latestArrival' ?? start.setHours(17);
    }

    start.setMinutes(0);
    start.setSeconds(0);
    this.startAt = start;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  onChange(event: any): void {
    this.parentForm.controls[this.name].setValue(
      DateTimePickerComponent.formatDate(event.value, this.type)
    );
    this.parentForm.markAsDirty();
  }

  private static formatDate(dateValue: string, type: PickerType): string {
    switch (type) {
      case 'both':
        return moment(dateValue).toISOString();
      case 'calendar':
        return moment(dateValue).format(this.CALENDAR_FORMAT);
      case 'timer':
        return moment(dateValue).format(this.TIMER_FORMAT);
    }
  }
}
