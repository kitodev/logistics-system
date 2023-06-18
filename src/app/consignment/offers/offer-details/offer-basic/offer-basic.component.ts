import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt';
import { faSave } from '@fortawesome/free-regular-svg-icons/faSave';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OfferRequestDataService } from '../../offer-request-data.service';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons/faHourglassHalf';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { FormBuilder, FormGroup } from '@angular/forms';
import { futureValidator } from '../../../../shared/form/validators/FutureValidator';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Role } from '../../../../auth/Role';

@Component({
  selector: 'app-offer-basic',
  templateUrl: './offer-basic.component.html',
  styleUrls: ['./offer-basic.component.scss'],
})
export class OfferBasicComponent implements OnInit, OnDestroy {
  OfferStatus = OfferStatus;

  offer: OfferManagementByRequesterDto;

  private unsubscribe = new Subject<void>();

  isConsignmentsExpanded = true;
  isAddresseeExpanded = true;
  givenOffers: Array<{
    offeredPrice: number;
    currency: string;
    company: string;
    expirationDate: string;
  }> = [];
  chosenOffer: {
    offeredPrice: number;
    currency: string;
    company: string;
    expirationDate: string;
  };

  Roles = Role;

  faTimes = faTimes;
  faCheck = faCheck;
  faSend = faPaperPlane;
  faBox = faBoxOpen;
  faTrashAlt = faTrashAlt;
  faSave = faSave;
  faWait = faHourglassHalf;
  faReplied = faReply;
  offerRequestFormGroup: FormGroup;
  deadlineMinDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerRequestDataService: OfferRequestDataService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.offerRequestDataService.offerRequestObservable
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.offer = value;
        if (!this.offer) {
          return;
        }
        this.offerRequestFormGroup = this.fb.group({
          requestDeadline: [this.offer.requestDeadline, futureValidator()],
        });
      });
  }

  sendOffer(): void {
    const deadline = this.offerRequestFormGroup.getRawValue()[
      'requestDeadline'
    ];
    if (deadline !== this.offer.requestDeadline) {
      this.offerRequestDataService
        .saveRequestDeadline(deadline)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((savedOffer) => {
          this.offerRequestDataService.request(this.offer.offerRequestId);
        });
    } else {
      this.offerRequestDataService.request(this.offer.offerRequestId);
    }
  }

  saveOffer(): void {
    let newId;
    this.offerRequestDataService
      .saveRequestDeadline(
        this.offerRequestFormGroup.getRawValue()['requestDeadline']
      )
      .pipe(
        tap((x: OfferManagementByRequesterDto) => {
          newId = x.offerRequestId;
        }),
        mergeMap(() => this.route.parent.params),
        takeUntil(this.unsubscribe)
      )
      .subscribe((params: Params) => {
        if (params['id'] === 'new') {
          this.router
            .navigate(['..', newId, this.route.routeConfig.path], {
              relativeTo: this.route.parent,
            })
            .then();
        }
      });
  }

  navigateToAddressee(): void {
    this.router
      .navigate(['addressee'], { relativeTo: this.route.parent })
      .then();
  }

  navigateToConsignments(): void {
    this.router
      .navigate(['consignment'], { relativeTo: this.route.parent })
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  acceptOffer(givenOfferId: string) {
    // this.modalService.openConfirmationModal(this.vcr, 'offer').then((res) => {
    //   if (res) {
    this.offerRequestDataService.accept(
      givenOfferId,
      this.offer.offerRequestId
    );
    // }
    // });
  }

  declineOffer(givenOfferId: string) {
    this.offerRequestDataService.decline(
      givenOfferId,
      this.offer.offerRequestId
    );
  }

  convert() {
    this.offerRequestDataService.convert(this.offer.offerRequestId);
  }

  private refreshData() {}
}
