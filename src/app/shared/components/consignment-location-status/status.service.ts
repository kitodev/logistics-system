import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
      private stationStatusBEService: StationStatusBEService,
      private consignmentStatusBEService: ConsignmentStatusBEService,
    ) {}
  
  getStationStatusHistory(lineId: string, premiseId: string, statusDirection: StatusDirection): Observable<StationStatusGetDto[]> {
    return this.stationStatusBEService
    .getStationStatusHistoryForLine(lineId, premiseId, statusDirection)
  }
    
  getConsignmentStatusHistory(consignmentId: string, lineId: string, premiseId: string): Observable<ConsignmentStatusGetDto[]> {
    return this.consignmentStatusBEService.getConsignmentStatusHistory(consignmentId, lineId, premiseId); 
  }

  overrideStationStatus(lineId: string, premiseId: string, status: StationStatusOverrideDto): Observable<string> {
    return this.stationStatusBEService.overrideStationStatus(lineId, premiseId, status);
  }

  overrideConsignmentStatus(lineId: string, premiseId: string, consignmentId: string, status: ConsignmentStatusOverrideDto): Observable<string> {
    return this.consignmentStatusBEService.overrideConsignmentStatus(lineId, premiseId, consignmentId, status);
  }

}
