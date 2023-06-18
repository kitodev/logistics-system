import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '../../../test/transloco-module.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FinanceService } from './finance.service';

describe('FinanceService', () => {
  let service: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoModule(), 
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
    service = TestBed.inject(FinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
