import { TestBed, waitForAsync } from '@angular/core/testing';

import { ClarityModule } from '@clr/angular';
import { getTranslocoModule } from '../../../../test/transloco-module.spec';
import { AddressComponent } from './address.component';
import { NgSelectModule } from '@ng-select/ng-select';

describe('AddressComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [getTranslocoModule(), ClarityModule, NgSelectModule],
        declarations: [AddressComponent],
      }).compileComponents();
    })
  );

  it('should create', () => {
    const fixture = TestBed.createComponent(AddressComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
