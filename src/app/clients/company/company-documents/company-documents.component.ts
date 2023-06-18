import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile';
import { faFolder } from '@fortawesome/free-regular-svg-icons/faFolder';
import { of, Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { AssetsService } from 'src/app/shared/documents/assets.service';
import { DataGridFilterType, TableCol } from 'src/app/shared/table/TableCol';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TableService } from 'src/app/shared/table/table.service';
import * as fileSaver from 'file-saver';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons/faShareSquare';
import { CompanyService } from '../../company.service';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { FormSelectItem } from 'src/app/shared/form/select/FormSelectItem';
import { ModalInputType } from 'src/app/shared/components/modal/modal.component';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { DATATABLE_SETTINGS } from '../../../constants';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.scss'],
})
export class CompanyDocumentsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  SIZE_OPTIONS = DATATABLE_SETTINGS.SIZE_OPTIONS;

  tree: Array<{
    name: string;
    directoryId: string;
    children?: [];
    parentId?: string;
    files?: [];
  }> = [];
  isLoading: Array<boolean> = [];
  clrIfExpanded: Array<boolean> = [];

  tableIsLoading = true;
  files: AssetDto[] = [];
  selectedFiles: AssetDto[] = [];
  tableCols: Array<TableCol<string>>;
  DataGridFilterType = DataGridFilterType;
  totalItems: number;

  partners: Array<CompanyDto>;
  currentDirectoryId: string;

  companyId: string;
  faFolder = faFolder;
  faTrashAlt = faTrashAlt;
  faFile = faFile;
  faDownload = faDownload;
  faShare = faShareSquare;

  constructor(
    private assetsService: AssetsService,
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private toastService: HotToastService,
    private translationService: TranslocoService,
    private companyService: CompanyService,
    private modalService: ModalService,
    private vcr: ViewContainerRef
  ) {
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
    this.setUpTable();
    this.assetsService
      .getCompanyDirectories(this.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.prepareTree(response);
      });
  }

  private setUpTable(): void {
    this.tableCols = [
      { field: 'name', label: 'file.name' },
      // { field: 'mediaType', label: 'file.mediaType', filterType: DataGridFilterType.NOFILTER, },
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

  private prepareTree(directories): void {
    directories.forEach((dir) => {
      if (!dir.parentId) {
        this.tree.push({
          name: dir.name,
          directoryId: dir.directoryId,
          children: [],
        });
      } else {
        this.findParentDir(dir, this.tree);
      }
    });
    this.tableIsLoading = false;
  }

  private findParentDir(directory, tree: Array<any>) {
    tree.forEach((dir) => {
      if (dir.directoryId === directory.parentId) {
        if (!dir.children) {
          dir['children'] = [];
        }
        dir.children.push(directory);
      } else {
        if (dir.children) {
          this.findParentDir(directory, dir.children);
        }
      }
    });
    return tree;
  }

  getChildren = (directory) => of(directory?.children);

  fetchContent(directoryId: string): void {
    this.currentDirectoryId = directoryId;
    this.refresh({ page: { size: 10 } });
  }

  refresh(state: ClrDatagridStateInterface): void {
    setTimeout(() => {
      if (this.currentDirectoryId) {
        this.tableIsLoading = true;
        this.isLoading[this.currentDirectoryId] = true;
        const query: QueryDto = this.tableService.convertStateToQuery(state);

        this.assetsService
          .getFiles(query, this.currentDirectoryId)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((response) => {
            this.files = response.content;
            this.isLoading[this.currentDirectoryId] = false;
            this.tableIsLoading = false;
          });
      }
    }, 0);
  }

  sendFileToPartner(assetId: string) {
    if (!this.partners) {
      this.companyService
        .getPartners(this.companyId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.partners = response;
          this.openModal(assetId);
        });
    } else {
      this.openModal(assetId);
    }
  }

  private openModal(assetId: string): void {
    const selectItems: FormSelectItem<any>[] = this.partners.map((p) => ({
      value: p.id,
      label: p.companyName,
    }));

    this.modalService
      .openInputModal(
        this.vcr,
        'file.share',
        'file.receiver',
        ModalInputType.SELECT,
        'general.send',
        selectItems
      )
      .pipe(
        filter((response) => !!response),
        mergeMap((response) =>
          this.assetsService.sendFileToPartner(assetId, response)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.toastService.success(
            this.translationService.translate('messages.successfulOperation')
          );
        },
        () => {
          this.toastService.error(
            this.translationService.translate('messages.operationFailed')
          );
        }
      );
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
        () => {
          this.toastService.error(
            this.translationService.translate('messages.downloadError')
          );
        }
      );
  }

  private prepareFileNameForDownload(file: AssetDto): string {
    return file.mediaType
      ? file.name + '.' + file.mediaType.split('/')[1]
      : file.name;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
