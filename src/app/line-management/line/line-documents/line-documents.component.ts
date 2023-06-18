import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetTypes } from 'src/app/shared/documents/assets.service';

@Component({
  selector: 'app-line-documents',
  templateUrl: './line-documents.component.html',
  styleUrls: ['./line-documents.component.scss']
})
export class LineDocumentsComponent implements OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  AssetTypes = AssetTypes;
  lineId: string;

  constructor(
    private route: ActivatedRoute,
    ) {
    this.route.parent.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      this.lineId = params.get('id');
      if (!this.lineId) {
        console.error('invalid ID');
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
