import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from 'src/test/transloco-module.spec';

import { LineService } from './line.service';

describe('LineService', () => {
  let service: LineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule,
        getTranslocoModule(),
      ],
    });
    service = TestBed.inject(LineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
