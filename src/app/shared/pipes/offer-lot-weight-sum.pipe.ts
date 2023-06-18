import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerLotWeightSum',
})
export class OfferLotWeightSumPipe implements PipeTransform {
  transform(offerRequest: OfferRequestByRequesterDto): number {
    let weight = 0;
    offerRequest.consignments.forEach((consignments) => {
      weight += consignments.sumWeight; // TODO make sense
    });

    return weight;
  }
}
