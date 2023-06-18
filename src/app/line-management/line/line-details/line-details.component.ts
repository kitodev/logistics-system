import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { CompanyService } from 'src/app/clients/company.service';
import { CommentApis } from 'src/app/shared/components/comments/comment.service';
import { FormModel } from 'src/app/shared/FormModel';
import { LineService } from '../../line.service';
import { countryCodes } from 'src/app/shared/form/address/countryCodes';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { AuthService } from 'src/app/auth/auth.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { HttpErrorResponse } from '@angular/common/http';
import { employeeSearch } from '../../../shared/employeeSearch';
import { VehicleService } from '../../../clients/company/vehicle.service';
import { LoadDraftFormService } from 'src/app/shared/system/load-draft-form.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { ConsignmentFormsService } from '../../../consignment/consignment-forms.service';

@Component({
  selector: 'app-line-details',
  templateUrl: './line-details.component.html',
  styleUrls: ['./line-details.component.scss'],
})
export class LineDetailsComponent implements OnInit, OnDestroy {
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  errors: HttpErrorResponse;
  private unsubscribe = new Subject<void>();
  private routeSub: any;
  isNew = true;
  isLoading = true;
  ownLine = false;

  lineToEdit: LineDto;
  lineId: string;
  myCompany: CompanyDto;
  partners: CompanyDto[] = [];
  selectedConveyorCompany: CompanyDto;
  contactEmployees: EmployeeDto[] = [];
  lineForm: FormGroup;
  readonly commentApi = CommentApis.LINE_ENDPOINT;

  readonly countries: Array<Array<string | Array<string>>> = countryCodes;

  travelModes: FormSelectItem<TravelMode>[];
  transportModes: FormSelectItem<TransportMode>[];
  vehicles: VehicleDto[] = [];
  drivers: EmployeeDto[] = [];

  selectedVehicle: VehicleDto;
  selectedDriver: EmployeeDto;
  vehicleAndDriverPairing: {
    [key: string]: {
      vehicle: VehicleDto;
      drivers: Array<{ id: string; driver: EmployeeDto }>;
    };
  } = {};
  employeeSearchFn = employeeSearch;
  faInfo = faInfo;

