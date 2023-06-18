import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Endpoints, FileUploadService } from './file-upload.service';

@Component({
  selector: 'form-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnDestroy {
  @Input()
  type: string;

  @Input()
  id: string;

  @Output() fileUploaded = new EventEmitter<string>();

  faExclamationCircle = faExclamationCircle;

  private static readonly allowedDocumentTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  static readonly allowedMaxImageSize = 10_485_760;
  static readonly allowedImageTypes = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ];

  file: File;
  fileError: string;
  documentName: string;

  private unsubscribe = new Subject<void>();

  constructor(private fileUploadService: FileUploadService) {}

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          /*if (!FileUploaderComponent.allowedDocumentTypes.includes(file.type)) {
            this.fileError = 'typeLimit';
            this.fileError = 'supportedFile';
            console.log(file.type);
            return;
          }*/

          if (file.size > FileUploaderComponent.allowedMaxImageSize) {
            this.fileError = 'sizeLimit';
            return;
          }

          this.file = file;
          this.fileError = '';
        });
      }
    }
  }

  saveDocument(): void {
    this.fileUploadService
      .addDocument(
        this.file,
        this.documentName,
        this.type + 'Document',
        Endpoints[this.type.toUpperCase()],
        this.id
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.file = null;
          this.documentName = null;
          this.fileUploaded.emit();
        },
        (error: HttpErrorResponse) => {
          this.fileError = error.error;
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
