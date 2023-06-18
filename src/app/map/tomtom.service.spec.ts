import { TestBed } from '@angular/core/testing';

import { TomTomService } from './tom-tom.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TomtomService', () => {
  let service: TomTomService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TomTomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
