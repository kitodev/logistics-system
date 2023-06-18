import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetTypes } from 'src/app/shared/documents/assets.service';

@Component({
  selector: 'app-parcel-documents',
  templateUrl: './parcel-documents.component.html',
  styleUrls: ['./parcel-documents.component.scss']
})
export class ParcelDocumentsComponent implements OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  AssetTypes = AssetTypes;
  consignmentId: string;

  constructor(
    private route: ActivatedRoute,
    ) {
    this.route.parent.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      this.consignmentId = params.get('id');
      if (!this.consignmentId) {
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
