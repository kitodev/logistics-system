import { Component, Input } from '@angular/core';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-offer-lifecycle',
  templateUrl: './offer-lifecycle.component.html',
  styleUrls: ['./offer-lifecycle.component.scss'],
})
export class OfferLifecycleComponent {
  @Input()
  status: OfferStatus;

  OfferStatus = OfferStatus;

  faAngleDoubleRight = faAngleDoubleRight;
  faTimes = faTimes;
}
