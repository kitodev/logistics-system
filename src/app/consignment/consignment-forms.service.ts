import { Injectable } from '@angular/core';
import { LotClassificationStrings } from './lots/LotClassificationStrings';
import { FormSelectItem } from '../shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';
import { FormModel } from '../shared/FormModel';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentFormsService {
  constructor(private translationService: TranslocoService) {}

  getLotQuantityTypes(): Array<FormSelectItem<QuantityType>> {
    return Object.keys(QuantityType).map((key) => ({
      value: QuantityType[key],
      label: this.translationService.translate(
        'consignment.lot.qtyTypes.' + QuantityType[key]
      ),
    }));
  }

  getLotGroups(): Array<FormSelectItem<LotGroup>> {
    return Object.keys(LotGroup).map((key) => ({
      value: LotGroup[key],
      label: LotGroup[key],
    }));
  }

  getLotClassifications(): Array<FormSelectItem<Classification>> {
    return Object.keys(Classification).map((key) => ({
      value: Classification[key],
      label: LotClassificationStrings[key],
    }));
  }

  getTransportModes(): Array<FormSelectItem<TransportMode>> {
    return Object.keys(TransportMode).map((key) => ({
      value: TransportMode[key],
      label: this.translationService.translate(
        'consignment.type.' + TransportMode[key]
      ),
    }));
  }

  getTravelModes(): Array<FormSelectItem<TravelMode>> {
    return Object.keys(TravelMode).map((key) => ({
      value: TravelMode[key],
      label: this.translationService.translate(
        'consignment.travelMode.' + TravelMode[key]
      ),
    }));
  }

  getConsignmentTradeTypes(): Array<FormSelectItem<TradeType>> {
    return Object.keys(TradeType).map((key) => ({
      value: TradeType[key],
      label: this.translationService.translate(
        'consignment.tradeTypes.' + TradeType[key]
      ),
    }));
  }

  getConsignmentParityList(): Array<FormSelectItem<Parity>> {
    return Object.keys(Parity).map((key) => ({
      value: Parity[key],
      label: Parity[key],
    }));
  }

  static createEmptyLot(): LotDto {
    return {
      quantity: null,
      quantityType: null,
      weight: null,
      lmeter: null,
      cbm: null,
      width: null,
      height: null,
      stackable: false,
      lotIdentifier: null,
      customs: false,
      adr: false,
      unNumber: null,
      lotGroup: null,
      adrIdentifier: null,
      classification: null,
      name: null,
    };
  }

  static createEmptyConsignmentBasicDto(): ConsignmentBasicDataDto {
    return {
      loadingInLocation: this.createEmptyLocation(),
      loadingOutLocation: this.createEmptyLocation(),
      ekaer: null,
      // travelMode: null,
      // transportMode: null,
      lots: [],
      // parity: null,
      // tradeType: null,
      orderId: null,
    };
  }

  public static createEmptyLocation(): LocationDto {
    return {
      id: null,
      companyEmail: null,
      companyFax: null,
      companyId: null,
      companyPhone: null,
      freightId: null,
      contactPersonId: null,
      customs: false,
      premiseAddress: {
        country: null,
        postCode: null,
        city: null,
        streetName: null,
        streetType: null,
        streetNumber: null,
        county: null,
      },
      coordinate: null,
      premiseId: null,
      loadingInReferenceNumber: null,
      loadingOutReferenceNumber: null,
      sender: null,
      timeGate: {
        latestArrival: undefined,
        earliestArrival: undefined,
        openingDays: null,
      },
    };
  }

  public static createLocationFormModel(
    location: LocationDto
  ): FormModel<LocationDto> {
    return {
      id: [location.id],
      freightId: [location.freightId],
      premiseAddress: [location.premiseAddress, Validators.required],
      coordinate: [location.coordinate],
      companyPhone: [location.companyPhone],
      companyFax: [location.companyFax],
      companyEmail: [location.companyEmail, Validators.email],
      loadingInReferenceNumber: [location.loadingInReferenceNumber],
      loadingOutReferenceNumber: [location.loadingOutReferenceNumber],
      timeGate: [location.timeGate],
      sender: [location.sender],
      customs: [location.customs],
      premiseId: [location.premiseId, Validators.required],
      companyId: [location.companyId, Validators.required],
      contactPersonId: [location.contactPersonId, Validators.required],
    };
  }

  public static createEmptyConsignment(): ConsignmentDto {
    const basicData = ConsignmentFormsService.createEmptyConsignmentBasicDto();

    return {
      consignorEmployeeId: null,
      responsiblePersonEmployeeId: null,
      givenOfferId: null,
      consignmentBasicData: basicData,
    };
  }

  public static toProperConsignmentDto(consignment: ConsignmentDto): void {
    ConsignmentFormsService.transformTimeGate(
      consignment.consignmentBasicData.loadingInLocation.timeGate
    );
    ConsignmentFormsService.transformTimeGate(
      consignment.consignmentBasicData.loadingOutLocation.timeGate
    );
    consignment.transshipmentLocations?.forEach((location) => {
      this.transformTimeGate(location.timeGate);
    });
    consignment.consignmentBasicData?.lots.forEach((lot) => {
      delete lot.rootVersion;
    });
  }

  public static transformTimeGate(timeGate: TimeGateDto): void {
    if (!timeGate) {
      return;
    }
    if (timeGate.openingDays) {
      for (const day in timeGate.openingDays) {
        if (
          !timeGate.openingDays[day].openFrom ||
          !timeGate.openingDays[day].openTo
        ) {
          delete timeGate.openingDays[day];
        }
      }
    }
  }
}
