import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lotBooleanProperty',
})
export class LotBooleanPropertyPipe implements PipeTransform {
  transform(lots: Array<LotDto>, propertyName: string): boolean {
    for (let lot of lots) {
      if (lot[propertyName]) {
        return true;
      }
    }
    return false;
  }
}
