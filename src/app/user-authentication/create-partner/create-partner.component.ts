import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PremiseFormsService } from 'src/app/clients/premise-forms.service';
import { AddressService } from 'src/app/shared/form/address/address.service';
import { FormModel } from 'src/app/shared/FormModel';
import { ApplicationUserService } from '../application-user.service';
import { FileUploaderComponent } from '../../shared/components/file-uploader/file-uploader.component';
import { FormSelectItem } from '../../shared/form/select/FormSelectItem';

const seatPredicate: (PremiseDto) => boolean = (premise: PremiseDto) =>
  premise.premiseType === PremiseType.SEAT;

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();
  faExclamationCircle = faExclamationCircle;

  companyForm: FormGroup;
  employeeForm: FormGroup;
  file: File;
  fileError: string;
  seatForm: FormGroup;
  secret: string;
  password: string;

  readonly minLen: number = 8;

  isNextStep = false;
  sameAddress = false;

  companyProfiles: Array<FormSelectItem<CompanyProfileEnum>> = [];

  constructor(
    private userService: CompanyBEService,
    //private companyService: CompanyBEService,
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService,
    private fb: FormBuilder,
    private translationService: TranslocoService,
    private premiseFormsService: PremiseFormsService,
    private toastService: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.secret = params['id'];
        if (!this.secret) {
          this.router.navigateByUrl('/').then();
        }
      });
    this.translationService
      .selectTranslation()
      .pipe()
      .subscribe(() => {
        this.companyProfiles = Object.keys(CompanyProfileEnum).map((key) => ({
          value: CompanyProfileEnum[key],
          label: this.translationService.translate(
            'company.profiles.' + CompanyProfileEnum[key]
          ),
        }));
      });

    this.buildForm();
  }

  private buildForm(): void {
    const addressModel: FormModel<AddressDto> = this.addressService.createAddressFormModel(
      {
        country: '',
        postCode: null,
        city: '',
        streetName: '',
        streetType: null,
        streetNumber: '',
      }
    );

    const seatFormModel: FormModel<PremiseDto> = {
      address: this.fb.group(addressModel),
      companyId: [''],
      name: [
        this.translationService.translate('company.seatAddress'),
        Validators.required,
      ],
      premiseType: [PremiseType.SEAT, Validators.required],
      openingDays: this.fb.group(
        this.premiseFormsService.getDefaultOpeningDays()
      ),
    };

    this.seatForm = this.fb.group(seatFormModel);

    const companyFormModel: FormModel<Omit<CompanyDto, 'id' | 'version'>> = {
      companyName: ['', Validators.required],
      mailingAddress: this.fb.group(addressModel),
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      taxNumber: ['', Validators.required],
      fax: [''],
      registrationNumber: ['', Validators.required],
      euTaxNumber: ['', Validators.required],
      companyProfiles: [[], Validators.required],
      premises: new FormArray([]),
      billingElectronic: [true, Validators.required],
      billingPaymentDeadlineDays: [30, Validators.required],
      billingLanguage: [BillingLanguage.hu, Validators.required],
      billingPaymentMethod: [PaymentMethod.TRANSFER, Validators.required],
    };

    this.companyForm = this.fb.group(companyFormModel);

    const identification: Array<FormGroup> = [
      this.fb.group({
        idType: ['', Validators.required],
        idNumber: ['', Validators.required],
        expire: ['', Validators.required],
      }),
    ];

    const employeeFormModel: FormModel<Omit<EmployeeDto, 'id' | 'version'>> = {
      companyId: [''],
      title: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeIdentification: this.fb.array(identification),
      phone: ['', Validators.required],
      mobile: [''],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
    };

    this.employeeForm = this.fb.group(employeeFormModel);
  }

  createPartner(): void {
    if (this.employeeForm.valid && this.password) {
      const company: CompanyDto = this.companyForm.value;
      const employee: EmployeeDto = this.employeeForm.value;
      company.premises = [this.seatForm.value];

      if (this.sameAddress) {
        company.mailingAddress = company.premises.find(seatPredicate)?.address;
      }

      const credentials: InvitePartnerCredentialsDto = {
        secretOneTimeId: this.secret,
        password: this.password,
      };

      this.userService
        .finishPartnerInvite(company, employee, credentials)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.router.navigateByUrl('/').then();
        });
    } else {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.employeeForm.markAllAsTouched();
    }
  }

  copyAddress(): void {
    const mailingForm = this.companyForm.get('mailingAddress');
    if (this.sameAddress) {
      mailingForm.setValue(this.seatForm.get('address').value);
      mailingForm.disable();
      mailingForm.markAsDirty();
    } else {
      mailingForm.enable();
    }
  }

  validateCompanyForm(): void {
    if (this.companyForm.valid && this.seatForm.valid) {
      this.isNextStep = true;
    } else {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.companyForm.markAllAsTouched();
      this.seatForm.markAllAsTouched();
    }
  }

  backToCompany(): void {
    this.isNextStep = false;
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
          this.companyForm.markAsDirty();
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
