import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LineService } from '../../line.service';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faBox } from '@fortawesome/free-solid-svg-icons/faBox';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { HttpErrorResponse } from '@angular/common/http';
import { faTruckLoading } from '@fortawesome/free-solid-svg-icons/faTruckLoading';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit, OnDestroy {
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faBox = faBox;
  faInfo = faInfoCircle;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faTruckLoading = faTruckLoading;
  faMoneyBillWave = faMoneyBillWave;

  errors: HttpErrorResponse;

  clrIfExpanded: Array<boolean> = [];
  orderChanged = false;
  overConsignmentId: string;

  private unsubscribe = new Subject<void>();
  lineId: string;
  isLoading = true;

  legs: LegsOfLineDto[];

  StatusDirection = StatusDirection;

  constructor(
    private lineService: LineService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.lineId = params.get('id') == 'new' ? null : params.get('id');
      });
  }

  ngOnInit(): void {
    this.loadLineData();
  }

  private loadLineData() {
    this.isLoading = true;
    this.lineService
      .getLegsByLineId(this.lineId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.legs = response;
        this.isLoading = false;
      });
  }

  openLine(): void {
    this.router
      .navigateByUrl(`${AppRoutes.LINEMANAGEMENT}/${AppRoutes.LINE}/${this.lineId}/details`)
      .then();
  }

  openConsignment(consignmentId: string): void {
    this.router
      .navigateByUrl(`${AppRoutes.CONSIGNMENT}/${AppRoutes.PARCEL}/${consignmentId}/details`)
      .then();
  }

  moveUp(index): void {
    if (index > 0) {
      this.legs.splice(index - 1, 0, this.legs.splice(index, 1)[0]);
      this.orderChanged = true;
    }
  }

  moveDown(index): void {
    if (index < this.legs.length - 1) {
      this.legs.splice(index + 1, 0, this.legs.splice(index, 1)[0]);
      this.orderChanged = true;
    }
  }

  prevent(event: Event): void {
    event.stopPropagation();
  }

  statusChangedEvent(event: string) {
    this.loadLineData();
  }

  save(): void {
    let premiseIds = [];
    this.legs.forEach((leg) => premiseIds.push(leg.premiseId));

    this.orderChanged = false;
    this.lineService
      .reorderLineLegs(this.lineId, premiseIds)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.loadLineData();
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  enter(consignmentId: string): void {
    this.overConsignmentId = consignmentId;
  }

  leave(): void {
    this.overConsignmentId = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
