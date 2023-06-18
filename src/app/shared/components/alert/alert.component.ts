import { Component, Input, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input() errors?: HttpErrorResponse;
  // @Input() success?: string;
  faExclamation = faExclamation;
  // faCheck = faCheck;
  faTimes = faTimes;

  errorMsg: string;
  errorArray: any[] = [];

  ngOnInit(): void {
    if (this.errors) {
      if (typeof this.errors.error.errors === 'string') {
        this.errorMsg = this.errors.error.errors;
      } else {
        this.errorArray = this.errors.error.errors;
      }
    }
  }

  close() {
    this.errors = null;
    // this.success = null;
  }
}
