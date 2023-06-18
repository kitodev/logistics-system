import { TestBed } from '@angular/core/testing';

import { VehicleService } from './vehicle.service';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoModule(), 
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