  constructor(
    private lineService: LineService,
    private companyService: CompanyService,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private vcr: ViewContainerRef,
    private draftFormService: LoadDraftFormService,
    private consignmentFormsService: ConsignmentFormsService
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.lineId = params.get('id') == 'new' ? null : params.get('id');
        this.isNew = !this.lineId;
      });
  }

  ngOnInit(): void {
    this.companyService
      .getProcessedPartners()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.partners = response;
          if (!this.isNew) {
            this.lineService
              .getLine(this.lineId)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe((response) => {
                this.lineToEdit = response;
                this.ownLine =
                  this.lineToEdit.conveyorCompanyId ===
                  this.authService.getOwnCompanyId();

                this.selectedConveyorCompany = this.partners.find(
                  (partner) => this.lineToEdit.conveyorCompanyId == partner.id
                );

                this.loadCompanyData(this.lineToEdit.conveyorCompanyId);
                forkJoin([
                  this.companyService.getDriversByCompany(
                    this.lineToEdit.conveyorCompanyId
                  ),
                  this.vehicleService.getVehiclesByCompanyId(
                    this.lineToEdit.conveyorCompanyId
                  ),
                ])
                  .pipe(takeUntil(this.unsubscribe))
                  .subscribe(([drivers, vehicles]) => {
                    this.drivers = drivers;
                    this.vehicles = vehicles;
                    this.preparePairingTableData();
                    this.isLoading = false;
                  });
                this.buildForm();
              });
          } else {
            this.lineToEdit = LineDetailsComponent.createEmptyLine();
            this.buildForm();

            this.draftFormService.loadDraftModal(
              SettingsSections.LINE,
              this.lineForm,
              this.vcr
            );

            this.routeSub = this.router.events.subscribe((event) => {
              if (event instanceof NavigationStart && !this.lineForm.pristine) {
                this.draftFormService.saveFormData(
                  SettingsSections.LINE,
                  this.lineForm.value
                );
              }
            });

            this.isLoading = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
    this.travelModes = this.consignmentFormsService.getTravelModes();
    this.transportModes = this.consignmentFormsService.getTransportModes();
  }

  onMyOwnLineChanged(): void {
    this.lineForm.get('contactOfConveyor').setValue(null);
    this.lineForm.get('activeVehicleId').setValue(null);
    this.lineForm.get('trailer').setValue(null);
    this.selectedDriver = null;
    this.selectedDriver = null;
    this.vehicleAndDriverPairing = {};

    if (this.ownLine) {
      if (this.myCompany) {
        this.selectedConveyorCompany = this.myCompany;
        this.conveyorInputChanged();
      } else {
        this.companyService
          .getMyCompany()
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response) => {
            this.selectedConveyorCompany = this.myCompany = response;
            this.conveyorInputChanged();
          });
      }
    } else {
      this.selectedConveyorCompany = null;
    }
  }

  private preparePairingTableData(): void {
    this.lineToEdit.vehicleToDriverMappings.forEach((pair) => {
      if (!this.vehicleAndDriverPairing[pair.vehicleId]) {
        this.vehicleAndDriverPairing[pair.vehicleId] = {
          drivers: [],
          vehicle: this.vehicles.find(
            (vehicle) => vehicle.id == pair.vehicleId
          ),
        };
      }
      this.vehicleAndDriverPairing[pair.vehicleId].drivers.push({
        id: pair.driver,
        driver: this.drivers.find((driver) => driver.id == pair.driver),
      });
    });
  }

  private static createEmptyLine(): LineDto {
    return {
      conveyorCompanyId: null,
      contactOfConveyor: null,
      start: null,
      arrival: null,
      activeVehicleId: null,
      trailer: null,
      travelMode: null,
      transportMode: null,
      countryPair: {
        from: '',
        to: '',
      },
      vehicleToDriverMappings: [],
    };
  }

  private buildForm(): void {
    const countryPair = {
      from: [this.lineToEdit.countryPair.from, Validators.required],
      to: [this.lineToEdit.countryPair.to, Validators.required],
    };

    const driverMappings: Array<FormGroup> = [];
    this.lineToEdit.vehicleToDriverMappings.forEach((pair) => {
      driverMappings.push(
        this.fb.group({
          vehicleId: [pair.vehicleId],
          driver: [pair.driver],
        })
      );
    });

    const lineFormModel: FormModel<LineDto> = {
      id: [this.lineToEdit.id],
      version: [this.lineToEdit.version],
      conveyorCompanyId: [
        this.lineToEdit.conveyorCompanyId,
        Validators.required,
      ],
      contactOfConveyor: [
        this.lineToEdit.contactOfConveyor,
        Validators.required,
      ],
      start: [this.lineToEdit.start, Validators.required],
      arrival: [this.lineToEdit.arrival, Validators.required],
      activeVehicleId: [this.lineToEdit.activeVehicleId, Validators.required],
      trailer: [this.lineToEdit.trailer],
      travelMode: [this.lineToEdit.travelMode, Validators.required],
      transportMode: [this.lineToEdit.transportMode, Validators.required],
      countryPair: this.fb.group(countryPair),
      vehicleToDriverMappings: this.fb.array(driverMappings),
    };

    this.lineForm = this.fb.group(lineFormModel);
  }

  private loadCompanyData(companyId: string) {
    this.companyService
      .getEmployees(companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.contactEmployees = response;
      });

    this.companyService
      .getDriversByCompany(companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.drivers = response;
      });

    this.vehicleService
      .getVehiclesByCompanyId(companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.vehicles = response;
      });
  }

  conveyorInputChanged() {
    this.lineForm
      .get('conveyorCompanyId')
      .setValue(this.selectedConveyorCompany.id);
    if (
      this.selectedConveyorCompany.id !== this.authService.getOwnCompanyId()
    ) {
      this.ownLine = false;
    }
    this.loadCompanyData(this.selectedConveyorCompany.id);
  }

  cancelEdit(): void {
    this.vehicleAndDriverPairing = {};
    this.preparePairingTableData();
    this.errors = null;
    this.selectedConveyorCompany = this.partners.find(
      (partner) => this.lineToEdit.conveyorCompanyId == partner.id
    );
    this.lineForm.patchValue(this.lineToEdit);
  }

  createLine(): void {
    if (this.lineForm.valid) {
      const newLine: Omit<LineDto, 'id' | 'version'> = {
        ...this.lineForm.value,
      };

      Object.keys(this.vehicleAndDriverPairing).forEach((vehicleId) => {
        this.vehicleAndDriverPairing[vehicleId].drivers.forEach((driverObj) => {
          newLine.vehicleToDriverMappings.push({
            vehicleId: vehicleId,
            driver: driverObj.id,
          });
        });
      });

      this.lineService
        .createLine(newLine)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.lineForm.markAsPristine();
            this.router.navigateByUrl(`${AppRoutes.LINEMANAGEMENT}`).then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.lineForm.markAllAsTouched();
    }
  }

  updateLine(): void {
    if (this.lineForm.valid) {
      const updatedLine: LineDto = { ...this.lineForm.value };

      updatedLine.vehicleToDriverMappings = [];

      Object.keys(this.vehicleAndDriverPairing).forEach((vehicleId) => {
        this.vehicleAndDriverPairing[vehicleId].drivers.forEach((driverObj) => {
          updatedLine.vehicleToDriverMappings.push({
            vehicleId: vehicleId,
            driver: driverObj.id,
          });
        });
      });

      this.lineService
        .updateLine(updatedLine)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          () => {
            this.router.navigateByUrl(`${AppRoutes.LINEMANAGEMENT}`).then();
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.lineForm.markAllAsTouched();
    }
  }

  addPair(): void {
    if (Object.keys(this.vehicleAndDriverPairing).length === 0) {
      this.lineForm.get('activeVehicleId').setValue(this.selectedVehicle.id);
    }
    if (!this.vehicleAndDriverPairing[this.selectedVehicle.id]) {
      this.vehicleAndDriverPairing[this.selectedVehicle.id] = {
        vehicle: this.selectedVehicle,
        drivers: [],
      };
    }
    this.vehicleAndDriverPairing[this.selectedVehicle.id].drivers.push({
      id: this.selectedDriver.id,
      driver: this.selectedDriver,
    });
    this.selectedDriver = null;
    this.selectedVehicle = null;
    this.lineForm.markAsDirty();
  }

  deleteVehicle(vehicleId: string): void {
    delete this.vehicleAndDriverPairing[vehicleId];
    this.lineForm.markAsDirty();
  }

  deleteDriver(vehicleId: string, driverId: string): void {
    this.vehicleAndDriverPairing[vehicleId].drivers.splice(
      this.vehicleAndDriverPairing[vehicleId].drivers.findIndex(
        (element) => element.id == driverId
      ),
      1
    );
    this.lineForm.markAsDirty();
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
