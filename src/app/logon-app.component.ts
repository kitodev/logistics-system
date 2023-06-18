import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from './auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { User } from './auth/User';
import { Router } from '@angular/router';
import { AppRoutes } from './shared/system/AppRoutes';
import { CompanyService } from './clients/company.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { registerLocaleData } from '@angular/common';
import localeGB from '@angular/common/locales/en-GB';
import localeHU from '@angular/common/locales/hu';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons/faUserCircle';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { faBuilding } from '@fortawesome/free-regular-svg-icons/faBuilding';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons/faUserAlt';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { ClrCommonStringsService } from '@clr/angular';
import { hunLocale } from './shared/table/table.service';
import { PopoutService } from './shared/popout/popout.service';
import { StatusesService } from './statuses/statuses.service';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

@Component({
  selector: 'app-logon',
  templateUrl: './logon-app.component.html',
  styleUrls: ['./logon-app.component.scss'],
})
export class LogonAppComponent implements OnInit, OnDestroy {
  title = 'logon-frontend';
  currentUser: User;
  private unsubscribe = new Subject<void>();

  errorCount: Observable<number>;

  faUserIcon = faUserCircle;
  faAngleDown = faAngleDown;
  faUserAlt = faUserAlt;
  faCog = faCog;
  faEnvelope = faEnvelope;
  faGlobe = faGlobe;
  faBuilding = faBuilding;
  faSignOut = faPowerOff;

  constructor(
    private translateService: TranslocoService,
    private authService: AuthService,
    private router: Router,
    private companyService: CompanyService,
    private config: NgSelectConfig,
    private popoutService: PopoutService,
    private statusesService: StatusesService,
    commonStrings: ClrCommonStringsService
  ) {
    translateService
      .selectTranslate('messages.error.notFound')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.config.notFoundText = value;
      });

    //TODO lang change
    commonStrings.localize(hunLocale);
  }

  changeLang(language: string): void {
    this.translateService.setActiveLang(language);
  }

  ngOnInit(): void {
    localStorage.getItem('lang');
    registerLocaleData(localeHU, 'hu-HU');
    registerLocaleData(localeGB, 'en-GB');
    this.currentUser = this.authService.getLoggedInUser();
    this.authService
      .getLoggedInUserObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((user) => {
        this.currentUser = user;
      });
    this.errorCount = this.statusesService.statusErrors.asObservable();
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: Event) {
    this.popoutService.closePopoutModal();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout(): void {
    this.authService.logout();
  }

  toMyCompany(): void {
    this.router.navigate(['/', AppRoutes.MY_COMPANY]).then();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  switchLang(): void {
    const currentLang = this.translateService.getActiveLang();
    switch (currentLang) {
      case 'hu':
        this.translateService.setActiveLang('en');
        localStorage.setItem('lang', currentLang);
        break;
      case 'en':
        this.translateService.setActiveLang('hu');
        localStorage.setItem('lang', currentLang);
        break;
    }
  }
}
