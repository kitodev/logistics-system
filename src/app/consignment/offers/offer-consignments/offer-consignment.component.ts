import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddressService } from '../../../shared/form/address/address.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import { faSave } from '@fortawesome/free-regular-svg-icons/faSave';
import { FormSelectItem } from '../../../shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { OfferRequestDataService } from '../offer-request-data.service';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';
import { CompanyService } from '../../../clients/company.service';
import { ClrAccordionPanel } from '@clr/angular';
import { HttpErrorResponse } from '@angular/common/http';

interface BasicDataItem {
  basicData: ConsignmentBasicDataDto;
  form: FormGroup;
}

@Component({
  selector: 'app-offer-consignment',
  templateUrl: './offer-consignment.component.html',
  styleUrls: ['./offer-consignment.component.scss'],
})
export class OfferConsignmentComponent implements OnInit, OnDestroy {
  @ViewChild('newPanel')
  newPanel: ClrAccordionPanel;

  errors: HttpErrorResponse;
  offer: OfferManagementByRequesterDto;

  basicDataItems: Array<BasicDataItem>;
  newOfferBasicDataForm: FormGroup;

  newConsignmentBasicData = ConsignmentFormsService.createEmptyConsignmentBasicDto();
  tradeTypes: FormSelectItem<TradeType>[];
  transportModes: FormSelectItem<TransportMode>[];

  parityList: FormSelectItem<Parity>[];
  isDirty = false;
  consignmentRequestsForm: FormArray;
  OfferStatus = OfferStatus;
  newOpen = true;
  partners: Array<CompanyDto>;

  unsubscribe: Subject<void> = new Subject<void>();

  faPlus = faPlus;
  faRightArrow = faLongArrowAltRight;
  faSave = faSave;

  constructor(
    private fb: FormBuilder,
    private translationService: TranslocoService,
    private offerService: OfferService,
    private companyService: CompanyService,
    private addressService: AddressService,
    private offerRequestDataService: OfferRequestDataService,
    private consignmentFormsService: ConsignmentFormsService
  ) {
    this.offerRequestDataService.offerRequestObservable
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.offer = value;
        this.isDirty = false;
        this.buildForm();
      });
  }

  ngOnInit(): void {
    this.tradeTypes = this.consignmentFormsService.getConsignmentTradeTypes();
    this.transportModes = this.consignmentFormsService.getTransportModes();
    this.parityList = this.consignmentFormsService.getConsignmentParityList();
    this.companyService
      .getProcessedPartners()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((partners) => {
        this.partners = partners;
      });
  }

  private buildForm(): void {
    this.basicDataItems = [];
    this.offer?.consignments.forEach((consignmentRequest) => {
      this.basicDataItems.push({
        basicData: consignmentRequest.consignmentBasicData as ConsignmentBasicDataDto,
        form: this.fb.group({}),
      });
    });

    this.newOfferBasicDataForm = this.fb.group({});
    this.consignmentRequestsForm = this.fb.array([]);
  }

  addNewConsignment(): void {
    this.consignmentRequestsForm.push(this.fb.group({}));
    const basicData = this.newOfferBasicDataForm.get('consignmentBasicData')
      .value;
    this.offer.consignments.push({
      consignmentBasicData: basicData,
    });
    this.basicDataItems.push({
      basicData: basicData,
      form: this.fb.group({}),
    });
    this.newPanel.togglePanel();
    this.newConsignmentBasicData = ConsignmentFormsService.createEmptyConsignmentBasicDto();
    this.newOfferBasicDataForm = this.fb.group({});

    this.isDirty = true;
  }

  saveOffer(): void {
    this.offerRequestDataService
      .saveConsignments(this.offer.consignments)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (value) => {
          // TODO: message to the user
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  saveConsignment(basicDataItem: BasicDataItem, index: number) {
    this.offer.consignments[index] = basicDataItem.form.value;
    basicDataItem.form.markAsPristine();
    this.isDirty = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
