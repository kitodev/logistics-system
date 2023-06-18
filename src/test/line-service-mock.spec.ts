import { Observable, of } from 'rxjs';
import { LineService } from '../app/line-management/line.service';

export const lineServiceMock: Partial<LineService> = {
  getLineHistory(lineId: string): Observable<LineLocationHistoryDto> {
    if (lineId === 'L1') {
      return of({
        locations: [
          {
            timestamp: '2020-12-10T16:00:00Z',
            coordinate: {
              lat: 1001,
              lon: 1002,
            },
          },
          {
            timestamp: '2020-12-10T17:00:00Z',
            coordinate: {
              lat: 1003,
              lon: 1004,
            },
          },
        ],
      });
    }
    if (lineId === 'L2') {
      return of({
        locations: [
          {
            timestamp: '2020-12-10T18:00:00Z',
            coordinate: {
              lat: 2001,
              lon: 2002,
            },
          },
          {
            timestamp: '2020-12-10T17:00:00Z',
            coordinate: {
              lat: 2003,
              lon: 2004,
            },
          },
        ],
      });
    }
  },
  getLegsByLineId: () => of([]),
  getLine: () => of(null),
  getLines: () => of({ content: [], number: 0 }),
  deleteLine: () => of(),
  getTransportModes: () => [
    {
      label: 'Speciális',
      value: 'SPECIAL',
    },
  ],
};
