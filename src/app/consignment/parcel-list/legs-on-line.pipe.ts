import { Pipe, PipeTransform } from '@angular/core';

export interface LegLine {
  route: string;
  lineId: string;
}

@Pipe({
  name: 'legsOnLine',
})
export class LegsOnLinePipe implements PipeTransform {
  transform(
    transshipmentLocations: Array<LocationDto>,
    loadingInLocation: LocationDto,
    loadingOutLocation: LocationDto,
    legs: Array<LegDto>
  ): Array<LegLine> {
    const locations = [
      loadingInLocation,
      ...transshipmentLocations,
      loadingOutLocation,
    ];
    const legsLine: Array<LegLine> = [];
    if (locations.length < 2) {
      return [];
    }
    for (let i = 1; i < locations.length; i++) {
      legsLine.push({
        route: `${locations[i - 1].premiseAddress.country}-${
          locations[i].premiseAddress.country
        }`,
        lineId: legs.find(
          (leg) =>
            leg.locationFromId === locations[i - 1].id &&
            leg.locationToId === locations[i].id
        )?.lineId,
      });
    }
    return legsLine;
  }
}
