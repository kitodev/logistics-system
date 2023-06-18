import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'offerNotSendable', pure: false })
export class OfferNotSendablePipe implements PipeTransform {
  private static isValidOfferAddress(location: LocationDto | null): boolean {
    //TODO: check
    return !!(location && location.companyId && location.premiseId);
  }

  transform(offer: OfferManagementByRequesterDto): boolean {
    return !(
      offer.receiverEmployees &&
      offer.receiverEmployees.length > 0 &&
      offer.consignments.length > 0 &&
      offer.consignments.every((consignment) => {
        return (
          OfferNotSendablePipe.isValidOfferAddress(
            consignment.consignmentBasicData.loadingInLocation
          ) &&
          OfferNotSendablePipe.isValidOfferAddress(
            consignment.consignmentBasicData.loadingOutLocation
          )
        );
        // TODO: check for Lot data
      })
    );
  }
}
