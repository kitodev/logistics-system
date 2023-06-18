import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridColumn, ClrDatagridStateInterface } from '@clr/angular';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { TranslocoService } from '@ngneat/transloco';
import { filter, takeUntil } from 'rxjs/operators';
import {
  CommentApis,
  CommentService,
} from 'src/app/shared/components/comments/comment.service';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsService } from 'src/app/shared/system/user-settings.service';
import { DataGridFilterType } from 'src/app/shared/table/TableCol';
import { CompanyService } from '../../company.service';
import { UserSettingsListComponent } from '../../../shared/components/user-settings-list/user-settings-list.component';
import { HotToastService } from '@ngneat/hot-toast';
import { faDownload, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';


enum PremiseTableHeaderFields {
  NAME = 'name',
  TYPE = 'premiseType',
  ADDRESS_COUNTRY = 'address.country',
  ADDRESS_CITY = 'address.city',
  ADDRESS_STREET = 'address.streetName',
  OPENING_HOURS = 'openingHours',
}

@Component({
  selector: 'app-premise-list',
  templateUrl: './premise-list.component.html',
  styleUrls: ['./premise-list.component.scss'],
})
export class PremiseListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  errors: HttpErrorResponse;

  isLoading = true;
  DataGridFilterType = DataGridFilterType;

  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faDownload = faDownload;
  faFilter = faFilter;

  isActive = true;
  
  @ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;
  
  premises: PremiseDto[] = [];
  selectedPremises: PremiseDto[] = [];
  companyId: string;

  PremiseTableHeaderFields = PremiseTableHeaderFields;
  PremiseType = PremiseType;

  details: {
    comments: Array<CommentDto>;
    connectedEmployees: ContactOfPremiseDto[];
  } = {
    comments: [],
    connectedEmployees: [],
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private commentService: CommentService,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private companyService: CompanyService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService
  ) {
    super(SettingsSections.PREMISE, userSettingsService);

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

  ngOnInit(): void {
    super.ngOnInit();
    this.loadPremises();
    this.setUpTable();
  }
  
  private setUpTable(): void {
    this.userColOrder = [
      {
        field: PremiseTableHeaderFields.NAME,
        label: 'company.premise.name',
        sort: true,
      },
      {
        field: PremiseTableHeaderFields.TYPE,
        label: 'company.premise.type',
        sort: true,
      },
      {
        field: PremiseTableHeaderFields.ADDRESS_COUNTRY,
        label: 'address.country',
        sort: true,
      },
      {
        field: PremiseTableHeaderFields.ADDRESS_CITY,
        label: 'address.city',
        sort: true,
      },
      {
        field: PremiseTableHeaderFields.ADDRESS_STREET,
        label: 'address.streetName',
        sort: true,
      },
      {
        field: PremiseTableHeaderFields.OPENING_HOURS,
        label: 'company.premise.openingHours',
        filterType: DataGridFilterType.NOFILTER,
        sort: false,
      },
    ];
    this.userColOrder.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  refresh(state: ClrDatagridStateInterface): void {
    setTimeout(() => (this.isLoading = false), 0);
  }

  clearFilters() {
    this.columns
    .forEach(
      (column) => (column.filterValue = '')
    );
  }

  private loadPremises(): void {
    this.companyService
      .getPremises(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.premises = response;
      });
  }

  edit(premiseId: string): void {
    this.router
      .navigateByUrl(
        `${AppRoutes.COMPANY}/${this.companyId}/${AppRoutes.PREMISES}/${premiseId}`
      )
      .then();
  }

  deletePremise(premiseId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'premise')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.companyService
          .deletePremise(this.companyId, premiseId)
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
              this.loadPremises();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            }
          );
      });
  }

  onDetailOpen(premise: PremiseDto): void {
    this.resetPendingSettings();
    if (!premise) {
      return;
    }
    this.commentService
      .getComments(CommentApis.PREMISE_ENDPOINT, premise.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((comments) => (this.details.comments = comments));

    this.companyService
      .getPremiseEmployees(this.companyId, premise.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.details.connectedEmployees = response;
      });
  }

  export(): void {
    const header: string[] = [
      'name',
      'premiseType',
      'address.country',
      'address.city',
      'address.streetName',
    ];

    this.csvDownloadService.export(header, this.premises, 'premise-list.csv');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
