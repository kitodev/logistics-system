import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataGridFilterType } from '../../../shared/table/TableCol';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { filter, takeUntil } from 'rxjs/operators';
import { TableService } from 'src/app/shared/table/table.service';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';
import { VehicleService } from '../vehicle.service';
import { UserSettingsService } from '../../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Role } from 'src/app/auth/Role';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';

enum VehicleTableHeaderFields {
  LICENSE_PLATE = 'licensePlate', 
  TYPE = 'vehicleType',
  FULL_WEIGHT_TYPE = 'fullWeightType',
  NET_WEIGHT_TYPE = 'netWeightType.quantity',
  STRUCTURE_TYPE = 'superStructureType',
  CARGO_WIDTH = 'cargoSpaceWidth',
  CARGO_HEIGHT = 'cargoSpaceHeight',
  CARGO_LENGTH = 'cargoSpaceLength',
  CARGO_VOLUME = 'cargoSpaceVolume',
  PALLET = 'palletCount',
  PROPERTIES = 'vehicleProperties',
}

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  errors: HttpErrorResponse;

  vehicles: VehicleDto[] = [];
  selectedVehicles: VehicleDto[] = [];
  companyId: string;
  totalItems: number;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  isLoading = true;
  DataGridFilterType = DataGridFilterType;
  Role = Role;
  VehicleTableHeaderFields = VehicleTableHeaderFields;
  faFilter = faFilter;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faDownload = faDownload;

  vehicleTypes: FormSelectItem<VehicleTypeEnum>[] = [];
  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];
  structureTypes: FormSelectItem<JarmuFelepitmenyEnum>[] = [];

  details: {
    comments: Array<CommentDto>;
  } = {
    comments: [],
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private commentService: CommentService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService
  ) {
    super(SettingsSections.VEHICLE, userSettingsService);

    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params.get('id') == 'new') {
          this.router.navigate(['/', AppRoutes.COMPANY, 'new']).then();
        } else {
          this.companyId = params.get('id');
        }
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.vehicleTypes = this.vehicleService.getVehicleTypes();
    this.fullWeightTypes = this.vehicleService.getFullWeightTypes();
    this.structureTypes = this.vehicleService.getStructureTypes();

    this.setUpTable();
  }

  private setUpTable(): void {
    this.userColOrder = this.userColOrder ?? [
      { field: VehicleTableHeaderFields.LICENSE_PLATE, label: 'company.vehicle.licensePlate' },
      {
        field: VehicleTableHeaderFields.TYPE,
        label: 'company.vehicle.vehicleType',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.vehicleTypes,
        operation: DbFilterOperation.HAS_ATTRIBUTE,
      },
      {
        field: VehicleTableHeaderFields.FULL_WEIGHT_TYPE,
        label: 'company.vehicle.fullWeight',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.fullWeightTypes,
      },
      {
        field: VehicleTableHeaderFields.NET_WEIGHT_TYPE,
        label: 'company.vehicle.netWeight',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.STRUCTURE_TYPE,
        label: 'company.vehicle.superStructure',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.structureTypes,
      },
      {
        field: VehicleTableHeaderFields.CARGO_WIDTH,
        label: 'company.vehicle.cargoSpaceWidth',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.CARGO_HEIGHT,
        label: 'company.vehicle.cargoSpaceHeight',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.CARGO_LENGTH,
        label: 'company.vehicle.cargoSpaceLength',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.CARGO_VOLUME,
        label: 'company.vehicle.cargoSpaceVolume',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.PALLET,
        label: 'company.vehicle.palletCount',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: VehicleTableHeaderFields.PROPERTIES,
        label: 'company.vehicle.vehicleProperties',
        filterType: DataGridFilterType.NOFILTER,
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
      const query: QueryDto = this.tableService.convertStateToQuery(state);

      this.vehicleService
        .getVehicles(this.companyId, query)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.isLoading = false;
          this.vehicles = response.content;
          this.totalItems = response.totalElements;
        });
    }, 0);
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  edit(vehicleId: string): void {
    this.router
      .navigateByUrl(
        `${AppRoutes.COMPANY}/${this.companyId}/${AppRoutes.VEHICLES}/${vehicleId}`
      )
      .then();
  }

  delete(vehicleId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'vehicle')
      .pipe(filter((response) => !!response))
      .subscribe(() => {
        this.isLoading = true;
        this.vehicleService
          .deleteVehicle(this.companyId, vehicleId)
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

  onDetailOpen(vehicle: VehicleDto): void {
    this.resetPendingSettings();
    if (!vehicle) {
      return;
    }
    this.commentService
      .getComments(CommentApis.EMPLOYEE_ENDPOINT, vehicle.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));
  }

  export(): void {
    const header: string[] = [
      'licensePlate',
      'vehicleType',
      'fullWeightType',
      'netWeight.quantity',
      'netWeight.unit',
      'superStructureType',
      'cargoSpaceWidth',
      'cargoSpaceHeight',
      'cargoSpaceLength',
      'cargoSpaceVolume',
      'palletCount',
    ];

    this.csvDownloadService.export(header, this.vehicles, 'vehicle-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
