import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeIdNumber',
  pure: true,
})
export class EmployeeIdentificationNumberPipe implements PipeTransform {
  transform(
    employeeIdentifications: Array<EmployeeIdentificationDto>,
    type: string
  ): string {
    return employeeIdentifications.filter((id) => id.idType === type)[0]
      ?.idNumber;
  }
}
