import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplicationUserService', () => {
  let service: ApplicationUserBEService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(ApplicationUserBEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
