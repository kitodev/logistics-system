import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { DataGridFilterType } from '../../shared/table/TableCol';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { TableService } from 'src/app/shared/table/table.service';
import { LineService } from '../line.service';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { filter, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { HttpErrorResponse } from '@angular/common/http';
import { VehicleService } from '../../clients/company/vehicle.service';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { CsvDownloadService } from '../../shared/csv-download.service';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { DATATABLE_SETTINGS } from '../../constants';


enum LineTableHeaderFields {
  CONVEYOR_COMPANY = 'conveyor.companyName',
  CONTACT = 'contact.lastName',
  TRANSPORT_MODE = 'transportMode',
  COUNTRY_PAIR = 'countryPair',
  LEGS = 'legs',
  ACTIVE_LICENSE_PLATE = 'activeVehicle.licensePlate',
  ACTIVE_VEHICLE_TYPE = 'activeVehicle.vehicleType',
  TRAILER_LICENSE_PLATE = 'trailer.trailerLicensePlate',
  ACTIVE_FULLWEIGHT = 'activeVehicle.fullWeightType',
  ACTIVE_NETWEIGHT = 'activeVehicle.netWeight.quantity',
  ACTIVE_STRUCTURE_TYPE = 'activeVehicle.superStructureType',
  ACTIVE_CARGO_WIDTH = 'activeVehicle.cargoSpaceWidth',
  ACTIVE_CARGO_LENGTH = 'activeVehicle.cargoSpaceLength',
  ACTIVE_CARGO_HEIGHT = 'activeVehicle.cargoSpaceHeight',
  ACTIVE_CARGO_VOLUME = 'activeVehicle.cargoSpaceVolume',
  ACTIVE_PALLET_COUNT = 'activeVehicle.palletCount',
}

@Component({
  selector: 'app-line-list',
  templateUrl: './line-list.component.html',
  styleUrls: ['./line-list.component.scss'],
})
export class LineListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  faDownload = faDownload;
  faEdit = faEdit;
  faClone = faClone;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faFilter = faFilter;
  errors: HttpErrorResponse;
  lineList: LineContactVehiclesAndDriversDto[] = [];
  travelModes: Array<FormSelectItem<TravelMode>>;
  selectedLines: LineContactVehiclesAndDriversDto[] = [];
  DataGridFilterType = DataGridFilterType;
  isLoading = true;
  totalItems: number;
  vehicleTypes: FormSelectItem<VehicleTypeEnum>[] = [];

  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];
  structureTypes: FormSelectItem<JarmuFelepitmenyEnum>[] = [];
  transportModes: FormSelectItem<TransportMode>[];
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;

  LineTableHeaderFields = LineTableHeaderFields;

  details: {
    comments: Array<CommentDto>;
    vehicles: Array<VehicleDto>;
    consignments: Array<ConsignmentDto>;
  } = {
    comments: [],
    vehicles: [],
    consignments: [],
  };

  constructor(
    private lineService: LineService,
    private vehicleService: VehicleService,
    private tableService: TableService,
    private router: Router,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private commentService: CommentService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService,
    title: Title
  ) {
    super(SettingsSections.LINE, userSettingsService);
    translationService
      .selectTranslate('header.lines')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.vehicleTypes = this.vehicleService.getVehicleTypes();
    this.fullWeightTypes = this.vehicleService.getFullWeightTypes();
    this.structureTypes = this.vehicleService.getStructureTypes();
    this.transportModes = this.lineService.getTransportModes();

    this.setUpTable();
  }

  private setUpTable(): void {
    this.userColOrder = this.userColOrder ?? [
      {
        field: LineTableHeaderFields.CONVEYOR_COMPANY,
        label: 'lines.conveyorCompany',
        sort: true,
      },
      {
        field: LineTableHeaderFields.CONTACT,
        label: 'lines.contactOfConveyor',
        filterType: DataGridFilterType.NOFILTER,
        sort: true,
      },
      {
        field: LineTableHeaderFields.TRANSPORT_MODE,
        label: 'lines.transportMode',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.transportModes,
        sort: true,
      },
      {
        field: LineTableHeaderFields.COUNTRY_PAIR,
        label: 'lines.countryPair',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.LEGS,
        label: 'lines.consignments',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_LICENSE_PLATE,
        label: 'lines.activeVehicle',
        sort: true,
      },
      {
        field: LineTableHeaderFields.ACTIVE_VEHICLE_TYPE,
        label: 'company.vehicle.vehicleType',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.vehicleTypes,
        sort: true,
      },
      {
        field: LineTableHeaderFields.TRAILER_LICENSE_PLATE,
        label: 'lines.trailerPlate',
        sort: true,
      },
      {
        field: LineTableHeaderFields.ACTIVE_FULLWEIGHT,
        label: 'company.vehicle.fullWeight',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.fullWeightTypes,
        sort: true,
      },
      {
        field: LineTableHeaderFields.ACTIVE_NETWEIGHT,
        label: 'company.vehicle.netWeight',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_STRUCTURE_TYPE,
        label: 'company.vehicle.superStructure',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.structureTypes,
        sort: true,
      },
      {
        field: LineTableHeaderFields.ACTIVE_CARGO_WIDTH,
        label: 'company.vehicle.cargoSpaceWidth',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_CARGO_LENGTH,
        label: 'company.vehicle.cargoSpaceLength',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_CARGO_HEIGHT,
        label: 'company.vehicle.cargoSpaceHeight',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_CARGO_VOLUME,
        label: 'company.vehicle.cargoSpaceVolume',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: LineTableHeaderFields.ACTIVE_PALLET_COUNT,
        label: 'company.vehicle.palletCount',
        filterType: DataGridFilterType.NOFILTER,
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
      this.isLoading = true;
      const query: QueryDto = this.tableService.convertStateToQuery(state);

      if (!state.sort) {
        query.sort[0].fieldName = 'lineId';
      }

      this.lineService
        .getLines(query)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.lineList = response.content;
          this.isLoading = false;
          this.totalItems = response.totalElements;
        });
    }, 0);
  }

  edit(lineId: string): void {
    this.router
      .navigateByUrl(`${AppRoutes.LINEMANAGEMENT}/line/${lineId}`)
      .then();
  }

  duplicate(line: LineContactVehiclesAndDriversDto) {
    // TODO: need implementation on backend
    const newLine: Omit<LineDto, 'id' | 'version'> = {
      start: line.start,
      transportMode: line.transportMode,
      conveyorCompanyId: undefined,
      contactOfConveyor: undefined,
      travelMode: undefined,
      arrival: undefined,
      countryPair: undefined,
      vehicleToDriverMappings: undefined,
      activeVehicleId: undefined
    };
    this.lineService
        .createLine(newLine)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (responseLine) => {
            this.router
              .navigateByUrl(`${AppRoutes.LINEMANAGEMENT}/${AppRoutes.LINE}/${responseLine.id}/details`)
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
  }

  delete(lineId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'line')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.lineService
          .deleteLine(lineId)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.saving'),
              success: this.translationService.translate('messages.success', {
                item: this.translationService.translate('messages.delete'),
              }),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(
            () => {
              this.refresh({});
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  onDetailOpen(line: LineContactVehiclesAndDriversDto) {
    this.resetPendingSettings();
    if (!line) {
      return;
    }
    this.commentService
      .getComments(CommentApis.LINE_ENDPOINT, line.lineId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));
  }

  export(): void {
    const header: string[] = [
      LineTableHeaderFields.CONVEYOR_COMPANY,
      'contact.firstName',
      'contact.lastName',
      LineTableHeaderFields.TRANSPORT_MODE,
      'countryPair.from',
      'countryPair.to',
      'legs.length',
      LineTableHeaderFields.ACTIVE_LICENSE_PLATE,
      LineTableHeaderFields.ACTIVE_VEHICLE_TYPE,
      LineTableHeaderFields.TRAILER_LICENSE_PLATE,
      LineTableHeaderFields.ACTIVE_FULLWEIGHT,
      'activeVehicle.netWeight.quantity',
      'activeVehicle.netWeight.unit',
      LineTableHeaderFields.ACTIVE_STRUCTURE_TYPE,
      LineTableHeaderFields.ACTIVE_CARGO_WIDTH,
      LineTableHeaderFields.ACTIVE_CARGO_LENGTH,
      LineTableHeaderFields.ACTIVE_CARGO_HEIGHT,
      LineTableHeaderFields.ACTIVE_CARGO_VOLUME,
      LineTableHeaderFields.ACTIVE_PALLET_COUNT,
    ];

    this.csvDownloadService.export(header, this.lineList, 'lineList.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
