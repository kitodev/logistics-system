import { Component, Inject } from '@angular/core';
import {
  POPOUT_MODAL_DATA,
  PopoutData,
} from '../../../shared/popout/PopoutModalData';

@Component({
  selector: 'app-qr-lot',
  templateUrl: './qr-lot.component.html',
})
export class QrLotComponent {
  text;
  lots: Array<{ id: string; index: number }>;

  constructor(@Inject(POPOUT_MODAL_DATA) public data: PopoutData) {
    this.text = data.text;
    this.lots = Array(data.lot.quantity)
      .fill(null)
      .map((item, index) => ({
        id: data.lot.id,
        index,
      }));
  }
}
