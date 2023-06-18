import { Injectable } from '@angular/core';
import { FormModel } from '../../FormModel';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  createAddressFormModel(address: AddressDto): FormModel<AddressDto> {
    return {
      country: [address.country, Validators.required],
      county: [address.county],
      postCode: [address.postCode, Validators.required],
      city: [address.city, Validators.required],
      streetName: [address.streetName, Validators.required],
      streetType: [address.streetType, Validators.required],
      streetNumber: [address.streetNumber, Validators.required],
    };
  }

  static createEmptyAddress(): AddressDto {
    return {
      country: '',
      county: null,
      postCode: '',
      city: '',
      streetName: '',
      streetType: null,
      streetNumber: '',
    };
  }
}
