import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyService } from '../../../clients/company.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faSave } from '@fortawesome/free-regular-svg-icons/faSave';
import { OfferRequestDataService } from '../offer-request-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { DataGridFilterType, TableCol } from 'src/app/shared/table/TableCol';
import { countryCodes } from 'src/app/shared/form/address/countryCodes';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';

@Component({
  selector: 'app-offer-addressee',
  templateUrl: './offer-addressee.component.html',
  styleUrls: ['./offer-addressee.component.scss'],
})
export class OfferAddresseeComponent implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  offer: OfferManagementByRequesterDto;
  OfferStatus = OfferStatus;

  contactList: EmployeeCompanyDto[] = [];
  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];
  departments: FormSelectItem<Department>[] = [];
  serviceFeatures: FormSelectItem<ServiceFeature>[] = [];
  positions: FormSelectItem<Position>[] = [];
  allPositions: { [key: string]: Position[] };
  specialInformation: any[] = [];

  selectedDepartment: string;
  selectedPosition: string;
  selectedServiceFeature: string;
  selectedFullWeightTypes: any[] = [];
  selectedSpecialInformation: any[] = [];
  selectedRouteFrom: string;
  selectedRouteTo: string;
  selectedContacts: EmployeeCompanyDto[] = [];

  isLoading = true;
  DataGridFilterType = DataGridFilterType;
  tableCols: Array<TableCol<string>>;
  countries: Array<Array<string | Array<string>>> = countryCodes;
  employees: Array<EmployeeDto>;
  private unsubscribe: Subject<void> = new Subject<void>();
  isDirty = false;
  faTrash = faTrashAlt;
  faSave = faSave;
  faRight = faArrowRight;
  faPlus = faPlus;
  faSearch = faSearch;
  faDownload = faDownload;

  constructor(
    private companyService: CompanyService,
    private offerRequestDataService: OfferRequestDataService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslocoService,
    private csvDownloadService: CsvDownloadService,
  ) {}

  private prepareFilterData() {
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

    this.serviceFeatures = Object.keys(ServiceFeature).map((key) => ({
      value: ServiceFeature[key],
      label: this.translationService.translate(
        'company.employee.serviceFeatures.' + ServiceFeature[key]
      ),
    }));

    this.companyService
      .getDepartmentPositionMatrix()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.allPositions = response;
      });

    this.departments = Object.keys(Department).map((key) => ({
      value: Department[key],
      label: this.translationService.translate(
        'company.employee.departments.' + Department[key]
      ),
    }));

    this.fullWeightTypes = Object.keys(JarmuOsszTomegEnum).map((key) => ({
      value: JarmuOsszTomegEnum[key],
      label: this.translationService.translate(
        'company.vehicle.fullWeightTypes.' + JarmuOsszTomegEnum[key]
      ),
    }));

    this.tableCols = [
      { field: 'employeeName', label: 'company.employee.name' },
      { field: 'companyName', label: 'company.label' },
      { field: 'phone', label: 'company.phone' },
      { field: 'mobile', label: 'company.employee.mobile' },
      { field: 'email', label: 'company.email' },
    ];

    this.loadContacts({ pageSize: 100 });
  }

  private loadContacts(query: QueryDto): void {
    this.isLoading = true;
    this.companyService
      .getPossibleAddressees(query)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((employees) => {
        this.contactList = employees.content;
        this.prepareSelectedEmployees();
        this.isLoading = false;
      });
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

  filter() {
    const query: QueryDto = {
      pageSize: 100,
      filters: [],
    };

    if (this.selectedDepartment) {
      query.filters.push({
        fieldName: 'employeeSpecializations.department',
        operation: DbFilterOperation.EQ,
        filterValue: this.selectedDepartment,
      });
    }

    if (this.selectedPosition) {
      query.filters.push({
        fieldName: 'employeeSpecializations.position',
        operation: DbFilterOperation.EQ,
        filterValue: this.selectedPosition,
      });
    }

    if (this.selectedServiceFeature) {
      query.filters.push({
        fieldName: 'employeeSpecializations.serviceFeature',
        operation: DbFilterOperation.EQ,
        filterValue: this.selectedServiceFeature,
      });
    }

    if (this.selectedSpecialInformation.length) {
      const selectedValues = {
        felepitmenyKialakitasEnums: [],
        csereFelepitmenyEnums: [],
        emelesEsMozgatasEnums: [],
        felszereltsegEnums: [],
        rakomanyRogzitesEnums: [],
      };

      this.selectedSpecialInformation.forEach((element) => {
        selectedValues[element.parent].push(element.value);
      });

      Object.keys(selectedValues).map((key) => {
        if (selectedValues[key].length) {
          query.filters.push({
            fieldName: 'employeeSpecializations.' + key,
            operation: DbFilterOperation.HAS_ATTRIBUTE,
            filterValue: selectedValues[key].join(),
          });
        }
      });
    }

    if (this.selectedFullWeightTypes.length) {
      query.filters.push({
        fieldName: 'employeeSpecializations.jarmuOsszTomegEnums',
        operation: DbFilterOperation.HAS_ATTRIBUTE,
        filterValue: this.selectedFullWeightTypes.join(),
      });
    }

    if (this.selectedRouteFrom) {
      query.filters.push({
        fieldName: 'employeeSpecializations.countryPairs.from',
        operation: DbFilterOperation.HAS_ATTRIBUTE,
        filterValue: this.selectedRouteFrom,
      });
    }

    if (this.selectedRouteTo) {
      query.filters.push({
        fieldName: 'employeeSpecializations.countryPairs.to',
        operation: DbFilterOperation.HAS_ATTRIBUTE,
        filterValue: this.selectedRouteTo,
      });
    }

    this.loadContacts(query);
  }

  onAdd() {
    this.selectedContacts.forEach((employee) => {
      if (
        !this.offer.receiverEmployees.find(
          (emp) => emp.employeeId === employee.employeeId
        )
      ) {
        const employeeOffer: EmployeeForOfferManagementDto = {
          employeeId: employee.employeeId,
          companyName: employee.companyName,
          companyId: employee.companyOfEmployeeId,
          title: employee.title,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
        };

        this.offer.receiverEmployees.push(employeeOffer);
        this.isDirty = true;
      }
    });
  }

  private prepareSelectedEmployees() {
    this.offer?.receiverEmployees.forEach((receiverEmployee) => {
      this.selectedContacts.push(
        this.contactList.find(
          (contact) => contact.employeeId === receiverEmployee.employeeId
        )
      );
    });
  }

  ngOnInit(): void {
    this.offerRequestDataService.offerRequestObservable
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.offer = value;
        this.isDirty = false;
      });

    this.prepareFilterData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  removeAddressee(addressee: EmployeeForOfferManagementDto) {
    const foundIndex = this.offer.receiverEmployees.findIndex(
      (selected) => addressee.employeeId === selected.employeeId
    );
    if (foundIndex < 0) {
      return;
    }
    this.offer.receiverEmployees.splice(foundIndex, 1);
    this.selectedContacts.splice(
      this.selectedContacts.findIndex(
        (emp) => addressee.employeeId === emp.employeeId
      ),
      1
    );
    this.isDirty = true;
  }

  saveAddressee(): void {
    let newId;
    this.offerRequestDataService
      .saveAddressee(this.offer.receiverEmployees)
      .pipe(
        tap((x: OfferManagementByRequesterDto) => {
          newId = x.offerRequestId;
        }),
        mergeMap(() => this.route.parent.params),
        takeUntil(this.unsubscribe)
      )
      .subscribe((params: Params) => {
        if (params['id'] === 'new') {
          this.router
            .navigate(['..', newId, this.route.routeConfig.path], {
              relativeTo: this.route.parent,
            })
            .then();
        }
      });
  }

  export(): void {
    const header: string[] = [
      'firstName',
      'lastName',
      'companyName',
      'phone',
      'mobile',
      'email',
    ];

    this.csvDownloadService.export(header, this.contactList, 'offer-addressee.csv');
  }
}
