import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bidder',
})
export class BidderPipe implements PipeTransform {
  transform(
    givenOffers: Array<GivenOfferWithBidderDto>,
    bidderEmployeeId: string
  ): string {
    const bid = givenOffers.filter(
      (value) => value.bidderEmployeeId === bidderEmployeeId
    );
    if (!bid?.length) {
      return '';
    }
    return bid[0].price;
  }
}
