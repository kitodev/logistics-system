import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerBidCount',
  pure: true,
})
export class OfferBidCountPipe implements PipeTransform {
  transform(offerRequest: OfferManagementByRequesterDto): number {
    let count = 0;
    offerRequest.consignments.forEach((consignment) => {
      count += consignment.givenOffers?.length;
    });

    return count;
  }
}
