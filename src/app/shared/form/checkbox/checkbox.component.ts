import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'form-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() helper?: string;
  @Input() required: boolean;

  control: FormControl;

  ngOnInit(): void {
    this.control = this.formGroup.controls[this.name] as FormControl;
  }
}
