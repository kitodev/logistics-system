import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataGridFilterType, TableCol } from '../../shared/table/TableCol';
import { SettingsSections } from '../../shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { Observable } from 'rxjs';
import { StatusesComponent } from '../statuses.component';
import { TableService } from 'src/app/shared/table/table.service';
import { takeUntil } from 'rxjs/operators';
import { StatusesService } from '../statuses.service';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { DATATABLE_SETTINGS } from '../../constants';

enum FaultyLinesTableHeaderFields {
  CONVEYOR = 'conveyor',
  COUNTRY_PAIR = 'countryPair',
  UP_STATUS = 'upStatus',
  DOWN_STATUS = 'downStatus',
  LINE_ID = 'lineId'
}
@Component({
  selector: 'app-faulty-lines',
  templateUrl: './faulty-lines.component.html',
  styleUrls: ['./faulty-lines.component.scss'],
})
export class FaultyLinesComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = false;

  faultyStations: Observable<Array<FaultyLineStationDto>>;
  totalItems: number;
  faultyLineStations: FaultyLineStationDto[] = [];
  FaultyLinesTableHeaderFields = FaultyLinesTableHeaderFields;
  isActive = true;
  faFilter = faFilter;
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  DataGridFilterType = DataGridFilterType;

  faBoxes = faBoxes;
  faRoute = faRoute;
  faDownload = faDownload;

  constructor(
    private statusesService: StatusesService,
    private csvDownloadService: CsvDownloadService,
    statusesComponent: StatusesComponent,
    userSettingsService: UserSettingsService,
    private tableService: TableService,
  ) {
    super(SettingsSections.STATUS_LINE_ERRORS, userSettingsService);
    this.faultyStations = statusesComponent.faultyStations;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setupTable();
    this.faultyStations.subscribe(faultyStations => {
      this.faultyLineStations = faultyStations;
    });
  }

  private setupTable(): void {
    this.userColOrder = [
      {
        field: FaultyLinesTableHeaderFields.CONVEYOR,
        label: 'lines.conveyorCompany',
        sort: true,
      },
      {
        field: FaultyLinesTableHeaderFields.COUNTRY_PAIR,
        label: 'lines.countryPair',
        sort: true,
      },
      {
        field: FaultyLinesTableHeaderFields.UP_STATUS,
        label: 'consignment.loadingIn.label',
        filterType: DataGridFilterType.DATE,
        sort: true,
      },
      {
        field: FaultyLinesTableHeaderFields.DOWN_STATUS,
        label: 'consignment.loadingOut.label',
        filterType: DataGridFilterType.DATE,
        sort: true,
      },
      /*{
        field: FaultyLinesTableHeaderFields.LINE_ID,
        label: 'lines.line',
        filterType: DataGridFilterType.NOFILTER,
        sort: true,
      },*/
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

  refresh(state: ClrDatagridStateInterface<unknown>): void {
    // TODO: backend is not yet implemented
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

  export(): void {
    const header: string[] = [
      'conveyor',
      'countryCodeFrom',
      'countryCodeTo',
    ];

    this.csvDownloadService.export(header, this.faultyLineStations, 'faulty-lines.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
