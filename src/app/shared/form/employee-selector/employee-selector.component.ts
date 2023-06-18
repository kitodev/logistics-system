import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { employeeSearch } from '../../employeeSearch';

@Component({
  selector: 'form-employee-selector',
  styleUrls: ['./employee-selector.component.scss'],
  templateUrl: './employee-selector.component.html',
})
export class EmployeeSelectorComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() employees: Array<EmployeeDto>;
  @Input() label: string;

  selectedEmployee: EmployeeDto = null;

  control: FormControl;

  private unsubscribe = new Subject<void>();
  employeeSearchFn = employeeSearch;

  ngOnInit(): void {
    this.parentForm?.controls[this.controlName].valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((employeeId: string) => {
        if (!employeeId) {
          this.selectedEmployee = null;
        } else {
          this.selectedEmployee = this.employees.find(
            (employee) => employee.id === employeeId
          );
        }
      });

    if (this.parentForm?.controls[this.controlName].value) {
      this.selectedEmployee = this.employees.find(
        (employee) =>
          employee.id === this.parentForm.controls[this.controlName].value
      );+
    }
  }

  selectEmployee(employee: EmployeeDto) {
    this.selectedEmployee = employee;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
