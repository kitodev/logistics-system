import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rejectEnable',
})
export class RejectEnablePipe implements PipeTransform {
  transform(givenOffers: Array<MyGivenOfferDto>): boolean {
    if (!givenOffers.length) {
      return true;
    }
    return !givenOffers.some(
      (givenOffer) =>
        givenOffer.status === GivenOfferStatus.REJECTED ||
        givenOffer.status === GivenOfferStatus.ACCEPTED
    );
  }
}
