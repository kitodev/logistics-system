import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-given-consignment-info',
  templateUrl: './given-consignment-info.component.html',
  styleUrls: ['./given-consignment-info.component.scss'],
})
export class GivenConsignmentInfoComponent {
  @Input()
  consignments: Array<OfferFindConsignmentRequestBriefDto>;

  constructor() {}
}
