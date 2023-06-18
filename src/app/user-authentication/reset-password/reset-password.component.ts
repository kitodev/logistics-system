import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationUserService } from '../application-user.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email: string;
  password: string;
  employeeId: string;
  code: string;
  activated = false;
  private unsubscribe: Subject<void> = new Subject<void>();
  errors: HttpErrorResponse;

  constructor(private applicationUserService: ApplicationUserService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.code = params['id'];
      });
  }

  resetPassword() {
    this.applicationUserService
      .resetPassword({
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
          console.log(this.errors)
        }
      );
  }
}
