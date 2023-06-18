import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerLot',
})
export class OfferLotPipe implements PipeTransform {
  transform(offerRequest: OfferRequestByRequesterDto): string {
    const values = [];
    offerRequest.consignments.forEach((consignments) => {
      // values.push(consignments.transportMode); //TODO make sense
    });

    return values.join(', ');
  }
}
