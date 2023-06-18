import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../../transloco-root.module';
import { AddressComponent } from './address/address.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';


@NgModule({
  declarations: [
    AddressComponent,
    CheckboxComponent,
    DateTimePickerComponent,
    InputComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    TranslocoRootModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
    OwlDateTimeModule,
  ],
  exports: [
    AddressComponent,
    CheckboxComponent,
    DateTimePickerComponent,
    InputComponent,
    SelectComponent,
  ]
})
export class FormComponentModule {}
