import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DataGridFilterType, TableCol } from '../shared/table/TableCol';
import { share, takeUntil } from 'rxjs/operators';
import { UserSettingsService } from '../shared/system/user-settings.service';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { ErrorStatus } from './ErrorStatus';
import { StatusesService } from './statuses.service';
import { Observable, Subject } from 'rxjs';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss'],
})
export class StatusesComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = true;
  private unsubscribe: Subject<void> = new Subject<void>();

  tableCols: Array<TableCol<string>>;
  statuses: Array<ErrorStatus> = [];
  faultyConsignments: Observable<Array<FaultyConsignmentDto>>;
  faultyStations: Observable<Array<FaultyLineStationDto>>;
  totalItems = 0;
  DataGridFilterType = DataGridFilterType;
  faBox = faBoxOpen;
  faRoad = faRoad;

  constructor(
    private statusesService: StatusesService,
    private cd: ChangeDetectorRef,
    userSettingsService: UserSettingsService,
    translationService: TranslocoService,
    title: Title
  ) {
    translationService
      .selectTranslate('header.errors')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.faultyConsignments = this.statusesService
      .getFaultyConsignments()
      .pipe(share());

    this.faultyStations = this.statusesService
      .getFaultyLineStations()
      .pipe(share());
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
