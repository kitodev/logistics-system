import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';

@Component({
  selector: 'app-parcel-details',
  templateUrl: './parcel-details.component.html',
  styleUrls: ['./parcel-details.component.scss'],
})
export class ParcelDetailsComponent implements OnDestroy {
  faArrowLeft = faArrowLeft;
  faTable = faTable;
  faMapMarkedAlt = faMapMarkedAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faCoins = faCoins;
  faFile = faFileAlt;
  faHistory = faHistory;

  id: string;

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    translate: TranslocoService,
    title: Title
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.id = params.get('id');
      });
    translate
      .selectTranslate('consignment.details')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
