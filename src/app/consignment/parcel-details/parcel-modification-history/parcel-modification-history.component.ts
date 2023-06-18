import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Components } from 'src/app/shared/components/history/history.component';

@Component({
  selector: 'app-parcel-modification-history',
  templateUrl: './parcel-modification-history.component.html',
  styleUrls: ['./parcel-modification-history.component.scss']
})
export class ParcelModificationHistoryComponent implements OnDestroy {

  private unsubscribe = new Subject<void>();
  readonly aggregateIdType = 'com.logoal.domain.freight.consignment.ConsignmentId';
  aggregateId: string;

  Components = Components;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.aggregateId = params.get('id');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
