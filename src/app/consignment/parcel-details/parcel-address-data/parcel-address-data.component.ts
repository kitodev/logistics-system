import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService } from '../../../clients/company.service';
import { FormModel } from '../../../shared/FormModel';
import { ConsignmentFormsService } from '../../consignment-forms.service';
import { faTruckLoading } from '@fortawesome/free-solid-svg-icons/faTruckLoading';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { LocationType } from '../LocationType';
import { HttpErrorResponse } from '@angular/common/http';
import { TomTomAddress, TomTomService } from '../../../map/tom-tom.service';
import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngneat/hot-toast';
import { ConsignmentMockService } from '../../consignment-mock.service';

@Component({
  selector: 'app-parcel-address-data',
  templateUrl: './parcel-address-data.component.html',
  styleUrls: ['./parcel-address-data.component.scss'],
})
export class ParcelAddressDataComponent implements OnInit, OnDestroy {
  consignment: ConsignmentDto;
  private unsubscribe: Subject<void> = new Subject<void>();
  consignmentForm: FormGroup;
  errors: HttpErrorResponse;
  partners: Array<CompanyDto> = [];
  isTransshipmentDirty = false;
  isTransshipmentValid = true;

  LocationType = LocationType;

  truckLoading = faTruckLoading;
  faMoneyBillWave = faMoneyBillWave;
  faTrashAlt = faTrashAlt;

  @ViewChild(LocationsListComponent)
  transshipmentLocations: LocationsListComponent;
  basicData: FormGroup;
  faError = faExclamationTriangle;

  constructor(
    private route: ActivatedRoute,
    private consignmentService: ConsignmentBEService,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private cd: ChangeDetectorRef,
    private tomTomService: TomTomService,
    private toastService: HotToastService,
    private translationService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        const consignmentId = params.get('id');
        if (!consignmentId) {
          console.error('invalid ID');
          return;
        }
        forkJoin([
          this.companyService.getProcessedPartners(),
          this.consignmentService.findConsignemntById(consignmentId),
        ])
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(([partners, consignment]) => {
            this.partners = partners;
            this.consignment = consignment;
            this.buildForm(consignment);
          });
      });
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private buildForm(consignment: ConsignmentDto): void {
    const basicDataModel: FormModel<ConsignmentBasicDataDto> = {
      // travelMode: [consignment.consignmentBasicData.travelMode],
      // transportMode: [consignment.consignmentBasicData.transportMode],
      ekaer: [consignment.consignmentBasicData.ekaer],
      lots: [consignment.consignmentBasicData.lots],
      orderId: [consignment.consignmentBasicData.orderId],
      // parity: [consignment.consignmentBasicData.parity],
      // tradeType: [consignment.consignmentBasicData.tradeType],
      loadingInLocation: [consignment.consignmentBasicData.loadingInLocation],
      loadingOutLocation: [consignment.consignmentBasicData.loadingOutLocation],
    };

    this.basicData = this.fb.group(basicDataModel);
    const consignmentModel: FormModel<ConsignmentDto> = {
      consignmentBasicData: this.basicData,
      consignmentId: [consignment.consignmentId],
      consignorEmployeeId: [consignment.consignorEmployeeId],
      givenOfferId: [consignment.givenOfferId],
      id: [consignment.id],
      responsiblePersonEmployeeId: [consignment.responsiblePersonEmployeeId],
      transshipmentLocations: this.fb.array([]),
      version: [consignment.version],
    };

    this.consignmentForm = this.fb.group(consignmentModel);
  }

  saveConsignment(): void {
    const consignment: ConsignmentDto = this.consignmentForm.value;
    consignment.transshipmentLocations = this.transshipmentLocations.getLocationsValue();
    ConsignmentFormsService.toProperConsignmentDto(consignment);
    const locations: Array<TomTomAddress> = [
      TomTomService.toTomTomAddress(
        consignment.consignmentBasicData.loadingInLocation.premiseAddress
      ),
      ...consignment.transshipmentLocations.map((location) =>
        TomTomService.toTomTomAddress(location.premiseAddress)
      ),
      TomTomService.toTomTomAddress(
        consignment.consignmentBasicData.loadingOutLocation.premiseAddress
      ),
    ];
    this.tomTomService
      .geocodeBatch(locations)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        ConsignmentMockService.updateLocationCoordinates(
          consignment,
          results.batchItems
        );
        this.consignmentService
          .updateConsignment(consignment.id, consignment)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.saving'),
              success: this.translationService.translate(
                'messages.changesSaved'
              ),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(
            (updatedConsignment) => {
              this.consignment = updatedConsignment;
              this.consignmentForm.patchValue(updatedConsignment);
              this.consignmentForm.markAsPristine();
              this.transshipmentLocations.markAsPristine();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  onDirtyChange(dirty: boolean) {
    this.isTransshipmentDirty = dirty;
  }

  onValidChange(valid: boolean) {
    this.isTransshipmentValid = valid;
  }
}
