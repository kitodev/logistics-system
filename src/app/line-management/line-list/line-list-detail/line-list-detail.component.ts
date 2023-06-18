import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LineService } from '../../line.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-line-list-detail',
  templateUrl: './line-list-detail.component.html',
  styleUrls: ['./line-list-detail.component.scss'],
})
export class LineListDetailComponent implements OnInit, OnDestroy {
  @Input()
  lineDetail: LineContactVehiclesAndDriversDto;

  private unsubscribe: Subject<void> = new Subject<void>();

  lineLegs: Array<LegsOfLineDto>;
  StatusTypes = OverallStatus;

  faCheck = faCheck;
  faCogs = faCogs;
  faHourglass = faHourglassHalf;
  faExclamation = faExclamationTriangle;
  faTimes = faTimes;

  constructor(private lineService: LineService) {}

  ngOnInit(): void {
    if (!this.lineDetail) {
      return;
    }
    this.lineService
      .getLegsByLineId(this.lineDetail.lineId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((legs) => {
        this.lineLegs = legs;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
