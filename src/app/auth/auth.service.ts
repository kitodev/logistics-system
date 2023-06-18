import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from '../shared/system/http.service';
import { Credentials } from './Credentials';
import {
  LocalStorageScopes,
  LocalStorageService,
} from '../shared/system/local-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from './Token';
import { ApplicationEmployee } from './ApplicationEmployee';
import { Role } from './Role';

interface LoginDto {
  full_name: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private loggedInUserSource: BehaviorSubject<User> = new BehaviorSubject<User>(
    null
  );
  private static readonly LOGIN_ENDPOINT = '/login';
  public static readonly TOKEN_STORAGE_KEY = 'token';
  private static readonly USER_STORAGE_KEY = 'user';
  private jwtHelper = new JwtHelperService();
  private myCompanyId: string;
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private httpService: HttpService,
    private localStorageService: LocalStorageService
  ) {
    const storedToken: string = this.localStorageService.getItem(
      AuthService.TOKEN_STORAGE_KEY,
      LocalStorageScopes.LOGON
    );
    if (this.jwtHelper.isTokenExpired(storedToken)) {
      this.clearUserData();
      return;
    }
    if (storedToken) {
      const storedUser: User = this.localStorageService.getParsedItem<User>(
        AuthService.USER_STORAGE_KEY,
        LocalStorageScopes.LOGON
      );
      const decodedToken: Token = this.jwtHelper.decodeToken(storedToken);
      const applicationEmployee: ApplicationEmployee = JSON.parse(
        decodedToken.authenticatedEmployee
      );
      const user: User = {
        email: decodedToken.sub,
        roles: decodedToken.roles,
        companyId: applicationEmployee.companyId,
        userName: storedUser.userName,
        employee: applicationEmployee,
      };
      this.myCompanyId = applicationEmployee.companyId;
      this.loggedInUserSource.next(user);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  login(credentials: Credentials): Observable<void> {
    return this.httpService
      .post<LoginDto>(AuthService.LOGIN_ENDPOINT, credentials)
      .pipe(
        map((response) => {
          this.localStorageService.setItem(
            AuthService.TOKEN_STORAGE_KEY,
            response.access_token,
            LocalStorageScopes.LOGON
          );
          const decodedToken: Token = this.jwtHelper.decodeToken(
            response.access_token
          );
          const authEmployee: ApplicationEmployee = JSON.parse(
            decodedToken.authenticatedEmployee
          );
          const user: User = {
            userName: decodedToken.sub,
            email: decodedToken.sub,
            companyId: authEmployee.companyId,
            roles: [...decodedToken.roles],
            employee: authEmployee,
          };
          this.myCompanyId = authEmployee.companyId;
          this.localStorageService.setItem(
            AuthService.USER_STORAGE_KEY,
            user,
            LocalStorageScopes.LOGON
          );
          this.loggedInUserSource.next(user);
        })
      );
  }

  logout(): void {
    this.clearUserData();
    this.loggedInUserSource.next(null);
  }

  getLoggedInUser(): User | null {
    return this.loggedInUserSource.getValue();
  }

  getLoggedInUserObservable(): Observable<User> {
    return this.loggedInUserSource.asObservable();
  }

  isLoggedIn(): boolean {
    const token = this.localStorageService.getItem(
      AuthService.TOKEN_STORAGE_KEY,
      LocalStorageScopes.LOGON
    );
    const expired = this.jwtHelper.isTokenExpired(token);
    return !!token && !expired;
  }

  isAgency(): boolean {
    return this.getLoggedInUser().employee.agency;
  }

  hasRole(role: Role): boolean {
    const user = this.getLoggedInUser();
    return user.roles.includes(role);
  }

  hasAnyRole(roles: Array<Role>): boolean {
    const user = this.getLoggedInUser();
    return (
      roles.filter((checkRole) => user.roles.includes(checkRole)).length > 0
    );
  }

  private clearUserData(): void {
    this.localStorageService.clearItem(
      AuthService.TOKEN_STORAGE_KEY,
      LocalStorageScopes.LOGON
    );
    this.localStorageService.clearItem(
      AuthService.USER_STORAGE_KEY,
      LocalStorageScopes.LOGON
    );
  }

  getOwnCompanyId(): string {
    return this.myCompanyId;
  }

  getAgencyId(): string | undefined {
    return this.getLoggedInUser().employee.agencyId;
  }
}
