import { AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit, } from '@angular/core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faRoad } from '@fortawesome/free-solid-svg-icons/faRoad';
import { DataGridFilterType, TableCol } from '../shared/table/TableCol';
import { share, takeUntil } from 'rxjs/operators';
import { UserSettingsService } from '../shared/system/user-settings.service';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { NotificationStatus } from './NotificationStatus';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent 
  implements
  OnInit, OnDestroy, AfterViewInit {
  isLoading = true;

  private unsubscribe: Subject<void> = new Subject<void>();

  tableCols: Array<TableCol<string>>;
  notificationOffer = 2;
  statuses: Array<NotificationStatus> = [];
  //notifications: Array<Notifications> = [];
  //faultyConsignments: Observable<Array<FaultyConsignmentDto>>;
  //faultyStations: Observable<Array<FaultyLineStationDto>>;
  totalItems = 0;

  DataGridFilterType = DataGridFilterType;
  faBox = faBoxOpen;
  faRoad = faRoad;
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  
  constructor(
    //private notificationsService: NotificationsService,
    private cd: ChangeDetectorRef,
    userSettingsService: UserSettingsService,
    translationService: TranslocoService,
    title: Title
  ) {
    translationService
      .selectTranslate('header.notifications')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.isLoading = true;

  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
