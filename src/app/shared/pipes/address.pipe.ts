import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address',
  pure: true,
})
export class AddressPipe implements PipeTransform {
  transform(address: AddressDto, html?: boolean): string {
    if (!address) {
      return '';
    }
    /* eslint-disable max-len */
    return html
      ? `${address.country}-${address.postCode} ${address.city},<wbr> ${address.streetName} ${address.streetType} ${address.streetNumber}`
      : `${address.country}-${address.postCode} ${address.city}, ${address.streetName} ${address.streetType} ${address.streetNumber}`;
  }
}
