import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { CompanyService } from '../company.service';
import { TableService } from '../../shared/table/table.service';
import { DataGridFilterType } from '../../shared/table/TableCol';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/system/AppRoutes';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import {
  ModalService,
  ModalType,
} from '../../shared/components/modal/modal.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { HotToastService } from '@ngneat/hot-toast';
import { countryCodes } from 'src/app/shared/form/address/countryCodes';
import { Form } from '@angular/forms';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { counties } from '../../shared/form/address/counties';
import { DATATABLE_SETTINGS } from '../../constants';

enum CompanyTableHeaderFields {
  COMPANY_NAME = 'companyName',
  SEAT_CITY = 'seatAddress.city',
  SEAT_STREET_NAME = 'seatAddress.streetName',
  SEAT_POST = 'seatAddress.postCode',
  SEAT_COUNTRY = 'seatAddress.country',
  MAILING = 'mailingAddress',
  PROFILES = 'companyProfiles',
  TAX_NUM = 'taxNumber',
  EU_TAX_NUM = 'euTaxNumber',
  REGISTRATION_NUM = 'registrationNumber',
  PHONE = 'phone',
  EMAIL = 'email',
  FIN_CONTACT_FIRST_NAME = 'financialContactFirstName',
  FIN_CONTACT_LAST_NAME = 'financialContactLastName',
  FINANCIAL_CONTACT = 'financialContactLastName',
  ACTIVE = 'active',
}

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  errors: HttpErrorResponse;
  companies: CompanyFinancialDto[] = [];
  selectedCompanies: CompanyDto[] = [];
  countries: Array<Array<string | Array<string>>> = countryCodes;

  DataGridFilterType = DataGridFilterType;
  totalItems: number;
  CompanyTableHeaderFields = CompanyTableHeaderFields;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  isLoading: boolean;
  faEdit = faEdit;
  faCheck = faCheck;
  faTimes = faTimes;
  faTrashAlt = faTrashAlt;
  faDownload = faDownload;
  faFilter = faFilter;
  details: {
    financialContact: EmployeeDto;
    comments: Array<CommentDto>;
  } = {
    financialContact: null,
    comments: [],
  };

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private tableService: TableService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private toastService: HotToastService,
    private commentService: CommentService,
    private cd: ChangeDetectorRef,
    userSettingsService: UserSettingsService,
    private translationService: TranslocoService,
    private csvDownloadService: CsvDownloadService,
    title: Title
  ) {
    super(SettingsSections.COMPANY, userSettingsService);
    translationService
      .selectTranslate('header.partners')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
    this.isLoading = true;
  }

  private getCompanyProfiles(): FormSelectItem<CompanyProfileEnum>[] {
    return Object.keys(CompanyProfileEnum).map((key) => ({
      value: CompanyProfileEnum[key],
      label: this.translationService.translate(
        'company.profiles.' + CompanyProfileEnum[key]
      ),
    }));
  }

  private setUpTable(): void {
    this.userColOrder = [
      {
        field: CompanyTableHeaderFields.COMPANY_NAME,
        label: 'company.companyName',
        sort: true,
      },
      {
        field: CompanyTableHeaderFields.SEAT_CITY,
        //filterType: DataGridFilterType.NOFILTER,
        label: 'address.city',
        sort: true,
      },
      {
        field: CompanyTableHeaderFields.SEAT_STREET_NAME,
        label: 'address.address',
        //filterType: DataGridFilterType.NOFILTER,
        sort: true,
      },
      {
        field: CompanyTableHeaderFields.SEAT_POST,
        label: 'address.postCode',
        //filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: CompanyTableHeaderFields.SEAT_COUNTRY,
        label: 'address.countryCode',
        //filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
      {
        field: CompanyTableHeaderFields.MAILING,
        label: 'company.mailingAddress',
        sort: true,
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: CompanyTableHeaderFields.PROFILES,
        label: 'company.companyProfiles',
        filterType: DataGridFilterType.PICKER,
        filterOptions: this.getCompanyProfiles(),
        operation: DbFilterOperation.HAS_ATTRIBUTE,
      },
      {
        field: CompanyTableHeaderFields.TAX_NUM,
        label: 'company.taxNumber',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: CompanyTableHeaderFields.EU_TAX_NUM,
        label: 'company.euTaxNumber',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: CompanyTableHeaderFields.REGISTRATION_NUM,
        label: 'company.registrationNumber',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: CompanyTableHeaderFields.PHONE,
        label: 'company.phone',
      },
      {
        field: CompanyTableHeaderFields.EMAIL,
        label: 'company.email',
        //filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: CompanyTableHeaderFields.FIN_CONTACT_FIRST_NAME,
        label: 'company.employee.firstName',
        //filterType: DataGridFilterType.NOFILTER,
        // sort: true
      },
      /*{
        field: CompanyTableHeaderFields.FIN_CONTACT_LAST_NAME,
        label: 'company.employee.lastName',
        //filterType: DataGridFilterType.NOFILTER,
        // sort: true
      },*/
      {
        field: CompanyTableHeaderFields.FINANCIAL_CONTACT,
        label: 'company.financialContact',
        //filterType: DataGridFilterType.NOFILTER,
        // sort: true
      },
      {
        field: CompanyTableHeaderFields.ACTIVE,
        label: 'company.active',
        filterType: DataGridFilterType.PICKER,
        filterOptions: [
          {
            value: true,
            label: this.translationService.translate('company.active'),
          },
          {
            value: false,
            label: this.translationService.translate('company.inactive'),
          },
        ],
        sort: false,
      },
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  refresh(state: ClrDatagridStateInterface): void {
    this.isLoading = true;
    const query: QueryDto = this.tableService.convertStateToQuery(state);

    this.companyService
      .getCompanies(query)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.isLoading = false;
        this.companies = response.content;
        this.totalItems = response.totalElements;
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setUpTable();
  }

  edit(companyId: string): void {
    this.router.navigateByUrl(`${AppRoutes.COMPANY}/${companyId}`).then();
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  del(companyId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'partner')
      .pipe(
        filter((response) => response),
        mergeMap(() => this.companyService.deleteCompany(companyId)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.refresh({});
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  onDetailOpen(company: CompanyFinancialDto): void {
    this.resetPendingSettings();
    if (!company) {
      return;
    }
    if (company.financialContactId) {
      this.companyService
        .getEmployeeById(company.financialContactId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.details.financialContact = response;
        });
    }

    this.commentService
      .getComments(CommentApis.COMPANY_ENDPOINT, company.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));
  }

  export(): void {
    const header: string[] = [
      'companyName',
      'seatAddress.city',
      'seatAddress.streetName',
      'seatAddress.postCode',
      'seatAddress.country',
      // 'mailingAddress',
      // 'profiles',
      'taxNumber',
      'registrationNumber',
      'phone',
      'email',
      'financialContactTitle',
      'financialContactFirstName',
      'financialContactLastName',
      // 'active',
    ];


    this.csvDownloadService.export(header, this.companies, 'company-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
