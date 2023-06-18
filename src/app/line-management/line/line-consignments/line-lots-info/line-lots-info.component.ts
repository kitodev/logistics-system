import { Component, Input } from '@angular/core';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';

export enum ConsignmentDirection {
  LoadIn = 'LoadIn',
  LoadOut = 'LoadOut',
}

@Component({
  selector: 'app-line-lots-info',
  templateUrl: './line-lots-info.component.html',
  styleUrls: ['./line-lots-info.component.scss'],
})
export class LineLotsInfoComponent {
  @Input()
  consignment: ConsignmentDto;

  @Input()
  companies: Map<string, CompanyDto>;

  @Input()
  direction: ConsignmentDirection = ConsignmentDirection.LoadIn;

  ConsignmentDirection = ConsignmentDirection;
  faEdit = faEdit;

  constructor() {}
}
