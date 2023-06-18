import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { countryCodes } from 'src/app/shared/form/address/countryCodes';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { CompanyService } from '../../company.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { CommentApis } from 'src/app/shared/components/comments/comment.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AssetTypes } from 'src/app/shared/documents/assets.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  isLoading = true;

  errors: HttpErrorResponse;
  isNew = false;
  sent = false;

  employeeForm: FormGroup;
  specializationsForm: FormGroup;
  private unsubscribe = new Subject<void>();
  companyId: string;
  employeeId: string;
  countries: Array<Array<string | Array<string>>> = countryCodes;

  allPositions: { [key: string]: Position[] };

  departments: FormSelectItem<Department>[] = [];
  serviceFeatures: FormSelectItem<ServiceFeature>[] = [];
  positions: FormSelectItem<Position>[] = [];
  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];

  specInfoValue: any[] = [];
  specialInformation: any[] = [];

  employees: EmployeeDto[] = [];

  employeeToEdit: EmployeeDto;
  originalEmployee: EmployeeDto;
  specToEdit: EmployeeSpecializationDto;

  CommentApis = CommentApis;
  AssetTypes = AssetTypes;

  private routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translationService: TranslocoService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private draftFormService: LoadDraftFormService,
    private toastService: HotToastService
  ) {
    if (this.router.url.includes(AppRoutes.SETTINGS)) {
      this.companyId = this.authService.getOwnCompanyId();
      this.employeeId = this.authService.getLoggedInUser().employee.employeeId;
    } else {
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
            this.employeeId = params.get('id');
          }
        });
    }
  }

  ngOnInit(): void {
    this.companyService
      .getEmployees(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.employees = response;
      });

    this.departments = Object.keys(Department).map((key) => ({
      value: Department[key],
      label: this.translationService.translate(
        'company.employee.departments.' + Department[key]
      ),
    }));

    this.serviceFeatures = Object.keys(ServiceFeature).map((key) => ({
      value: ServiceFeature[key],
      label: this.translationService.translate(
        'company.employee.serviceFeatures.' + ServiceFeature[key]
      ),
    }));

    this.fullWeightTypes = Object.keys(JarmuOsszTomegEnum).map((key) => ({
      value: JarmuOsszTomegEnum[key],
      label: this.translationService.translate(
        'company.vehicle.fullWeightTypes.' + JarmuOsszTomegEnum[key]
      ),
    }));

    this.specialInformation.push({
      value: 'felepitmenyKialakitasEnums',
      label: this.translationService.translate(
        'company.vehicle.felepitmenyKialakitas.felepitmenyKialakitas'
      ),
      options: Object.keys(FelepitmenyKialakitasEnum).map((key) => ({
        value: FelepitmenyKialakitasEnum[key],
        parent: 'felepitmenyKialakitasEnums',
        label: this.translationService.translate(
          'company.vehicle.felepitmenyKialakitas.' +
            FelepitmenyKialakitasEnum[key]
        ),
      })),
    });
    this.specialInformation.push({
      value: 'csereFelepitmenyEnums',
      label: this.translationService.translate(
        'company.vehicle.csereFelepitmeny.csereFelepitmeny'
      ),
      options: Object.keys(CsereFelepitmenyEnum).map((key) => ({
        value: CsereFelepitmenyEnum[key],
        parent: 'csereFelepitmenyEnums',
        label: this.translationService.translate(
          'company.vehicle.csereFelepitmeny.' + CsereFelepitmenyEnum[key]
        ),
      })),
    });

    this.specialInformation.push({
      value: 'emelesEsMozgatasEnums',
      label: this.translationService.translate(
        'company.vehicle.emelesEsMozgatas.emelesEsMozgatas'
      ),
      options: Object.keys(EmelesEsMozgatasEnum).map((key) => ({
        value: EmelesEsMozgatasEnum[key],
        parent: 'emelesEsMozgatasEnums',
        label: this.translationService.translate(
          'company.vehicle.emelesEsMozgatas.' + EmelesEsMozgatasEnum[key]
        ),
      })),
    });

    this.specialInformation.push({
      value: 'felszereltsegEnums',
      label: this.translationService.translate(
        'company.vehicle.felszereltseg.felszereltseg'
      ),
      options: Object.keys(FelszereltsegEnum).map((key) => ({
        value: FelszereltsegEnum[key],
        parent: 'felszereltsegEnums',
        label: this.translationService.translate(
          'company.vehicle.felszereltseg.' + FelszereltsegEnum[key]
        ),
      })),
    });

    this.specialInformation.push({
      value: 'rakomanyRogzitesEnums',
      label: this.translationService.translate(
        'company.vehicle.rakomanyRogzites.rakomanyRogzites'
      ),
      options: Object.keys(RakomanyRogzitesEnum).map((key) => ({
        value: RakomanyRogzitesEnum[key],
        parent: 'rakomanyRogzitesEnums',
        label: this.translationService.translate(
          'company.vehicle.rakomanyRogzites.' + RakomanyRogzitesEnum[key]
        ),
      })),
    });

    this.companyService
      .getDepartmentPositionMatrix()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.allPositions = response;
      });

    if (!this.isNew) {
      this.companyService
        .getEmployeeById(this.employeeId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.employeeToEdit = response;
          this.originalEmployee = response;
          this.buildForm();
          this.specToEdit = this.createEmptySpec();
          this.buildSpecForm();
          this.isLoading = false;
        });
    } else {
      this.employeeToEdit = this.createEmptyEmployee();
      this.buildForm();

      this.draftFormService.loadDraftModal(
        SettingsSections.EMPLOYEE,
        this.employeeForm,
        this.vcr
      );

      this.routeSub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart && !this.employeeForm.pristine) {
          this.draftFormService.saveFormData(
            SettingsSections.EMPLOYEE,
            this.employeeForm.value
          );
        }
      });

      this.isLoading = false;
    }
  }

  private buildForm(): void {
    const identification: Array<FormGroup> = [];
    this.employeeToEdit.employeeIdentification.forEach((idToEdit) => {
      identification.push(
        this.fb.group({
          idType: [idToEdit.idType, Validators.required],
          idNumber: [idToEdit.idNumber, Validators.required],
          expire: [idToEdit.expire, Validators.required], //TODO req???
        })
      );
    });

    const employeeFormModel: FormModel<EmployeeDto> = {
      id: [this.employeeToEdit.id],
      version: [this.employeeToEdit.version],
      companyId: [this.employeeToEdit.companyId, Validators.required],
      lineManagerId: [this.employeeToEdit.lineManagerId],
      title: [this.employeeToEdit.title],
      firstName: [this.employeeToEdit.firstName, Validators.required],
      lastName: [this.employeeToEdit.lastName, Validators.required],
      employeeSpecializations: [this.employeeToEdit.employeeSpecializations],
      employeeIdentification: this.fb.array(identification),
      phone: [this.employeeToEdit.phone, Validators.required],
      mobile: [this.employeeToEdit.mobile],
      email: [
        this.employeeToEdit.email,
        [Validators.required, Validators.email],
      ],
      fax: [this.employeeToEdit.fax],
    };
    this.employeeForm = this.fb.group(employeeFormModel);
  }

  isDriver(): boolean {
    const driver = this.employeeToEdit?.employeeSpecializations?.find(s => s.position === Position.DRIVER);
    const isDriverForm = this.specializationsForm?.get('position').value === Position.DRIVER;
    if (driver || isDriverForm) return true;
  }

  private buildSpecForm(): void {
    const countryPairs: Array<FormGroup> = [];
    this.specToEdit.countryPairs.forEach((pair) => {
      countryPairs.push(
        this.fb.group({
          from: [pair.from],
          to: [pair.to],
        })
      );
    });

    const specialization: FormModel<EmployeeSpecializationDto> = {
      employeeId: [this.specToEdit.employeeId],
      rootVersion: [this.specToEdit.rootVersion],
      department: [this.specToEdit.department, Validators.required],
      serviceFeature: [this.specToEdit.serviceFeature, Validators.required],
      position: [this.specToEdit.position, Validators.required],
      jarmuOsszTomegEnums: [this.specToEdit.jarmuOsszTomegEnums],
      felepitmenyKialakitasEnums: [this.specToEdit.felepitmenyKialakitasEnums],
      csereFelepitmenyEnums: [this.specToEdit.csereFelepitmenyEnums],
      emelesEsMozgatasEnums: [this.specToEdit.emelesEsMozgatasEnums],
      felszereltsegEnums: [this.specToEdit.felszereltsegEnums],
      rakomanyRogzitesEnums: [this.specToEdit.rakomanyRogzitesEnums],

      countryPairs: this.fb.array(countryPairs),
    };

    this.specializationsForm = this.fb.group(specialization);
  }

  private createEmptyEmployee(): EmployeeDto {
    return {
      companyId: this.companyId,
      firstName: '',
      lastName: '',
      employeeIdentification: [
        {
          idNumber: '-',
          idType: '-',
          expire: '2021-01-01',
        },
      ],
      phone: '',
      mobile: '',
      email: '',
      employeeSpecializations: [],
    };
  }

  private createEmptySpec(): EmployeeSpecializationDto {
    return {
      employeeId: this.employeeToEdit.id,
      rootVersion: this.employeeToEdit.version,
      // for multiple select need to be array
      department: null,
      serviceFeature: null,
      position: null,
      jarmuOsszTomegEnums: [],
      rakomanyRogzitesEnums: [],
      felepitmenyKialakitasEnums: [],
      felszereltsegEnums: [],
      csereFelepitmenyEnums: [],
      emelesEsMozgatasEnums: [],
      countryPairs: [
        {
          from: null,
          to: null,
        },
      ],
    };
  }

  createEmployee(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const newEmployee: Omit<EmployeeDto, 'id' | 'version'> = {
        ...this.employeeForm.value,
      };
      this.companyService
        .createEmployee(this.companyId, newEmployee)
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
            this.employeeForm.markAsPristine();

            this.router.navigate([
              '/',
              AppRoutes.COMPANY,
              this.companyId,
              AppRoutes.EMPLOYEES,
              response.id
            ]).then();

            this.isNew = false;
            this.employeeToEdit = response;
            this.originalEmployee = response;
            this.buildForm();
            this.specToEdit = this.createEmptySpec();
            this.buildSpecForm();
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
      this.employeeForm.markAllAsTouched();
    }
  }

  updateEmployee(): void {
    if (this.employeeForm.valid) {
      const employee: EmployeeDto = {
        ...this.employeeForm.value,
      };
      employee.id = this.employeeToEdit.id;
      employee.version = this.employeeToEdit.version;
      this.companyService
        .updateEmployee(employee)
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
            this.employeeForm.markAsPristine();
            this.router
              .navigate([
                '/',
                AppRoutes.COMPANY,
                this.companyId,
                AppRoutes.EMPLOYEES,
              ])
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.toastService.error(
        this.translationService.translate('messages.checkForm')
      );
      this.employeeForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.employeeForm.reset();
    this.employeeToEdit = this.originalEmployee;
    this.errors = null;
    this.buildForm();
  }

  resetSpecialization(): void {
    this.specializationsForm.reset();
    this.specToEdit = this.createEmptySpec();
    this.specInfoValue = [];
    this.errors = null;
    this.buildSpecForm();
  }

  addNewIdentification(): void {
    this.employeeToEdit = {
      ...this.employeeForm.value,
    };
    this.employeeToEdit.employeeIdentification.push({
      idNumber: '',
      idType: '',
      expire: '2021-01-01',
    });
    this.buildForm();
    this.employeeForm.markAsDirty();
    //TODO dirty/pristine ExpressionChangedAfterItHasBeenCheckedError
  }

  deleteIdentification(index: number): void {
    this.employeeToEdit = {
      ...this.employeeForm.value,
    };
    this.employeeToEdit.employeeIdentification.splice(index, 1);
    this.buildForm();
    this.employeeForm.markAsDirty();
  }

  addSpecialization(): void {
    const newSpec: Omit<EmployeeSpecializationDto, 'id'> = {
      ...this.specializationsForm.value,
    };

    newSpec.employeeId = this.employeeToEdit.id;
    newSpec.rootVersion = this.employeeToEdit.version;

    if (
      !newSpec.countryPairs[newSpec.countryPairs.length - 1].from ||
      !newSpec.countryPairs[newSpec.countryPairs.length - 1].to
    ) {
      if (newSpec.countryPairs.length == 1) {
        newSpec.countryPairs = [];
      } else {
        delete newSpec.countryPairs[newSpec.countryPairs.length - 1];
      }
    }

    this.companyService
      .addSpecialization(this.employeeToEdit.id, newSpec)
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
          this.employeeToEdit = response;
          this.countries = countryCodes;
          this.specializationsForm.reset();
          this.specInfoValue = [];
          this.specToEdit = this.createEmptySpec();
          this.buildSpecForm();
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  onDepartmentChange(event): void {
    this.positions = [];

    if (event) {
      let pos = this.allPositions[event.value];
      pos.forEach((element) => {
        this.positions.push({
          value: element,
          label: this.translationService.translate(
            'company.employee.positions.' + Position[element]
          ),
        });
      });
    }
  }

  onSpecialInfoChange(event): void {
    const selectedValues = {
      felepitmenyKialakitasEnums: [],
      csereFelepitmenyEnums: [],
      emelesEsMozgatasEnums: [],
      felszereltsegEnums: [],
      rakomanyRogzitesEnums: [],
    };
    event.forEach((element) => {
      selectedValues[element.parent].push(element.value);
    });

    this.specializationsForm.controls['felepitmenyKialakitasEnums'].setValue(
      selectedValues.felepitmenyKialakitasEnums
    );
    this.specializationsForm.controls['csereFelepitmenyEnums'].setValue(
      selectedValues.csereFelepitmenyEnums
    );
    this.specializationsForm.controls['emelesEsMozgatasEnums'].setValue(
      selectedValues.emelesEsMozgatasEnums
    );
    this.specializationsForm.controls['felszereltsegEnums'].setValue(
      selectedValues.felszereltsegEnums
    );
    this.specializationsForm.controls['rakomanyRogzitesEnums'].setValue(
      selectedValues.rakomanyRogzitesEnums
    );
  }

  onServiceFeatureChange(event): void {
    const val: string = event.value;
    if (val.includes('DOMESTIC')) {
      this.countries = [['EU', ['HU']]];
    } else if (val.includes('INTERNATIONAL')) {
      // TODO - HU-HU cannot be included.
      this.countries = countryCodes;
    } else {
      this.countries = countryCodes;
    }
  }

  addNewCountryPair() {
    this.specToEdit = {
      ...this.specializationsForm.value,
    };
    this.specToEdit.countryPairs.push({
      from: null,
      to: null,
    });
    this.buildSpecForm();
    this.specializationsForm.markAsDirty();
  }

  deleteSpecialization(specId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'specialization')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deleteSpecialization(this.employeeToEdit.id, specId)
          .pipe(
            this.toastService.observe({
              loading: this.translationService.translate('messages.inProgress'),
              success: this.translationService.translate('messages.success', {
                item: this.translationService.translate('messages.delete'),
              }),
              error: this.translationService.translate('messages.saveError'),
            }),
            takeUntil(this.unsubscribe)
          )
          .subscribe(
            (response) => {
              this.employeeToEdit = response;
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  inviteUser() {
    this.companyService
      .inviteUser(this.employeeToEdit.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.sent = true;
          //TODO ?
        },
        (error: HttpErrorResponse) => {
          this.sent = false;
          this.errors = error;
        }
      );
  }

  disableUser() {
    this.companyService
      .disableUser(this.employeeToEdit.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.sent = true;
          //TODO ?
        },
        (error: HttpErrorResponse) => {
          this.sent = false;
          this.errors = error;
        }
      );
  }

  activateUser() {
    this.companyService
      .activateUser(this.employeeToEdit.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          //TODO ?
          this.sent = true;
        },
        (error: HttpErrorResponse) => {
          this.sent = false;
          this.errors = error;
        }
      );
  }

  resetPassword() {
    this.companyService
      .resetPassword(this.employeeToEdit.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          //TODO ?
          this.sent = true;
        },
        (error: HttpErrorResponse) => {
          this.sent = false;
          this.errors = error;
        }
      );
  }
}
