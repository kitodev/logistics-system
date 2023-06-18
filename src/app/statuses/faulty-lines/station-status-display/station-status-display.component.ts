import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-station-status-display',
  templateUrl: './station-status-display.component.html',
  styleUrls: ['./station-status-display.component.scss'],
})
export class StationStatusDisplayComponent {
  @Input()
  readonly stationStatus: FaultyStationStatusDto;

  constructor() {}
}
