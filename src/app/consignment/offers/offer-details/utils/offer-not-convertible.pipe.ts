import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerNotConvertible',
})
export class OfferNotConvertiblePipe implements PipeTransform {
  transform(offer: OfferManagementByRequesterDto): boolean {
    return !(
      offer.requestDeadline &&
      offer.receiverEmployees &&
      offer.receiverEmployees.length > 0 &&
      offer.consignments.length > 0
    );
  }
}
