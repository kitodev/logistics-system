import { TestBed } from '@angular/core/testing';

import { StatusesService } from './statuses.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('StatusesService', () => {
  let service: StatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(StatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
