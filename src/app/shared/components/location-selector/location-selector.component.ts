import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  CompanySection,
  CompanyService,
} from '../../../clients/company.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddressService } from '../../form/address/address.service';
import { CommentApis } from '../comments/comment.service';
import { Router } from '@angular/router';
import { DayOfWeek } from '../../day-of-week';
import { ConsignmentFormsService } from '../../../consignment/consignment-forms.service';
import { faBuilding } from '@fortawesome/free-regular-svg-icons/faBuilding';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { employeeSearch } from '../../employeeSearch';
import { LocationType } from '../../../consignment/parcel-details/LocationType';
import { faTruckLoading } from '@fortawesome/free-solid-svg-icons/faTruckLoading';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons/faMoneyBillWave';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { TomTomService } from '../../../map/tom-tom.service';
import { StatusService } from '../consignment-location-status/status.service';

export interface ContactOfPremiseMockDto { 
  id?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  fax?: string,
  mobile?: string,
  email?: string;
}

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss'],
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
  get companies(): Array<CompanyDto> {
    return this._companies;
  }

  @Input()
  set companies(companies: Array<CompanyDto>) {
    this._companies = companies;
    this.senderCompany = this.companies?.find(
      (company) => company.id === this.location?.sender
    );
  }

  @Input()
  consignmentId?: string;
  @Input()
  legs?: Array<LegDto>;

  @Input()
  controlName: string;
  @Input()
  location: LocationDto;
  @Input()
  locationType: LocationType;
  @Input()
  transshipmentLocationPosition = 0;
  @Input()
  transshipmentLocationCount = 0;
  private _companies: Array<CompanyDto>;
  @Input()
  isNew: boolean;
  @Input()
  editable = true;
  @Input()
  simpleMode = false;
  @Input()
  showStatus = false;
  @Input()
  label: string;

  @Input()
  set parentForm(value: FormGroup) {
    this._parentForm = value;
  }

  get parentForm(): FormGroup {
    return this._parentForm;
  }

  private _parentForm: FormGroup;

  @Output()
  onMoveUp: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  onRemove: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  onMoveDown: EventEmitter<number> = new EventEmitter<number>();

  get editMode(): boolean {
    return this._editMode;
  }

  set editMode(value: boolean) {
    this._editMode = value;
    if (!value) {
      return;
    }
    this.buildEditForm();
    if (this.location.companyId) {
      this.selectedCompany = this._companies.find(
        (company) => company.id === this.location.companyId
      );
      this.onCompanyChange(
        this.selectedCompany,
        this.location.premiseId,
        this.location.contactPersonId
      );
    }
  }

  locationFormGroup: FormGroup;
  locationEditFormGroup: FormGroup;
  premises: Array<PremiseDto>;
  selectedCompany: CompanyDto;
  senderCompany: CompanyDto;
  selectedPremise: PremiseDto;
  employees: ContactOfPremiseDto[];
  selectedContact: ContactOfPremiseMockDto;

  upStatus: {
    status: ConsignmentStatusGetDto,
    lineId: string,
  }
  downStatus: {
    status: ConsignmentStatusGetDto,
    lineId: string,
  }

  CommentApis = CommentApis;
  LocationType = LocationType;
  private unsubscribe: Subject<void> = new Subject<void>();
  private _editMode = false;
  faBuilding = faBuilding;
  faExternalLinkAlt = faExternalLinkAlt;
  faTruckLoading = faTruckLoading;
  faExchange = faExchangeAlt;
  faMoneyBillWave = faMoneyBillWave;
  faUp = faArrowUp;
  faDown = faArrowDown;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faCrosshair = faCrosshairs;
  employeeSearchFn = employeeSearch;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private statusService: StatusService,
    private tomtomService: TomTomService
  ) {
    this.upStatus = {
      status: null,
      lineId: '',
    }
    this.downStatus = {
      status: null,
      lineId: '',
    }
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.isNew && this.locationType === LocationType.TRANSSHIPMENT) {
      this.editMode = true;
    }

    this.loadStatuses();
  }

  private loadStatuses(): void {
    if (this.legs) {
      const upLeg = this.legs.find((leg) => leg.locationFromId === this.location.id);
      const downLeg = this.legs.find((leg) => leg.locationToId === this.location.id);
        
      if (upLeg) {
        this.upStatus.lineId = upLeg.lineId;
        this.statusService
        .getConsignmentStatusHistory(this.consignmentId, this.upStatus.lineId, this.location.premiseId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.upStatus.status = res[res.length-1];
        });
      }
      
      if (downLeg) {
        this.downStatus.lineId = downLeg.lineId;
        this.statusService
        .getConsignmentStatusHistory(this.consignmentId, this.downStatus.lineId, this.location.premiseId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.downStatus.status = res[res.length-1];
        });
      }
    }
  }

  private buildForm(): void {
    this.locationFormGroup = this.fb.group(
      ConsignmentFormsService.createLocationFormModel(this.location)
    );
    if (this.parentForm instanceof FormArray) {
      this.parentForm.push(this.locationFormGroup);
    } else {
      this.parentForm.addControl(this.controlName, this.locationFormGroup);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onCompanyChange(
    company: CompanyDto,
    premiseId?: string,
    contactId?: string
  ): void {
    this.selectedCompany = company;
    this.setLocationCompanyData(company);
    if (!company) {
      this.setPremise(undefined);
      this.premises = [];
      return;
    }
    this.companyService
      .getPremises(company.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((premises) => {
        this.premises = premises;
        if (this.premises && premiseId !== null && premiseId !== undefined) {
          this.setPremise(
            this.premises.find((premise) => premise.id === premiseId),
            contactId
          );
          return;
        }
        if (this.premises && this.premises.length === 1) {
          this.setPremise(this.premises[0]);
          return;
        }
        this.setPremise(undefined);
      });
  }

  onSenderChange(company: CompanyDto) {
    this.senderCompany = company;
  }

  private setPremise(premise: PremiseDto, contactId?: string): void {
    this.getCurrentForm()
      .get('premiseId')
      .patchValue(premise ? premise.id : undefined);
    this.onPremiseChange(premise, contactId);
  }

  onPremiseChange(premise: PremiseDto, contactId?: string): void {
    this.selectedPremise = premise;
    this.setLocationPremiseData(premise);
    if (!premise) {
      this.setContact(undefined);
      return;
    }
    this.companyService
      .getPremiseEmployees(
        this.selectedPremise.companyId,
        this.selectedPremise.id
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.employees = value;
        if (this.employees && contactId) {
          this.setContact(
            this.employees.find((contact) => contact.id === contactId)
          );
          return;
        }
        if (this.employees && this.employees.length === 1) {
          this.setContact(this.employees[0]);
          return;
        }
        this.setContact(undefined);
      });
  }

  private setContact(contact: ContactOfPremiseMockDto): void {
    this.getCurrentForm()
      .get('contactPersonId')
      .patchValue(contact ? contact.id : undefined);
    this.onContactChange(contact);
  }

  onContactChange(employee: ContactOfPremiseMockDto): void {
    this.selectedContact = employee;
  }

  private setLocationCompanyData(company: CompanyDto): void {
    this.location.companyId = company?.id;
    this.location.companyEmail = company?.email;
    this.location.companyPhone = company?.phone;
    this.location.companyFax = company?.fax;
    this.getCurrentForm()?.patchValue({
      companyId: company?.id,
      companyEmail: company?.email,
      companyPhone: company?.phone,
      companyFax: company?.fax,
    });
  }

  private setLocationPremiseData(premise: PremiseDto): void {
    const existingTimeGate: TimeGateDto = this.getCurrentForm().get('timeGate')
      .value;
    const earliestArrival = existingTimeGate.earliestArrival;
    const latestArrival = existingTimeGate.latestArrival;

    if (!premise) {
      this.location.premiseId = undefined;
      this.location.premiseAddress = AddressService.createEmptyAddress();
      this.location.timeGate.openingDays = undefined;
      this.getCurrentForm()
        .get('premiseAddress')
        .patchValue(AddressService.createEmptyAddress());
      const openingDays = {};
      Object.keys(DayOfWeek).forEach((day) => {
        openingDays[DayOfWeek[day]] = {
          openFrom: null,
          openTo: null,
        };
      });
      this.getCurrentForm().get('timeGate').setValue({
        earliestArrival,
        latestArrival,
        openingDays: openingDays,
      });
    } else {
      this.location.premiseId = premise.id;

      this.location.premiseAddress = premise.address;
      this.getCurrentForm().get('premiseAddress').patchValue(premise.address);

      this.location.timeGate = Object.assign(this.location.timeGate, {
        openingDays: { ...premise.openingDays },
        earliestArrival,
        latestArrival,
      });
      this.getCurrentForm().get('timeGate').patchValue(this.location.timeGate);
    }
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  saveLocation(): void {
    const editedLocation: LocationDto = this.locationEditFormGroup.value;
    this.location = { ...this.location, ...editedLocation };
    const patch: LocationDto = {
      premiseAddress: {
        ...editedLocation.premiseAddress,
      },
      contactPersonId: editedLocation.contactPersonId,
      premiseId: editedLocation.premiseId,
      companyId: editedLocation.companyId,
      companyEmail: editedLocation.companyEmail,
      companyPhone: editedLocation.companyPhone,
      companyFax: editedLocation.companyFax,
      timeGate: editedLocation.timeGate,
      sender: editedLocation.sender,
      loadingInReferenceNumber: editedLocation.loadingInReferenceNumber,
      loadingOutReferenceNumber: editedLocation.loadingOutReferenceNumber,
      customs: editedLocation.customs,
    };
    this.locationFormGroup.patchValue(patch);
    this.locationFormGroup.markAsDirty();
    this.parentForm.setControl(this.controlName, this.locationFormGroup);
    this.parentForm.markAsDirty();
    this.editMode = false;
  }

  editAddress(): void {
    this.editMode = true;
  }

  private getCurrentForm(): FormGroup {
    return (!this.isNew ||
      (this.isNew && this.locationType === LocationType.TRANSSHIPMENT)) &&
      this.editMode
      ? this.locationEditFormGroup
      : this.locationFormGroup;
  }

  private buildEditForm(): void {
    this.locationEditFormGroup = this.fb.group(
      ConsignmentFormsService.createLocationFormModel(this.location)
    );
  }

  toPartners(): void {
    const companyId = this.getCurrentForm().get('companyId').value;
    if (!companyId) {
      this.router
        .navigateByUrl(CompanyService.getRoute('new', CompanySection.DETAILS))
        .then();
      return;
    }
    this.router
      .navigateByUrl(
        CompanyService.getRoute(companyId, CompanySection.PREMISES)
      )
      .then();
  }

  moveUp(position: number) {
    this.onMoveUp.emit(position);
  }

  moveDown(position: number) {
    this.onMoveDown.emit(position);
  }

  remove(position: number) {
    this.onRemove.emit(position);
  }

  statusChangedEvent(event: string) {
    this.loadStatuses();
  }
}
