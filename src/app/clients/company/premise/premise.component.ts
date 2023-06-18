import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppRoutes } from '../../../shared/system/AppRoutes';
import { FormModel } from 'src/app/shared/FormModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AddressService } from 'src/app/shared/form/address/address.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PremiseFormsService } from '../../premise-forms.service';
import { CommentApis } from 'src/app/shared/components/comments/comment.service';
import { DayOfWeek } from '../../../shared/day-of-week';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { DayIntervalValidator } from './DayIntervalValidator';
import { DateTimePickerComponent } from 'src/app/shared/form/date-time-picker/date-time-picker.component';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-premise',
  templateUrl: './premise.component.html',
  styleUrls: ['./premise.component.scss'],
})
export class PremiseComponent implements OnInit, OnDestroy {
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  companyId: string;
  premiseId: string;
  errors: HttpErrorResponse;
  premiseToEdit: PremiseDto;
  originalPremise: PremiseDto;
  premiseForm: FormGroup;
  contactForm: FormGroup;
  contactsList: Array<string> = [];
  premiseTypes: FormSelectItem<PremiseType>[];
  isNew = false;
  isLoading = true;
  days: DayOfWeek[] = [];
  companyEmployees: EmployeeDto[] = [];
  connectedEmployees: ContactOfPremiseDto[] = [];

  readonly commentApi = CommentApis.PREMISE_ENDPOINT;

  PremiseType = PremiseType;

  private unsubscribe = new Subject<void>();
  private routeSub: any;
  faPlus = faPlus;
  faExclamation = faExclamationCircle;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private addressService: AddressService,
    private translationService: TranslocoService,
    private premiseFormsService: PremiseFormsService,
    private draftFormService: LoadDraftFormService,
    private toastService: HotToastService
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.companyId = params.get('id');
      });
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params.get('id') == 'new') {
          this.isNew = true;
        } else {
          this.premiseId = params.get('id');
        }
      });
  }

  ngOnInit(): void {
    this.premiseTypes = Object.keys(PremiseType)
      .filter((type) => type !== PremiseType.SEAT)
      .map((key) => ({
        value: PremiseType[key],
        label: this.translationService.translate(
          'company.premise.types.' + PremiseType[key]
        ),
      }));
    this.days = Object.keys(DayOfWeek).map((p) => DayOfWeek[p]);

    if (!this.isNew) {
      this.loadPremiseEmployees();

      if (!this.companyEmployees.length) {
        this.companyService
          .getEmployees(this.companyId)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response) => {
            this.companyEmployees = response;
          });
      }

      this.companyService
        .getPremiseById(this.companyId, this.premiseId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.premiseToEdit = response;
          this.originalPremise = response;
          this.buildForm();
          this.isLoading = false;
        });
    } else {
      this.premiseToEdit = this.premiseFormsService.createEmptyPremise(
        this.companyId
      );
      this.buildForm();

      this.draftFormService.loadDraftModal(
        SettingsSections.PREMISE,
        this.premiseForm,
        this.vcr
      );

      this.routeSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart && !this.premiseForm.pristine) {
          this.draftFormService.saveFormData(
            SettingsSections.PREMISE,
            this.premiseForm.value
          );
        }
      });

      this.isLoading = false;
    }
  }

  private buildForm(): void {
    const addressModel: FormModel<AddressDto> = this.addressService.createAddressFormModel(
      this.premiseToEdit.address
    );

    const premiseFormModel: FormModel<Omit<PremiseDto, 'id' | 'version'>> = {
      companyId: [this.premiseToEdit.companyId, Validators.required],
      name: [this.premiseToEdit.name, Validators.required],
      premiseType: [this.premiseToEdit.premiseType, Validators.required],
      address: this.fb.group(addressModel),
      openingDays: this.fb.group(
        this.createPremiseOpeningDaysFormModel(this.premiseToEdit.openingDays)
      ),
    };

    this.premiseForm = this.fb.group(premiseFormModel);

    this.contactForm = this.fb.group({
      employee: [null, Validators.required],
    });
  }

  public createPremiseOpeningDaysFormModel(openingDays: {
    [p: string]: OpeningIntervalDto;
  }): FormModel<DayOfWeek[]> {
    const opening: FormModel<DayOfWeek[]> = [];

    Object.keys(DayOfWeek).forEach((day) => {
      opening[
        DayOfWeek[day]
      ] = this.fb.group(
        this.premiseFormsService.createOpeningDayFormGroup(
          openingDays ? openingDays[DayOfWeek[day]] : undefined
        ),
        { validators: DayIntervalValidator }
      );
    });
    return opening;
  }

  private loadPremiseEmployees(): void {
    this.companyService
      .getPremiseEmployees(this.companyId, this.premiseId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.connectedEmployees = response;
      });
  }

  private validateDays() {
    Object.keys(DayOfWeek).forEach((day) => {
      const openingDay = this.premiseForm.value.openingDays[
        day
      ] as OpeningIntervalDto;
      if (
        !openingDay ||
        !openingDay.openFrom ||
        !openingDay.openTo ||
        openingDay.openTo == DateTimePickerComponent.INVALID_DATE ||
        openingDay.openFrom == DateTimePickerComponent.INVALID_DATE
      ) {
        (<FormGroup>this.premiseForm.get('openingDays')).removeControl(day);
      }
    });
  }

  createPremise(): void {
    if (this.premiseForm.valid) {
      this.validateDays();
      const newPremise: Omit<PremiseDto, 'id' | 'version'> = {
        ...this.premiseForm.value,
      };

      this.companyService
        .createPremise(this.companyId, newPremise)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          () => {
            this.premiseForm.markAsPristine();
            this.router
              .navigate([
                '/',
                AppRoutes.COMPANY,
                this.companyId,
                AppRoutes.PREMISES,
              ])
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.premiseForm.markAllAsTouched();
    }
  }

  updatePremise(): void {
    if (this.premiseForm.valid) {
      this.validateDays();
      const premise: PremiseDto = {
        ...this.premiseForm.value,
      };
      premise.id = this.premiseToEdit.id;
      premise.rootVersion = this.premiseToEdit.rootVersion;

      this.companyService
        .updatePremise(this.companyId, premise)
        .pipe(
          this.toastService.observe({
            loading: this.translationService.translate('messages.saving'),
            success: this.translationService.translate('messages.changesSaved'),
            error: this.translationService.translate('messages.saveError'),
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe(
          () => {
            this.premiseForm.markAsPristine();
            this.router
              .navigate([
                '/',
                AppRoutes.COMPANY,
                this.companyId,
                AppRoutes.PREMISES,
              ])
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.premiseForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.premiseForm.reset();
    this.premiseForm.patchValue(this.originalPremise);
    this.errors = null;
    this.buildForm();
  }

  addContact(): void {
    this.companyService
      .addPremiseContactEmployee(
        this.companyId,
        this.premiseToEdit.id,
        this.contactForm.get('employee').value
      )
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
          this.loadPremiseEmployees();
          response.premises.forEach((item) => {
            if (item.id === this.premiseToEdit.id) {
              this.premiseToEdit = item;
            }
          });
          this.contactForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  deleteContact(employeeId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'premiseContact')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deletePremiseContactEmployee(
            this.companyId,
            this.premiseToEdit.id,
            employeeId
          )
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.saving'),
              success: this.translationService.translate('messages.success', {
                item: this.translationService.translate('messages.delete'),
              }),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe((response) => {
            this.loadPremiseEmployees();
            response.premises.forEach((premise) => {
              if (premise.id === this.premiseToEdit.id) {
                this.premiseToEdit = premise;
              }
            });
          });
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
