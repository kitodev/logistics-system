import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeName',
  pure: true,
})
export class EmployeeNamePipe implements PipeTransform {
  transform(
    employee:
      | EmployeeDto
      | CommentDto
      | EmployeeForOfferManagementDto
      | { firstName: string; lastName: string; title?: string },
    withTitle?: boolean
  ): unknown {
    if (!employee) {
      return '';
    }

    return `${employee['title'] ? employee['title'] : ''} ${
      employee.firstName
    } ${employee.lastName}`;
  }
}
