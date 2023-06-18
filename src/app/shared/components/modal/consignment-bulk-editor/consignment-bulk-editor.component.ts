import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConsignmentFormsService } from 'src/app/consignment/consignment-forms.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';

@Component({
  selector: 'app-consignment-bulk-editor',
  templateUrl: './consignment-bulk-editor.component.html',
  styleUrls: ['./consignment-bulk-editor.component.scss']
})
export class ConsignmentBulkEditorComponent implements OnInit, OnDestroy {
  protected unsubscribe = new Subject<void>();
  destroy$: Subject<boolean | string> = new Subject();
  open = true;
  error;
  selectedItems: ConsignmentExtendedDto[];
  tradeTypes: FormSelectItem<TradeType>[];
  travelModes: FormSelectItem<TravelMode>[];
  transportModes: FormSelectItem<TransportMode>[];
  parityList: FormSelectItem<Parity>[];
  consignmentForm: FormGroup;
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
    // this.updateConsignments();
    this.open = false;
    this.destroy$.next(this.error);
  }

  // private updateConsignments() {
  //   this.selectedItems.map(async item => {
  //     await this.consignmentService.updateExtendedConsignment(item)
  //     .pipe(
  //       this.toastService.observe({
  //         loading: this.translationService.translate('messages.saving'),
  //         success: this.translationService.translate('messages.changesSaved'),
  //         error: this.translationService.translate('messages.saveError'),
  //       }),
  //       takeUntil(this.unsubscribe)
  //     )
  //     .subscribe(
  //       (responseConsignment) => {},
  //       (error: HttpErrorResponse) => {
  //         this.error = error;
  //       }
  //     );
  //   });
  // }

  private bulkChange(): void {
    if (this.selectedParity) {
      // this.selectedItems.map(item => item.consignmentBasicData.parity = this.selectedParity.value);
    }
    if (this.selectedTradeType) {
      // this.selectedItems.map(item => item.consignmentBasicData.tradeType = this.selectedTradeType.value);
    }
    if (this.selectedTransportMode) {
      // this.selectedItems.map(item => item.consignmentBasicData.transportMode = this.selectedTransportMode.value);
    }
    if (this.selectedTravelMode) {
      // this.selectedItems.map(item => item.consignmentBasicData.travelMode = this.selectedTravelMode.value);
    }
  }

  private buildBasicDataForm(): void {
    const consignmentFormModel: FormModel<Omit<any, 'id' | 'version'>> = {
      tradeType: [this.tradeTypes],
      travelMode: [this.travelModes],
      transportMode: [this.transportModes],
      parity: [this.parityList],
    };

    this.consignmentForm = this.fb.group({
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
