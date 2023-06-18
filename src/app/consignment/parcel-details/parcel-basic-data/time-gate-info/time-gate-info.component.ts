import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-gate-info',
  templateUrl: './time-gate-info.component.html',
  styleUrls: ['./time-gate-info.component.scss'],
})
export class TimeGateInfoComponent {
  @Input()
  timeGate: TimeGateDto;
}
