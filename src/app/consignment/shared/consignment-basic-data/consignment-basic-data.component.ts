import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormModel } from '../../../shared/FormModel';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { FormSelectItem } from '../../../shared/form/select/FormSelectItem';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { Subject } from 'rxjs';
import { AddressService } from '../../../shared/form/address/address.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationType } from '../../parcel-details/LocationType';

@Component({
  selector: 'app-consignment-basic-data',
  templateUrl: './consignment-basic-data.component.html',
  styleUrls: ['./consignment-basic-data.component.scss'],
})
export class ConsignmentBasicDataComponent implements OnInit {
  get consignmentBasicData(): ConsignmentBasicDataDto {
    return this._consignmentBasicData;
  }

  @Input()
  set consignmentBasicData(value: ConsignmentBasicDataDto) {
    this._consignmentBasicData = value;
  }

  get parentForm(): FormGroup {
    return this._parentForm;
  }

  @Input()
  set parentForm(value: FormGroup) {
    this._parentForm = value;
    this.buildForm();
  }

  private _consignmentBasicData: ConsignmentBasicDataDto;
  @Input()
  isNew: boolean;
  @Input()
  locationEditable = true;
  @Input()
  lotsEditable = true;
  @Input()
  consignmentBasicDataForm: FormGroup;
  @Input()
  partners: Array<CompanyDto>;
  private _parentForm: FormGroup;
  @Output()
  onPrint: EventEmitter<LotDto> = new EventEmitter<LotDto>();

  tradeTypes: FormSelectItem<TradeType>[];
  travelModes: FormSelectItem<TravelMode>[];
  transportModes: FormSelectItem<TransportMode>[];
  parityList: FormSelectItem<Parity>[];

  LocationType = LocationType;

  isLoading = false;
  errors: HttpErrorResponse;
  unsubscribe: Subject<void> = new Subject<void>();

  faTable = faTable;

  constructor(
    private consignmentsFormService: ConsignmentFormsService,
    private addressService: AddressService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // TODO: data should come from the order
    this.tradeTypes = this.consignmentsFormService.getConsignmentTradeTypes();
    this.travelModes = this.consignmentsFormService.getTravelModes();
    this.transportModes = this.consignmentsFormService.getTransportModes();
    this.parityList = this.consignmentsFormService.getConsignmentParityList();
  }

  private buildForm(): void {
    if (!this.parentForm) {
      return;
    }
    const consignmentBasicDataFormModel: FormModel<
      Omit<
        ConsignmentBasicDataDto,
        'lots' | 'loadingInLocation' | 'loadingOutLocation'
      >
    > = {
      ekaer: [this.consignmentBasicData?.ekaer, Validators.required],
      // tradeType: [this.consignmentBasicData?.tradeType, Validators.required],
      orderId: [this.consignmentBasicData?.orderId],
      // travelMode: [this.consignmentBasicData?.travelMode],
      // transportMode: [this.consignmentBasicData?.transportMode],
      // parity: [this.consignmentBasicData?.parity],
    };
    this.consignmentBasicDataForm = this.fb.group(
      consignmentBasicDataFormModel
    );
    if (this.parentForm instanceof FormArray) {
      this.parentForm.push(this.consignmentBasicDataForm);
    } else {
      const control = this.parentForm.get('consignmentBasicData');
      if (control) {
        // control.patchValue(this.consignmentBasicData);
        return;
      }
      this.parentForm.addControl(
        'consignmentBasicData',
        this.consignmentBasicDataForm
      );
    }
  }

  print(lot: LotDto) {
    this.onPrint.emit(lot);
  }
}
