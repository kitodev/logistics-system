import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConsignmentService', () => {
  let service: ConsignmentBEService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(ConsignmentBEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
