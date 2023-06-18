import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ModalService,
  ModalType,
} from 'src/app/shared/components/modal/modal.service';
import { SettingsSections } from 'src/app/shared/system/local-storage.service';
import { UserSettingsService } from 'src/app/shared/system/user-settings.service';
import { DataGridFilterType, TableCol } from 'src/app/shared/table/TableCol';
import { FinanceService } from 'src/app/shared/finance/finance.service';
import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngneat/hot-toast';
import { UserSettingsListComponent } from 'src/app/shared/components/user-settings-list/user-settings-list.component';
import { FinanceType } from 'src/app/shared/finance/form/financial-matrix.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../../constants';

@Component({
  selector: 'app-line-financial-matrix-list',
  templateUrl: './financial-matrix-list.component.html',
  styleUrls: ['./financial-matrix-list.component.scss'],
})
export class LineFinancialMatrixListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = true;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  faDownload = faDownload;
  isAddingNew = false;
  isEditing = false;

  tableCols: Array<TableCol<string>>;
  DataGridFilterType = DataGridFilterType;
  FinanceType = FinanceType;

  lineId: string;
  lineEntries: FinancialEntriesDto;
  selectedEntries: FinancialEntriesDto[] = [];
  detailState: FinancialReadEntryDto = null;
  
  constructor(
    private financeService: FinanceService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private translationService: TranslocoService,
    private toastService: HotToastService,
    private csvDownloadService: CsvDownloadService,
    userSettingsService: UserSettingsService
  ) {
    super(SettingsSections.FINANCIAL_MATRIX, userSettingsService);

    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.lineId = params.get('id');
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadData();
    this.setUpTable();
  }

  loadData(): void {
    this.isLoading = true;
    this.financeService
      .getEntries(FinanceType.LINE, this.lineId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.lineEntries = response;
        this.isAddingNew = false;
        this.isEditing = false;
        this.detailState = null;
        this.isLoading = false;
      });
  }

  private setUpTable(): void {
    this.tableCols = [
      {
        field: 'typeOfServicesOrGoods',
        label: 'finance.typeOfServicesOrGoods',
      },
      { field: 'financialSign', label: 'finance.financialSign' },
      { field: 'description', label: 'finance.description' },
      { field: 'dateOfFulfillment', label: 'finance.dateOfFulfillment' },
      { field: 'unitPrice.amount', label: 'finance.unitPrice' },
      { field: 'totalPrice.amount', label: 'finance.totalPrice' },
      { field: 'unitPrice.currency', label: 'finance.currency' },
      { field: 'vat', label: 'finance.vat' },
      { field: 'netPrice.amount', label: 'finance.netPrice' },
      { field: 'notes', label: 'finance.notes' },
    ];
    this.tableCols.map((col) => {
      col.hidden = this.userSettings[col.field];
      return col;
    });
  }

  onDetailOpen(entry: FinancialReadEntryDto): void {
    this.resetPendingSettings();
    if (!entry) {
      this.detailState = null;
      this.reset();
    }
  }

  edit(): void {
    this.isEditing = true;
    this.isAddingNew = false;
  }

  quickEdit(entry: FinancialReadEntryDto): void {
    this.edit();
    this.detailState = entry;
  }

  delete(entryId: string): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'finance')
      .pipe(filter((response) => response))
      .subscribe(() => {
        this.isLoading = true;
        this.financeService
          .deleteEntry(FinanceType.LINE, this.lineId, entryId)
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
          .subscribe(() => {
            this.loadData();
          });
      });
  }

  export(): void {
    const header: string[] = [
      'typeOfServicesOrGoods',
      'financialSign',
      'description',
      'dateOfFulfillment',
      'unitPrice.amount',
      'totalPrice.amount',
      'unitPrice.currency',
      'vat',
      'netPrice.amount',
      'notes',
    ];

    this.csvDownloadService.export(header, this.lineEntries.entries, 'financial-matrix-list.csv');
  }

  addNew(): void {
    this.isAddingNew = true;
    this.isEditing = false;
  }

  reset(): void {
    this.isAddingNew = false;
    this.isEditing = false;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}