import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'largeNumber',
})
export class LargeNumberPipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 2): string {
    const limit = Math.pow(10, decimalPlaces);
    if (value >= limit) {
      return `${limit - 1}+`;
    }
    return value.toString(0);
  }
}
