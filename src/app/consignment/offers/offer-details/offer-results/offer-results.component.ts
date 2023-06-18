import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory';

interface BidItem {
  givenOfferId?: string;
  offeredPrice?: string;
  offerExpiration?: string;
  status?: GivenOfferStatus;
}

interface ConsignmentBids {
  consignmentId: string;
  consignmentBasicData: ConsignmentBasicDataDto;
  bids: Array<BidItem>;
  latestBid?: BidItem;
}

interface EmployeeBids {
  bidder: {
    bidderEmployee: {
      id: string;
      firstName: string;
      lastName: string;
      title: string;
      phone: string;
      email: string;
    };
    companyId: string;
    companyName: string;
  };
  bids: Array<ConsignmentBids>;
}

@Component({
  selector: 'app-offer-results',
  templateUrl: './offer-results.component.html',
  styleUrls: ['./offer-results.component.scss'],
})
export class OfferResultsComponent implements OnInit {
  get consignments(): Array<ConsignmentDetailedWithGivenOfferDto> {
    return this._consignments;
  }

  @Input()
  set consignments(value: Array<ConsignmentDetailedWithGivenOfferDto>) {
    this._consignments = value;
    this.loadBids();
  }

  private _consignments: Array<ConsignmentDetailedWithGivenOfferDto>;
  @Input()
  receiverEmployees: Array<EmployeeForOfferManagementDto>;

  @Output()
  offerAccept: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  offerDecline: EventEmitter<string> = new EventEmitter<string>();

  BidStatus = GivenOfferStatus;
  bids: Array<EmployeeBids> = [];
  faCheck = faCheck;
  faTimes = faTimes;
  faHistory = faHistory;

  ngOnInit(): void {
    this.loadBids();
  }

  accept(offerId: string) {
    this.offerAccept.emit(offerId);
  }

  decline(offerId: string) {
    this.offerDecline.emit(offerId);
  }

  private loadBids() {
    this.bids = this.receiverEmployees?.map((employee) => {
      const items: Array<ConsignmentBids> = [];
      for (let consignment of this.consignments) {
        const givenOffer: Array<GivenOfferWithBidderDto> = consignment.givenOffers.filter(
          (offer) => offer.bidderEmployeeId === employee.employeeId
        );
        const bids: Array<BidItem> = [];
        let latestBid: BidItem;

        givenOffer.forEach((offer) => {
          if (
            offer.status === GivenOfferStatus.GIVEN ||
            offer.status === GivenOfferStatus.ACCEPTED ||
            offer.status === GivenOfferStatus.REJECTED
          ) {
            latestBid = {
              offeredPrice: offer.price,
              givenOfferId: offer.id,
              offerExpiration: offer.expirationDate,
              status: offer.status,
            };
          }
          bids.push({
            offeredPrice: offer.price,
            givenOfferId: offer.id,
            offerExpiration: offer.expirationDate,
            status: offer.status,
          });
        });
        if (!latestBid && bids.length) {
          latestBid = bids[bids.length - 1];
        }
        items.push({
          consignmentId: consignment.consignmentId,
          consignmentBasicData: consignment.consignmentBasicData as ConsignmentBasicDataDto,
          bids,
          latestBid,
        });
      }
      const bid: EmployeeBids = {
        bidder: {
          bidderEmployee: {
            id: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            title: employee.title,
          },
          companyId: employee.companyId,
          companyName: employee.companyName,
        },
        bids: items,
      };
      return bid;
    });
    if (!this.bids) {
      return;
    }
    this.bids = this.bids?.sort((a, b) => {
      let aAccepted = 0;
      a.bids.forEach((bid) => {
        if (
          bid.bids.filter((item) => item.status === GivenOfferStatus.ACCEPTED)
            .length
        ) {
          aAccepted++;
        }
      });
      let bAccepted = 0;
      b.bids.forEach((bid) => {
        if (
          bid.bids.filter((item) => item.status === GivenOfferStatus.ACCEPTED)
            .length
        ) {
          bAccepted++;
        }
      });
      return bAccepted - aAccepted;
    });
  }
}
