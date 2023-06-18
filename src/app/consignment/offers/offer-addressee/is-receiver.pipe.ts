import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isReceiver',
  pure: false,
})
export class IsReceiverPipe implements PipeTransform {
  transform(
    employeeId: string,
    receivers: Array<EmployeeForOfferManagementDto>
  ): boolean {
    for (const receiver of receivers) {
      if (receiver.employeeId === employeeId) {
        return true;
      }
    }
    return false;
  }
}
