import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CustomFilter, TableService } from 'src/app/shared/table/table.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { DataGridFilterType, TableCol } from '../../shared/table/TableCol';
import { AppRoutes } from '../../shared/system/AppRoutes';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ModalService,
  ModalType,
} from '../../shared/components/modal/modal.service';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { FormSelectItem } from '../../shared/form/select/FormSelectItem';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { faDownload, faRoute } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { DATATABLE_SETTINGS } from '../../constants';

enum OfferNotificationTableHeaderFields {
  REQUESTER = 'requester',
  REQUESTER_DEADLINE = 'requestDeadline',
  CONSIGNMENT = 'consignments',
  LAST_UPDATED = 'lastUpdated',
  CREATED_AT = 'createdAt',
}

@Component({
  selector: 'app-notification-offers',
  templateUrl: './notification-offers.component.html',
  styleUrls: ['./notification-offers.component.scss']
})
export class NotificationOffersComponent 
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  loading = true;
  errors: HttpErrorResponse;
  
  faClone = faClone;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faRoute = faRoute;
  faDownload = faDownload;
  offers: Array<OfferRequestByRequesterDto> = [];
  selectedOffers: Array<OfferRequestByRequesterDto> = [];
  receiversLookup: { [key: string]: EmployeeForOfferManagementDto } = {};
  totalItems: number;
  OfferNotificationTableHeaderFields = OfferNotificationTableHeaderFields;
  private readonly transportModes: FormSelectItem<TransportMode>[] = [];

  private readonly statusFilterOptions: FormSelectItem<OfferStatus>[] = [];

  DataGridFilterType = DataGridFilterType;
  faCheck = faCheck;

  constructor(
    private tableService: TableService,
    private offerService: OfferService,
    private route: ActivatedRoute,
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
        field: OfferNotificationTableHeaderFields.REQUESTER,
        label: 'offer.offersNum',
        filterType: DataGridFilterType.NOFILTER,
      },
      /*{
        field: OfferNotificationTableHeaderFields.CONSIGNMENT,
        label: 'offer.consignments',
        filter: new CustomFilter(),
        filterOptions: this.transportModes,
        filterType: DataGridFilterType.PICKER,
        //filterType: DataGridFilterType.NOFILTER,
      },*/
      {
        field: OfferNotificationTableHeaderFields.LAST_UPDATED,
        label: 'offer.lastUpdated',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OfferNotificationTableHeaderFields.CREATED_AT,
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

  /*delete(offerId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'offer')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.offerService
          .deleteOffer(offerId)
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
  }*/

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
