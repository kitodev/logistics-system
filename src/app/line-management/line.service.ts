import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormSelectItem } from '../shared/form/select/FormSelectItem';
import { TranslocoService } from '@ngneat/transloco';

enum Endpoints {
  LINE_ENDPOINT = '/lines',
  LIST_ENDPOINT = '/list',
  LEGS_ENDPOINT = '/legs',
  TRANSPORT = '/transport',
  HISTORY = '/location-history',
}

@Injectable({
  providedIn: 'root',
})
export class LineService {
  constructor(
    private lineBEService: LineBEService,
    private legBEService: LegBEService,
    private translationService: TranslocoService
  ) {}

  public static getLinesRoute(lineId?: string): string {
    return `${Endpoints.LINE_ENDPOINT}/${lineId}`;
  }

  getLines(query: QueryDto): Observable<PageLineContactVehiclesAndDriversDto> {
    return this.lineBEService.findMyLines(query);

  }

  getLine(lineId: string): Observable<LineDto> {
    return this.lineBEService.getLine(lineId);
  }

  createLine(line: Omit<LineDto, 'id' | 'version'>): Observable<LineDto> {
    return this.lineBEService.createLine(line);
  }

  updateLine(line: LineDto): Observable<LineDto> {
    return this.lineBEService.updateLine(line.id, line);
  }

  deleteLine(lineId: string): Observable<unknown> {
    return this.lineBEService.deleteLine(lineId);
  }

  addLegsToLine(legs: LegDto[]): Observable<LegDto[]> {
    return this.legBEService.createLegs(legs);
  }

  getLegsByLineId(lineId: string): Observable<LegsOfLineDto[]> {
    return this.lineBEService.listOfLegs(lineId);
  }

  deleteLegOfLine(legs: Array<string>): Observable<unknown> {
    return this.legBEService.deleteLegs(legs);
  }

  reorderLineLegs(
    lineId: string,
    premiseIds: Array<string>
  ): Observable<unknown> {
    return this.legBEService.reorderLegs(lineId, premiseIds);
  }

  getTransportModes(): Array<FormSelectItem<TransportMode>> {
    return Object.keys(TransportMode).map((key) => ({
      value: TransportMode[key],
      label: this.translationService.translate(
        'consignment.type.' + TransportMode[key]
      ),
    }));
  }

  getLineHistory(lineId: string): Observable<LineLocationHistoryDto> {
    return this.lineBEService.getLocationHistory(lineId);
  }
}
