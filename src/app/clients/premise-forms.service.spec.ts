import { TestBed } from '@angular/core/testing';

import { PremiseFormsService } from './premise-forms.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PremiseFormsService', () => {
  let service: PremiseFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
    });
    service = TestBed.inject(PremiseFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
