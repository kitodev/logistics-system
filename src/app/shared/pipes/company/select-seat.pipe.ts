import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectSeat',
})
export class SelectSeatPipe implements PipeTransform {
  transform(
    premises: Array<PremiseDto>,
    property: keyof PremiseDto
  ):
    | string
    | number
    | AddressDto
    | { [key: string]: OpeningIntervalDto }
    | string[]
    | undefined {
    const seat = premises?.find(
      (premise) => premise.premiseType === PremiseType.SEAT
    );
    return seat ? seat[property] : undefined;
  }
}
