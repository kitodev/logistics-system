import { DefaultOrderKeyValuePipe } from './default-order-key-value.pipe';
import { KeyValueDiffers } from '@angular/core';

describe('DefaultOrderKeyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultOrderKeyValuePipe(new KeyValueDiffers([]));
    expect(pipe).toBeTruthy();
  });
});
