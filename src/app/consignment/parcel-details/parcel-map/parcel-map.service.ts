import { Injectable } from '@angular/core';
import { LngLat } from '@tomtom-international/web-sdk-maps';
import { LocationType } from '../LocationType';
import { StationMarker } from './parcel-map.component';

import { Observable, of, Subject, zip } from 'rxjs';
import { LineService } from '../../../line-management/line.service';
import { map } from 'rxjs/operators';

export const reverseTimestampSort: (
  a: ConsignmentStatusDto,
  b: ConsignmentStatusDto
) => number = (a, b) => {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
};

@Injectable({
  providedIn: 'root',
})
export class ParcelMapService {
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private lineService: LineService) {}

  static getLocationsLegs(
    consignment: ConsignmentDto
  ): [Array<LocationDto>, Array<LegDto>] {
    return [
      [
        consignment.consignmentBasicData.loadingInLocation,
        ...consignment.transshipmentLocations,
        consignment.consignmentBasicData.loadingOutLocation,
      ],
      consignment.legs,
    ];
  }

  static locationsToMarkers(
    locations: Array<LocationDto>
  ): Array<StationMarker> {
    return locations.reduce((acc, location, index) => {
      if (location.coordinate) {
        acc.push({
          address: location.premiseAddress,
          markerSign: (index + 1).toString(),
          coordinate: new LngLat(
            location.coordinate.lon,
            location.coordinate.lat
          ),
          type:
            index === 0
              ? LocationType.LOADING_IN
              : index === locations.length - 1
              ? LocationType.LOADING_OUT
              : LocationType.TRANSSHIPMENT,
        });
      }
      return acc;
    }, [] as StationMarker[]);
  }

  public statusToCoordinates(
    locations: Array<LocationDto>,
    legs: Array<LegDto>,
    status: Array<ConsignmentStatusDto>
  ): Observable<CoordinateDto | null> {
    const locationToPremiseMap: Map<string, LocationDto> = new Map<
      string,
      LocationDto
    >();
    locations.forEach((location) => {
      locationToPremiseMap.set(location.id, location);
    });
    if (!legs?.length) {
      return of(null);
    }
    let lastLeg = legs[0];
    for (const leg of legs) {
      const inLocation = locationToPremiseMap.get(leg.locationFromId);
      const inStatus = status.find(
        (status) =>
          status.premiseId === inLocation?.premiseId &&
          status.lineId === leg.lineId
      );
      const outLocation = locationToPremiseMap.get(leg.locationToId);
      const outStatus = status.find(
        (status) =>
          status.premiseId === outLocation?.premiseId &&
          status.lineId === leg.lineId
      );
      if (
        !inStatus ||
        inStatus.overallStatus === OverallStatus.WAITING_FOR_UPDATE
      ) {
        // it is still in the loading in location
        if (leg === legs[0]) {
          return of(
            locationToPremiseMap.get(lastLeg.locationFromId).coordinate
          );
        }
        // not reached this location yet, so it is at the previous finished
        return of(locationToPremiseMap.get(lastLeg.locationToId).coordinate);
      }
      if (inStatus.overallStatus === OverallStatus.IN_PROGRESS) {
        return of(inLocation.coordinate);
      }
      if (inStatus.overallStatus === OverallStatus.PROBLEM_APPEARED) {
        //don't know what to do
      }
      if (inStatus.overallStatus === OverallStatus.FINISHED) {
        if (!outStatus) {
          return this.getLastLineCoordinate(leg.lineId);
        }
        // to next location
        if (outStatus.overallStatus === OverallStatus.IN_PROGRESS) {
          return of(outLocation.coordinate);
        }
        if (outStatus.overallStatus === OverallStatus.PROBLEM_APPEARED) {
          // don't know what to do
        }
        if (outStatus.overallStatus === OverallStatus.WAITING_FOR_UPDATE) {
          // currently travelling on the line, line history needed
          return zip(
            this.getLastLineCoordinate(leg.lineId),
            of(inLocation.coordinate)
          ).pipe(
            map(
              ([lineCoordinate, locationCoordinate]) =>
                lineCoordinate ?? locationCoordinate
            )
          );
        }
        if (outStatus.overallStatus === OverallStatus.FINISHED) {
          lastLeg = leg;
          // next leg
        }
      }
    }
    // first loading did not happen yet, so it is on the loading in location
    return of(locationToPremiseMap.get(lastLeg.locationFromId).coordinate);
  }

  public static filterLastStatus(
    statuses: Array<ConsignmentStatusDto>
  ): Array<ConsignmentStatusDto> {
    const filtered: Array<ConsignmentStatusDto> = [];
    if (!statuses?.length) {
      return filtered;
    }
    statuses.sort(reverseTimestampSort).forEach((status) => {
      if (
        filtered.findIndex(
          (filteredStatus) =>
            filteredStatus.lineId === status.lineId &&
            filteredStatus.premiseId === status.premiseId
        ) < 0
      ) {
        filtered.push(status);
      }
    });
    return filtered;
  }

  private getLastLineCoordinate(
    lineId: string
  ): Observable<CoordinateDto | null> {
    return this.lineService.getLineHistory(lineId).pipe(
      map((lineHistory) => {
        if (!lineHistory.locations?.length) {
          return null;
        }
        const locations = lineHistory.locations.sort((locationA, locationB) => {
          return (
            new Date(locationB.timestamp).getTime() -
            new Date(locationA.timestamp).getTime()
          );
        });

        return locations[0].coordinate;
      })
    );
  }
}
