import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerRoute',
  pure: true,
})
export class OfferRoutePipe implements PipeTransform {
  transform(
    offerRequest: OfferRequestByRequesterDto
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
        inCountry: consignments.loadingInLocation.premiseAddress.country,
        inCity: consignments.loadingInLocation.premiseAddress.city,
        outCountry: consignments.loadingOutLocation.premiseAddress.country,
        outCity: consignments.loadingOutLocation.premiseAddress.city,
      });
    });

    return values;
  }
}
