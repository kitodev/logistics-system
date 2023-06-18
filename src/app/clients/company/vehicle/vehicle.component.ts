import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { FormModel } from 'src/app/shared/FormModel';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { getEnumValueArray } from '../../../shared/form/getEnumValueArray';
import { CommentApis } from 'src/app/shared/components/comments/comment.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { VehicleService } from '../vehicle.service';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AssetTypes } from 'src/app/shared/documents/assets.service';
import { Role } from '../../../auth/Role';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit, OnDestroy {
  errors: HttpErrorResponse;
  isLoading = true;
  faTrashAlt = faTrashAlt;
  Role = Role;

  private unsubscribe = new Subject<void>();
  private routeSub: any;
  companyId: string;
  vehicleId: string;
  isNew = false;
  isAddingOpen = false;
  isServiceHistory = false;
  WeightUnit = WeightUnit;

  readonly commentApi = CommentApis.VEHICLE_ENDPOINT;
  AssetTypes = AssetTypes;

  vehicleDataForm: FormGroup;
  serviceHistoryDataForm: FormGroup;
  vehicleToEdit: VehicleDto;
  vehicleTypes: FormSelectItem<VehicleTypeEnum>[] = [];
  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];
  structureTypes: FormSelectItem<JarmuFelepitmenyEnum>[] = [];
  units: FormSelectItem<WeightUnit>[] = [];

  readonly felepitmenyKialakitasProperties: FelepitmenyKialakitasEnum[] = getEnumValueArray(
    FelepitmenyKialakitasEnum
  );
  readonly csereFelepitmenyProperties: CsereFelepitmenyEnum[] = getEnumValueArray(
    CsereFelepitmenyEnum
  );
  readonly emelesEsMozgatasProperties: EmelesEsMozgatasEnum[] = getEnumValueArray(
    EmelesEsMozgatasEnum
  );
  readonly felszereltsegProperties: FelszereltsegEnum[] = getEnumValueArray(
    FelszereltsegEnum
  );
  readonly rakomanyRogzitesProperties: RakomanyRogzitesEnum[] = getEnumValueArray(
    RakomanyRogzitesEnum
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private translationService: TranslocoService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
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
          this.isAddingOpen = true;
        } else {
          this.vehicleId = params.get('id');
        }
      });
  }

  private buildForm(): void {
    const netWeight: FormModel<WeightDto> = {
      quantity: [this.vehicleToEdit.netWeight.quantity, Validators.required],
      unit: [this.vehicleToEdit.netWeight.unit],
    };

    const vehicleProperties: FormModel<VehiclePropertiesDto> = {
      felepitmenyKialakitasProperties: new FormArray([]),
      csereFelepitmenyProperties: new FormArray([]),
      emelesEsMozgatasProperties: new FormArray([]),
      felszereltsegProperties: new FormArray([]),
      rakomanyRogzitesProperties: new FormArray([]),
    };

    const historyModel: FormModel<VehicleServiceHistoryDto> = {
      serviceDate: [null, Validators.required],
      description: ['', Validators.required],
      parts: ['', Validators.required],
      price: ['', Validators.required],
      location: ['', Validators.required],
    };

    const vehicleFormModel: FormModel<Omit<VehicleDto, 'id' | 'version'>> = {
      companyId: [this.vehicleToEdit.companyId, Validators.required],
      vehicleType: [this.vehicleToEdit.vehicleType, Validators.required],
      licensePlate: [this.vehicleToEdit.licensePlate, Validators.required],
      fullWeightType: [this.vehicleToEdit.fullWeightType, Validators.required],
      netWeight: this.fb.group(netWeight),
      superStructureType: [
        this.vehicleToEdit.superStructureType,
        Validators.required,
      ],
      cargoSpaceWidth: [
        this.vehicleToEdit.cargoSpaceWidth,
        Validators.required,
      ],
      cargoSpaceHeight: [
        this.vehicleToEdit.cargoSpaceHeight,
        Validators.required,
      ],
      cargoSpaceLength: [
        this.vehicleToEdit.cargoSpaceLength,
        Validators.required,
      ],
      cargoSpaceVolume: [
        this.vehicleToEdit.cargoSpaceVolume,
        Validators.required,
      ],
      palletCount: [this.vehicleToEdit.palletCount, Validators.required],
      vehicleProperties: this.fb.group(vehicleProperties),
    };

    this.serviceHistoryDataForm = this.fb.group(historyModel);

    this.vehicleDataForm = this.fb.group(vehicleFormModel);
    this.fillVehiclePropertiesFormControl();

    this.isLoading = false;
  }

  get felepitmenyKialakitasPropertiesFormArray(): FormArray {
    return this.vehicleDataForm.controls.vehicleProperties['controls']
      .felepitmenyKialakitasProperties as FormArray;
  }

  get csereFelepitmenyPropertiesFormArray(): FormArray {
    return this.vehicleDataForm.controls.vehicleProperties['controls']
      .csereFelepitmenyProperties as FormArray;
  }

  get emelesEsMozgatasPropertiesFormArray(): FormArray {
    return this.vehicleDataForm.controls.vehicleProperties['controls']
      .emelesEsMozgatasProperties as FormArray;
  }

  get felszereltsegPropertiesFormArray(): FormArray {
    return this.vehicleDataForm.controls.vehicleProperties['controls']
      .felszereltsegProperties as FormArray;
  }

  get rakomanyRogzitesPropertiesFormArray(): FormArray {
    return this.vehicleDataForm.controls.vehicleProperties['controls']
      .rakomanyRogzitesProperties as FormArray;
  }

  ngOnInit(): void {
    this.vehicleTypes = this.vehicleService.getVehicleTypes();

    this.fullWeightTypes = this.vehicleService.getFullWeightTypes();

    this.structureTypes = this.vehicleService.getStructureTypes();

    this.units = Object.keys(WeightUnit).map((key) => ({
      value: WeightUnit[key],
      label: WeightUnit[key],
    }));

    if (!this.isNew) {
      this.vehicleService
        .getVehicleById(this.vehicleId, this.companyId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.vehicleToEdit = response;
          this.isAddingOpen = !this.vehicleToEdit.vehicleServiceHistory.length;
          this.buildForm();
        });
    } else {
      this.vehicleToEdit = this.createEmptyVehicle();
      this.buildForm();

      this.draftFormService.loadDraftModal(
        SettingsSections.VEHICLE,
        this.vehicleDataForm,
        this.vcr
      );

      this.routeSub = this.router.events.subscribe((event) => {
        if (
          event instanceof NavigationStart &&
          !this.vehicleDataForm.pristine
        ) {
          this.draftFormService.saveFormData(
            SettingsSections.VEHICLE,
            this.vehicleDataForm.value
          );
        }
      });
    }
  }

  private createEmptyVehicle(): VehicleDto {
    return {
      companyId: this.companyId,
      vehicleType: null,
      licensePlate: '',
      fullWeightType: null,
      superStructureType: null,
      cargoSpaceWidth: null,
      cargoSpaceHeight: null,
      cargoSpaceLength: null,
      cargoSpaceVolume: null,
      palletCount: null,
      netWeight: {
        quantity: null,
        unit: WeightUnit.KG,
      },
      vehicleProperties: {
        felepitmenyKialakitasProperties: [],
        felszereltsegProperties: [],
        csereFelepitmenyProperties: [],
        emelesEsMozgatasProperties: [],
        rakomanyRogzitesProperties: [],
      },
      vehicleServiceHistory: [],
    };
  }

  private prepareProperties(): void {
    const properties: VehiclePropertiesDto = {
      felepitmenyKialakitasProperties: [],
      felszereltsegProperties: [],
      csereFelepitmenyProperties: [],
      emelesEsMozgatasProperties: [],
      rakomanyRogzitesProperties: [],
    };

    this.vehicleDataForm.value.vehicleProperties.felepitmenyKialakitasProperties.forEach(
      (element, index) => {
        if (element) {
          properties.felepitmenyKialakitasProperties.push(
            this.felepitmenyKialakitasProperties[index]
          );
        }
      }
    );

    this.vehicleDataForm.value.vehicleProperties.felszereltsegProperties.forEach(
      (element, index) => {
        if (element) {
          properties.felszereltsegProperties.push(
            this.felszereltsegProperties[index]
          );
        }
      }
    );

    this.vehicleDataForm.value.vehicleProperties.csereFelepitmenyProperties.forEach(
      (element, index) => {
        if (element) {
          properties.csereFelepitmenyProperties.push(
            this.csereFelepitmenyProperties[index]
          );
        }
      }
    );

    this.vehicleDataForm.value.vehicleProperties.emelesEsMozgatasProperties.forEach(
      (element, index) => {
        if (element) {
          properties.emelesEsMozgatasProperties.push(
            this.emelesEsMozgatasProperties[index]
          );
        }
      }
    );

    this.vehicleDataForm.value.vehicleProperties.rakomanyRogzitesProperties.forEach(
      (element, index) => {
        if (element) {
          properties.rakomanyRogzitesProperties.push(
            this.rakomanyRogzitesProperties[index]
          );
        }
      }
    );

    this.vehicleDataForm.value.vehicleProperties = properties;
  }

  private removeNetWeightIfInvalid(): void {
    if (
      !(
        this.vehicleDataForm.value.netWeight.unit &&
        this.vehicleDataForm.value.netWeight.quantity
      )
    ) {
      this.vehicleDataForm.controls.netWeight.patchValue(null);
    }
  }

  createVehicle(): void {
    if (this.vehicleDataForm.valid) {
      this.prepareProperties();
      // this.removeNetWeightIfInvalid();

      const newVehicle: Omit<VehicleDto, 'id' | 'version'> = {
        ...this.vehicleDataForm.value,
      };

      this.vehicleService
        .createVehicle(this.companyId, newVehicle)
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
            this.vehicleDataForm.markAsPristine();
            this.router
              .navigate([
                '/',
                AppRoutes.COMPANY,
                this.companyId,
                AppRoutes.VEHICLES,
              ])
              .then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.vehicleDataForm.markAllAsTouched();
    }
  }

  updateVehicle(): void {
    if (this.vehicleDataForm.valid) {
      this.prepareProperties();
      this.prepareServiceHistory();
      // this.removeNetWeightIfInvalid();
      const updatedVehicle: VehicleDto = {
        ...this.vehicleDataForm.value,
      };

      updatedVehicle.id = this.vehicleToEdit.id;
      updatedVehicle.version = this.vehicleToEdit.version;

      this.vehicleService
        .updateVehicle(this.companyId, updatedVehicle)
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
            this.vehicleDataForm.markAsPristine();
            if (!this.isServiceHistory) {
              this.router
                .navigate([
                  '/',
                  AppRoutes.COMPANY,
                  this.companyId,
                  AppRoutes.VEHICLES,
                ])
                .then();
            } else {
              this.vehicleToEdit = response;
              this.serviceHistoryDataForm.reset();
            }
            this.isServiceHistory = false;
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.vehicleDataForm.markAllAsTouched();
    }
  }

  addServiceHistory(): void {
    if (this.vehicleDataForm.valid && this.serviceHistoryDataForm.valid) {
      this.isServiceHistory = true;
      this.updateVehicle();
    } else {
      this.vehicleDataForm.markAllAsTouched();
      this.serviceHistoryDataForm.markAllAsTouched();
    }
  }

  private prepareServiceHistory(): void {
    let history: Array<VehicleServiceHistoryDto> = [];
    history = [...this.vehicleToEdit.vehicleServiceHistory];
    if (this.serviceHistoryDataForm.valid) {
      history.push(this.serviceHistoryDataForm.value);
    }
    this.vehicleDataForm.value.vehicleServiceHistory = history;
  }

  resetServiceHistory(): void {
    this.serviceHistoryDataForm.reset();
  }

  deleteHistory(serviceHistoryItem: VehicleServiceHistoryDto): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'vehicle')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.isServiceHistory = true;
        const index = this.vehicleToEdit.vehicleServiceHistory.findIndex(
          (p) => p.serviceDate === serviceHistoryItem.serviceDate
        );
        this.vehicleToEdit.vehicleServiceHistory.splice(index, 1);
        this.updateVehicle();
      });
  }

  reset(): void {
    this.vehicleDataForm.reset();
    this.errors = null;
    if (!this.isNew) {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private fillVehiclePropertiesFormControl() {
    this.felepitmenyKialakitasProperties.forEach((prop) =>
      this.felepitmenyKialakitasPropertiesFormArray.push(
        new FormControl(
          this.vehicleToEdit.vehicleProperties.felepitmenyKialakitasProperties.includes(
            prop
          )
        )
      )
    );
    this.csereFelepitmenyProperties.forEach((prop) =>
      this.csereFelepitmenyPropertiesFormArray.push(
        new FormControl(
          this.vehicleToEdit.vehicleProperties.csereFelepitmenyProperties.includes(
            prop
          )
        )
      )
    );

    this.emelesEsMozgatasProperties.forEach((prop) =>
      this.emelesEsMozgatasPropertiesFormArray.push(
        new FormControl(
          this.vehicleToEdit.vehicleProperties.emelesEsMozgatasProperties.includes(
            prop
          )
        )
      )
    );

    this.felszereltsegProperties.forEach((prop) =>
      this.felszereltsegPropertiesFormArray.push(
        new FormControl(
          this.vehicleToEdit.vehicleProperties.felszereltsegProperties.includes(
            prop
          )
        )
      )
    );

    this.rakomanyRogzitesProperties.forEach((prop) =>
      this.rakomanyRogzitesPropertiesFormArray.push(
        new FormControl(
          this.vehicleToEdit.vehicleProperties.rakomanyRogzitesProperties.includes(
            prop
          )
        )
      )
    );
  }
}
