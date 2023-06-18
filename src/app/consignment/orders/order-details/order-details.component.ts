import { Component } from '@angular/core';
import { faArrowLeft, faTable } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {

  faArrowLeft = faArrowLeft;
  faTable = faTable;

  constructor() { }

}
