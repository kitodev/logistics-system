import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '../shared/system/local-storage.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeMock: any = { snapshot: {} };
  let routeStateMock;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    createUrlTree: () => 'default route',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        LocalStorageService,
        { provide: Router, useValue: routerMock },
      ],
    });

    authService = TestBed.inject(AuthService);
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow page without login', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    routeStateMock = { snapshot: {}, url: ['/', 'stats'] };
    const result = guard.canActivate(routeMock, routeStateMock);
    expect(result).toMatch('default route');
  });

  it('should allow page when logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    routeStateMock = { snapshot: {}, url: ['/', 'stats'] };
    const result = guard.canActivate(routeMock, routeStateMock);
    expect(result).toEqual(true);
  });
});
