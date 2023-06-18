import { Component } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faTruckMoving } from '@fortawesome/free-solid-svg-icons/faTruckMoving';
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons/faWarehouse';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss'],
})
export class MyCompanyComponent {
  faTruckMoving = faTruckMoving;
  faTable = faTable;
  faUserTie = faUserTie;
  faWarehouse = faWarehouse;
  faFile = faFileAlt;

  // TODO routemap
}
