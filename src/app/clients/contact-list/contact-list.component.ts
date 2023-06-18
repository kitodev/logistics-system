import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataGridFilterType } from 'src/app/shared/table/TableCol';
import { TableService } from 'src/app/shared/table/table.service';
import { CompanyService } from '../company.service';
import { filter, takeUntil } from 'rxjs/operators';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { Router } from '@angular/router';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { HttpErrorResponse } from '@angular/common/http';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import { UserSettingsService } from '../../shared/system/user-settings.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { companyServiceMock } from '../../../test/company-service-mock.spec';
import { employeeSearch } from '../../shared/employeeSearch';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../constants';

enum ContactTableHeaderFields {
  EMPLOYEE_NAME = 'employeeName',
  PHONE = 'phone',
  MOBILE = 'mobile',
  EMAIL = 'email',
  FAX = 'fax',
  COMPANY_NAME = 'companyName',
  LINE_MANAGER = 'lineManager',
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent
  extends UserSettingsListComponent
  implements OnDestroy, OnInit {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  errors: HttpErrorResponse;

  contactList: EmployeeCompanyDto[] = [];
  selectedContacts: EmployeeCompanyDto[] = [];
  faEdit = faEdit;
  faFilter = faFilter;
  faTrashAlt = faTrashAlt;
  faDownload = faDownload;
  DataGridFilterType = DataGridFilterType;
  totalItems: number;
  isLoading = true;
  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;

  ContactTableHeaderFields = ContactTableHeaderFields;

  details: {
    comments: Array<CommentDto>;
  } = {
    comments: [],
  };

  constructor(
    private tableService: TableService,
    private companyService: CompanyService,
    private router: Router,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private commentService: CommentService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService,
    title: Title
  ) {
    super(SettingsSections.CONTACT, userSettingsService);

    translationService
      .selectTranslate('company.menu.contacts')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setUpTable();
  }

  private setUpTable(): void {
    this.userColOrder = this.userColOrder ?? [
      { field: ContactTableHeaderFields.EMPLOYEE_NAME, label: 'company.employee.name' },
      { field: ContactTableHeaderFields.PHONE, label: 'company.phone' },
      { field: ContactTableHeaderFields.MOBILE, label: 'company.employee.mobile' },
      { field: ContactTableHeaderFields.EMAIL, label: 'company.email' },
      { field: ContactTableHeaderFields.FAX, label: 'company.fax' },
      { field: ContactTableHeaderFields.COMPANY_NAME, label: 'company.label' },
      { field: ContactTableHeaderFields.LINE_MANAGER, label: 'company.employee.lineManager' }, //TODO lineManager filter/search
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  refresh(state: ClrDatagridStateInterface<unknown>): void {
    setTimeout(() => {
      this.isLoading = true;
      const query: QueryDto = this.tableService.convertStateToQuery(state);
      this.companyService
        .getAllEmployees(query)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((employees) => {
          this.contactList = employees.content;
          this.isLoading = false;
          this.totalItems = employees.totalElements;
        });
    }, 0);
  }

  edit(contact: EmployeeCompanyDto): void {
    this.router
      .navigateByUrl(
        `${AppRoutes.COMPANY}/${contact.companyOfEmployeeId}/employees/${contact.employeeId}`,
        {
          state: { employee: contact },
        }
      )
      .then();
  }

  /*deleteSelected() {
    this.modalService
    .openConfirmationModal(this.vcr, ModalType.DELETE, 'partner')
    // TODO: delete without confirmation
    for(const contact in this.selectedContacts) {
      this.companyService
      .deleteEmployee(this.selectedContacts[contact].employeeId)
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
      .subscribe(
        () => {
          this.refresh({});
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
    }
  }*/

  delete(contactId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'partner')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deleteEmployee(contactId)
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
          .subscribe(
            () => {
              this.refresh({});
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  onDetailOpen(employee: EmployeeCompanyDto): void {
    this.resetPendingSettings();
    if (!employee) {
      return;
    }

    this.commentService
      .getComments(CommentApis.EMPLOYEE_ENDPOINT, employee.employeeId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));
  }

  export(): void {
    const header: string[] = [
      'firstName',
      'lastName',
      'phone',
      'mobile',
      'email',
      'fax',
      'companyName',
      'lineManagerTitle',
      'lineManagerLastName',
      'lineManagerFirstName',
    ];

    this.csvDownloadService.export(header, this.contactList, 'contact-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
