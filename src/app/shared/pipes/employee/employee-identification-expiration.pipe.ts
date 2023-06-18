import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeIdExpiration',
  pure: true,
})
export class EmployeeIdentificationExpirationPipe implements PipeTransform {
  transform(
    employeeIdentifications: Array<EmployeeIdentificationDto>,
    type: string
  ): string {
    return employeeIdentifications.filter((id) => id.idType === type)[0]
      ?.expire;
  }
}
