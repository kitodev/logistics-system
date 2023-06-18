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
import { UserSettingsListComponent } from '../../shared/components/user-settings-list/user-settings-list.component';
import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngneat/hot-toast';
import { FinanceType } from 'src/app/shared/finance/form/financial-matrix.component';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CsvDownloadService } from 'src/app/shared/csv-download.service';
import { DATATABLE_SETTINGS } from '../../constants';

@Component({
  selector: 'app-consignment-financial-matrix-list',
  templateUrl: './financial-matrix-list.component.html',
  styleUrls: ['./financial-matrix-list.component.scss'],
})
export class ConsignmentFinancialMatrixListComponent
  extends UserSettingsListComponent
  implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;
  isLoading = true;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faTimes = faTimes;
  faFileDownload = faFileDownload;
  faDownload = faDownload;
  isAddingNew = false;
  isEditing = false;

  FinanceType = FinanceType;

  tableCols: Array<TableCol<string>>;
  DataGridFilterType = DataGridFilterType;
  selectedEntries: FinancialEntriesDto[] = [];
  consignmentId: string;
  consignmentEntries: FinancialEntriesDto;
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
        this.consignmentId = params.get('id');
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
      .getEntries(FinanceType.CONSIGNMENT, this.consignmentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.consignmentEntries = response;
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
      { field: 'netPrice.amount', label: 'finance.netPrice' },
      { field: 'vat', label: 'finance.vat' },
      { field: 'totalPrice.amount', label: 'finance.totalPrice' },
      { field: 'unitPrice.currency', label: 'finance.currency' },
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
          .deleteEntry(FinanceType.CONSIGNMENT, this.consignmentId, entryId)
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
      'netPrice.amount',
      'vat',
      'totalPrice.amount',
      'unitPrice.currency',
      'notes',
    ];

    this.csvDownloadService.export(header, this.consignmentEntries.entries, 'financial-matrix.csv');
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
