import { TestBed } from '@angular/core/testing';

import { PopoutService } from './popout.service';

describe('PopoutService', () => {
  let service: PopoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
