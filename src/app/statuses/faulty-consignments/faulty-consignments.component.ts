import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataGridFilterType, TableCol } from '../../shared/table/TableCol';

import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { SettingsSections } from '../../shared/system/local-storage.service';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { StatusesComponent } from '../statuses.component';
import { Observable } from 'rxjs';
import { StatusesService } from '../statuses.service';
import { takeUntil } from 'rxjs/operators';
import { TableService } from 'src/app/shared/table/table.service';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { DATATABLE_SETTINGS } from '../../constants';

enum FaultyConsignmentsTableHeaderFields {
  STATUS = 'status',
  ERROR_DESCRIPTION = 'errorDescription',
  TIMESTAMP = 'timestamp',
  LINE_ID = 'lineId'
}

@Component({
  selector: 'app-faulty-consignments',
  templateUrl: './faulty-consignments.component.html',
  styleUrls: ['./faulty-consignments.component.scss'],
})
export class FaultyConsignmentsComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = false;

  faultyConsignments: Observable<Array<FaultyConsignmentDto>>;
  faultyConsignmentsDto: FaultyConsignmentDto[] = [];
  faultyStations: Array<FaultyLineStationDto>;
  faFilter = faFilter;

  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  FaultyConsignmentsTableHeaderFields = FaultyConsignmentsTableHeaderFields;

  DataGridFilterType = DataGridFilterType;

  faBoxes = faBoxes;
  faRoute = faRoute;
  faDownload = faDownload;

  constructor(
    private statusesService: StatusesService,
    userSettingsService: UserSettingsService,
    private tableService: TableService,
    private csvDownloadService: CsvDownloadService,
    public statusesComponent: StatusesComponent
  ) {
    super(SettingsSections.STATUS_CONSIGNMENT_ERRORS, userSettingsService);
    this.faultyConsignments = statusesComponent.faultyConsignments;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setupTable();
    this.faultyConsignments.subscribe(faultyConsignments => {
      this.faultyConsignmentsDto = faultyConsignments;
    })
  }

  private setupTable(): void {
    this.userColOrder = [
      {
        field: FaultyConsignmentsTableHeaderFields.STATUS,
        label: 'status.orderId',
        sort: true,
      },
      {
        field: FaultyConsignmentsTableHeaderFields.ERROR_DESCRIPTION,
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
        field: FaultyConsignmentsTableHeaderFields.TIMESTAMP,
        label: 'status.timestamp',
        filterType: DataGridFilterType.DATE,
        sort: true,
      },
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }
  
  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  refresh(state: ClrDatagridStateInterface): void {
    setTimeout(() => {
    this.isLoading = false;
    //const query: QueryDto = this.tableService.convertStateToQuery(state);
    this.statusesService.
      getFaultyConsignments()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        //this.faultyStations = response.content;
        this.isLoading = false;
      //this.totalItems = response.totalItems;
      });
    }, 0);
  }

  export(): void {
    const header: string[] = [
      'orderId',
      'errorDescription',
      'timestamp',
    ];

    this.csvDownloadService.export(header, this.faultyConsignmentsDto, 'faulty-consignments.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
