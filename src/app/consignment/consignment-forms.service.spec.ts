import { TestBed } from '@angular/core/testing';

import { ConsignmentFormsService } from './consignment-forms.service';
import { getTranslocoModule } from '../../test/transloco-module.spec';

describe('ConsignmentFormsService', () => {
  let service: ConsignmentFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [],
    });
    service = TestBed.inject(ConsignmentFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
