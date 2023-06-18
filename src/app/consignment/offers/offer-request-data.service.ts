import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { map, mergeMap, take, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OfferRequestDataService implements OnDestroy {
  errors: HttpErrorResponse;
  offerRequest: Subject<OfferManagementByRequesterDto> = new BehaviorSubject(
    null
  );
  offerRequestObservable = this.offerRequest.asObservable();

  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private offerService: OfferService) {}

  updateOfferRequest(offerRequest: OfferManagementByRequesterDto): void {
    this.offerRequest.next(offerRequest);
  }

  setOfferRequest(requestId: string): void {
    if (requestId === null) {
      this.offerRequest.next(OfferRequestDataService.createEmptyOffer());
      return;
    }
    this.offerRequest.next(null);
    this.loadOfferRequest(requestId);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  loadOfferRequest(requestId: string): void {
    this.offerService
      .findByIdForRequester(requestId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.offerRequest.next(value);
      });
  }

  request(offerRequestId: string): void {
    if (offerRequestId === null) {
      // TODO save offer first
    } else {
      this.offerService
        .request(offerRequestId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (returnedOffer) => {
            this.loadOfferRequest(returnedOffer.offerRequestId);
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    }
  }

  convert(offerRequestId: string): void {
    this.offerService
      .convert(offerRequestId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (returnedOffer) => {
          this.loadOfferRequest(returnedOffer.offerRequestId);
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  accept(givenOfferId: string, offerRequestId: string): void {
    this.offerService
      .accept(givenOfferId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.loadOfferRequest(offerRequestId);
      });
  }

  decline(givenOfferId: string, offerRequestId: string): void {
    this.offerService
      .decline(givenOfferId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.loadOfferRequest(offerRequestId);
      });
  }

  saveOffer(offer: OfferManagementByRequesterDto): void {
    const offerSaveDto: OfferRequestDraftDto = OfferRequestDataService.convertRequestToSaveDto(
      offer
    );

    if (offer.offerRequestId === null) {
      this.offerService
        .draftSave(offerSaveDto)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (insertedOffer) => {
            this.offerRequest.next(insertedOffer);
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    } else {
      this.offerService
        .draftUpdate(offerSaveDto)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (updatedOffer) => {
            this.offerRequest.next(updatedOffer);
          },
          (error: HttpErrorResponse) => {
            this.errors = error;
          }
        );
    }
  }

  saveRequestDeadline(
    requestDeadline: string
  ): Observable<OfferManagementByRequesterDto> {
    return this.save((offer) => {
      offer.requestDeadline = requestDeadline;
      return offer;
    });
  }

  saveAddressee(
    addresseeList: Array<EmployeeForOfferManagementDto>
  ): Observable<OfferManagementByRequesterDto> {
    return this.save((offer) => {
      offer.receiverEmployees = addresseeList;
      return offer;
    });
  }

  saveConsignments(
    consignments: Array<ConsignmentDetailedWithGivenOfferDto>
  ): Observable<OfferManagementByRequesterDto> {
    return this.save((offer) => {
      offer.consignments = consignments;
      return offer;
    });
  }

  private static createEmptyOffer(): OfferManagementByRequesterDto {
    return {
      offerStatus: OfferStatus.DRAFT,
      consignments: [],
      receiverEmployees: [],
      requestDeadline: null,
    };
  }

  private static convertRequestToSaveDto(
    from: OfferManagementByRequesterDto
  ): OfferRequestDraftDto {
    // @ts-ignore
    return {
      offerRequestId: from.offerRequestId,
      id: from.offerRequestId,
      requestDeadline: from.requestDeadline,
      receiverEmployeeIds: from.receiverEmployees.map(
        (employee) => employee.employeeId
      ),
      consignmentRequests: from.consignments.map((consignments) => ({
        consignmentId: consignments.consignmentId,
        consignmentBasicData: consignments.consignmentBasicData as ConsignmentBasicDataDto,
        id: consignments.consignmentId,
      })),
      version: from.version,
    };
  }

  private save(
    modifyFunction: (
      original: OfferManagementByRequesterDto
    ) => OfferManagementByRequesterDto
  ): Observable<OfferManagementByRequesterDto> {
    let offer: OfferManagementByRequesterDto;
    return this.offerRequestObservable.pipe(
      take(1),
      map(modifyFunction),
      map((modified: OfferManagementByRequesterDto) => {
        offer = modified;
        return OfferRequestDataService.convertRequestToSaveDto(modified);
      }),
      mergeMap((converted: OfferRequestDraftDto) => {
        if (converted.id) {
          return this.offerService.draftUpdate(converted);
        } else {
          return this.offerService.draftSave(converted);
        }
      }),
      mergeMap((returned: OfferRequestDraftDto) => {
        offer.version = returned.version;
        offer.consignments?.forEach((consignment) => {
          consignment?.consignmentBasicData?.lots.forEach((lot) => {
            lot.rootVersion = returned.version;
          });
        });
        if (!offer.offerRequestId) {
          offer.offerRequestId = returned.offerRequestId;
        }
        this.offerRequest.next(offer);
        return of(offer);
      })
    );
  }
}
