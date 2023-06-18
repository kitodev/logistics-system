import { Component, OnDestroy } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { ActivatedRoute } from '@angular/router';
import { OfferRequestDataService } from '../offer-request-data.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faSave } from '@fortawesome/free-regular-svg-icons/faSave';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
})
export class OfferDetailsComponent implements OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();
  errors: HttpErrorResponse;
  offerId: string | null;
  offer: OfferManagementByRequesterDto;

  faArrowLeft = faArrowLeft;
  faBox = faBoxOpen;
  faPeople = faUserFriends;
  faTable = faTable;
  faTrashAlt = faTrashAlt;
  faSave = faSave;

  constructor(
    translate: TranslocoService,
    title: Title,
    route: ActivatedRoute,
    private offerService: OfferService,
    private offerRequestDataService: OfferRequestDataService
  ) {
    translate
      .selectTranslate('offer.offers')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));

    route.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      this.offerId = params.get('id') === 'new' ? null : params.get('id');
      this.offerRequestDataService.setOfferRequest(this.offerId);
      this.offerRequestDataService.offerRequestObservable
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((offerRequest) => {
          this.offer = offerRequest;
        });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  saveOffer(): void {
    this.offerRequestDataService.saveOffer(this.offer);
  }
}
