import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faLongArrowAltRight, faTable } from '@fortawesome/free-solid-svg-icons';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { OrderDto } from '../order-list/order-list.component';
import TestOrders from '../testOrders.json';

@Component({
  selector: 'app-order-basic-data',
  templateUrl: './order-basic-data.component.html',
  styleUrls: ['./order-basic-data.component.scss']
})
export class OrderBasicDataComponent implements OnInit, OnDestroy {
  protected unsubscribe = new Subject<void>();
  faRightArrow = faLongArrowAltRight;
  faTable = faTable;
  orderBasicDataForm: FormGroup;
  order: OrderDto;
  tradeTypes: FormSelectItem<TradeType>[];
  travelModes: Array<FormSelectItem<TravelMode>>;
  transportModes: Array<FormSelectItem<TransportMode>>;
  parityList: Array<FormSelectItem<Parity>>;
  selectedTravelMode;
  selectedTransportMode;
  selectedTradeType;
  selectedParity;

  // TODO: change any after the we know the exact type of DTO
  basicDataItems: Array<any>;

  fullPrice;
  error;

  constructor(
    private consignmentFormsService: ConsignmentFormsService,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private translationService: TranslocoService,
  ) { }

  async ngOnInit() {
    this.tradeTypes = await this.consignmentFormsService.getConsignmentTradeTypes();
    this.travelModes = await this.consignmentFormsService.getTravelModes();
    this.transportModes = await this.consignmentFormsService.getTransportModes();
    this.parityList = await this.consignmentFormsService.getConsignmentParityList();

    // TODO: fetch the corresponding order data
    this.order = TestOrders[1];
    this.loadConsignments();
    this.calculateFullPrice();
    this.buildBasicDataForm();
  }

  save(): void {
    this.bulkChange();
    this.updateOrder();
  }

  private async updateOrder(): Promise<any>  {
    // await this.orderService.updateOrder(this.order)
    //   .pipe(
    //     this.toastService.observe({
    //       loading: this.translationService.translate('messages.saving'),
    //       success: this.translationService.translate('messages.changesSaved'),
    //       error: this.translationService.translate('messages.saveError'),
    //     }),
    //     takeUntil(this.unsubscribe)
    //   )
    //   .subscribe(
    //     (responseConsignment) => {},
    //     (error: HttpErrorResponse) => {
    //       this.error = error;
    //     }
    //   );
  }

  private bulkChange(): void {
    if (this.selectedParity) {
      this.order.parity = this.selectedParity.value;
    }
    if (this.selectedTradeType) {
      this.order.tradeType = this.selectedTradeType.value;
    }
    if (this.selectedTransportMode) {
      this.order.transportMode = this.selectedTransportMode.value;
    }
    if (this.selectedTravelMode) {
      this.order.travelMode = this.selectedTravelMode.value;
    }
  }
  private buildBasicDataForm(): void {
    const orderBasicDataFormModel: FormModel<Omit<any, 'id' | 'version'>> = {
      tradeType: [this.order.tradeType],
      travelMode: [this.order.travelMode],
      transportMode: [this.order.transportMode],
      parity: [this.order.parity],
    };

    this.orderBasicDataForm = this.fb.group(orderBasicDataFormModel);
  }

  private calculateFullPrice() {
    // TODO: Backend should do it
    this.fullPrice = this.order.consignments.reduce((sum, consignment) => sum + parseInt(consignment.acceptedOffer.price.split(' ')[1].split('.')[0]), 0);
  }
  private loadConsignments() {
    this.basicDataItems = this.order.consignments;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
