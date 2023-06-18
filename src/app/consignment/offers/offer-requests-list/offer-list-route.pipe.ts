import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerListRoute',
  pure: true,
})
export class OfferListRoutePipe implements PipeTransform {
  transform(
    offerRequest: OfferManagementByRequesterDto
  ): Array<{
    inCountry: string;
    inCity: string;
    outCountry: string;
    outCity: string;
  }> {
    const values: Array<{
      inCountry: string;
      inCity: string;
      outCountry: string;
      outCity: string;
    }> = [];
    offerRequest.consignments.forEach((consignments) => {
      values.push({
        inCountry:
          consignments.consignmentBasicData.loadingInLocation.premiseAddress
            .country,
        inCity:
          consignments.consignmentBasicData.loadingInLocation.premiseAddress
            .city,
        outCountry:
          consignments.consignmentBasicData.loadingOutLocation.premiseAddress
            .country,
        outCity:
          consignments.consignmentBasicData.loadingOutLocation.premiseAddress
            .city,
      });
    });

    return values;
  }
}
