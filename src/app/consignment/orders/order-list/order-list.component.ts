import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { faClone, faEdit, faTimes, faTrashAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { UserSettingsListComponent } from 'src/app/shared/components/user-settings-list/user-settings-list.component';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsService } from 'src/app/shared/system/user-settings.service';
import { TableService } from 'src/app/shared/table/table.service';
import { DataGridFilterType } from 'src/app/shared/table/TableCol';
import TestOrders from '../testOrders.json';
import { DATATABLE_SETTINGS } from '../../../constants';

export interface OrderDto { 
  id: string;
  orderId?: string;
  travelMode?: string;
  transportMode?: string;
  tradeType?: string;
  parity?: string;
  orderNumber: string;
  consignorEmployeeId?: string;
  consignorEmployeeTitle?: string;
  consignorEmployeeFirstName?: string;
  consignorEmployeeLastName?: string;
  consignorEmployeeCompanyId?: string;
  consignorEmployeeCompanyName?: string;
  consignments: Array<any>;
  requestDeadline?: string;
}
enum OrderTableHeaderFields {
  ORDER_ID = 'orderID',
  CONSIGNOR = 'consignor',
  TRADE_TYPE = 'tradeType',
  TRAVEL_MODE = 'travelMode',
  TRANSPORT_MODE = 'transportMode',
  PARITY = 'parity',
  PRICE = 'price',

}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent extends UserSettingsListComponent implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = true;
  detailOpened = false;
  orders: OrderDto[];
  selectedOrders = [];
  totalItems: number;
  DataGridFilterType = DataGridFilterType;
  OrderTableHeaderFields = OrderTableHeaderFields;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faClone = faClone;
  faTimes = faTimes;
  faFilter = faFilter;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  constructor(
    private tableService: TableService,
    private router: Router,
    private translationService: TranslocoService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    userSettingsService: UserSettingsService,
    title: Title,
  ) {
    super(SettingsSections.ORDER, userSettingsService);
    this.translationService
      .selectTranslate('header.orders')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
   }

  ngOnInit(): void {
    super.ngOnInit();
    // TODO: using test data. Backend is not yet implemented
    // this.travelModes = this.consignmentFormsService.getTravelModes();
    // this.transportModes = this.consignmentFormsService.getTransportModes();
    // this.parityList = this.consignmentFormsService.getConsignmentParityList();
    this.setUpTable();
  }

  onDetailOpen(order: OrderDto): void {
    this.resetPendingSettings();
    if (!order) {
      this.detailOpened = false;
      return;
    }
    this.detailOpened = true;
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  private setUpTable(): void {
    this.userColOrder = this.userColOrder ?? [
      {
        field: OrderTableHeaderFields.ORDER_ID,
        label: 'orders.orderId',
      },
      {
        field: OrderTableHeaderFields.CONSIGNOR,
        label: 'orders.consignor',
      },
      {
        field: OrderTableHeaderFields.TRADE_TYPE,
        label: 'orders.tradeType',
      },
      {
        field: OrderTableHeaderFields.TRAVEL_MODE,
        label: 'orders.travelMode',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: OrderTableHeaderFields.TRANSPORT_MODE,
        label: 'orders.transportMode',
        filterType: DataGridFilterType.PICKER,
      },
      {
        field: OrderTableHeaderFields.PARITY,
        label: 'orders.parity',
      },
      {
        field: OrderTableHeaderFields.PRICE,
        label: 'orders.price',
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
      state.sort = { by: 'orderId', reverse: null };
    }
    const query: QueryDto = this.tableService.convertStateToQuery(state);

    // TODO: testdata. Backend is not yet implemented
    this.orders = TestOrders;
    this.isLoading = false;
    this.totalItems = this.orders.length;

    // this.orderService
    //   .getOrderss(query)
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe((response) => {
    //     this.orders = response.content;
    //     this.isLoading = false;
    //     this.totalItems = response.totalElements;
    //   });
  }

  edit(orderId: string): void {
    this.router
      .navigateByUrl(`${AppRoutes.ORDER}/${orderId}`)
      .then();
  }

  editSelected() {
    this.modalService.openBulkEditModal(this.vcr, this.selectedOrders, 'order');
  }

  delete(orderId: string): void {
    // this.modalService
    //   .openConfirmationModal(this.vcr, ModalType.DELETE, 'order')
    //   .pipe(filter((response) => response))
    //   .subscribe(() => {
    //     this.orderService
    //       .deleteOrder(orderId)
    //       .pipe(
    //         this.toastService.observe({
    //           loading: this.translationService.translate('messages.saving'),
    //           success: this.translationService.translate('messages.success', {
    //             item: this.translationService.translate('messages.delete'),
    //           }),
    //           error: this.translationService.translate('messages.saveError'),
    //         }),
    //         takeUntil(this.unsubscribe)
    //       )
    //       .subscribe(
    //         () => {
    //           this.refresh({});
    //         },
    //         (error: HttpErrorResponse) => {
    //           this.errors = error;
    //         }
    //       );
    //   });
  }


}
