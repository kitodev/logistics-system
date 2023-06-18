import { TestBed } from '@angular/core/testing';
import { OfferRequestDataService } from './offer-request-data.service';
import { of } from 'rxjs';

describe('OfferRequestDataService', () => {
  let service: OfferRequestDataService;
  const offerServiceMock = {
    createOffer: jasmine.createSpy('create offer'),
    updateOffer: jasmine.createSpy('update offer'),
    requestOffer: () => of(null),
    getRequesterOffer: () => of(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OfferService,
          useValue: offerServiceMock,
        },
      ],
    });
    service = TestBed.inject(OfferRequestDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
