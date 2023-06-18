import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { CustomFilter, TableService } from '../../shared/table/table.service';
import { DataGridFilterType, TableCol } from '../../shared/table/TableCol';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { filter, takeUntil } from 'rxjs/operators';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { ConsignmentFormsService } from '../consignment-forms.service';
import { LineService } from 'src/app/line-management/line.service';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { AuthService } from '../../auth/auth.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons/faTruckMoving';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { ModalInputType } from 'src/app/shared/components/modal/modal.component';
import { DATATABLE_SETTINGS } from '../../constants';

enum ConsignmentTableHeaderFields {
  LOADING_IN_COUNTRY = 'consignmentBasicData.loadingInLocation.premiseAddress.country',
  LOADING_OUT_COUNTRY = 'consignmentBasicData.loadingOutLocation.premiseAddress.country',
  CONSIGNOR = 'consignorEmployeeCompanyName',
  // TRAVEL_MODE = 'consignmentBasicData.travelMode',
  // TRANSPORT_MODE = 'consignmentBasicData.transportMode',
  LOADING_IN_ADDRESS = 'consignmentBasicData.loadingInLocation.premiseAddress',
  LOADING_OUT_ADDRESS = 'consignmentBasicData.loadingOutLocation.premiseAddress',
  ORDER_ID = 'consignmentBasicData.orderId',
  NET_WEIGHT_SUM = 'sumNetWeight',
  NET_CBM_SUM = 'sumNetCbm',
  SUB_ROUTE = 'consignment.subRoute',
  RESPONSIBLE_PERSON = 'responsiblePersonLastName',
  EKAER = 'consignmentBasicData.ekaer',
  LOT_ADR = 'consignmentBasicData.lot.adr',
  LOT_CUSTOMS = 'consignmentBasicData.lot.customs',
  // PARITY = 'consignmentBasicData.parity',
}

@Component({
  selector: 'app-parcel-list',
  templateUrl: './parcel-list.component.html',
  styleUrls: ['./parcel-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'countries', alias: 'countries' },
    },
  ],
})
export class ParcelListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  errors: HttpErrorResponse;

  consignments: ConsignmentExtendedDto[] = [];
  selectedConsignments: ConsignmentExtendedDto[] = [];
  DataGridFilterType = DataGridFilterType;
  totalItems: number;
  consignmentLines: Array<LineDto> = [];
  consignmentComments: Array<CommentDto> = [];
  ownCompanyId: string;
  ConsignmentTableHeaderFields = ConsignmentTableHeaderFields;
  detailOpened = false;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;

  faFilter = faFilter;
  isLoading = true;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  faCheck = faCheck;
  faTruck = faTruckMoving;
  faClone = faClone;
  faDownload = faDownload;

  constructor(
    private consignmentService: ConsignmentBEService,
    private router: Router,
    private tableService: TableService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private lineService: LineService,
    private commentService: CommentService,
    private consignmentFormsService: ConsignmentFormsService,
    userSettingsService: UserSettingsService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    title: Title,
    authService: AuthService
  ) {
    super(SettingsSections.PARCEL, userSettingsService);
    translationService
      .selectTranslate('header.consignments')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));

    this.ownCompanyId = authService.getOwnCompanyId();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setUpTable();
  }

  onDetailOpen(consignment: ConsignmentExtendedDto): void {
    this.resetPendingSettings();
    if (!consignment) {
      this.consignmentComments = [];
      this.consignmentLines = [];
      this.detailOpened = false;
      return;
    }
    this.detailOpened = true;

    consignment.legs.forEach((leg) => {
      this.lineService
        .getLine(leg.lineId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((line) => this.consignmentLines.push(line));
    });

    this.commentService
      .getComments(CommentApis.CONSIGNMENT_ENDPOINT, consignment.consignmentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.consignmentComments = comments));
  }

  private setUpTable(): void {
    this.userColOrder = this.userColOrder ?? [
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_COUNTRY,
        label: 'consignment.departure',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_OUT_COUNTRY,
        label: 'consignment.arrival',
      },
      {
        field: ConsignmentTableHeaderFields.CONSIGNOR,
        label: 'consignment.consignor',
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_IN_ADDRESS,
        label: 'consignment.loadingIn.address',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.LOADING_OUT_ADDRESS,
        label: 'consignment.loadingOut.address',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.ORDER_ID,
        label: 'consignment.orderId',
      },
      {
        field: ConsignmentTableHeaderFields.NET_WEIGHT_SUM,
        label: 'consignment.sumNetWeight',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.NET_CBM_SUM,
        label: 'consignment.sumNetCbm',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.SUB_ROUTE,
        label: 'consignment.legs',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.RESPONSIBLE_PERSON,
        label: 'consignment.responsiblePerson',
      },
      {
        field: ConsignmentTableHeaderFields.EKAER,
        label: 'consignment.ekaer',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.LOT_ADR,
        label: 'consignment.lot.adr',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: ConsignmentTableHeaderFields.LOT_CUSTOMS,
        label: 'consignment.lot.customs',
        filterType: DataGridFilterType.NOFILTER,
      },
    ];

    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  refresh(state: ClrDatagridStateInterface): void {
    this.isLoading = true;
    if (!state.sort) {
      state.sort = { by: 'consignmentId', reverse: null };
    }
    const query: QueryDto = this.tableService.convertStateToQuery(state);

    this.consignmentService
      .findAllExtended(query)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.consignments = response.content;
        this.isLoading = false;
        this.totalItems = response.totalElements;
      });
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  edit(consignmentId: string): void {
    this.router
      .navigateByUrl(`${AppRoutes.CONSIGNMENT}/${AppRoutes.PARCEL}/${consignmentId}`)
      .then();
  }

  editSelected() {
    this.modalService.openBulkEditModal(this.vcr, this.selectedConsignments, 'consignment');
  }

  duplicate(consignment: ConsignmentExtendedDto) {
 
    const newConsignment: Omit<ConsignmentDto, 'id' | 'version'> = {
      consignmentBasicData: consignment.consignmentBasicData,
      consignorEmployeeId: consignment.consignorEmployeeId,
      responsiblePersonEmployeeId: consignment.responsiblePerson,
      transshipmentLocations: consignment.transshipmentLocations,
      legs: consignment.legs
    };

    this.consignmentService
        .createConsignment(newConsignment)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (responseConsignment) => {
            this.router
              .navigateByUrl(`${AppRoutes.CONSIGNMENT}/${AppRoutes.PARCEL}/${responseConsignment.consignmentId}/details`)
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
  }

  del(consignmentId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'consignment')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.consignmentService
          .deleteById(consignmentId)
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

  export(): void {
    const header: string[] = [
      'consignmentBasicData.loadingInLocation.premiseAddress.country',
      'consignmentBasicData.loadingOutLocation.premiseAddress.country',
      'consignorEmployeeCompanyName',
      'consignorEmployeeFirstName',
      'consignorEmployeeLastName',
      'consignorEmployeeTitle',
      'consignmentBasicData.travelMode',
      'consignmentBasicData.transportMode',
      'consignmentBasicData.orderId',
      'consignmentBasicData.sumNetWeight',
      'consignmentBasicData.sumNetCbm',
      'responsiblePersonFirstName',
      'responsiblePersonLastName',
      'responsiblePersonTitle',
      'consignmentBasicData.ekaer',
      'consignmentBasicData.parity',
    ];

    this.csvDownloadService.export(header, this.consignments, 'parcel-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
