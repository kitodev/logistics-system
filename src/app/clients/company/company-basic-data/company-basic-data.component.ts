import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { FormModel } from '../../../shared/FormModel';
import { AddressService } from '../../../shared/form/address/address.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { NavigationStart, Router } from '@angular/router';

import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faFileImage } from '@fortawesome/free-regular-svg-icons/faFileImage';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { PremiseFormsService } from '../../premise-forms.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { AssetTypes } from 'src/app/shared/documents/assets.service';
import { Role } from 'src/app/auth/Role';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';
import { numberValidator } from '../../../shared/form/validators/NumberValidator';
import { FileUploaderComponent } from '../../../shared/components/file-uploader/file-uploader.component';
import { FormSelectItem } from '../../../shared/form/select/FormSelectItem';

const seatPredicate: (PremiseDto) => boolean = (premise: PremiseDto) =>
  premise.premiseType === PremiseType.SEAT;

interface companyDraft {
  basicData: CompanyDto;
  seat: PremiseDto;
}

@Component({
  selector: 'app-company-basic-data',
  templateUrl: './company-basic-data.component.html',
  styleUrls: ['./company-basic-data.component.scss'],
})
export class CompanyBasicDataComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  companyBasicDataForm: FormGroup;
  seatForm: FormGroup;
  errors: HttpErrorResponse;
  companyProfiles: Array<FormSelectItem<CompanyProfileEnum>> = [];
  company: CompanyDto = null;
  isLoading = true;
  isNew = false;
  private unsubscribe = new Subject<void>();
  private routeSub: any;
  companyEmployees: EmployeeDto[] = [];
  AssetTypes = AssetTypes;
  myCompanyId: string;
  url = 'assets/images/logo.png';
  file: File;
  fileError: string;

  faExclamationCircle = faExclamationCircle;
  faFileImage = faFileImage;
  sameAddress = false;
  Role = Role;
  billingLanguages: BillingLanguage[] = Object.values(BillingLanguage);
  billingPaymentMethods;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private addressService: AddressService,
    private premiseFormsService: PremiseFormsService,
    private authService: AuthService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private draftFormService: LoadDraftFormService,
    private translationService: TranslocoService,
    private toastService: HotToastService
  ) {}

  ngOnInit(): void {
    this.myCompanyId = this.authService.getOwnCompanyId();
    this.billingPaymentMethods = Object.keys(PaymentMethod).map(key => ({
      value: PaymentMethod[key],
      label: this.translationService.translate(`company.${PaymentMethod[key]}`),
    }))

    this.companyProfiles = Object.keys(CompanyProfileEnum).map((key) => ({
      value: CompanyProfileEnum[key],
      label: this.translationService.translate(
        'company.profiles.' + CompanyProfileEnum[key]
      ),
    }));

    if (this.companyId) {
      this.loadExistingCompany();
    } else {
      this.isNew = true;
      this.company = CompanyBasicDataComponent.createEmptyCompany();
      this.buildForm();

      this.draftFormService
        .loadDraft<companyDraft>(SettingsSections.COMPANY, this.vcr)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((savedData) => {
          if (savedData) {
            this.companyBasicDataForm.patchValue(savedData.basicData);
            this.seatForm.patchValue(savedData.seat);
            this.setSameAddress();
          }
        });

      this.routeSub = this.router.events
        .pipe(
          filter(
            (event) =>
              event instanceof NavigationStart &&
              (this.companyBasicDataForm.dirty || this.seatForm.dirty)
          )
        )
        .subscribe(() => {
          const draft: companyDraft = {
            basicData: this.companyBasicDataForm.getRawValue(),
            seat: this.seatForm.getRawValue(),
          };
          this.draftFormService.saveFormData(SettingsSections.COMPANY, draft);
        });

      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadExistingCompany(): void {
    this.companyService
      .getCompany(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.company = response;
        this.buildForm();
        this.isLoading = false;
      });

    this.companyService
      .getEmployees(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.companyEmployees = response;
      });
  }

  private buildForm(): void {
    this.buildBasicDataForm();

    this.buildSeatForm();
    if (!this.isNew) {
      this.setSameAddress();
    }
  }

  private buildBasicDataForm(): void {
    const mailingAddressModel: FormModel<AddressDto> = this.addressService.createAddressFormModel(
      this.company.mailingAddress
    );

    const companyFormModel: FormModel<Omit<CompanyDto, 'id' | 'version'>> = {
      financialContactId: [this.company.financialContactId],
      companyName: [this.company.companyName, Validators.required],
      mailingAddress: this.fb.group(mailingAddressModel),
      phone: [this.company.phone, Validators.required],
      fax: [this.company.fax],
      email: [this.company.email, [Validators.required, Validators.email]],
      taxNumber: [this.company.taxNumber, Validators.required],
      euTaxNumber: [this.company.euTaxNumber],
      groupIdentificationNumber: [this.company.groupIdentificationNumber],
      creditLimit: [this.company.creditLimit, numberValidator()],
      registrationNumber: [
        this.company.registrationNumber,
        Validators.required,
      ],
      companyProfiles: [this.company.companyProfiles, Validators.required],
      premises: new FormArray([]),
      billingElectronic: [this.company.billingElectronic, Validators.required],
      billingPaymentDeadlineDays: [this.company.billingPaymentDeadlineDays, Validators.required],
      billingLanguage: [this.company.billingLanguage, Validators.required],
      billingPaymentMethod: [this.company.billingPaymentMethod, Validators.required],
    };

    this.companyBasicDataForm = this.fb.group(companyFormModel);
  }

  private buildSeatForm(): void {
    const existingSeat =
      this.company.premises?.find(seatPredicate) ??
      this.premiseFormsService.createEmptyPremise(this.company.id);

    const addressModel: FormModel<AddressDto> = this.addressService.createAddressFormModel(
      existingSeat.address
    );

    const seatFormModel: FormModel<PremiseDto> = {
      address: this.fb.group(addressModel),
      companyId: [existingSeat.companyId],
      employeeIds: [existingSeat.employeeIds],
      name: [
        existingSeat.name == null || existingSeat.name === ''
          ? this.translationService.translate('company.seatAddress')
          : existingSeat.name,
      ],
      openingDays: this.fb.group(
        this.premiseFormsService.getDefaultOpeningDays()
      ),
      premiseType: [PremiseType.SEAT],
    };
    this.seatForm = this.fb.group(seatFormModel);
  }

  get profilesFormArray(): FormArray {
    return this.companyBasicDataForm.controls.companyProfiles as FormArray;
  }

  createCompany(): void {
    if (this.companyBasicDataForm.valid && this.seatForm.valid) {
      this.isLoading = true;
      const newCompany: Omit<
        CompanyDto,
        'id' | 'version' | 'connectedAgencyId'
      > = {
        ...this.companyBasicDataForm.getRawValue(),
      };

      this.updatePremises();
      newCompany.premises = this.company.premises;

      if (this.sameAddress) {
        newCompany.mailingAddress = newCompany.premises.find(
          seatPredicate
        )?.address;
      }

      this.companyService
        .createCompany(newCompany, this.file)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (response) => {
            this.companyBasicDataForm.markAsPristine();
            this.seatForm.markAsPristine();
            this.router
              .navigate(['/', AppRoutes.COMPANY, response.id, 'details'])
              .then();

            this.isNew = false;
            this.company = response;
            this.buildForm();
            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.companyBasicDataForm.markAllAsTouched();
      this.seatForm.markAllAsTouched();
    }
  }

  updateCompany(): void {
    if (this.companyBasicDataForm.valid && this.seatForm.valid) {
      const updatedCompany: CompanyDto = {
        ...this.companyBasicDataForm.getRawValue(),
      };
      updatedCompany.id = this.company.id;
      updatedCompany.version = this.company.version;

      this.updatePremises();
      updatedCompany.premises = this.company.premises;

      if (this.sameAddress) {
        updatedCompany.mailingAddress = updatedCompany.premises.find(
          seatPredicate
        )?.address;
      }

      this.companyService
        .updateCompany(updatedCompany, this.file)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          (updatedCompany) => {
            // TODO: check refresh company data
            this.company = updatedCompany;
          },
          (error: HttpErrorResponse) => {
            //TODO: specify errors
            //this.errors = error;
          }
        );
    } else {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.companyBasicDataForm.markAllAsTouched();
      this.seatForm.markAllAsTouched();
    }
  }

  private updatePremises(): void {
    const findIndex = this.company.premises?.findIndex(seatPredicate);
    this.premiseFormsService.sanitizeOpeningDays(this.seatForm);
    const updatedSeat: PremiseDto = {
      ...this.seatForm.value,
    };
    updatedSeat.companyId = this.companyId;
    updatedSeat.rootVersion = this.company.version;
    if (findIndex >= 0) {
      updatedSeat.id = this.company.premises[findIndex].id;
      this.company.premises[findIndex] = updatedSeat;
    } else {
      this.company.premises
        ? this.company.premises.push(updatedSeat)
        : (this.company.premises = [updatedSeat]);
    }
  }
  
  public onSelectFile(e) {
    if(e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=> {
        this.url=event.target.result;
      }
    }
  }

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (!FileUploaderComponent.allowedImageTypes.includes(file.type)) {
            this.fileError = 'typeLimit';
            return;
          }
          if (file.size > FileUploaderComponent.allowedMaxImageSize) {
            this.fileError = 'sizeLimit';
            return;
          }
          this.file = file;
          this.fileError = '';
          this.companyBasicDataForm.markAsDirty();
        });
      }
    }
  }

  copyAddress(): void {
    const mailingForm = this.companyBasicDataForm.get('mailingAddress');
    if (this.sameAddress) {
      mailingForm.setValue(this.seatForm.get('address').value);
      mailingForm.disable();
      mailingForm.markAsDirty();
    } else {
      mailingForm.enable();
    }
  }

  private setSameAddress(): void {
    if (
      JSON.stringify(this.companyBasicDataForm.get('mailingAddress').value) ==
      JSON.stringify(this.seatForm.get('address').value)
    ) {
      this.sameAddress = true;
      setTimeout(() => {
        this.companyBasicDataForm.get('mailingAddress').disable();
      }, 0);
    }
  }

  private static createEmptyCompany(): CompanyDto {
    return {
      companyName: '',
      mailingAddress: AddressService.createEmptyAddress(),
      phone: '',
      email: '',
      taxNumber: '',
      euTaxNumber: null,
      groupIdentificationNumber: null,
      premises: [],
      creditLimit: null,
      registrationNumber: '',
      companyProfiles: [],
      billingElectronic: true,
      billingPaymentDeadlineDays: null,
      billingLanguage: null,
      billingPaymentMethod: null,
    };
  }

  promoteCompany(): void {
    this.modalService
      .openConfirmationModal(
        this.vcr,
        ModalType.GENERAL,
        'modal.promote',
        'modal.promoteTitle'
      )
      .pipe(
        filter((response) => response),
        mergeMap(() => this.companyService.promoteCompany(this.companyId)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.toastService.success(
            this.translationService.translate('messages.successfulOperation')
          );
        },
        (error) => {
          this.toastService.error(
            this.translationService.translate('messages.operationFailed')
          );
        }
      );
  }

  activateCompany(): void {
    this.isLoading = true;
    if (this.company.active) {
      this.companyService
        .inactivateCompany(this.companyId)
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
          this.loadExistingCompany();
        });
    } else {
      this.companyService
        .activateCompany(this.companyId)
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
        .subscribe((response) => {
          this.company = response;
          this.buildForm();
          this.isLoading = false;
        });
    }
  }
}
