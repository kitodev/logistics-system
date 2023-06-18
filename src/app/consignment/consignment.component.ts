import { Component } from '@angular/core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';


@Component({
  selector: 'app-consignment',
  templateUrl: './consignment.component.html',
  styleUrls: ['./consignment.component.scss'],
})
export class ConsignmentComponent {
  faPlus = faPlus;
  faBoxOpen = faBoxOpen;
}
