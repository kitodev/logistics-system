import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusesService {
  statusErrors: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private lineStatusBEService: StationStatusBEService,
    private consignmentStatusBEService: ConsignmentStatusBEService,
    ) {}

  public getFaultyConsignments(): Observable<Array<FaultyConsignmentDto>> {
    return this.consignmentStatusBEService.getFaultyConsignments();
  }

  public getFaultyLineStations(): Observable<Array<FaultyLineStationDto>> {
    return this.lineStatusBEService.getFaultyStations();
  }
}
