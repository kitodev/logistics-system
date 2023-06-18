import { TestBed } from '@angular/core/testing';

import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { authServiceMock } from '../../test/auth-service-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });
    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
