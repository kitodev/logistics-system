import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../company.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ModalService,
  ModalType,
} from '../../../shared/components/modal/modal.service';
import { filter, takeUntil } from 'rxjs/operators';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { DataGridFilterType } from 'src/app/shared/table/TableCol';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { UserSettingsService } from '../../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';
import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngneat/hot-toast';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';

enum EmployeeTableHeaderFields {
  EMPLOYEE_NAME = 'employeeName',
  PHONE = 'phone',
  MOBILE = 'mobile',
  EMAIL = 'email',
  DEPARTMENT = 'department',
  POSITION = 'position',
  SERVICE = 'serviceFeature',
  FULL_WEIGHT_TYPE = 'transportType',
  FROM = 'countryPair.from',
  TO = 'countryPair.to',
  SPEC_INFO = 'specInfo',
  ROUTE = 'route',
  FAX = 'fax',
  EXPIRE = 'identificationExpire.expire',
  LINE_MANAGER = 'lineManager',
}


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faFilter = faFilter;
  faDownload = faDownload;

  companyId: string;
  errors: HttpErrorResponse;
  isLoading = true;
  selectedEmployees: EmployeeDto[] = [];
  employees: EmployeeDto[] = [];
  DataGridFilterType = DataGridFilterType;
  isActive = true;

  departments: FormSelectItem<Department>[] = [];
  positions: FormSelectItem<Position>[] = [];
  serviceFeatures: FormSelectItem<ServiceFeature>[] = [];
  fullWeightTypes: FormSelectItem<JarmuOsszTomegEnum>[] = [];
  structureTypes: FormSelectItem<JarmuFelepitmenyEnum>[] = [];

  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  EmployeeTableHeaderFields = EmployeeTableHeaderFields;

  employeeLookupMap: { [id: string]: EmployeeDto };

  details: {
    comments: Array<CommentDto>;
  } = {
    comments: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private commentService: CommentService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService
  ) {
    super(SettingsSections.EMPLOYEE, userSettingsService);

    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params.get('id') == 'new') {
          this.router.navigate(['/', AppRoutes.COMPANY, 'new']).then();
        } else {
          this.companyId = params.get('id');
        }
      });
  }
  private getPosition(): FormSelectItem<Position>[] {
    return Object.keys(Position).map((key) => ({
      value: Position[key],
      label: this.translationService.translate(
        'company.employee.positions.' + Position[key]
      ),
    }));
  }

  private getDepartment(): FormSelectItem<Department>[] {
    return Object.keys(Department).map((key) => ({
      value: Department[key],
      label: this.translationService.translate(
        'company.employee.departments.' + Department[key]
      ),
    }));
  }

  private getService(): FormSelectItem<ServiceFeature>[] {
    return Object.keys(ServiceFeature).map((key) => ({
      value: ServiceFeature[key],
      label: this.translationService.translate(
        'company.employee.serviceFeatures.' + ServiceFeature[key]
      ),
    }));
  }

  private getFullWeightTypes(): FormSelectItem<JarmuOsszTomegEnum>[] {
    return Object.keys(JarmuOsszTomegEnum).map((key) => ({
      value: JarmuOsszTomegEnum[key],
      label: this.translationService.translate(
        'company.vehicle.fullWeightTypes.' + JarmuOsszTomegEnum[key]
      ),
    }));
  }

  private getStructureTypes(): FormSelectItem<JarmuFelepitmenyEnum>[] {
    return Object.keys(JarmuFelepitmenyEnum).map((key) => ({
      value: JarmuFelepitmenyEnum[key],
      label: this.translationService.translate(
        'company.vehicle.structureTypes.' + JarmuFelepitmenyEnum[key]
      ),
    }));
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadEmployees();
    this.setUpTable();

    //this.positions = this.companyService.getPosition();
    /*this.departments = this.companyService.getDepartment();
    this.serviceFeatures = this.companyService.getService();
    this.fullWeightTypes = this.companyService.getFullWeightTypes();
    this.structureTypes = this.companyService.getStructureTypes();*/
  }

  refresh(state: ClrDatagridStateInterface): void {
    //TODO: investigate ExpressionChangedAfterItHasBeenCheckedError and find a proper solution instead of setTimeout
    setTimeout(() => (this.isLoading = false), 0);
  }

  private setUpTable(): void {
    this.userColOrder = [
      { field: EmployeeTableHeaderFields.EMPLOYEE_NAME, label: 'company.employee.name' },
      { field: EmployeeTableHeaderFields.PHONE, label: 'company.phone' },
      { field: EmployeeTableHeaderFields.MOBILE, label: 'company.employee.mobile' },
      { field: EmployeeTableHeaderFields.EMAIL, label: 'company.email' },
      { field: EmployeeTableHeaderFields.FAX, label: 'company.fax' },
      { 
        field: EmployeeTableHeaderFields.DEPARTMENT,
        label: 'company.employee.department',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getDepartment(),
      },
      /*{ 
        field: EmployeeTableHeaderFields.POSITION, 
        label: 'company.employee.position',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getPosition(),
      },*/
      { field: EmployeeTableHeaderFields.SERVICE, 
        label: 'company.employee.serviceFeature',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getService(),
      },
      { field: EmployeeTableHeaderFields.FULL_WEIGHT_TYPE,
        label: 'company.employee.transportType',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getFullWeightTypes(),
      },
      { field: EmployeeTableHeaderFields.SPEC_INFO,
        label: 'company.employee.specInfo',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getStructureTypes(),
      },
      {
        field: EmployeeTableHeaderFields.FROM,
        label: 'company.employee.start',
      },
      {
        field: EmployeeTableHeaderFields.TO,
        label: 'company.employee.arrival',
      },
      { 
        field: EmployeeTableHeaderFields.EXPIRE, 
        label: 'company.employee.identificationExpire',
        filterType: DataGridFilterType.DATE 
      },
      {
        field: EmployeeTableHeaderFields.LINE_MANAGER,
        label: 'company.employee.lineManager',
        //filterType: DataGridFilterType.NOFILTER,
      },
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  private loadEmployees(): void {
    this.companyService
      .getEmployees(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.employees = response;
        this.createEmployeeMap(this.employees);
      });
  }

  edit(employeeId: string): void {
    this.router
      .navigate([
        '/',
        AppRoutes.COMPANY,
        this.companyId,
        AppRoutes.EMPLOYEES,
        employeeId,
      ])
      .then();
  }

  delete(employeeId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'employee')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deleteEmployee(employeeId)
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
            () => {
              this.loadEmployees();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  onDetailOpen(employee: EmployeeDto): void {
    this.resetPendingSettings();
    if (!employee) {
      return;
    }
    this.commentService
      .getComments(CommentApis.EMPLOYEE_ENDPOINT, employee.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));
  }

  createEmployeeMap(employees: Array<EmployeeDto>) {
    this.employeeLookupMap = {};
    if (!employees || !employees.length) {
      return;
    }
    employees.forEach((employee) => {
      this.employeeLookupMap[employee.id] = employee;
    });
  }

  export(): void {
    const header: string[] = [
      'firstName',
      'lastName',
      'phone',
      'mobile',
      'email',
      'fax',
    ];

    this.csvDownloadService.export(header, this.employees, 'employee-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
