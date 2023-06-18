import { Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
})
export class OffersComponent {
  faPlus = faPlus;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;
  faBoxes = faBoxes;
}
