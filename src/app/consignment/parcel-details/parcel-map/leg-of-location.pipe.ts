import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'legOfLocation',
  pure: true,
})
export class LegOfLocationPipe implements PipeTransform {
  transform(legs: Array<LegDto>, locationId: string): LegDto | null {
    if (!legs || !legs.length) {
      return null;
    }
    return legs.find((leg) => leg.locationFromId === locationId);
  }
}
