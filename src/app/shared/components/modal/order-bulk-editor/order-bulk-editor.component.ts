import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConsignmentFormsService } from 'src/app/consignment/consignment-forms.service';
import { OrderDto } from 'src/app/consignment/orders/order-list/order-list.component';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';

@Component({
  selector: 'app-order-bulk-editor',
  templateUrl: './order-bulk-editor.component.html',
  styleUrls: ['./order-bulk-editor.component.scss']
})
export class OrderBulkEditorComponent implements OnInit, OnDestroy {
  protected unsubscribe = new Subject<void>();
  destroy$: Subject<boolean | string> = new Subject();
  open = true;
  error;
  selectedItems: OrderDto[];
  tradeTypes: FormSelectItem<TradeType>[];
  travelModes: FormSelectItem<TravelMode>[];
  transportModes: FormSelectItem<TransportMode>[];
  parityList: FormSelectItem<Parity>[];
  orderForm: FormGroup;
  selectedTravelMode;
  selectedTransportMode;
  selectedTradeType;
  selectedParity;

  constructor(
    private fb: FormBuilder,
    private consignmentsFormService: ConsignmentFormsService,
    private consignmentService: ConsignmentBEService,
    private toastService: HotToastService,
    private translationService: TranslocoService,
  ) { }

  ngOnInit(): void {
    this.tradeTypes = this.consignmentsFormService.getConsignmentTradeTypes();
    this.travelModes = this.consignmentsFormService.getTravelModes();
    this.transportModes = this.consignmentsFormService.getTransportModes();
    this.parityList = this.consignmentsFormService.getConsignmentParityList();
    this.buildBasicDataForm();
  }

  save(): void {
    this.bulkChange();
    this.updateConsignments();
    this.open = false;
    this.destroy$.next(this.error);
  }

  private updateConsignments() {
    // this.selectedItems.map(async item => {
    //   await this.orderService.updateOrder(item)
    //   .pipe(
    //     this.toastService.observe({
    //       loading: this.translationService.translate('messages.saving'),
    //       success: this.translationService.translate('messages.changesSaved'),
    //       error: this.translationService.translate('messages.saveError'),
    //     }),
    //     takeUntil(this.unsubscribe)
    //   )
    //   .subscribe(
    //     (responseOrder) => {},
    //     (error: HttpErrorResponse) => {
    //       this.error = error;
    //     }
    //   );
    // });
  }

  private bulkChange(): void {
    if (this.selectedParity) {
      this.selectedItems.map(item => item.parity = this.selectedParity.value);
    }
    if (this.selectedTradeType) {
      this.selectedItems.map(item => item.tradeType = this.selectedTradeType.value);
    }
    if (this.selectedTransportMode) {
      this.selectedItems.map(item => item.transportMode = this.selectedTransportMode.value);
    }
    if (this.selectedTravelMode) {
      this.selectedItems.map(item => item.travelMode = this.selectedTravelMode.value);
    }
  }

  private buildBasicDataForm(): void {
    this.orderForm = this.fb.group({
      tradeType: new FormControl(this.tradeTypes),
      travelMode: new FormControl(this.travelModes),
      transportMode: new FormControl(this.transportModes),
      parity: new FormControl(this.parityList),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
