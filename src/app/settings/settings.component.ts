import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  readonly PASS_MIN_LENGTH = 4;
  faGlobe = faGlobe;
  changePasswordFrom: FormGroup;
  passwords: any;
  errors: HttpErrorResponse;

  constructor(
    private translateService: TranslocoService,
    private applicationUserService: ApplicationUserBEService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.buildPasswordChangeForm();
  }

  private buildPasswordChangeForm(): void {
    const passwordFormModel = {
      oldPassword: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      newPasswordRepeat: ['', [Validators.required, Validators.minLength(4)]],
    }

    this.changePasswordFrom = this.fb.group(passwordFormModel);
  }


  changePassword() {
    if (this.changePasswordFrom.invalid) {
      return
    }
    this.passwords = this.changePasswordFrom.value
    
    if (this.passwords.newPassword !== this.passwords.newPasswordRepeat) {
      this.toastService.error(this.translateService.translate('messages.error.mismatch'));
      return;
    }

    const user = this.authService.getLoggedInUser();

    const changePassword: ApplicationUserPasswordModificationDto = {
      email: user.email,
      oldPassword: this.passwords.oldPassword,
      newPassword: this.passwords.newPassword,
    }
    
    this.applicationUserService
      .changePassword(changePassword)
      .pipe(
        this.toastService.observe({
          loading: this.translateService.translate('messages.inProgress'),
          success: this.translateService.translate('messages.changesSaved'),
          error: this.translateService.translate('messages.operationFailed'),
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.changePasswordFrom.markAsPristine();
          this.authService.logout();
          this.router.navigate(['/login']).then();
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
          if (error.error.errors === 'Old password incorrect!') {
            this.toastService.error(this.translateService.translate('messages.error.oldPassword'));
          }
        }
      );
  }

  switchLang(lang): void {
    if (lang === 'en')
      this.translateService.setActiveLang('en');
    if (lang === 'hu')
      this.translateService.setActiveLang('hu');
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
