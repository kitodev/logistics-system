import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserSettingsListComponent } from 'src/app/shared/components/user-settings-list/user-settings-list.component';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsService } from 'src/app/shared/system/user-settings.service';
import { TableService } from 'src/app/shared/table/table.service';
import { DataGridFilterType, TableCol } from 'src/app/shared/table/TableCol';
import { StatusesService } from 'src/app/statuses/statuses.service';
import { DATATABLE_SETTINGS } from '../../constants';


export enum ConsignmentsNotificationTableHeaderFields {
  NOTIFICATION = 'notification',
  ERROR_DESCRIPTION = 'errorDescription',
  TIMESTAMP = 'timestamp',
  // LINE_ID = 'lineId'
}

@Component({
  selector: 'app-notification-consignments',
  templateUrl: './notification-consignments.component.html',
  styleUrls: ['./notification-consignments.component.scss']
})
export class NotificationConsignmentsComponent

  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = true;
  totalItems: number;
  consignments: ConsignmentExtendedDto[] = [];

  //notificationConsignments: Observable<Array<NotificationConsignmentDto>>;
  /*notificationConsignmentsDto: NotificationConsignmentDto[] = [];
  notificationStations: Array<NotificationLineStationDto>;*/

  ConsignmentsNotificationTableHeaderFields = ConsignmentsNotificationTableHeaderFields;

  DataGridFilterType = DataGridFilterType;

  faBoxes = faBoxes;
  faRoute = faRoute;
  faDownload = faDownload;

  constructor(
    private statusesService: StatusesService,
    userSettingsService: UserSettingsService,
    private tableService: TableService,
    private csvDownloadService: CsvDownloadService,
  ) {
    super(SettingsSections.STATUS_CONSIGNMENT_NOTIFICATION, userSettingsService);
    //this.notificationConsignments = notificationsComponent:.notificationConsignments;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setupTable();
    /*this.notificationConsignments.subscribe(notificationConsignments => {
      this.notificationConsignmentsDto = notificationConsignments;
    })*/
  }

  private setupTable(): void {
    this.userColOrder = [
      {
        field: ConsignmentsNotificationTableHeaderFields.NOTIFICATION,
        label: 'status.orderId',
        sort: true,
      },
      {
        field: ConsignmentsNotificationTableHeaderFields.ERROR_DESCRIPTION,
        label: 'status.errorDescription',
        sort: true,
      },
      /*{
        field: 'lineId',
        label: 'lines.line',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },*/
      {
        field: ConsignmentsNotificationTableHeaderFields.TIMESTAMP,
        label: 'status.timestamp',
        filterType: DataGridFilterType.NOFILTER,
        sort: true,
      },
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  refresh(state: ClrDatagridStateInterface): void {
    setTimeout(() => {
      this.isLoading = false;
      this.statusesService.
        getFaultyConsignments()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          //this.faultyLineStations = response.content;
          this.isLoading = false;
          //this.totalItems = response.totalItems;
        });
      }, 0);
  }

  /*export(): void {
    const header: string[] = [
      'orderId',
      'errorDescription',
      'timestamp',
    ];

    this.csvDownloadService.export(header, this.NotificationConsignmentsDto, 'notification-consignments.csv');
  }*/

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
