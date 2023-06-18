import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationUserService } from '../application-user.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  password: string;
  code: string;
  email: string;
  readonly minLen: number = 8;
  activated = false;
  private unsubscribe: Subject<void> = new Subject<void>();
  errors: HttpErrorResponse;

  constructor(
    private applicationUserService: ApplicationUserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.code = params['id'];
      });
  }

  setPassword() {
    this.applicationUserService
      .setPassword({
        newPassword: this.password,
        secretOneTimeUuid: this.code,
        email: this.email,
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (value) => {
          this.activated = true;
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
