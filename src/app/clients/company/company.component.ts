import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons/faTruckMoving';
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons/faWarehouse';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyService } from '../company.service';
import { HttpErrorResponse } from '@angular/common/http';
import HttpStatus from 'http-status-codes';
import { NotFoundResourceTypes } from 'src/app/shared/components/not-found/not-found.component';

@Component({
  selector: 'app-company',
  styleUrls: ['./company.component.scss'],
  templateUrl: './company.component.html',
})
export class CompanyComponent implements OnDestroy {
  faArrowLeft = faArrowLeft;
  faTruckMoving = faTruckMoving;
  faTable = faTable;
  faUserTie = faUserTie;
  faWarehouse = faWarehouse;
  faFile = faFileAlt;

  companyName: string;
  inactive: boolean;

  notFound = false;
  NotFoundResourceTypes = NotFoundResourceTypes;

  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    router: Router
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params.get('id') && params.get('id') != 'new') {
          this.companyService
            .getCompany(params.get('id'))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              (response) => {
                this.notFound = false;
                this.companyName = response.companyName;
                this.inactive = !response.active;
              },
              (error: HttpErrorResponse) => {
                if (error?.status === HttpStatus.NOT_FOUND) {
                  this.notFound = true;
                }
              }
            );
        } else {
          this.notFound = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
