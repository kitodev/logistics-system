import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
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

export enum LinesNotificationTableHeaderFields {
  CONVEYOR = 'conveyor',
  COUNTRY_PAIR = 'countryPair',
  UP_STATUS = 'upStatus',
  DOWN_STATUS = 'downStatus',
  LINE_ID = 'lineId'
}

@Component({
  selector: 'app-notification-lines',
  templateUrl: './notification-lines.component.html',
  styleUrls: ['./notification-lines.component.scss']
})
export class NotificationLinesComponent 
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = true;
  totalItems: number;
  faRoute = faRoute;
  DataGridFilterType = DataGridFilterType;

  LinesNotificationTableHeaderFields = LinesNotificationTableHeaderFields;

  faultyStations: Observable<Array<FaultyLineStationDto>>;
  faultyLineStations: FaultyLineStationDto[] = [];

  constructor(private statusesService: StatusesService,
    userSettingsService: UserSettingsService,
    private tableService: TableService,
    private csvDownloadService: CsvDownloadService,
    ) 
    {
      super(SettingsSections.STATUS_LINE_NOTIFICATION, userSettingsService);
    }
    ngOnInit(): void {
      super.ngOnInit();
      this.setupTable();
    }

    private setupTable(): void {
      this.userColOrder = [
        {
          field: LinesNotificationTableHeaderFields.CONVEYOR,
          label: 'lines.conveyorCompany',
          sort: true,
        },
        {
          field: LinesNotificationTableHeaderFields.COUNTRY_PAIR,
          label: 'lines.countryPair',
          sort: true,
        },
        {
          field: LinesNotificationTableHeaderFields.UP_STATUS,
          label: 'consignment.loadingIn.label',
          //filterType: DataGridFilterType.NOFILTER,
          sort: true,
        },
        {
          field: LinesNotificationTableHeaderFields.DOWN_STATUS,
          label: 'consignment.loadingOut.label',
          //filterType: DataGridFilterType.NOFILTER,
          sort: true,
        },
        {
          field: LinesNotificationTableHeaderFields.LINE_ID,
          label: 'lines.line',
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
        //const query: QueryDto = this.tableService.convertStateToQuery(state);
        this.statusesService.
          getFaultyLineStations()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response) => {
            //this.faultyLineStations = response.content;
            this.isLoading = false;
            //this.totalItems = response.totalItems;
          });
        }, 0);
    }

    ngOnDestroy(): void {
      super.ngOnDestroy();
    }
}
