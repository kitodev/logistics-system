import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { TableService, CustomFilter } from '../../../shared/table/table.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';

import { HttpErrorResponse } from '@angular/common/http';
import { DataGridFilterType, TableCol } from '../../../shared/table/TableCol';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { UserSettingsService } from '../../../shared/system/user-settings.service';
import { Currencies } from '../../../shared/finance/Currencies';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { HotToastService } from '@ngneat/hot-toast';
import { Role } from 'src/app/auth/Role';
import { AppRoutes } from '../../../shared/system/AppRoutes';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';

export interface Bid {
  consignmentId: string;
  amount: number;
  currency: string;
  expiration: string;
}

enum OffersIncomingTableHeaderFields {
  OFFER_STATUS = 'offerStatus',
  REQUESTER_EMPLOYER_FIRST_NAME = 'requesterEmployee.firstName',
  REQUESTER_EMPLOYER_COMPANY_NAME = 'requesterEmployee.companyName',
  REQUESTER_DEADLINE = 'requestDeadline',
  CONSIGNMENT_REQUESTER = 'consignmentRequests',
  GIVEN_OFFER_STATUS = 'myGivenOffers.status',
  LAST_UPDATE_STATUS = 'lastUpdated',
  CREATED_AT = 'createdAt',
}
@Component({
  selector: 'app-offers-incoming-list',
  templateUrl: './offers-incoming-list.component.html',
  styleUrls: ['./offers-incoming-list.component.scss'],
})
export class OffersIncomingListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  loading = true;
  errors: HttpErrorResponse;

  DataGridFilterType = DataGridFilterType;

  offers: Array<OfferFindGivenOfferDto> = [];
  offersList: Array<OfferFindGivenOfferDto> = [];
  myBids: { [consignmentId: string]: Array<MyGivenOfferDto> } = {};
  latestBids: { [consignmentId: string]: MyGivenOfferDto } = {};

  totalItems: number;
  newBids: Array<Bid> = [];

  min = new Date();
  Currencies = Object.values(Currencies);
  GivenOfferStatus = GivenOfferStatus;
  OfferStatus = OfferStatus;
  Role = Role;
  givenOfferStatuses: FormSelectItem<GivenOfferStatus>[] = [];
  offerStatuses: FormSelectItem<OfferStatus>[] = [];
  transportModes: FormSelectItem<TransportMode>[];
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  OffersIncomingTableHeaderFields = OffersIncomingTableHeaderFields;
  
  faEdit = faEdit;
  faFilter = faFilter;
  faTrashAlt = faTrashAlt;
  faHourglass = faHourglassHalf;
  faCheck = faCheck;
  faTimes = faTimes;
  faDownload = faDownload;
  detailState: OfferFindGivenOfferDto;

  constructor(
    private tableService: TableService,
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    userSettingsService: UserSettingsService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    title: Title
  ) {
    super(SettingsSections.OFFER_REC, userSettingsService);
    this.translationService
      .selectTranslate('offer.offers')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.givenOfferStatuses = Object.keys(GivenOfferStatus).map((key) => ({
      value: GivenOfferStatus[key],
      label: this.translationService.translate(
        'offer.givenOfferStatus.' + GivenOfferStatus[key]
      ),
    }));

    this.offerStatuses = Object.keys(OfferStatus)
      .filter((sta) => sta !== OfferStatus.DRAFT)
      .map((key) => ({
        value: OfferStatus[key],
        label: this.translationService.translate(
          'offer.given-status.' + OfferStatus[key]
        ),
      }));

      this.transportModes = Object.keys(TransportMode).map((key) => ({
        value: TransportMode[key],
        label: this.translationService.translate(
          'offer.consignment.' + TransportMode[key]
        ),
      }));

    this.setupTable();
  }

  private setupTable(): void {
    this.userColOrder = [
      {
        field: OffersIncomingTableHeaderFields.OFFER_STATUS,
        label: 'offer.status.status',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.offerStatuses,
      },
      {
        field: OffersIncomingTableHeaderFields.REQUESTER_EMPLOYER_FIRST_NAME,
        label: 'offer.requester',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersIncomingTableHeaderFields.REQUESTER_EMPLOYER_COMPANY_NAME,
        label: 'offer.partner',
      },
      {
        field: OffersIncomingTableHeaderFields.REQUESTER_DEADLINE,
        label: 'offer.requestDeadline',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersIncomingTableHeaderFields.CONSIGNMENT_REQUESTER,
        label: 'offer.consignments',
        filterType: DataGridFilterType.PICKER,
        filter: new CustomFilter(),
        filterOptions: this.transportModes,
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersIncomingTableHeaderFields.GIVEN_OFFER_STATUS,
        label: 'offer.offers',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.givenOfferStatuses,
        operation: DbFilterOperation.HAS_ATTRIBUTE,
      },
      {
        field: OffersIncomingTableHeaderFields.LAST_UPDATE_STATUS,
        label: 'offer.lastUpdated',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OffersIncomingTableHeaderFields.CREATED_AT,
        label: 'offer.createdAt',
        //filterType: DataGridFilterType.NOFILTER,
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
      this.loading = true;
      const query = this.tableService.convertStateToQuery(state);
      this.loadReceivedOffers(query);
    }, 0);
  }

  loadReceivedOffers(query: QueryDto): void {
    this.offerService
      .findGivenOffer(query)
      .subscribe((offerResponse) => {
        this.loading = false;

        this.offers = offerResponse.content;
        this.myBids = {};
        offerResponse.content.forEach((request) => {
          request.myGivenOffers.forEach((bid) => {
            if (!this.myBids[bid.consignmentId]) {
              this.myBids[bid.consignmentId] = [];
            }
            this.myBids[bid.consignmentId].push(bid);
            if (
              bid.status === GivenOfferStatus.GIVEN ||
              bid.status === GivenOfferStatus.ACCEPTED
            ) {
              this.latestBids[bid.consignmentId] = bid;
            }
          });
          request.consignmentRequests.forEach((consignment) => {
            if (!this.myBids[consignment.id.rawId]) {
              this.myBids[consignment.id.rawId] = [];
            }
            if (!this.latestBids[consignment.id.rawId]) {
              //TODO: choose correctly the latest given offer when date information is available
              this.latestBids[consignment.id.rawId] = this.myBids[
                consignment.id.rawId
              ]
                ? this.myBids[consignment.id.rawId][0]
                : undefined;
            }
          });
        });
        this.totalItems = offerResponse.totalElements;
        this.route.params
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((params) => {
            if (params['id']) {
              this.detailState = this.offers.find(
                (offer) => offer.offerRequestId === params['id']
              );
            }
          });
      });
  }
  
  onDetailOpen(offer: OfferFindGivenOfferDto): void {
    this.resetPendingSettings();
    if (offer) {
      this.newBids = offer.consignmentRequests.map((consignment) => {
        return {
          amount: undefined,
          consignmentId: consignment.id.rawId,
          currency: 'HUF',
          expiration: undefined,
        };
      });
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  bid(offerRequestId: string, bid: Bid) {
    this.offerService
      .give(offerRequestId, {
        expirationDate: bid.expiration,
        consignmentId: bid.consignmentId,
        price: bid.currency + ' ' + bid.amount,
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        const query = this.tableService.convertStateToQuery({});
        this.loadReceivedOffers(query);
      });
  }

  reject(offerRequestId: string, consignmentId: string): void {
    this.modalService
      .openConfirmationModal(
        this.vcr,
        ModalType.GENERAL,
        'modal.offerRejectSure',
        'modal.offerRejectTitle'
      )
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.offerService
          .reject(offerRequestId, consignmentId)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.inProgress'),
              success: this.translationService.translate(
                'messages.successfulOperation'
              ),
              error: this.translationService.translate(
                'messages.operationFailed'
              ),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(() => {
            const query = this.tableService.convertStateToQuery({});
            this.loadReceivedOffers(query);
          });
      });
  }

  forward(offerRequestId: string) {
    this.modalService
      .openConfirmationModal(
        this.vcr,
        ModalType.GENERAL,
        'modal.offerForwardSure',
        'modal.offerForwardTitle'
      )
      .pipe(
        filter((response) => response),
        mergeMap(() => this.offerService.copy(offerRequestId))
      )
      .subscribe((offerRequest) => {
        this.router
          .navigate([
            '/',
            AppRoutes.OFFER,
            'offer-outgoing',
            offerRequest.offerRequestId,
          ])
          .then();
      });
  }

  export(): void {
    const header: string[] = [
      'offerStatus',
      'requesterEmployee.firstName',
      'requesterEmployee.lastName',
      'requesterEmployee.title',
      'requesterEmployee.companyName',
      'requestDeadline',
      // 'consignmentRequests',
      // 'givenOfferStatus',
      'lastUpdated',
      'createdAt',
    ];

    this.csvDownloadService.export(header, this.offers, 'offers-incoming-list.csv');
  }
}
