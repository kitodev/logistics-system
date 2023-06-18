import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { CustomFilter, TableService } from 'src/app/shared/table/table.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { DataGridFilterType, TableCol } from '../../../shared/table/TableCol';
import { AppRoutes } from '../../../shared/system/AppRoutes';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';

import { filter, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { FormSelectItem } from '../../../shared/form/select/FormSelectItem';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { UserSettingsService } from '../../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { ClrDatagridColumn } from '@clr/angular';
import { DATATABLE_SETTINGS } from '../../../constants';

enum OffersRequestsTableHeaderFields {
  OFFER_STATUS = 'offerStatus',
  ROUTE = 'route',
  REQUESTER = 'requester',
  RECEIVER_EMPLOYEEIDS = 'receiverEmployeeIds',
  REQUESTER_DEADLINE = 'requestDeadline',
  CONSIGNMENT = 'consignments',
  LAST_UPDATED = 'lastUpdated',
  CREATED_AT = 'createdAt',
}

@Component({
  selector: 'app-offers',
  templateUrl: './offer-requests-list.component.html',
  styleUrls: ['./offer-requests-list.component.scss'],
})
export class OfferRequestsListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  loading = true;
  errors: HttpErrorResponse;
  
  faFilter = faFilter;
  faClone = faClone;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faDownload = faDownload;
  offers: Array<OfferRequestByRequesterDto> = [];
  selectedOffers: Array<OfferRequestByRequesterDto> = [];
  receiversLookup: { [key: string]: EmployeeForOfferManagementDto } = {};
  totalItems: number;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  OffersRequestsTableHeaderFields = OffersRequestsTableHeaderFields;

  private readonly transportModes: FormSelectItem<TransportMode>[] = [];

  private readonly statusFilterOptions: FormSelectItem<OfferStatus>[] = [];

  DataGridFilterType = DataGridFilterType;
  faCheck = faCheck;

  constructor(
    private tableService: TableService,
    private offerService: OfferService,
    private router: Router,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private toastService: HotToastService,
    private translationService: TranslocoService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService,
    title: Title
  ) {
    super(SettingsSections.OFFER_REQ, userSettingsService);

    this.translationService
      .selectTranslate('offer.offers')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));

    this.statusFilterOptions = Object.keys(OfferStatus).map((key) => ({
      value: OfferStatus[key],
      label: this.translationService.translate(
        'offer.status.' + OfferStatus[key]
      ),
    }));

    this.transportModes = Object.keys(TransportMode).map((key) => ({
      value: TransportMode[key],
      label: this.translationService.translate(
        'offer.consignment.' + TransportMode[key]
      ),
    }));
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  refresh(state: unknown): void {
    this.loading = true;
    const query = this.tableService.convertStateToQuery(state);
    query.sort = [
      { fieldName: 'lastUpdated', direction: SortDtoDirection.DESC },
    ];
    this.loadOfferRequests(query);
  }

  loadOfferRequests(query: QueryDto): void {
    this.offerService
      .findMyOfferRequests(query)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((offerResponse) => {
        this.loading = false;
        offerResponse.content.forEach((offer) => {
          offer.receiverEmployees.forEach((employee) => {
            this.receiversLookup[employee.employeeId] = employee;
          });
        });
        this.offers = offerResponse.content;
        this.totalItems = offerResponse.totalElements;
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setupTable();
  }

  private setupTable(): void {
    this.userColOrder = [
      {
        field: OffersRequestsTableHeaderFields.OFFER_STATUS,
        label: 'offer.status.status',
        //filterType: DataGridFilterType.NOFILTER,
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.statusFilterOptions,
      },
      {
        field: OffersRequestsTableHeaderFields.ROUTE,
        label: 'offer.route',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.REQUESTER,
        label: 'offer.offersNum',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.RECEIVER_EMPLOYEEIDS,
        label: 'offer.addressee',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.REQUESTER_DEADLINE,
        label: 'offer.requestDeadline',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.CONSIGNMENT,
        label: 'offer.consignments',
        filter: new CustomFilter(),
        filterOptions: this.transportModes,
        filterType: DataGridFilterType.PICKER,
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.LAST_UPDATED,
        label: 'offer.lastUpdated',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersRequestsTableHeaderFields.CREATED_AT,
        label: 'offer.createdAt',
        //filterType: DataGridFilterType.NOFILTER,
      },
    ];

    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  toOfferRequest(offerId: string): void {
    this.router
      .navigateByUrl(`${AppRoutes.OFFER}/offer-outgoing/${offerId}`)
      .then();
  }

  duplicate(offer: OfferRequestByRequesterDto) {
 
    const newOffer: Omit<OfferRequestDraftDto, 'id' | 'version'> = {
      consignmentRequests: offer.consignments,
      offerRequestId: offer.offerRequestId,
    };
    /*this.offerService
        .createOffer(newOffer)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (responseOffer) => {
            this.router
              .navigateByUrl(`${AppRoutes.OFFER}/offer-outgoing/${responseOffer.offerRequestId}/draft`)
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );*/
  }

  delete(offerId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'offer')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.offerService
          .deleteGivenOfferById(offerId)
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
      'offerStatus',
      // 'route',
      // 'offerBidCount',
      // 'receiverEmployees',
      'requestDeadline',
      // 'consignments',
      'lastUpdated',
      'createdAt',
    ];

    this.csvDownloadService.export(header, this.offers, 'offer-request-list.csv');
  }

  onDetailOpen(offer: OfferRequestByRequesterDto): void {
    super.resetPendingSettings();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
