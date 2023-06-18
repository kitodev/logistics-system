import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormSelectItem } from './FormSelectItem';

@Component({
  selector: 'form-select',
  templateUrl: './select.component.html',
})
export class SelectComponent {
  get formGroup(): FormGroup {
    return this._formGroup;
  }

  @Input()
  set formGroup(value: FormGroup) {
    if (!value) {
      return;
    }
    this._formGroup = value;
    this.control = value.controls[this.name] as FormControl;
    if (this.disabled) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }

  private _formGroup: FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() optionsArray: Array<FormSelectItem<any>>;
  @Input() required: boolean;
  // @Input() multisArray?: Array<Array<string | Array<string>>>;
  // @Input() optionsObject?;
  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    if (value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }

  private _disabled = false;
  control: FormControl;
}
