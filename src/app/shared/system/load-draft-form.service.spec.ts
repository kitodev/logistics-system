import { TestBed } from '@angular/core/testing';

import { LoadDraftFormService } from './load-draft-form.service';

describe('LoadDraftFormService', () => {
  let service: LoadDraftFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadDraftFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
