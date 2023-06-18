import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModel } from '../../../shared/FormModel';
import { PremiseFormsService } from '../../../clients/premise-forms.service';
import { DayOfWeek } from 'src/app/shared/day-of-week';
import { DayIntervalValidator } from 'src/app/clients/company/premise/DayIntervalValidator';

@Component({
  selector: 'app-timegate',
  templateUrl: './time-gate.component.html',
  styleUrls: ['./time-gate.component.scss'],
})
export class TimeGateComponent {
  get parentForm(): FormGroup {
    return this._parentForm;
  }

  @Input()
  set parentForm(value: FormGroup) {
    this._parentForm = value;
    if (value) {
      this.buildForm();
    }
  }

  private _parentForm: FormGroup;
  @Input()
  timeGate: TimeGateDto;
  @Input()
  controlName: string;
  timeGateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private premiseFormsService: PremiseFormsService
  ) {}

  private buildForm(): void {
    const timeGateModel: FormModel<TimeGateDto> = {
      earliestArrival: [this.timeGate?.earliestArrival, Validators.required],
      latestArrival: [this.timeGate?.latestArrival, Validators.required],
      openingDays: this.fb.group(
        this.createPremiseOpeningDaysFormModel(this.timeGate?.openingDays)
      ),
    };
    this.timeGateForm = this.fb.group(timeGateModel);
    this.parentForm.setControl(this.controlName, this.timeGateForm);
  }

  public createPremiseOpeningDaysFormModel(openingDays: {
    [p: string]: OpeningIntervalDto;
  }): FormModel<DayOfWeek[]> {
    const opening: FormModel<DayOfWeek[]> = [];
    Object.keys(DayOfWeek).forEach((day) => {
      opening[
        DayOfWeek[day]
      ] = this.fb.group(
        this.premiseFormsService.createOpeningDayFormGroup(
          openingDays ? openingDays[DayOfWeek[day]] : undefined
        ),
        { validators: DayIntervalValidator }
      );
    });

    return opening;
  }
}
