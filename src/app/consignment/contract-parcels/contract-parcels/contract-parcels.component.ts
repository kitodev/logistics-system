import { Component, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contract-parcels',
  templateUrl: './contract-parcels.component.html',
  styleUrls: ['./contract-parcels.component.scss'],
})
export class ContractParcelsComponent implements OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  constructor(translate: TranslocoService, title: Title) {
    translate
      .selectTranslate('consignment.menu.contractParcels')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
