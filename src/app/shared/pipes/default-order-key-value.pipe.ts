import { Pipe } from '@angular/core';
import { KeyValue, KeyValuePipe } from '@angular/common';

const keepOrder = (a) => a;
/* eslint-disable @angular-eslint/use-pipe-transform-interface */
@Pipe({
  name: 'defaultOrderKeyValue',
  pure: true,
})
export class DefaultOrderKeyValuePipe extends KeyValuePipe {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public transform<K, V>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    compareFn: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number = keepOrder
  ): Array<KeyValue<K, V>> {
    return super.transform(input, compareFn);
  }
}
