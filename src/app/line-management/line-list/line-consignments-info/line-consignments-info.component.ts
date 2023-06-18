import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-line-consignments-info',
  templateUrl: './line-consignments-info.component.html',
  styleUrls: ['./line-consignments-info.component.scss'],
})
export class LineConsignmentsInfoComponent {
  @Input()
  leg: LineContactVehiclesAndDriversLegsOfLineDto;

  constructor() {}
}
