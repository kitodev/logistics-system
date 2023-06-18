import { AfterViewInit, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Credentials } from '../auth/Credentials';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import HttpStatus from 'http-status-codes';
import { AppRoutes } from '../shared/system/AppRoutes';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  credentials: Credentials = { username: '', password: '' };
  errorMessage: string = null;

  readonly EMAIL_MIN_LENGTH = 4;
  readonly PASS_MIN_LENGTH = 4;

  faExclamation = faExclamationCircle;

  constructor(
    private translateService: TranslocoService,
    private authService: AuthService,
    private router: Router
  ) {}

  changeLang(language: string): void {
    this.translateService.setActiveLang(language);
  }

  login(): void {
    this.authService.login(this.credentials).subscribe(
      () => {
        this.router.navigate(['/', AppRoutes.STATS]).then();
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatus.FORBIDDEN:
          case HttpStatus.UNAUTHORIZED:
            this.errorMessage = this.translateService.translate(
              'auth.badCredentials'
            );
            break;
          default:
            this.errorMessage = error.message || 'Unknown error';
        }
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user && user.userName) {
      this.router.navigate(['/', AppRoutes.STATS]).then();
    }
  }
}
