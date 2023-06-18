import { TestBed } from '@angular/core/testing';

import { ParcelMapService } from './parcel-map.service';
import { LineService } from '../../../line-management/line.service';
import { lineServiceMock } from '../../../../test/line-service-mock.spec';

describe('ParcelMapService', () => {
  let service: ParcelMapService;
  const locationA: LocationDto = {
    companyEmail: '',
    companyId: 'CA',
    companyPhone: '',
    contactPersonId: '',
    coordinate: { lat: 1, lon: 2 },
    customs: false,
    id: 'A',
    premiseAddress: undefined,
    premiseId: 'PA',
    sender: 'jozsi',
    timeGate: undefined,
  };
  const locationB: LocationDto = {
    companyEmail: '',
    companyId: 'CB',
    companyPhone: '',
    contactPersonId: '',
    coordinate: { lat: 3, lon: 4 },
    customs: false,
    id: 'B',
    premiseAddress: undefined,
    premiseId: 'PB',
    sender: 'jozsi',
    timeGate: undefined,
  };
  const locationC: LocationDto = {
    companyEmail: '',
    companyId: 'CC',
    companyPhone: '',
    contactPersonId: '',
    coordinate: { lat: 5, lon: 6 },
    customs: false,
    id: 'C',
    premiseAddress: undefined,
    premiseId: 'PC',
    sender: 'jozsi',
    timeGate: undefined,
  };
  const leg1: LegDto = { lineId: 'L1', locationFromId: 'A', locationToId: 'B' };
  const leg2: LegDto = { lineId: 'L2', locationFromId: 'B', locationToId: 'C' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LineService,
          useValue: lineServiceMock,
        },
      ],
    });
    service = TestBed.inject(ParcelMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when consignment is not yet on a line', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [];
    const status: Array<ConsignmentStatusDto> = [];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value).toBeNull();
    });
  });

  it('should select the first location when there are no status info', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(1);
      expect(value.lon).toEqual(2);
    });
  });

  it('should select the first location when loading in is in progress', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.IN_PROGRESS,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(1);
      expect(value.lon).toEqual(2);
    });
  });

  it('should get line history when first location is finished', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      { premiseId: 'PA', lineId: 'L1', overallStatus: OverallStatus.FINISHED },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(1003);
      expect(value.lon).toEqual(1004);
    });
  });

  it('should get line history when first location is finished, second is waiting', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      { premiseId: 'PA', lineId: 'L1', overallStatus: OverallStatus.FINISHED },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(1003);
      expect(value.lon).toEqual(1004);
    });
  });

  it('should select the second location when there are no status info for second location', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.IN_PROGRESS,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(3);
      expect(value.lon).toEqual(4);
    });
  });

  it('should select the second location when there are no status info for leg 2', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      { premiseId: 'PB', lineId: 'L1', overallStatus: OverallStatus.FINISHED },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(3);
      expect(value.lon).toEqual(4);
    });
  });

  it('should select the second location when the loading in is waiting for second line', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L2',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
      },
      {
        premiseId: 'PC',
        lineId: 'L2',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(3);
      expect(value.lon).toEqual(4);
    });
  });

  it('should select the second location when the loading in is in progress for second line', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L2',
        overallStatus: OverallStatus.IN_PROGRESS,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(3);
      expect(value.lon).toEqual(4);
    });
  });

  it('should select the second line history when the loading in is finished for second line', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L2',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PC',
        lineId: 'L2',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(2001);
      expect(value.lon).toEqual(2002);
    });
  });
  it('should select the second line history when the loading out is in progress for second line', () => {
    const locations: Array<LocationDto> = [locationA, locationB, locationC];
    const legs: Array<LegDto> = [leg1, leg2];
    const status: Array<ConsignmentStatusDto> = [
      {
        premiseId: 'PA',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L1',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PB',
        lineId: 'L2',
        overallStatus: OverallStatus.FINISHED,
      },
      {
        premiseId: 'PC',
        lineId: 'L2',
        overallStatus: OverallStatus.IN_PROGRESS,
      },
    ];

    service.statusToCoordinates(locations, legs, status).subscribe((value) => {
      expect(value.lat).toEqual(5);
      expect(value.lon).toEqual(6);
    });
  });

  it('should filter out the old statuses', () => {
    const statuses: Array<ConsignmentStatusDto> = [
      {
        consignmentStatusId: 'fe2e9c49-ab22-4f6a-8727-420ca4ab0940',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
        lineId: '2491b951-0a03-4572-a405-22e175842014',
        premiseId: '5de2cac1-fdac-49ad-85d2-401e32524948',
        timestamp: '2021-03-03T11:39:37.077921Z',
      },
      {
        consignmentStatusId: 'b49ed52f-81b2-4465-ab22-987491466f30',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
        lineId: '2491b951-0a03-4572-a405-22e175842014',
        premiseId: '54cb859b-3628-45d5-8fd1-00fd31a34bb5',
        timestamp: '2021-03-03T11:39:37.077921Z',
      },
      {
        consignmentStatusId: 'ad2eb9ba-53ac-43d1-b3b6-8e4389bb90fa',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
        lineId: '2555bcf0-49fc-4f65-82c4-0f7969abd739',
        premiseId: 'ca6e810f-ac03-425f-b2d7-5adf48693d35',
        timestamp: '2021-03-03T11:39:37.077921Z',
      },
      {
        consignmentStatusId: 'd8e91a50-0af4-4a9a-8273-5af340586990',
        overallStatus: OverallStatus.WAITING_FOR_UPDATE,
        lineId: '2555bcf0-49fc-4f65-82c4-0f7969abd739',
        premiseId: '5de2cac1-fdac-49ad-85d2-401e32524948',
        timestamp: '2021-03-03T11:39:37.077921Z',
      },
      {
        consignmentStatusId: 'a36d9232-cd1a-47c1-a8f2-3f6c7b977d68',
        overallStatus: OverallStatus.FINISHED,
        lineId: '2555bcf0-49fc-4f65-82c4-0f7969abd739',
        premiseId: 'ca6e810f-ac03-425f-b2d7-5adf48693d35',
        timestamp: '2021-03-03T11:41:25.267739Z',
      },
      {
        consignmentStatusId: '34c08870-80d0-4248-b4ac-951821803d8a',
        overallStatus: OverallStatus.FINISHED,
        lineId: '2555bcf0-49fc-4f65-82c4-0f7969abd739',
        premiseId: '5de2cac1-fdac-49ad-85d2-401e32524948',
        timestamp: '2021-03-03T11:41:29.935027Z',
      },
      {
        consignmentStatusId: '735d98b5-14dd-4f5a-af7a-742f9e157e2c',
        overallStatus: OverallStatus.FINISHED,
        lineId: '2491b951-0a03-4572-a405-22e175842014',
        premiseId: '5de2cac1-fdac-49ad-85d2-401e32524948',
        timestamp: '2021-03-03T11:43:09.709048Z',
      },
    ];

    const filtered = ParcelMapService.filterLastStatus(statuses);
    // MUST HAVE
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === 'a36d9232-cd1a-47c1-a8f2-3f6c7b977d68'
      )
    ).toBeTruthy();
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === '34c08870-80d0-4248-b4ac-951821803d8a'
      )
    ).toBeTruthy();
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === '735d98b5-14dd-4f5a-af7a-742f9e157e2c'
      )
    ).toBeTruthy();
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === 'b49ed52f-81b2-4465-ab22-987491466f30'
      )
    ).toBeTruthy();
    // SHOULDN'T HAVE
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === 'd8e91a50-0af4-4a9a-8273-5af340586990'
      )
    ).toBeFalsy();
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === 'fe2e9c49-ab22-4f6a-8727-420ca4ab0940'
      )
    ).toBeFalsy();
    expect(
      filtered.find(
        (value) =>
          value.consignmentStatusId === 'ad2eb9ba-53ac-43d1-b3b6-8e4389bb90fa'
      )
    ).toBeFalsy();
    expect(ParcelMapService.filterLastStatus([]).length).toEqual(0);
  });
});
