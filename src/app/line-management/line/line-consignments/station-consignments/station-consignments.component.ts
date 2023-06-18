import { Component, Inject } from '@angular/core';
import { PopoutData, POPOUT_MODAL_DATA } from 'src/app/shared/popout/PopoutModalData';

@Component({
  selector: 'app-station-consignments',
  templateUrl: './station-consignments.component.html',
  styleUrls: ['./station-consignments.component.scss']
})
export class StationConsignmentsComponent {

  text;
  leg: LegsOfLineDto;

  constructor(@Inject(POPOUT_MODAL_DATA) public data: PopoutData) {
    this.text = data.text;
    this.leg = data.leg;
  }
}
