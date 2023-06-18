import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-consignment-info',
  templateUrl: './consignment-info.component.html',
  styleUrls: ['./consignment-info.component.scss'],
})
export class ConsignmentInfoComponent {
  @Input()
  basicData: ConsignmentBasicDataDto;

  constructor() {}
}
