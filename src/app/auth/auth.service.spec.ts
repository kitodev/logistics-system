import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpService } from '../shared/system/http.service';
import { LocalStorageService } from '../shared/system/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpService, LocalStorageService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
