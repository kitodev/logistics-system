import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile';
import { faFileImage } from '@fortawesome/free-regular-svg-icons/faFileImage';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { HttpErrorResponse } from '@angular/common/http';
import * as fileSaver from 'file-saver';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {

  faFile = faFile;
  faImage = faFileImage;
  faDownload = faDownload;
  faTrashAlt = faTrashAlt;
  isLoading = true;
  errors: HttpErrorResponse;
  tools = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image'],
    ],
  };
  private unsubscribe = new Subject<void>();
  constructor(private toastService: HotToastService,
    private translationService: TranslocoService) 
    {}

}
