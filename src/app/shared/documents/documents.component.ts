import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AssetsService, AssetTypes } from './assets.service';
import { DataGridFilterType, TableCol } from '../table/TableCol';
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile';
import { faFileImage } from '@fortawesome/free-regular-svg-icons/faFileImage';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import {
  ModalService,
  ModalType,
} from '../components/modal/modal.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { HttpErrorResponse } from '@angular/common/http';
import * as fileSaver from 'file-saver';
import { DATATABLE_SETTINGS } from '../../constants';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @Input()
  type: AssetTypes;

  @Input()
  id: string;
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;

  faFile = faFile;
  faImage = faFileImage;
  faDownload = faDownload;
  faTrashAlt = faTrashAlt;
  isLoading = true;
  errors: HttpErrorResponse;

  private unsubscribe = new Subject<void>();

  files: AssetDto[] = [];
  selectedFiles: AssetDto[] = [];
  tableCols: Array<TableCol<string>>;
  DataGridFilterType = DataGridFilterType;

  constructor(
    private assetsService: AssetsService,
    private modalService: ModalService,
    private vcr: ViewContainerRef,
    private toastService: HotToastService,
    private translationService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.setUpTable();
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.assetsService
      .getDocuments(this.id, this.type)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.files = response;
        this.isLoading = false;
      });
  }
  
  private setUpTable(): void {
    this.tableCols = [
      { field: 'name', label: 'file.name' },
      { 
        field: 'mediaType',
        label: 'file.mediaType',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: 'created',
        label: 'file.created',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: 'uploadedBy',
        label: 'file.uploadedBy',
        filterType: DataGridFilterType.NOFILTER,
      },
      {
        field: 'fileSize',
        label: 'file.fileSize',
        filterType: DataGridFilterType.NOFILTER,
      },
    ];
  }

  downloadFile(file: AssetDto): void {
    this.assetsService
      .downloadFile(file.assetId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          let blob: Blob = new Blob([response]);
          fileSaver.saveAs(blob, this.prepareFileNameForDownload(file));
        },
        (error: any) => console.error('Error downloading the file', error)
      );
  }

  private prepareFileNameForDownload(file: AssetDto): string {
    return file.mediaType ? file.name + '.' + (file.mediaType.split('/'))[1] : file.name;
  }

  deleteFile(fileId): void {
    this.modalService
      .openConfirmationModal(this.vcr, ModalType.DELETE, 'file')
      .pipe(filter((response) => response))
      .subscribe((res) => {
        if (res) {
          this.assetsService
            .deleteFile(fileId)
            .pipe(
              this.toastService.observe({
                success: this.translationService.translate('messages.success', {
                  item: this.translationService.translate('messages.delete'),
                }),
                error: this.translationService.translate('messages.operationFailed'),
              }),
              takeUntil(this.unsubscribe)
            )
            .subscribe(
              () => {
                this.loadFiles();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              }
            );
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
