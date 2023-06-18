import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { StatusService } from './status.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-consignment-location-status',
  templateUrl: './consignment-location-status.component.html',
  styleUrls: ['./consignment-location-status.component.scss'],
})
export class ConsignmentLocationStatusComponent implements OnInit, OnDestroy {
  @Input()
  status: StationOverrideStatus | ConsignmentStatusGetDto;

  @Input()
  consignmentId?: string;

  @Input()
  direction?: StatusDirection;

  @Input()
  lineId: string;

  @Input()
  premiseId: string;

  @Input()
  isLeft?: boolean;

  @Output() statusChanged = new EventEmitter<string>();

  newStatus: OverallStatus;
  description: string;

  statusHistory: StationStatusGetDto[] | ConsignmentStatusGetDto[];

  StatusTypes = OverallStatus;

  faCheck = faCheck;
  faCogs = faCogs;
  faHourglass = faHourglassHalf;
  faExclamation = faExclamationTriangle;
  faTimes = faTimes;
  menuIsOpen = false;
  historyIsOpen = false;

  private unsubscribe = new Subject<void>();

  constructor(private statusService: StatusService) {}

  ngOnInit(): void {
    this.resetNewStatus();
  }

  selectStatus(statusType: OverallStatus) {
    this.newStatus = statusType;
  }

  loadStatusHistory() {
    this.historyIsOpen = !this.historyIsOpen;

    if (this.historyIsOpen) {
      if (this.direction) {
        this.statusService
        .getStationStatusHistory(this.lineId, this.premiseId, this.direction)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.statusHistory = response;
        });
      } else {
        this.statusService
        .getConsignmentStatusHistory(this.consignmentId, this.lineId, this.premiseId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.statusHistory = response;
        });
      }
    }
  }

  cancel() {
    this.resetNewStatus();
    this.historyIsOpen = false;
  }

  save() {
    if (this.direction) {
      const newS: StationStatusOverrideDto = {
        direction: this.direction,
        errorDescription: this.description,
        overallStatus: this.newStatus,
      };
      this.statusService
      .overrideStationStatus(this.lineId, this.premiseId, newS)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.statusChanged.emit(response);
        this.resetNewStatus();
      },
      (error: HttpErrorResponse) => {
      });

    } else {
      const newS: ConsignmentStatusOverrideDto = {
        overallStatus: this.newStatus,
        timestamp: '',
        errorDescription: this.description,
      };

      this.statusService
      .overrideConsignmentStatus(this.lineId, this.premiseId, this.consignmentId, newS)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.statusChanged.emit(response);
        this.resetNewStatus();
      },
      (error: HttpErrorResponse) => {
      });
    }
  }

  spacePress(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.description += ' ';
  }

  private resetNewStatus(): void {
    this.newStatus = undefined;
    // this.errorStatus = undefined;
    this.description = '';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
