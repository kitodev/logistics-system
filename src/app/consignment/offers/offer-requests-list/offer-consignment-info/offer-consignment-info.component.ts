import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-offer-consignment-info',
  templateUrl: './offer-consignment-info.component.html',
  styleUrls: ['./offer-consignment-info.component.scss'],
})
export class OfferConsignmentInfoComponent {
  @Input()
  consignments: Array<ConsignmentListingWithGivenOfferDto>;

  constructor() {}
}
