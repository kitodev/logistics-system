import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerByEmployee',
  pure: true,
})
export class OfferByEmployeePipe implements PipeTransform {
  transform(
    consignmentsWithOffers: Array<ConsignmentDetailedWithGivenOfferDto>,
    employeeId: string
  ): number {
    let offersNum = 0;
    consignmentsWithOffers.forEach((consignmentsWithOffer) => {
      consignmentsWithOffer.givenOffers.forEach((offer) => {
        if (offer.bidderEmployeeId === employeeId) {
          offersNum++;
        }
      });
    });

    return offersNum;
  }
}
