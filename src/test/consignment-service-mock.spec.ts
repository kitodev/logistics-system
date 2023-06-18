import { of } from 'rxjs';

export const consignmentServiceMock: Partial<ConsignmentBEService> = {
  createConsignment: jasmine.createSpy('create consignment'),
  findConsignemntById: () => {
    return of(testConsignment) as any;
  },
  deleteById: jasmine.createSpy('delete consignment'),
  findAllConsignment: () =>
    of({ content: [testConsignment], number: 1 } as any),
  consignmentStatuses: () => of([]) as any,
};

const testConsignment: ConsignmentDto = {
  consignmentBasicData: {
    // parity: Parity.DAT,
    // tradeType: TradeType.EXPORT,
    // travelMode: TravelMode.RIVER,
    // transportMode: TransportMode.COMPLETE,
    loadingInLocation: {
      premiseAddress: {
        country: null,
        streetType: null,
        streetName: null,
        city: null,
        streetNumber: null,
        county: null,
        postCode: null,
      },
      timeGate: {
        latestArrival: null,
        earliestArrival: null,
        openingDays: null,
      },
      companyFax: null,
      loadingInReferenceNumber: 'in',
      loadingOutReferenceNumber: 'out',
      contactPersonId: null,
      sender: null,
      companyPhone: null,
      companyEmail: null,
      companyId: null,
      premiseId: null,
      customs: null,
    },
    loadingOutLocation: {
      premiseAddress: {
        country: null,
        streetType: null,
        streetName: null,
        city: null,
        streetNumber: null,
        county: null,
        postCode: null,
      },
      timeGate: {
        latestArrival: null,
        earliestArrival: null,
        openingDays: null,
      },
      companyFax: null,
      loadingInReferenceNumber: 'in',
      loadingOutReferenceNumber: 'out',
      contactPersonId: null,
      sender: null,
      companyPhone: null,
      companyEmail: null,
      companyId: null,
      premiseId: null,
      customs: null,
    },
    lots: [],
  },
  transshipmentLocations: [],
  consignorEmployeeId: 'test',
  consignmentId: 'test',
  responsiblePersonEmployeeId: 'test',
};
